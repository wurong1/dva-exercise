import React, { Component } from 'react';
import moment from 'moment';
import { remote } from '../../../utils/fetch';
import { Row, Col } from 'antd';

class PreAuthorizeTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showOriginSSn: false,
      originSsn: null,
    };
  }
  getRiskRate() {
    const recommendedMaturity = this.context.reloanInfo.recommendedMaturity;
    const name = `riskRate${recommendedMaturity}M`;
    const riskRate = this.context.reloanInfo.feeRate && this.context.reloanInfo.feeRate[name];
    return riskRate;
  }

  showSsn = () => {
    const { originSsn } = this.state;
    if (!originSsn) {
      remote({
        method: 'GET',
        url: `/borrower/findReloanCredit?aid=${this.context.loanInfoData.aid}&desensitization=true`,
      }).then((res) => {
        this.setState({ originSsn: res && res.cardNum });
      }).catch(() => {
      });
    }
    this.setState(prevState => ({
      showOriginSSn: !prevState.showOriginSSn,
    }));
  }

  render() {
    const { originSsn, showOriginSSn } = this.state;
    const riskRate = this.getRiskRate();
    const maturity = this.context.reloanInfo.recommendedMaturity || 0;
    const fee = this.context.reloanInfo.contractAmount || 0;
    const feeRate = this.context.reloanInfo.feeRate && this.context.reloanInfo.feeRate.origFee || 0;
    const manageRate = this.context.reloanInfo.feeRate && this.context.reloanInfo.feeRate.managementFee || 0;
    const interviewFee = parseInt(fee * feeRate, 10) / 100;
    const manageFee = parseInt(fee * manageRate * maturity, 10) / 100;
    const protectFee = parseInt(fee * riskRate, 10) / 100;
    const tjFee = interviewFee + manageFee + protectFee;
    let date = this.context.reloanInfo.expiryDate;
    const dateFormat = 'YYYY-MM-DD';
    date = date &&  moment(date).format(dateFormat);
    return (
      <div className="pre-auth">
        <div className="task-step-title" style={{'marginBottom': '15px'}}>
          <h5>授信信息</h5>
        </div>
        <Row>
          <Col span={12}>
            <p>原合同金额</p>
            <span>{this.context.reloanInfo.originalAmount}</span>
          </Col>
          <Col span={12}>
            <p>原到手金额</p>
            <span>{this.context.reloanInfo.originalFinalAmount}</span>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <p>预授信合同金额</p>
            <span>{this.context.reloanInfo.contractAmount}</span>
          </Col>
          <Col span={12}>
            <p>预授信到手金额</p>
            <span>{this.context.reloanInfo.finalAmount}</span>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <p>审批费率</p>
            <span>{feeRate}%</span>
          </Col>
          <Col span={12}>
            <p>居间服务费</p>
            <span>{interviewFee}</span>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <p>管理费率</p>
            <span>{manageRate}%</span>
          </Col>
          <Col span={12}>
            <p>账户管理费金额</p>
            <span>{manageFee}</span>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <p>借款人履约互保准备金率</p>
            <span>{riskRate}%</span>
          </Col>
          <Col span={12}>
            <p>借款人履约互保准备金</p>
            <span>{protectFee}</span>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <p>趸缴费用总和</p>
            <span>{tjFee}</span>
          </Col>
          <Col span={12}>
            <p>利率</p>
            <span>{this.context.reloanInfo.feeRate && this.context.reloanInfo.feeRate.intRate}%</span>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <p>申请金额上限</p>
            <span>200000</span>
          </Col>
          <Col span={12}>
            <p>建议期限</p>
            <span>{maturity}</span>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <p>有效日期</p>
            <span>{date}</span>
          </Col>
          <Col span={12}>
            <p>建议期限</p>
            <span>{maturity}</span>
          </Col>
        </Row>
        <div className="task-step-title" style={{'marginBottom': '15px'}}>
          <h5>用户信息</h5>
        </div>
        <div>
          <Row>
            <Col span={12}>
              <p>用户姓名</p>
              <span>{this.context.reloanInfo.realName}</span>
            </Col>
            <Col span={12}>
              <p>身份证号</p>
              <span>{ showOriginSSn ? originSsn : this.context.reloanInfo.cardNum } </span>
              {
                this.context.reloanInfo.cardNum &&
                <a>
                  <span
                    className={showOriginSSn ? 'icon-showpsw' : 'icon-closepsw'}
                    onClick={this.showSsn}
                    style={{ marginLeft: '5px' }}
                  />
                </a>
              }
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <p>原借款申请ID</p>
              <span>{this.context.reloanInfo.originalLoanAppId}</span>
            </Col>
            <Col span={12}>
              <p>原借款ID</p>
              <span>{this.context.reloanInfo.originalLoanId}</span>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <p>客户等级</p>
              <span>{this.context.reloanInfo.grade}</span>
            </Col>
          </Row>
        </div>
      </div>);
  }
}
export default PreAuthorizeTab;
PreAuthorizeTab.contextTypes = {
  reloanInfo: React.PropTypes.object,
  loanInfoData: React.PropTypes.object,
};
