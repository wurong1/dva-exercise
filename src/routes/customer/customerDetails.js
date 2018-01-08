/**
 * Created by eng0409 on 17-8-9.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Tabs, Row, Col } from 'antd';
import './customer.less';

const { TabPane } = Tabs;
const loanColumns = [
  {
    title: '贷款申请ID',
    dataIndex: 'loanId',
  }, {
    title: '贷款创建时间',
    dataIndex: 'applyTime',
  }, {
    title: '贷款产品',
    dataIndex: 'product',
  }, {
    title: '贷款申请金额',
    dataIndex: 'amount',
  }, {
    title: '贷款申请状态',
    dataIndex: 'loanApplyStatus',
  }, {
    title: '贷款状态',
    dataIndex: 'loanStatus',
  },
];
const dealColumns = [
  {
    title: '操作时间',
    dataIndex: 'operationDate',
  }, {
    title: '操作人',
    dataIndex: 'employeeName',
  }, {
    title: '操作内容',
    dataIndex: 'operationContent',
  },
];

class CustomerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actorId: this.props.routingQuery.actorId,
      pageNo: '1',
      pageSize: '50',
      showOriginPhone: false,
    };
  }

  componentWillMount() {
    const { getCustomerDetails } = this.props;
    getCustomerDetails(this.state.actorId);
  }

  getPaginationData(pageNo, pageSize) {
    const { getCustomerDealRecord } = this.props;
    getCustomerDealRecord({
      actorId: this.state.actorId,
      pageNo,
      pageSize,
    });
  }

  callBack = (key) => {
    const { getCustomerDealRecord } = this.props;
    if (key === 'dealRecord' && this.props.isFirstLoad) {
      getCustomerDealRecord(this.state);
    }
  }

  showPhoneNo = () => {
    const userInfo = this.props.customerDetailsList || {};
    const { getOriginPhone, originPhoneNo } = this.props;
    const { showOriginPhone } = this.state;
    if (!showOriginPhone && !originPhoneNo) {
      getOriginPhone(userInfo.actorId);
    }
    this.setState(prevState => ({
      showOriginPhone: !prevState.showOriginPhone,
    }));
  }

  render() {
    const userInfo = this.props.customerDetailsList;
    const loanRecord = userInfo.loans;
    const dealRecord = this.props.customerDealRecord.records;
    const pagination = {
      total: this.props.customerDealRecord.totalRecords,
      defaultPageSize: 50,
      onChange: (pageNo, pageSize) => this.getPaginationData(pageNo, pageSize),
    };
    const { showOriginPhone } = this.state;
    const { originPhoneNo } = this.props;
    return (
      <div className="customer">
        <h3 className="dr-section-font">客户详情</h3>
        <div className="customer-detail-container">
          <div className="customer-info">
            <Row gutter={16}>
              <Col span={3}>
                <p><label>借款人ID</label></p>
                <span>{userInfo.actorId}</span>
              </Col>
              <Col span={3}>
                <p><label>姓名</label></p>
                <span>{userInfo.name}</span>
              </Col>
              <Col span={3}>
                <p><label>手机号</label></p>
                <span>{showOriginPhone ? originPhoneNo : userInfo.phone}</span>
                {
                  userInfo.phone &&
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
                <p><label>用户名</label></p>
                <span>{userInfo.userName}</span>
              </Col>
              <Col span={3}>
                <p><label>注册时间</label></p>
                <span>{userInfo.registTime}</span>
              </Col>
              <Col span={3}>
                <p><label>注册来源</label></p>
                <span>{userInfo.clientSource}</span>
              </Col>
              <Col span={3}>
                <p><label>推广渠道</label></p>
                <span>{userInfo.marketChannel}</span>
              </Col>
              <Col span={3}>
                <p><label>手机归属城市</label></p>
                <span>{userInfo.city}</span>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={3}>
                <p><label>最后分配时间</label></p>
                <span>{userInfo.lastContactTime}</span>
              </Col>
            </Row>
          </div>
          <div>
            <Tabs defaultActiveKey="loanRecord" onChange={this.callBack}>
              <TabPane tab="贷款记录" key="loanRecord">
                <Table dataSource={loanRecord} columns={loanColumns} />
              </TabPane>
              <TabPane tab="操作记录" key="dealRecord">
                <Table dataSource={dealRecord} columns={dealColumns} pagination={pagination} />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

CustomerDetails.propTypes = {
};

export default connect(
  state => ({
    customerDetailsList: state.customerDetails.customerDetailsList,
    customerDealRecord: state.customerDetails.customerDealRecord,
    isFirstLoad: state.customerDetails.isFirstLoad,
    routingQuery: state.routing.locationBeforeTransitions.query,
    originPhoneNo: state.customerDetails.originPhoneNo,
  }),
  dispatch => ({
    getCustomerDetails: (parameter) => {
      dispatch({ type: 'customerDetails/getCustomerDetails', payload: parameter });
    },
    getCustomerDealRecord: (parameter) => {
      dispatch({ type: 'customerDetails/getCustomerDealRecord', payload: parameter });
    },
    getOriginPhone: params => dispatch({ type: 'customerDetails/getOriginPhone', payload: params }),
  }),
)(CustomerDetails);

