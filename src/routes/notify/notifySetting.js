import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Checkbox, Spin } from 'antd';
import './notify.less';

class NotifiySetting extends Component {
  componentWillMount() {
    this.props.getNotifySettingList();
  }

  onChange(type, e) {
    e.preventDefault();
    this.props.updateCheckStatus(type);
  }

  handleClick(e) {
    e.preventDefault();
    const { notifySettingList: { list = [] } } = this.props;
    const hold = list.find((item) => item.notificationType === 'hold');
    const approved = list.find((item) => item.notificationType === 'approved');
    const holdOptions = {
      type: 'hold',
      status: hold ?  Number(hold.notificationStatus) : 0,
    };
    const approvedOptions = {
        type: 'approved',
        status: approved ?  Number(approved.notificationStatus) : 0,
      }
    this.props.updateSetting(holdOptions);
    this.props.updateSetting(approvedOptions);
    
  }

  render() {
    const { notifySettingList: { isFetching, list = [] } } = this.props;
    const hold = list.find((item) => item.notificationType === 'hold');
    const approved = list.find((item) => item.notificationType === 'approved');
    const holdStatus = hold ? hold.notificationStatus : 0;
    const approvedStatus = approved ? approved.notificationStatus : 0;
    return (
      <div className="notify">
        <h3>通知设置</h3>
        <Spin spinning={isFetching} >
          <Row className="setting-row">
            <Col span={3}>消息变更通知</Col>
            <Col span={3}>站内信</Col>
          </Row>
          <Row className="setting-row">
            <Col span={3}>补件</Col>
            <Col span={3}>
              <Checkbox
               checked={holdStatus}
               onClick={this.onChange.bind(this, 'hold')}>
              </Checkbox>
            </Col>
          </Row>
          <Row className="setting-row">
            <Col span={3}>签约</Col>
            <Col span={3}>
              <Checkbox
                checked={approvedStatus}
                onClick={this.onChange.bind(this, 'approved')}>
              </Checkbox>
              </Col>
          </Row>
          <Row className="setting-row">
            <Button onClick={this.handleClick.bind(this)}>保存</Button>
          </Row>
        </Spin>
      </div>
    );
  }
}

export default connect(
  state => ({
    notifySettingList: state.notify.notifySettingList,
  }),
  dispatch => ({
    getNotifySettingList: () => dispatch({type: 'notify/getNotifySettingList'}),
    updateCheckStatus: (params) => dispatch({type: 'notify/updateCheckStatus', payload: params }),
    updateSetting: (params) =>  dispatch({type: 'notify/updateSetting', payload: params })
  })
)(NotifiySetting);
