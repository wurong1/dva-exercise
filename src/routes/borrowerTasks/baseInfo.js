import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import moment from 'moment';

class BaseInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showOriginPhone: false,
      showOriginSSn: false,
    };
  }

  showPhoneNo = () => {
    this.props.getDetailPhone();
    this.setState(prevState => ({
      showOriginPhone: !prevState.showOriginPhone,
    }));
  }

  showSsn = () => {
    this.props.getDetailSsn();
    this.setState(prevState => ({
      showOriginSSn: !prevState.showOriginSSn,
    }));
  }

  render() {
    const {
      taskInfo: {
        customerInfor: {
          actorId,
          actorName,
          userName,
          phone,
          phoneCity,
          city,
          customerOrigin,
          marketChannel,
          borrowerStatusDate,
          workingYearsLevel,
          offemployeeName,
          ssn,
        } = {},
        loanBaseInfor: {
          loanEmployeeName,
          loanEmployeeGroupName,
          intentionLoanTypeName,
          intentionAmount,
          intentionLoanCycle,
        } = {},
        employeeGroupName,
        employeeName,
        allocateTime,
        readOnly,
      },
      originPhoneNo,
      originSsn,
    } = this.props;
    const { showOriginPhone, showOriginSSn } = this.state;
    return (
      <div className="crm-section">
        <Row>
          <Col span={3}>
            <h3>客户信息</h3>
          </Col>
          <Col span={3}>
            <p>借款人ID</p>
            <span>{actorId}</span>
          </Col>
          <Col span={3}>
            <p>客户姓名</p>
            <span>{actorName }</span>
          </Col>
          <Col span={3}>
            <p>用户名</p>
            <span>{userName}</span>
          </Col>
          <Col span={3}>
            <p>手机号</p>
            <span>{ showOriginPhone ? originPhoneNo : phone } </span>
            {
              phone &&
              <a>
                <span
                  className={showOriginPhone ? 'icon-showpsw' : 'icon-closepsw'}
                  onClick={this.showPhoneNo}
                  style={{ marginLeft: '5px' }}
                />
              </a>
            }
          </Col>
          <Col span={3}>
            <p>手机所属城市</p>
            <span>{phoneCity}</span>
          </Col>
          <Col span={3}>
            <p>城市</p>
            <span>{city}</span>
          </Col>
          <Col span={3}>
            <p>客户来源</p>
            <span>{customerOrigin}</span>
          </Col>
        </Row>
        <Row>
          <Col span={3} offset={3} >
            <p>渠道</p>
            <span>{marketChannel}</span>
          </Col>
          <Col span={3}>
            <p>注册时间</p>
            <span>{borrowerStatusDate && moment(borrowerStatusDate).format('YYYY-MM-DD')}</span>
          </Col>
          <Col span={3}>
            <p>在现工作单位年限</p>
            <span>
              { workingYearsLevel === 0 && '0-6个月'}
              { workingYearsLevel === 1 && '7-12个月'}
              { workingYearsLevel === 2 && '1-3年'}
            </span>
          </Col>
          <Col span={3}>
            <p>负责人组别</p>
            <span>{employeeGroupName}</span>
          </Col>
          <Col span={3}>
            <p>负责人</p>
            <span>{employeeName}</span>
          </Col>
          <Col span={3}>
            <p>用户所属销售</p>
            <span>{offemployeeName}</span>
          </Col>
          <Col span={3}>
            <p>最后分配时间</p>
            <span>{ allocateTime && moment(allocateTime).format('YYYY-MM-DD HH:mm:ss') }</span>
          </Col>
        </Row>
        <Row>
          <Col span={3} offset={3} >
            <p>借款所属销售</p>
            <span>{loanEmployeeName}</span>
          </Col>
          <Col span={3}>
            <p>借款所属销售组别</p>
            <span>{loanEmployeeGroupName }</span>
          </Col>
          { readOnly === false &&
            <Col span={6}>
              <p>证件号</p>
              <span>{ showOriginSSn ? originSsn : ssn } </span>
              {
                ssn &&
                <a>
                  <span
                    className={showOriginSSn ? 'icon-showpsw' : 'icon-closepsw'}
                    onClick={this.showSsn}
                    style={{ marginLeft: '5px' }}
                  />
                </a>
              }
            </Col>
          }
        </Row>
        <Row>
          <Col span={3}>
            <h3>客户意向</h3>
          </Col>
          <Col span={3}>
            <p>贷款类型</p>
            <span>{intentionLoanTypeName }</span>
          </Col>
          <Col span={3}>
            <p>申请金额</p>
            <span>{intentionAmount}</span>
          </Col>
          <Col span={3}>
            <p>贷款期限</p>
            <span>{intentionLoanCycle}</span>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(
  state => ({
    taskInfo: state.taskDetails.taskDetailsList || {},
    originPhoneNo: state.taskDetails.originPhoneNo,
    originSsn: state.taskDetails.originSsn,
  }),
)(BaseInfo);
