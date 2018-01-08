import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Tabs, Button, Pagination, Modal, Spin } from 'antd';
import './notify.less';

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

class Notification extends Component {
  componentWillMount() {
    const options = {
      type: 'hold',
      pageNo: 1,
      pageSize: 20,
    };
    this.props.getMessageList(options);
  }

  getDetail = (item, type) => {
    const url = `/bcrm/#/taskDetails?taskId=${item.content && item.content.split('-')[3]}`;
    const haveRead = item.haveRead;
    const params = {
      type,
      msgId: item.msgSeqId,
    };
    if (!haveRead) {
      this.props.readMessage(params);
    }
    window.open(url);
  }

  handClick = (type) => {
    const options = {
      type,
      pageNo: 1,
      pageSize: 20,
    };
    this.props.getMessageList(options);
  }

  holdPageChange = (page, pageSize) => {
    const options = {
      type: 'hold',
      pageNo: page || 1,
      pageSize: pageSize || 20,
    };
    this.props.getMessageList(options);
  }

  signPageChange = (page, pageSize) => {
    const options = {
      type: 'approved',
      pageNo: page || 1,
      pageSize: pageSize || 20,
    };
    this.props.getMessageList(options);
  }

  clearData = (type, e) => {
    e.preventDefault();
    const self = this;
    confirm({
      title: '确认删除全部?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        self.props.deleteAll(type);
      },
    });
  }

  render() {
    const {
      holdList = {},
      signList = {},
      unReceivedCount: {
        hold = 0, approved = 0,
      },
      isFetching } = this.props;
    const holdPageCount = holdList.pageCount || 0;
    const listOfhold = holdList.list || [];
    const holdTotalCount = holdList.totalCount || 0;
    const signPageCount = signList.pageCount || 0;
    const listOfSign = signList.list || [];
    const signTotalCount = signList.totalCount || 0;
    const holdPagination = {
      current: holdList.pageNo || 1,
      total: holdList.totalCount || 0,
      pageSize: holdList.pageSize || 20,
      size: 'small',
    };
    const signPagination = {
      current: signList.pageNo || 1,
      total: signList.totalCount || 0,
      pageSize: signList.pageSize || 20,
      size: 'small',
    };
    const holdStart =
      holdPageCount > 1 ?
        ((holdPagination.pageSize) * (holdPagination.current - 1)) + 1
      :
         1;
    const signStart =
      signPageCount > 1 ?
        ((signPagination.pageSize) * (signPagination.current - 1)) + 1
      :
        1;
    let holdEnd = 0;
    let signEnd = 0;
    if (holdPageCount > 1 && holdPagination.current < holdPageCount) {
      holdEnd = (holdPagination.pageSize) * (holdPagination.current);
    } else {
      holdEnd = holdTotalCount;
    }
    if (signPageCount > 1 && signPagination.current < signPageCount) {
      signEnd = (signPagination.pageSize) * (signPagination.current);
    } else {
      signEnd = signTotalCount;
    }
    return (
      <div className="notify">
        <h3>站内信</h3>
        <div className="tab-content">
          <Tabs tabPosition="left" onTabClick={this.handClick}>
            <TabPane tab={<Spin spinning={isFetching}><div>补件通知{hold > 0 ? <div className="num">{hold}</div> : ''}</div></Spin>} key="hold">
              <Spin spinning={holdList.isFetching}>
                <p>补件通知 ({holdTotalCount}条通知) <a onClick={this.clearData.bind(this, 'hold')} disabled={holdTotalCount < 1}>清空</a></p>
                {listOfhold.map((item, idx) =>
                  <div className={`item ${item.haveRead ? '' : 'item-bold'}`} key={idx}>
                    您好！用户：{item.content && item.content.split('-')[0]}，贷款申请ID：{item.content && item.content.split('-')[1]}，所属销售：{item.content && item.content.split('-')[2]}。该贷款已经进入补件阶段，请及时处理。
                    <Button onClick={this.getDetail.bind(this, item, 'hold')}>立即查看</Button>
                    <br />{item.sendTime && moment(item.sendTime).format('YYYY-MM-DD')}
                  </div>,
                )}
              </Spin>
              <div className="record">
                {holdTotalCount > 0 ? `当前显示第${holdStart}-${holdEnd}条记录` : ''}
              </div>
              <div className="page">
                <Pagination {...holdPagination} onChange={this.holdPageChange} />
              </div>
            </TabPane>
            <TabPane tab={<Spin spinning={isFetching}><div>签约通知{approved > 0 ? <div className="num">{approved}</div> : ''}</div></Spin>} key="approved">
              <Spin spinning={signList.isFetching}>
                <p>签约通知 ({signTotalCount}条通知) <a onClick={this.clearData.bind(this, 'approved')} disabled={signTotalCount < 1}>清空</a></p>
                {listOfSign.map((item, idx) =>
                  <div className={`item ${item.haveRead ? '' : 'item-bold'}`} key={idx}>
                    您好！用户：{item.content && item.content.split('-')[0]}，贷款申请ID：{item.content && item.content.split('-')[1]}，所属销售：{item.content && item.content.split('-')[2]}。该贷款已经进入签约阶段，请及时处理。
                    <Button onClick={this.getDetail.bind(this, item, 'approved')}>立即查看</Button>
                    <br />2017-12-12
                  </div>,
                )}
              </Spin>
              <div className="record">
                {signTotalCount > 0 ? `当前显示第${signStart}-${signEnd}条记录` : ''}
              </div>
              <div className="page">
                <Pagination {...signPagination} onChange={this.signPageChange} />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    holdList: state.notify.holdList,
    signList: state.notify.signList,
    isFetching: state.notify.isFetching,
    unReceivedCount: state.notify.unReceivedCount,
  }),
  dispatch => ({
    getMessageList: params => dispatch({ type: 'notify/getMessageList', payload: params }),
    readMessage: params => dispatch({ type: 'notify/readMessage', payload: params }),
    deleteAll: params => dispatch({ type: 'notify/deleteAll', payload: params }),
  }),
)(Notification);
