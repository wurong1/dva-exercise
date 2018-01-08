import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { DatePicker, Table, Form, Select, Button, Row, Col, TreeSelect } from 'antd';
import TrimInput from '../../components/input-trim';
import CascadeSelect from '../../components/select-cascade';
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

class PhoneSalesAllCustomerPage extends Component {
  state = {

  };

  componentWillMount() {
    const { getEmployeeGroupId } = this.props;
    getEmployeeGroupId();
  }

  getPaginationData(pageNo, pageSize) {
    const { phoneSalesSearch, form: { getFieldsValue } } = this.props;
    const formData = getFieldsValue();
    const params = dealData(formData, { pageNo, pageSize });
    phoneSalesSearch(params);
  }

  handleChange = () => {
    this.setState(preState => ({ chageFlag: !preState.chageFlag }));
  }

  handleReset = () => {
    const { phoneSalesReset, form: { resetFields } } = this.props;
    resetFields();
    phoneSalesReset();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { phoneSalesSearch, form: { getFieldsValue } } = this.props;
    const formData = getFieldsValue();
    const params = dealData(formData, { pageNo: 1, pageSize: 50 });
    phoneSalesSearch(params);
  };

  render() {
    const { searchList, employeeGroupId, customerIds, phoneDeploy, selectedRowKeys,
      setPhoneSelectedArr, setPhoneCustomerIds, isModalShow, deployLoading, openModal, closeModal,
      form: { getFieldDecorator, getFieldValue } }
      = this.props;
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
        setPhoneSelectedArr(key);
        setPhoneCustomerIds(arr);
      },
    };
    const employeeIdOptions = {
      remote: '/borrower/getUserByGroupId?groupId={:val}',
      parentName: 'employeeGroupId',
      parentValue: getFieldValue('employeeGroupId'),
    };
    const pagination = {
      total: searchList.totalRecords,
      defaultPageSize: searchList.pageSize ? searchList.pageSize : 50,
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
                      <Option value="">全部</Option>
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
            <Row gutter={16}>
              <Col span={3}>
                <FormItem label="负责人组别" >
                  {getFieldDecorator('employeeGroupId')(
                    <TreeSelect
                      treeData={employeeGroupId}
                      dropdownMatchSelectWidth={false}
                      treeDefaultExpandAll={false}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      allowClear
                      onChange={this.handleChange.bind(this)}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="负责人" >
                  {getFieldDecorator('employeeId')(
                    <CascadeSelect {...employeeIdOptions} />,
                  )}
                </FormItem>
              </Col>
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
            rowKey={(record, idx) => idx}
          />
          <CustomerDeploy
            key={isModalShow}
            isDisabled={isDisabled}
            modalClose={closeModal}
            modalOpen={openModal}
            isModalShow={isModalShow}
            deploy={phoneDeploy}
            customerIds={customerIds}
            loading={deployLoading}
          />
        </div>
      </div>
    );
  }
}

PhoneSalesAllCustomerPage.propTypes = {
};

export default connect(
  state => ({
    employeeGroupId: state.allCustomer.employeeGroupId,
    searchList: state.allCustomer.phoneSalesSearchList,
    selectedRowKeys: state.allCustomer.phoneSelectedRowKeys,
    isModalShow: state.allCustomer.isPhoneModalShow,
    deployLoading: state.allCustomer.phoneDeployLoading,
    customerIds: state.allCustomer.phoneCustomerIds,
    loading: state.loading.models.allCustomer,
  }),
  dispatch => ({
    getEmployeeGroupId: () => {
      dispatch({ type: 'allCustomer/getEmployeeGroupId' });
    },
    phoneSalesSearch: (params) => {
      dispatch({ type: 'allCustomer/phoneSalesSearch', payload: params });
    },
    phoneSalesReset: () => {
      dispatch({ type: 'allCustomer/phoneSalesReset' });
    },
    openModal: () => {
      dispatch({ type: 'allCustomer/openPhoneModal' });
    },
    phoneDeploy: (params) => {
      dispatch({ type: 'allCustomer/phoneDeploy', payload: params });
    },
    closeModal: () => {
      dispatch({ type: 'allCustomer/closePhoneModal' });
    },
    setPhoneSelectedArr: (params) => {
      dispatch({ type: 'allCustomer/setPhoneSelectedArr', payload: params });
    },
    setPhoneCustomerIds: (params) => {
      dispatch({ type: 'allCustomer/setPhoneCustomerIds', payload: params });
    },
  }),
)(Form.create()(PhoneSalesAllCustomerPage));

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
  resultData.type = 'ALL';
  resultData.hasReferCode = false;
  resultData.pageNo = pageData.pageNo;
  resultData.pageSize = pageData.pageSize;
  return resultData;
}
