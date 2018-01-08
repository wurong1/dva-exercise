import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Row, Col } from 'antd';
import '../borrowerTasks.less';
import bAddress from '../../../constants/bapp-address';

const bappAddress = bAddress;
bappAddress.forEach((city) => {
  if (city.children) {
    city.children.forEach((district) => {
      if (district.children) {
        delete district.children;
      }
    });
  }
});

const FormItem = Form.Item;
const Option = Select.Option;
const rules = {
  // 业主贷
  YCDAI: {
    min: 2,
    max: 15,
  },
  // 双金贷
  SJDAI: {
    min: 2,
    max: 15,
  },
 // 寿险贷
  SXDAI: {
    min: 2,
    max: 15,
  },
  // 新贵贷
  XGDAI: {
    min: 2,
    max: 20,
  },
  // 优薪贷
  YSDAI: {
    min: 2,
    max: 20,
  },
  // 优车贷
  XCDAI: {
    min: 2,
    max: 20,
  },
};

class LoanApply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loanType: null,
      isFirstLoad: true,
    };
  }

  componentDidMount() {

  }

  loanTypeChange = (val) => {
    this.setState({ loanType: val, isFirstLoad: false }, () => {
      this.props.form.validateFields(['loanAmount'], { force: true });
    });
  }

  validationRules = (rule, data, value, callback) => {
    let result = null;
    if (value) {
      const checkValue = Number(value);
      if (!isNaN(checkValue)) {
        if (rule && rule.min) {
          if (checkValue > 0 && checkValue >= rule.min && checkValue <= rule.max) {
            result = 'success';
          } else {
            result = `贷款金额范围为${rule.min}至${rule.max}万元`;
          }
        } else {
          result = 'success';
        }
      } else {
        result = '请输入数字';
      }
    } else {
      result = 'success';
    }
    callback(result === 'success' ? undefined : result);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { oneSubmit, pageData, form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const resultData = values;
        resultData.aid = pageData.aid;
        oneSubmit(resultData);
      }
    });
  }

  render() {
    const { loanType, isFirstLoad } = this.state;
    const { pageData, configInfo, form: { getFieldDecorator } } = this.props;
    return (
      <div className="border-bottom">
        <div className="loanriver-form-field">
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={8}>
                <FormItem label="贷款类型">
                  {getFieldDecorator('productName', {
                    initialValue: pageData.productName,
                    onChange: this.loanTypeChange,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.productName && JSON.parse(configInfo.productName).map((val) => {
                          return <Option key={val && val.value} value={val && val.value}>{val && val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col offset={4} span={8}>
                <FormItem label="贷款金额">
                  {getFieldDecorator('loanAmount', {
                    initialValue: pageData.loanAmount,
                    rules: [{
                      validator: this.validationRules.bind(this, isFirstLoad ? rules[pageData.productName] : rules[loanType]),
                    }],
                  })(
                    <Input addonAfter="万元" />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="贷款期限">
                  {getFieldDecorator('loanDuration', {
                    initialValue: pageData.loanDuration,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.loanDuration && JSON.parse(configInfo.loanDuration).map((val) => {
                          return <Option key={val && val.value} value={val && val.value}>{val && val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col offset={4} span={8}>
                <FormItem label="贷款用途">
                  {getFieldDecorator('loanPurpose', {
                    initialValue: pageData.loanPurpose,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.loanPurpose && JSON.parse(configInfo.loanPurpose).map((val) => {
                          return <Option key={val && val.value} value={val && val.value}>{val && val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <div style={{ marginBottom: '20px' }}>(<span style={{ color: 'red' }}>*</span>表示必填项)</div>
            <Row>
              <Button type="primary" htmlType="submit">保存</Button>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

LoanApply.propTypes = {
};

export default connect(
  null,
  dispatch => ({
    oneSubmit: (params) => {
      dispatch({ type: 'loanRiver/oneSubmit', payload: params });
    },
  }),
)(Form.create()(LoanApply));

