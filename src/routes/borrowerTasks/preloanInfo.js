import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { DatePicker, Table, Form, Button, Row, Col } from 'antd';
import './borrowerTasks.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const columns = [
  {
    title: '预申请时间',
    dataIndex: 'preDate',
    key: 'preDate',
  }, {
    title: '推荐贷款类型',
    dataIndex: 'recommendLoanProduct',
    key: 'recommendLoanProduct',
    render: text =>
      <span>
        {
          text.map((val, index) => {
            return <span style={{ marginLeft: '2px', color: 'white', backgroundColor: index === 0 ? '#f5787a' : '#777' }}>{`${index + 1}.${val && val.name}`} </span>;
          })
        }
      </span>,
  }, {
    title: '期望额度',
    dataIndex: 'amount',
    key: 'amount',
  }, {
    title: '常住地区',
    dataIndex: 'residence',
    key: 'residence',
  }, {
    title: '户籍所在地',
    dataIndex: 'permanentResidence',
    key: 'permanentResidence',
  },
];

class PreloanInfo extends Component {
  state = {
    pageNo: 1,
    pageSize: 50,
  };

  componentDidMount() {
    const { getCustomerInfo, routingQuery: { customerId } } = this.props;
    getCustomerInfo(customerId || '');
  }

  handleChange = () => {
    this.setState(preState => ({ chageFlag: !preState.chageFlag }));
  }

  handleReset = () => {
    const { resetTabList, form: { resetFields } } = this.props;
    resetFields();
    resetTabList();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { getTabList, routingQuery, form: { getFieldsValue } } = this.props;
    const formData = getFieldsValue();
    const params = dealData(formData, routingQuery);
    getTabList(params);
  };

  expandedRowRender = (record) => {
    return (
      <div className="tab-expand-line">
        <Row>
          <Col span={3}>
            <p>税前平均月收入</p>
            <span>{ record.pretaxIncomeMonth || '-' }</span>
          </Col>
          <Col span={3}>
            <p>工作性质</p>
            <span>{ record.professionType || '-' }</span>
          </Col>
          <Col span={3}>
            <p>职位</p>
            <span>{ record.occupation || '-' }</span>
          </Col>
          <Col span={3}>
            <p>在现工作单位年限</p>
            <span>{ record.professionTenure || '-' }</span>
          </Col>
          <Col span={3}>
            <p>企业经营时间</p>
            <span>{ record.coporationAge || '-' }</span>
          </Col>
          <Col span={3}>
            <p>是否缴纳公积金或社保</p>
            <span>{ (record.socialInsurance ? '是' : '否') || '-' }</span>
          </Col>
          <Col span={3}>
            <p>是否在还房贷</p>
            <span>{ (record.houseProperty ? '是' : '否') || '-' }</span>
          </Col>
          <Col span={3}>
            <p>是否买过人寿保险</p>
            <span>{ (record.lifeInsurance ? '是' : '否') || '-' }</span>
          </Col>
        </Row>
        <Row>
          <Col span={3}>
            <p>是否拥有房产并愿意抵押</p>
            <span>{ (record.houseMortgage ? '是' : '否') || '-' }</span>
          </Col>
          <Col span={3}>
            <p>年龄阶段</p>
            <span>{ record.ageType || '-' }</span>
          </Col>
          <Col span={3}>
            <p>用户申请贷款类型</p>
            <span>{ record.userLoanType.name || '-' }</span>
          </Col>
          <Col span={3}>
            <p>用户申请贷款金额</p>
            <span>{ record.userLoanAmount || '-' }</span>
          </Col>
          <Col span={3}>
            <p>用户申请贷款期限</p>
            <span>{ record.userLoanDuration || '-' }</span>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const { pageNo, pageSize } = this.state;
    const { customerInfo, tabList, loading, form: { getFieldDecorator } }
      = this.props;
    const pagination = {
      total: tabList.length || 0,
      current: pageNo,
      pageSize,
      onChange: (number, size) => {
        this.setState({ pageNo: number, pageSize: size });
      },
    };
    return (
      <div>
        <h3>客户预申请信息</h3>
        <div className="info-container">
          <Row>
            <Col span={3}>
              <h3>客户信息</h3>
            </Col>
            <Col span={3}>
              <p>借款人ID</p>
              <span>{ customerInfo && customerInfo.drBusinessId }</span>
            </Col>
            <Col span={3}>
              <p>客户姓名</p>
              <span>{ customerInfo && customerInfo.customerName }</span>
            </Col>
            <Col span={3}>
              <p>用户名</p>
              <span>{ customerInfo && customerInfo.userName }</span>
            </Col>
            <Col span={3}>
              <p>手机号</p>
              <span>{ customerInfo && customerInfo.phone }</span>
            </Col>
            <Col span={3}>
              <p>手机所属城市</p>
              <span>{ customerInfo && customerInfo.phoneCity }</span>
            </Col>
            <Col span={3}>
              <p>城市</p>
              <span>{ customerInfo && customerInfo.city }</span>
            </Col>
            <Col span={3}>
              <p>客户来源</p>
              <span>{ customerInfo && customerInfo.customerOrigin }</span>
            </Col>
          </Row>
          <Row>
            <Col offset={3} span={3}>
              <p>渠道</p>
              <span>{ customerInfo && customerInfo.marketChannel }</span>
            </Col>
            <Col span={3}>
              <p>注册时间</p>
              <span>{ customerInfo && customerInfo.borrowerStatusDate }</span>
            </Col>
            <Col span={3}>
              <p>在现单位工作年限</p>
              <span>{ customerInfo && customerInfo.workingYearsLevel }</span>
            </Col>
            <Col span={3}>
              <p>负责人组别</p>
              <span>{ customerInfo && customerInfo.borrowEmployeeGroupName }</span>
            </Col>
            <Col span={3}>
              <p>负责人</p>
              <span>{ customerInfo && customerInfo.borrowEmployeeName }</span>
            </Col>
            <Col span={3}>
              <p>用户所属销售</p>
              <span>{ customerInfo && customerInfo.offemployeeName }</span>
            </Col>
          </Row>
        </div>
        <div className="tab-container">
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={4}>
                <FormItem label="预申请时间">
                  {getFieldDecorator('processPreDate')(
                    <RangePicker />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <Button type="primary" htmlType="submit">查询</Button>
                <a style={{ marginLeft: '10px' }} onClick={this.handleReset}>清空</a>
              </Col>
            </Row>
            <Row>
              <Table
                dataSource={tabList || []}
                expandedRowRender={record => this.expandedRowRender(record)}
                columns={columns}
                loading={loading}
                pagination={pagination}
                size="middle"
              />
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

PreloanInfo.propTypes = {
};

export default connect(
  state => ({
    customerInfo: state.preloanInfo.customerInfo,
    tabList: state.preloanInfo.tabList,
    loading: state.loading.models.preloanInfo,
    routingQuery: state.routing.locationBeforeTransitions.query,
  }),
  dispatch => ({
    getCustomerInfo: (params) => {
      dispatch({ type: 'preloanInfo/getCustomerInfo', payload: params });
    },
    getTabList: (params) => {
      dispatch({ type: 'preloanInfo/getTabList', payload: params });
    },
    resetTabList: () => {
      dispatch({ type: 'preloanInfo/resetTabList' });
    },
  }),
)(Form.create()(PreloanInfo));

function dealData(formData, routingQuery) {
  const resultData = {
    actorId: routingQuery.actorId || '',
  };
  if (formData.processPreDate) {
    resultData.processPreStartDate = +formData.processPreDate[0].startOf('day');
    resultData.processPreEndDate = +formData.processPreDate[1].startOf('day') + 86399999;
  }
  return resultData;
}
