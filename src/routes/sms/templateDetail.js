import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Spin } from 'antd';
import moment from 'moment';
import './sms.less';


class TemplateDetail extends Component {
  componentDidMount() {
    const { id, getTemplateDetail } = this.props;
    getTemplateDetail(id);
  }
  render() {
    const {
      templateDetail: {
        templateName,
        createdBy,
        createdDate,
        updatedBy,
        updateDate,
        content,
        loading,
      },
    } = this.props;
    return (
      <Spin spinning={loading}>
        <div className="sms">
          <h3 className="dr-section-font">消息内容</h3>
          <div className="sms-section">
            <p style={{ fontSize: '20px', textAlign: 'center', marginBottom: '20px' }}>{templateName}</p>
            <Row>
              <Col span={12}>
                <span className="sms-section-label">创建人：{createdBy} {createdDate && moment(createdDate).format('YYYY-MM-DD HH:mm:ss')}</span>
              </Col>
              <Col span={12}>
                <span className="sms-section-label">修改人：{updatedBy} {updateDate && moment(updateDate).format('YYYY-MM-DD HH:mm:ss')}</span>
              </Col>
            </Row>
            <div style={{ marginTop: '30px', padding: '15px' }}>
              {content}
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}
export default connect(
  state => ({
    id: state.routing.locationBeforeTransitions.query.id,
    templateDetail: state.smsTemplate.templateDetail,
  }),
  dispatch => ({
    getTemplateDetail: params => dispatch({ type: 'smsTemplate/getTemplateDetail', payload: params }),
  }),
)(TemplateDetail);
