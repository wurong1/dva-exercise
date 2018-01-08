import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Input, Button, Row, Col, Table, Spin } from 'antd';
import './calculator.less';

const FormItem = Form.Item;
const Option = Select.Option;

const columns = [{
  title: '期数',
  dataIndex: 'mount',
  key: 'mount',
}, {
  title: '月收本息',
  dataIndex: 'monthPay',
  key: 'monthPay',
}, {
  title: '月收本金',
  dataIndex: 'capital',
  key: 'capital',
}, {
  title: '月收利息',
  dataIndex: 'interest',
  key: 'interest',
}, {
  title: '当前余额',
  dataIndex: 'balance',
  key: 'balance',
}];

const rules = {
  // 新贵贷
  OUTSTANDING: {
    min: 20000,
    max: 500000,
    decimalTwo: true,
  },
  // 业主贷
  PROPERTY_OWNER: {
    min: 50000,
    max: 150000,
    decimalTwo: true,
  },
  // 双金贷
  DOUBLE_FUND: {
    min: 20000,
    max: 150000,
    decimalTwo: true,
  },
  // 寿险贷
  LIFE_INSURANCE: {
    min: 20000,
    max: 150000,
    decimalTwo: true,
  },
  // 现金贷
  CASH_LOAN: {
    min: 500,
    max: 1000,
    decimalTwo: true,
  },
};


class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      totalPay: null,
      totalRatio: null,
      loanType: null,
    };
  }

  calculateByMonth = (money, yearratio, month) => {
    const monthratio = ((yearratio * 10) / 12) * 0.001;
    const arry = [];
    let mount;
    let balance;
    let interest;
    let capital;
    let monthPay =
      (money * monthratio * ((1 + monthratio) ** month)) / (((1 + monthratio) ** month) - 1);
    for (let i = 0; i < month; i += 1) {
      mount = i + 1;
      balance = i === 0 ?
        (money * (1 + monthratio)) - monthPay :
          (i === month - 1) ? 0 : (arry[i - 1].balance * (1 + monthratio)) - monthPay;
      interest = i === 0 ? money * monthratio : arry[i - 1].balance * monthratio;
      capital = monthPay - interest;
      arry[i] = {
        mount,
        monthPay: twoDecimal(monthPay),
        interest: twoDecimal(interest),
        capital: twoDecimal(capital),
        balance: twoDecimal(balance),
      };
    }
    monthPay = Math.round(monthPay * 100) / 100;
    const totalPay = twoDecimal(monthPay * month);
    const totalRatio = twoDecimal(totalPay - money);
    this.setState({ dataSource: arry, totalPay, totalRatio });
  }

  calculateByDay = (money, yearratio, day) => {
    const dayratio = ((yearratio * 10) / 360) * 0.001;
    const mount = 1;
    const monthPay = (money * dayratio * day) + parseFloat(money);
    const interest = money * dayratio * day;
    const capital = money;
    const reslut = {
      mount,
      monthPay: twoDecimal(monthPay),
      interest: twoDecimal(interest),
      capital: twoDecimal(capital),
      balance: 0,
    };
    this.setState({ dataSource: [reslut], totalPay: monthPay, totalRatio: interest });
  }

  checkAmount = (rule, value, callback) => {
    const form = this.props.form;
    const { loanType } = this.state;
    let message;
    if (!loanType) {
      form.validateFields(['loanType'], { force: true });
      callback();
    } else if (!value) {
      callback();
    } else {
      const validator = rules[loanType];
      const index = value.lastIndexOf('.');
      const decimalTwo = index > -1 ? value.substring(index + 1).length > 2 : false;
      if (decimalTwo) {
        callback('最多输入小数点后两位');
      } else {
        if (value < validator.min) message = `金额不得小于${validator.min}`;
        if (value > validator.max) message = `金额不得大于${validator.max}`;
        callback(message);
      }
    }
  }

  checkYearRatio = (rule, value, callback) => {
    if (!value) {
      callback();
    } else {
      const index = value.lastIndexOf('.');
      const decimalTwo = index > -1 ? value.substring(index + 1).length > 2 : false;
      if (value === '0') {
        callback('请输入大于0的数字');
      } else if (decimalTwo) {
        callback('最多输入小数点后两位');
      } else {
        callback();
      }
    }
  }

  handleTypeChange = (value) => {
    const { setFieldsValue } = this.props.form;
    const { getCycleList, getRepayList } = this.props;
    if (value) {
      this.setState({ loanType: value }, () => {
        this.props.form.validateFields(['amount'], { force: true, first: true });
      });
    } else {
      this.setState({ loanType: value });
    }
    setFieldsValue({ loanCycle: '', repayType: '' });
    getCycleList(value);
    getRepayList(value);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { amount, loanCycle, repayType, yearRatio } = values;
        if (repayType === '按月等额本息') { // 按月等额本息还款方式
          this.calculateByMonth(amount, yearRatio, loanCycle);
        } else {
          this.calculateByDay(amount, yearRatio, loanCycle);
        }
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { dataSource, totalPay, totalRatio } = this.state;
    const { loanCycleList, loanRepayList, loadingCycleList, loadingRepayList } = this.props;

    return (
      <div>
        <Row gutter={24}>
          <Col offset={6}>
            <h3 className="dr-section-font">贷款计算器</h3>
          </Col>
        </Row>
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={24}>
            <Col span={10} offset={6} className="calculator">
              <Row gutter={24}>
                <Col span={10}>
                  <FormItem
                    label="借款产品"
                  >
                    {getFieldDecorator('loanType', {
                      initialValue: '',
                      rules: [{ required: true, message: '不能为空！' }],
                    })(
                      <Select onChange={this.handleTypeChange}>
                        <Option value="">-请选择-</Option>
                        <Option value="DOUBLE_FUND">双金贷</Option>
                        <Option value="OUTSTANDING">新贵贷</Option>
                        <Option value="PROPERTY_OWNER">业主贷</Option>
                        <Option value="LIFE_INSURANCE">寿险贷</Option>
                        <Option value="CASH_LOAN">现金贷</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={10} offset={4}>
                  <FormItem
                    label="贷款金额"
                  >
                    {getFieldDecorator('amount', {
                      rules: [
                        { required: true, message: '不能为空！' },
                        { validator: this.checkAmount.bind(this) },
                      ],
                    })(
                      <Input addonAfter="元" type="number" />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={10}>
                  <FormItem
                    label="年利率"
                  >
                    {getFieldDecorator('yearRatio', {
                      rules: [
                        { required: true, message: '不能为空！' },
                        { validator: this.checkYearRatio.bind(this) },
                      ],
                    })(
                      <Input addonAfter="%" type="number" />,
                    )}
                  </FormItem>
                </Col>
                <Col span={5} style={{ paddingTop: '33px' }} offset={4}>
                  <FormItem>
                    <Button type="primary" htmlType="submit">开始计算</Button>
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24} className="section">
                <Col span={8}>
                  <Spin spinning={loadingCycleList}>
                    <FormItem
                      label={null}
                    >
                      {getFieldDecorator('loanCycle', {
                        initialValue: '',
                        rules: [{ required: true, message: '不能为空！' }],
                      })(
                        <Select>
                          <Option value="">-请选择-</Option>
                          {
                            loanCycleList.map((item, idx) =>
                              <Option value={item.code} key={idx}>{item.name}</Option>,
                            )
                          }
                        </Select>,
                      )}
                    </FormItem>
                  </Spin>
                </Col>
                <Col span={8}>
                  <Spin spinning={loadingRepayList}>
                    <FormItem
                      label={null}
                    >
                      {getFieldDecorator('repayType', {
                        initialValue: '',
                        rules: [{ required: true, message: '不能为空！' }],
                      })(
                        <Select>
                          <Option value="">-请选择-</Option>
                          {
                            loanRepayList.map((item, idx) =>
                              <Option value={item.code} key={idx}>{item.name}</Option>,
                            )
                          }
                        </Select>,
                        )}
                    </FormItem>
                  </Spin>
                </Col>
                <Col span={8}>
                  <div>还款总额：{totalPay}</div>
                  <div>还款总利息：{totalRatio}</div>
                </Col>
              </Row>
              <Row gutter={24}>
                <Table dataSource={dataSource} columns={columns} rowKey={(record, idx) => idx} />
              </Row>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

function twoDecimal(data) {
  return Math.round(data * 100) / 100;
}

export default connect(
  state => ({
    loanCycleList: state.calculator.loanCycleList,
    loanRepayList: state.calculator.loanRepayList,
    loadingCycleList: state.calculator.loadingCycleList,
    loadingRepayList: state.calculator.loadingRepayList,
  }),
  dispatch => ({
    getCycleList: params => dispatch({ type: 'calculator/getCycleList', payload: params }),
    getRepayList: params => dispatch({ type: 'calculator/getRepayList', payload: params }),
  }),
)(Form.create()(Calculator));
