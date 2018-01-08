import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Table } from 'antd';
import moment from 'moment';
import './task.less';

const planColumns = [
  {
    title: '期数',
    dataIndex: 'itIndex',
    key: 'itIndex',
  }, {
    title: '还款日期',
    dataIndex: 'dueDate',
    key: 'dueDate',
    render: (text) => {
      return text ? moment(text).format('YYYY-MM-DD') : '';
    },
  }, {
    title: '应还本金',
    dataIndex: 'accruedPrincipal',
    key: 'accruedPrincipal',
  }, {
    title: '应还利息',
    dataIndex: 'interest',
    key: 'interest',
  }, {
    title: '本期管理费',
    dataIndex: 'borrowerManagementFee',
    key: 'borrowerManagementFee',
  }];

const detailColumns = [
  {
    title: '期数',
    dataIndex: 'periodIndex',
    key: 'periodIndex',
  }, {
    title: '到期还款日',
    dataIndex: 'dueD',
    key: 'dueD',
  }, {
    title: '实际还款日',
    dataIndex: 'receivedD',
    key: 'receivedD',
  }, {
    title: '应收总额',
    dataIndex: 'dueAmt',
    key: 'dueAmt',
  }, {
    title: '实收总额',
    dataIndex: 'receivedAmt',
    key: 'receivedAmt',
  }, {
    title: '应收本金',
    dataIndex: 'prncpAccr',
    key: 'prncpAccr',
  }, {
    title: '应收利息',
    dataIndex: 'intAccr',
    key: 'intAccr',
  }, {
    title: '应收罚息',
    dataIndex: 'feeAccr',
    key: 'feeAccr',
  }, {
    title: '月管理费',
    dataIndex: 'slManagmentFeeAccr',
    key: 'slManagmentFeeAccr',
  }, {
    title: '未结本金',
    dataIndex: 'prncpBal',
    key: 'prncpBal',
  }, {
    title: '未结利息',
    dataIndex: 'intBal',
    key: 'intBal',
  }, {
    title: '未结罚息',
    dataIndex: 'feeBal',
    key: 'feeBal',
  }, {
    title: '未结月管理费',
    dataIndex: 'slManagmentFeeBa',
    key: 'slManagmentFeeBa',
  }, {
    title: '剩余本金',
    dataIndex: 'prncpOut',
    key: 'prncpOut',
  },
];

class RepayInfoDetails extends Component {
  componentWillMount() {
    const { getWithholdInfo, getRepaymentPlan, getRepaymentDetail, loanId } = this.props;
    getWithholdInfo(loanId);
    getRepaymentPlan(loanId);
    getRepaymentDetail(loanId);
  }

  render() {
    const {
      withholdInfo: {
        accountId,
        alreadyPaid,
        availableBalance,
        bankBranch,
        createdTime,
        currentBalance,
        status,
      },
      repaymentPlan = [],
      repaymentDetail = [],
    } = this.props;
    const repaymentPlanData = repaymentPlan.map((val, index) => {
      return { ...val, itIndex: index + 1 };
    });
    return (
      <div className="dr-layout task">
        <Link to="/borrowerLoanInfo" style={{ float: 'right', 'margin-right': '23px' }}>返回</Link>
        <h3>借款信息详情</h3>
        <p className="title">还款信息</p>
        <div className="section-info">
          <Row gutter={24}>
            <Col className="gutter-row" span={4}>
              <div className="info-item">
                <label htmlFor="currentBalance" >本期应还金额</label>
                <div>{currentBalance}</div>
              </div>
            </Col>
            <Col className="gutter-row" span={4}>
              <div className="info-item">
                <label htmlFor="alreadyPaid">本期已还金额</label>
                <div>{alreadyPaid}</div>
              </div>
            </Col>
            <Col className="gutter-row" span={4}>
              <div className="info-item">
                <label htmlFor="accountId">代扣账号</label>
                <div>{accountId}</div>
              </div>
            </Col>
            <Col className="gutter-row" span={4}>
              <div className="info-item">
                <label htmlFor="bankBranch">支行名称</label>
                <div>{bankBranch}</div>
              </div>
            </Col>
            <Col className="gutter-row" span={4}>
              <div className="info-item">
                <label htmlFor="status">代扣结果</label>
                <div>{status}</div>
              </div>
            </Col>
            <Col className="gutter-row" span={4}>
              <div className="info-item">
                <label htmlFor="createdTime">代扣日期</label>
                <div>{createdTime}</div>
              </div>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col className="gutter-row" span={4}>
              <div className="info-item">
                <label htmlFor="availableBalance">账户结余</label>
                <div>{availableBalance}</div>
              </div>
            </Col>
          </Row>
        </div>
        <p className="title">还款计划</p>
        <Table
          dataSource={repaymentPlanData}
          columns={planColumns}
          rowKey={(record, idx) => idx}
        />
        <p className="title">实际还款明细</p>
        <Table
          dataSource={repaymentDetail}
          rowKey={(record, idx) => idx}
          columns={detailColumns}
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    loanId: state.routing.locationBeforeTransitions.query.loanId,
    withholdInfo: state.task.repayInfoDetail.withholdInfo,
    repaymentPlan: state.task.repayInfoDetail.repaymentPlan,
    repaymentDetail: state.task.repayInfoDetail.repaymentDetail }),
  dispatch => ({
    getWithholdInfo: params => dispatch({ type: 'task/getWithholdInfo', payload: params }),
    getRepaymentPlan: params => dispatch({ type: 'task/getRepaymentPlan', payload: params }),
    getRepaymentDetail: params => dispatch({ type: 'task/getRepaymentDetail', payload: params }),
  }),
)(RepayInfoDetails);
