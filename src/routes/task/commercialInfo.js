import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Col, Table, InputNumber, DatePicker } from 'antd';
import TrimInput from '../../components/input-trim';
import './task.less';

const FormItem = Form.Item;

class Commercial extends Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: {},
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return false;
      }
      const traceDate = values.traceDate && values.traceDate.format('YYYY-MM-DD HH:mm:ss');
      this.props.submitForm({ ...values, traceDate });
      this.setState({ formData: { ...values, traceDate } });
    });
  }

  clearData = () => {
    const { resetFields } = this.props.form;
    resetFields();
    this.props.clearData();
  }

  ssnValidate =(rule, value, callback) => {
    const regx = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    if (!regx.exec(value)) {
      callback('请输入正确的身份证号');
    } else {
      callback();
    }
  }

  deploy = () => {
    const { commercialInfo: { selectedRows, cardNo }, deployCommercial } = this.props;
    const { formData } = this.state;
    const list = selectedRows.map((item) => {
      return { sellerNo: item.mid, posNo: item.pid };
    });
    const params = {
      cardNo,
      posInfomationDetailRequests: list,
      formData,
    };
    deployCommercial(params);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { commercialInfo: { isFetching, list = [], selectedRows = [], loading } } = this.props;

    const columns = [{
      title: '商户编号',
      dataIndex: 'mid',
      key: 'mid',
    }, {
      title: '终端编号',
      dataIndex: 'pid',
      key: 'pid',
    }, {
      title: '交易日期',
      dataIndex: 'transDate',
      key: 'transDate',
      render: (text) => {
        return text && text.split('T').join(' ');
      }
    }, {
      title: '交易名称',
      dataIndex: 'merName',
      key: 'merName',
    }];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedrows) => {
        this.props.setSelectedRows(selectedrows);
      },
    };

    return (
      <div className="dr-layout task">
        <Form
          layout="horizontal"
          onSubmit={this.handleSubmit}
        >
          <div className="crm-filter-box">
            <Row gutter={24}>
              <Col span={4}>
                <FormItem
                  label="法人身份证"
                >
                  {getFieldDecorator('cardId', {
                    rules: [{
                      required: true,
                      validator: this.ssnValidate,
                    }],
                  })(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="银行卡前六位"
                >
                  {getFieldDecorator('card6', {
                    rules: [{
                      required: true,
                      message: '不能为空',
                    }, {
                      len: 6,
                      message: '请输入6位数字',
                    }],
                  })(
                    <TrimInput />,
                    )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="银行卡后四位"
                >
                  {getFieldDecorator('card4', {
                    rules: [{
                      required: true,
                      message: '不能为空',
                    }, {
                      len: 4,
                      message: '请输入4位数字',
                    }],
                  })(
                    <TrimInput />,
                    )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="消费金额"
                >
                  {getFieldDecorator('money', {
                    rules: [{
                      required: true,
                      message: '不能为空',
                    }, {
                      type: 'number',
                      message: '请输入数字',
                    }],
                  })(
                    <InputNumber />,
                    )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="消费日期"
                >
                  {getFieldDecorator('traceDate', {
                    rules: [{
                      required: true,
                      message: '不能为空',
                    }],
                  })(
                    <DatePicker showTime />,
                    )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="商户注册名称"
                >
                  {getFieldDecorator('entName', {
                    rules: [{
                      required: true,
                      message: '不能为空',
                    }],
                  })(
                    <TrimInput />,
                    )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <FormItem
                  label="商户注册号"
                >
                  {getFieldDecorator('regNo', {
                    rules: [{
                      required: true,
                      message: '不能为空',
                    }],
                  })(
                    <TrimInput />,
                    )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="商户编号"
                >
                  {getFieldDecorator('merId', {
                    rules: [{
                      required: true,
                      message: '不能为空',
                    }],
                  })(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="终端编号"
                >
                  {getFieldDecorator('posId', {
                    rules: [{
                      required: true,
                      message: '不能为空',
                    }],
                  })(
                    <TrimInput />,
                    )}
                </FormItem>
              </Col>
            </Row>
          </div>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
            >
              搜索
            </Button>
          </FormItem>
        </Form>
        <Button className="btn-clear" onClick={this.clearData.bind(this)}>
          清空
        </Button>
        <Table
          key={isFetching}
          columns={columns}
          dataSource={list}
          size="middle"
          loading={isFetching}
          rowKey={(record, idx) => idx}
          rowSelection={rowSelection}
          footer={(currentPageData) => {
            const footer =
              (<Button
                type="primary"
                onClick={this.deploy}
                disabled={selectedRows.length < 1}
                loading={loading}
              >
                添加至商户列表
              </Button>);
            return currentPageData.length > 0 ? footer : null;
          }
          }
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    commercialInfo: state.task.unionPay.commercialInfo,
  }),
  dispatch => ({
    submitForm: params => dispatch({ type: 'task/getCommercialInfo', payload: params }),
    clearData: () => dispatch({ type: 'task/clearCommercialInfo' }),
    setSelectedRows: params => dispatch({ type: 'task/setSelectedRows', payload: params }),
    deployCommercial: params => dispatch({ type: 'task/deployCommercial', payload: params }),
  }),
)(Form.create()(Commercial));
