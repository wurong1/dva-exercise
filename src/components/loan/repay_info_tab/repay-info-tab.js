import React, {Component} from 'react';
import {Table} from 'antd';
import moment from 'moment';
// import loanInfoData from '../../../constants/loan-info-data';
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
          url: '/borrower/findRepaymentPlan?loanId=' + this.context.loanInfoData.realLoanId,
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
    const planColumns = [{
      title: '期数',
      dataIndex: 'index',
      key: 'index'
    }, {
      title: '还款日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (text) => moment(new Date(text)).format("YYYY-MM-DD")
    }, {
      title: '应还本金',
      dataIndex: 'duePrincipal',
      key: 'duePrincipal'
    }, {
      title: '应还利息',
      dataIndex: 'estimatedDueInterest',
      key: 'estimatedDueInterest'
    }, {
      title: '应还总额',
      dataIndex: 'totalAmount',
      key: 'totalAmount'
    }, {
      title: '剩余本金',
      dataIndex: 'principalOut',
      key: 'principalOut'
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
        <div>
          <h3 className="sub-form-title" >还款信息</h3>
          <div className="col-cell-group row">
            <div className="col-cell col-xs-6 tab-div">
              <p className="tab-p"><label className="cell-label tab-label">本期应还金额</label></p>
              <span>{this.state.info.currentBalance}</span>
            </div>
            <div className="col-cell col-xs-6 tab-div">
              <p className="tab-p"><label className="cell-label tab-label">本期已还金额</label></p>
              <span>{this.state.info.alreadyPaid}</span>
            </div>
          </div>
          <div className="col-cell-group row">
            <div className="col-cell col-xs-6 tab-div">
              <p className="tab-p"><label className="cell-label tab-label">代扣账号</label></p>
              <span>{this.state.info.accountId}</span>
            </div>
            <div className="col-cell col-xs-6 tab-div">
              <p className="tab-p"><label className="cell-label tab-label">支行名称</label></p>
              <span>{this.state.info.bankBranch}</span>
            </div>
          </div>
          <div className="col-cell-group row">
            <div className="col-cell col-xs-6 tab-div">
              <p className="tab-p"><label className="cell-label tab-label">代扣结果</label></p>
              <span>{this.state.info.status}</span>
            </div>
            <div className="col-cell col-xs-6 tab-div">
              <p className="tab-p"><label className="cell-label tab-label">代扣日期</label></p>
              <span>{this.state.info.createdTime}</span>
            </div>
          </div>
          <div className="col-cell-group row">
            <div className="col-cell col-xs-6 tab-div">
              <p className="tab-p"><label className="cell-label tab-label">账户结余</label></p>
              <span>{this.state.info.availableBalance}</span>
            </div>
          </div>
        </div>
        <h3 className="sub-form-title">还款计划</h3>
        <div className="table-container">
          <Table columns={planColumns} dataSource={this.state.planData}/>
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
  loanInfoData: React.PropTypes.object
};

