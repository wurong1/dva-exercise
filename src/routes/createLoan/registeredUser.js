import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Button, Table, Radio, message, Row, Col, Spin } from 'antd';

import TrimInput from '../../components/input-trim';
import './createLoan.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const phoneRegExp = /^(1(3|4|5|7|8)[0-9]{9})$/;
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
const personalColumns = [
  {
    title: '手机号',
    dataIndex: 'cellphone',
  }, {
    title: '邮箱',
    dataIndex: 'email',
  }, {
    title: '借款人ID',
    dataIndex: 'id',
  }, {
    title: '姓名',
    dataIndex: 'userName',
  }, {
    title: '身份证号',
    dataIndex: 'idCard',
  }, {
    title: '注册时间',
    dataIndex: 'registDate',
    render: text => <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
  }, {
    title: '注册来源',
    dataIndex: 'clientSourceType',
  },
];
const companyColumns = [
  {
    title: '企业证件号',
    dataIndex: 'idCard',
  }, {
    title: '借款人ID',
    dataIndex: 'id',
  }, {
    title: '企业名称',
    dataIndex: 'userName',
  }, {
    title: '注册时间',
    dataIndex: 'registDate',
    render: text => <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
  }, {
    title: '注册来源',
    dataIndex: 'clientSourceType',
  },
];

class RegisteredModal extends Component {
  state = {
    company: false,
    selectedRowKeys: [],
  };
  componentWillMount() {

  }

  onChange= (e) => {
    const { temporaryId } = this.props;
    this.setState({ company: e.target.value, selectedRowKeys: [] });
    temporaryId(null);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { searchCustomer, form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        if (!values.ssn) {
          if (values.cellPhone || values.email) {
            searchCustomer(values, this.state);
            this.setState({ selectedRowKeys: [] });
          } else {
            message.info('请确保至少输入一个查询条件！');
          }
        } else {
          searchCustomer(values, this.state);
          this.setState({ selectedRowKeys: [] });
        }
      }
    });
  };

  handleReset = () => {
    const { form: { resetFields } } = this.props;
    resetFields();
  };

  render() {
    const { form: { getFieldDecorator }, searchCustomerLoading,
    temporaryId, searchCustomerList, searchCompanyCustomerList } = this.props;
    const { company, selectedRowKeys } = this.state;
    const columns = company ? companyColumns : personalColumns;
    const dataSource = company ? searchCompanyCustomerList ? [searchCompanyCustomerList] : null : searchCustomerList ? [searchCustomerList] : null;
    const rowSelection = {
      selectedRowKeys,
      type: 'raido',
      onChange: (key, selectedRows) => {
        if (selectedRows.length > 0) {
          const chooseList = selectedRows[0] ? selectedRows[0] : null;
          if (chooseList) {
            chooseList.company = company;
            temporaryId(chooseList);
          }
        } else {
          temporaryId(null);
        }
        this.setState({ selectedRowKeys: key });
      },
    };
    return (
      <div>
        <Spin spinning={searchCustomerLoading}>
          <div className="search-header">
            <Form onSubmit={this.handleSubmit}>
              <div>
                <RadioGroup className="padding-bottom-20" onChange={this.onChange} defaultValue={false}>
                  <RadioButton className="width-150 text-center" value={false}>个人</RadioButton>
                  <RadioButton className="width-150 text-center" value={true}>企业</RadioButton>
                </RadioGroup>
              </div>
              <Row gutter={16}>
                {
                  company ?
                    <Col span={10}>
                      <FormItem label="企业证件号" {...formItemLayout} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {getFieldDecorator('ssn', {
                          rules: [{ required: true, message: '请输入企业证件号后再查询！' }],
                        })(
                          <TrimInput />,
                        )}
                      </FormItem>
                    </Col>
                    :
                    <Col span={18}>
                      <Row>
                        <Col span={12}>
                          <FormItem label="手机" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                            {getFieldDecorator('cellPhone', {
                              rules: [{ exclusive: true, pattern: phoneRegExp, message: '精准查询，请确保手机号正确！' }],
                            })(
                              <TrimInput />,
                            )}
                          </FormItem>
                        </Col>
                        <Col span={12}>
                          <FormItem label="邮箱" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                            {getFieldDecorator('email', {
                              rules: [{ exclusive: true, type: 'email', message: '精准查询，请确保邮箱正确！' }],
                            })(
                              <TrimInput />,
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                    </Col>
                }
                <Col span={6}>
                  <Button type="primary" htmlType="submit">查询</Button>
                  <a onClick={this.handleReset} className="btn-link">清空</a>
                </Col>
              </Row>
            </Form>
          </div>
          <div>
            <Table
              dataSource={dataSource}
              columns={columns}
              rowSelection={rowSelection}
              pagination={false}
            />
          </div>
        </Spin>
      </div>
    );
  }
}

RegisteredModal.propTypes = {
};

export default connect(
  state => ({
    searchCustomerLoading: state.createLoan.searchCustomerLoading,
    searchCustomerList: state.createLoan.searchCustomerList,
    searchCompanyCustomerList: state.createLoan.searchCompanyCustomerList,
    chooseList: state.createLoan.chooseList,
  }),
  dispatch => ({
    searchCustomer: (formData, state) => {
      const resultData = formData;
      resultData.company = state.company;
      dispatch({ type: 'createLoan/searchCustomer', payload: resultData });
    },
    temporaryId: (chooseList) => {
      dispatch({ type: 'createLoan/temporaryId', payload: chooseList });
    },
  }),
)(Form.create()(RegisteredModal));

