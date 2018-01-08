import React, { Component } from 'react';
import { Table, Row, Col } from 'antd';
import moment from 'moment';
import { remote } from '../../../utils/fetch';

class RepayInfoTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      detailData: [],
      planData: [],
      info: {}
    };
  }

  componentWillMount() {
    if(this.context.loanInfoData.realLoanId) {

      // 获取实际还款明细数据
      remote({
        url: '/borrower/findRepaymentDetails?loanId=' + this.context.loanInfoData.realLoanId,
        // url:'/findRepaymentDetails?loanId=10602',
        method: 'get'
      }).then((data)=>{
        this.setState({detailData: data});
      }).catch(() => {
      });

      // 获取还款计划数据
      if(this.context.loanInfoData.configProductCode !== 'CASH_LOAN') {
        remote({
          url: `/borrower/findRepaymentPlan?loanId=${this.context.loanInfoData.realLoanId}` ,
          //url: '/borrower/findRepaymentPlan?loanId=4235286' ,
          method: 'get'
        }).then((data)=>{
          this.setState({planData: data});
        }).catch(() => {
        });
      }

      // 获取还款信息
      remote({
        url: '/borrower/findWithholdingInformation?loanId=' + this.context.loanInfoData.realLoanId,
        // url: '/findWithholdingInformation?loanId=123891',
        method: 'get'
      }).then((data)=>{
        this.setState({info: data});
      }).catch(() => {
      });
    }
  }

  render() {
    const planData = this.state.planData.map((val, index) => {
      val.itIndex = index + 1;
      return val;
    });
    const planColumns = [{
      title: '期数',
      dataIndex: 'itIndex',
      key: 'itIndex',
    }, {
      title: '还款日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (text) => moment(new Date(text)).format("YYYY-MM-DD")
    }, {
      title: '应还本金',
      dataIndex: 'accruedPrincipal',
      key: 'accruedPrincipal'
    }, {
      title: '应还利息',
      dataIndex: 'interest',
      key: 'interest'
    }, {
      title: '本期管理费',
      dataIndex: 'borrowerManagementFee',
      key: 'borrowerManagementFee'
    }];
    const detailColumns = [{
      title: '期数',
      dataIndex: 'periodIndex',
      key: 'periodIndex'
    }, {
      title: '到期还款日',
      dataIndex: 'dueD',
      key: 'dueD'
    }, {
      title: '实际还款日',
      dataIndex: 'receivedD',
      key: 'receivedD'
    }, {
      title: '应收总额',
      dataIndex: 'dueAmt',
      key: 'dueAmt'
    }, {
      title: '实收总额',
      dataIndex: 'receivedAmt',
      key: 'receivedAmt'
    }, {
      title: '应收本金',
      dataIndex: 'prncpAccr',
      key: 'prncpAccr'
    }, {
      title: '应收利息',
      dataIndex: 'intAccr',
      key: 'intAccr'
    }, {
      title: '应收罚息',
      dataIndex: 'feeAccr',
      key: 'feeAccr'
    }, {
      title: '月管理费',
      dataIndex: 'slManagmentFeeAccr',
      key: 'slManagmentFeeAccr'
    }, {
      title: '未结本金',
      dataIndex: 'prncpBal',
      key: 'prncpBal'
    }, {
      title: '未结利息',
      dataIndex: 'intBal',
      key: 'intBal'
    }, {
      title: '未结罚息',
      dataIndex: 'feeBal',
      key: 'feeBal'
    }, {
      title: '未结月管理费',
      dataIndex: 'slManagmentFeeBa',
      key: 'slManagmentFeeBa'
    }, {
      title: '剩余本金',
      dataIndex: 'prncpOut',
      key: 'prncpOut'
    }];
    return (
      <div>
        <div className="pre-auth">
          <div className="task-step-title" style={{ marginBottom: '15px', marginLeft: '20px' }}>
            <h5>还款信息</h5>
          </div>
          <Row>
            <Col span={12}>
              <p>本期应还金额</p>
              <span>{this.state.info.currentBalance}</span>
            </Col>
            <Col span={12}>
              <p>本期已还金额</p>
              <span>{this.state.info.alreadyPaid}</span>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <p>代扣账号</p>
              <span>{this.state.info.accountId}</span>
            </Col>
            <Col span={12}>
              <p>支行名称</p>
              <span>{this.state.info.bankBranch}</span>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <p>代扣结果</p>
              <span>{this.state.info.status}</span>
            </Col>
            <Col span={12}>
              <p>代扣日期</p>
              <span>{this.state.info.createdTime}</span>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <p>代扣结果</p>
              <span>{this.state.info.status}</span>
            </Col>
            <Col span={12}>
              <p>账户结余</p>
              <span>{this.state.info.availableBalance}</span>
            </Col>
          </Row>
        </div>
        <h3 className="sub-form-title">还款计划</h3>
        <div className="table-container">
          <Table columns={planColumns} dataSource={planData}/>
        </div>
        <h3 className="sub-form-title">实际还款明细</h3>
        <div className="table-container">
          <Table columns={detailColumns} dataSource={this.state.detailData}/>
        </div>
      </div>
    );
  }
}
export default RepayInfoTab;
RepayInfoTab.contextTypes = {
  loanInfoData: React.PropTypes.object,
};
