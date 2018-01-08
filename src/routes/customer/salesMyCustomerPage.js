import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { DatePicker, Table, Form, Select, Button, Row, Col } from 'antd';

import TrimInput from '../../components/input-trim';
import CustomerDeploy from './deployModal';
import './customer.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
const columns = [
  {
    title: '借款人Id',
    dataIndex: 'actorId',
    render: text => <Link to={`/customerDetails?actorId=${text}`}>{text}</Link>,
  }, {
    title: '电话号码',
    dataIndex: 'phone',
  }, {
    title: '客户名称',
    dataIndex: 'name',
  }, {
    title: '手机归属城市',
    dataIndex: 'city',
  }, {
    title: '注册时间',
    dataIndex: 'registTime',
    render: text => <span>{text ? moment(Number(text)).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
  }, {
    title: '注册来源',
    dataIndex: 'clientSource',
  }, {
    title: '最后分配时间',
    dataIndex: 'lastContactTime',
    render: text => <span>{text ? moment(Number(text)).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
  }, {
    title: '推广渠道',
    dataIndex: 'marketChannel',
  }, {
    title: '负责人组别',
    dataIndex: 'employeeGroupName',
  }, {
    title: '负责人',
    dataIndex: 'employeeName',
  },
];
const clientSourceData = [
  {
    name: '全部',
    value: '',
  }, {
    name: 'Borrow App',
    value: 'BA',
  }, {
    name: 'Landing Page',
    value: 'LP',
  }, {
    name: 'WeChat',
    value: 'WX',
  }, {
    name: 'Sales App',
    value: 'SP',
  }, {
    name: 'Cash Loan',
    value: 'CL',
  }, {
    name: 'Main Site',
    value: 'MS',
  }, {
    name: 'New Borrower',
    value: 'NB',
  }, {
    name: 'BD',
    value: 'BD',
  }, {
    name: 'CRM',
    value: 'CRM',
  }, {
    name: 'Speed Loan',
    value: 'SL',
  }, {
    name: 'LITE',
    value: 'LT',
  }, {
    name: '来源为空',
    value: 'NOTSET',
  }, {
    name: 'UNKNOWN',
    value: 'UN',
  },
];

class SalesMyCustomerPage extends Component {
  state = {

  };

  componentWillMount() {

  }

  getPaginationData(pageNo, pageSize) {
    const { salesSearch, form: { getFieldsValue } } = this.props;
    const formData = getFieldsValue();
    const params = dealData(formData, { pageNo, pageSize });
    salesSearch(params);
  }

  handleReset = () => {
    const { salesReset, form: { resetFields } } = this.props;
    resetFields();
    salesReset();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { salesSearch, form: { getFieldsValue } } = this.props;
    const formData = getFieldsValue();
    const params = dealData(formData, { pageNo: 1, pageSize: 50 });
    salesSearch(params);
  };

  render() {
    const { searchList, deploy, customerIds, selectedRowKeys, setSelectedArr, setCustomerIds,
      isModalShow, openModal, closeModal, deployLoading, form: { getFieldDecorator } } = this.props;
    const isDisabled = customerIds && customerIds.length <= 0;
    const rowSelection = {
      selectedRowKeys,
      onChange: (key, selectedRows) => {
        const arr = [];
        if (selectedRows) {
          selectedRows.forEach((val, idx) => {
            arr[idx] = val.customerId;
          });
        }
        setSelectedArr(key);
        setCustomerIds(arr);
      },
    };
    const pagination = {
      total: searchList && searchList.totalRecords,
      defaultPageSize: searchList && searchList.pageSize ? searchList.pageSize : 50,
      onChange: (page, pageSize) => this.getPaginationData(page, pageSize),
    };
    return (
      <div>
        <div className="customer-border">
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col span={3}>
                <FormItem label="借款人id" {...formItemLayout} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('actorId')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="电话" {...formItemLayout} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('phone')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="姓名" {...formItemLayout} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('name')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem label="注册时间" {...formItemLayout} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('registTime')(
                    <RangePicker />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="注册来源" {...formItemLayout} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('clientSource')(
                    <Select>
                      {
                        clientSourceData && clientSourceData.map((val) => {
                          return <Option key={val.value} value={val.value}>{val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem label="最后分配时间" {...formItemLayout} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('lastContactTime')(
                    <RangePicker />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="推广渠道" {...formItemLayout} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('marketChannel')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={3}>
                <FormItem label="证件号码" {...formItemLayout} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('idNo')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Button type="primary" htmlType="submit">查询</Button>
              <a onClick={this.handleReset} className="btn-link">清空</a>
            </Row>
          </Form>
        </div>
        <div>
          <Table
            rowSelection={rowSelection}
            className="crm-table"
            dataSource={searchList && searchList.records}
            columns={columns}
            loading={this.props.loading}
            pagination={pagination}
          />
          <CustomerDeploy
            key={isModalShow}
            isDisabled={isDisabled}
            modalClose={closeModal}
            modalOpen={openModal}
            isModalShow={isModalShow}
            deploy={deploy}
            customerIds={customerIds}
            loading={deployLoading}
          />
        </div>
      </div>
    );
  }
}

SalesMyCustomerPage.propTypes = {
};

export default connect(
  state => ({
    searchList: state.myCustomer.salesSearchList,
    isModalShow: state.myCustomer.isModalShow,
    selectedRowKeys: state.myCustomer.selectedRowKeys,
    customerIds: state.myCustomer.customerIds,
    deployLoading: state.myCustomer.deployLoading,
    loading: state.loading.models.myCustomer,
  }),
  dispatch => ({
    salesSearch: (params) => {
      dispatch({ type: 'myCustomer/salesSearch', payload: params });
    },
    salesReset: () => {
      dispatch({ type: 'myCustomer/salesReset' });
    },
    openModal: () => {
      dispatch({ type: 'myCustomer/openModal' });
    },
    deploy: (params) => {
      dispatch({ type: 'myCustomer/deploy', payload: params });
    },
    closeModal: () => {
      dispatch({ type: 'myCustomer/closeModal' });
    },
    setSelectedArr: (params) => {
      dispatch({ type: 'myCustomer/setSelectedArr', payload: params });
    },
    setCustomerIds: (params) => {
      dispatch({ type: 'myCustomer/setCustomerIds', payload: params });
    },
  }),
)(Form.create()(SalesMyCustomerPage));

function dealData(formData, pageData) {
  const resultData = formData;
  for (const x in resultData) {
    if (['registTime', 'lastContactTime'].indexOf(x) > -1 && resultData[x]) {
      if (resultData[x].length > 0) {
        const startDay = +resultData[x][0].startOf('day');
        const endDay = +resultData[x][1].startOf('day') + 86399999;
        resultData[x] = `${startDay}-${endDay}`;
      } else {
        delete resultData[x];
      }
    }
  }
  resultData.type = 'PERSONAL';
  resultData.hasReferCode = true;
  resultData.pageNo = pageData.pageNo;
  resultData.pageSize = pageData.pageSize;
  return resultData;
}
