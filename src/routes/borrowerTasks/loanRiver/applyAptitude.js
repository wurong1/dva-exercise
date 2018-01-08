import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Row, Col, Cascader } from 'antd';
import '../borrowerTasks.less';
import TrimInput from '../../../components/input-trim';

const FormItem = Form.Item;
const Option = Select.Option;

class ApplyAptitude extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appComuntRule: [],
    };
  }

  componentDidMount() {

  }

  validationRules = (rule, data, value, callback) => {
    let result = null;
    if (value) {
      const checkValue = Number(value);
      if (!isNaN(checkValue)) {
        result = 'success';
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
    const { pageData, configInfo, form: { getFieldDecorator } } = this.props;
    return (
      <div className="border-bottom">
        <div className="loanriver-form-field">
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={8}>
                <FormItem label="信用情况">
                  {getFieldDecorator('creditStatus', {
                    initialValue: pageData.creditStatus,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.creditStatus && JSON.parse(configInfo.creditStatus).map((val) => {
                          return <Option key={val && val.value} value={val && val.value}>{val && val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col offset={4} span={8}>
                <FormItem label="是否有本地公积金">
                  {getFieldDecorator('hasAccumulationFundAgency', {
                    initialValue: `${pageData.hasAccumulationFundAgency === null ? '' : pageData.hasAccumulationFundAgency}`,
                  })(
                    <Select>
                      <Option value="true">是</Option>
                      <Option value="false">否</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="本地公积金缴存年限">
                  {getFieldDecorator('accumulationFundAgencyRange', {
                    initialValue: pageData.accumulationFundAgencyRange,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.accumulationFundAgencyRange && JSON.parse(configInfo.accumulationFundAgencyRange).map((val) => {
                          return <Option key={val && val.value} value={val && val.value}>{val && val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col offset={4} span={8}>
                <FormItem label="是否有本地社保">
                  {getFieldDecorator('hasSocialInsurance', {
                    initialValue: `${pageData.hasSocialInsurance === null ? '' : pageData.hasSocialInsurance}`,
                  })(
                    <Select>
                      <Option value="true">是</Option>
                      <Option value="false">否</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="本地社保缴存年限">
                  {getFieldDecorator('socialInsuranceRange', {
                    initialValue: pageData.socialInsuranceRange,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.socialInsuranceRange && JSON.parse(configInfo.socialInsuranceRange).map((val) => {
                          return <Option key={val && val.value} value={val && val.value}>{val && val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col offset={4} span={8}>
                <FormItem label="名下是否有房">
                  {getFieldDecorator('isEstateOwner', {
                    initialValue: `${pageData.isEstateOwner === null ? '' : pageData.isEstateOwner}`,
                  })(
                    <Select>
                      <Option value="true">是</Option>
                      <Option value="false">否</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="名下房产类型">
                  {getFieldDecorator('estateType', {
                    initialValue: pageData.estateType,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.estateType && JSON.parse(configInfo.estateType).map((val) => {
                          return <Option key={val && val.value} value={val && val.value}>{val && val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col offset={4} span={8}>
                <FormItem label="名下是否有车">
                  {getFieldDecorator('isCarOwner', {
                    initialValue: `${pageData.isCarOwner === null ? '' : pageData.isCarOwner}`,
                  })(
                    <Select>
                      <Option value="true">是</Option>
                      <Option value="false">否</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="车辆牌照类型">
                  {getFieldDecorator('carPlateType', {
                    initialValue: pageData.carPlateType,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.carPlateType && JSON.parse(configInfo.carPlateType).map((val) => {
                          return <Option key={val && val.value} value={val && val.value}>{val && val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col offset={4} span={8}>
                <FormItem label="车龄情况">
                  {getFieldDecorator('carAge', {
                    initialValue: pageData.carAge,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.carAge && JSON.parse(configInfo.carAge).map((val) => {
                          return <Option key={val && val.value} value={val && val.value}>{val && val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="车辆估值">
                  {getFieldDecorator('carEvaluation', {
                    initialValue: pageData.carEvaluation,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.carEvaluation && JSON.parse(configInfo.carEvaluation).map((val) => {
                          return <Option key={val && val.value} value={val && val.value}>{val && val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col offset={4} span={8}>
                <FormItem label="车辆用途类型">
                  {getFieldDecorator('carUsage', {
                    initialValue: pageData.carUsage,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.carUsage && JSON.parse(configInfo.carUsage).map((val) => {
                          return <Option key={val && val.value} value={val && val.value}>{val && val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="车辆按揭状态">
                  {getFieldDecorator('carMortgageStatus', {
                    initialValue: pageData.carMortgageStatus,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.carMortgageStatus && JSON.parse(configInfo.carMortgageStatus).map((val) => {
                          return <Option key={val && val.value} value={val && val.value}>{val && val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col offset={4} span={8}>
                <FormItem label="是否能提供车辆商业保险单">
                  {getFieldDecorator('carInsurance', {
                    initialValue: pageData.carInsurance,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.carInsurance && JSON.parse(configInfo.carInsurance).map((val) => {
                          return <Option key={val && val.value} value={val && val.value}>{val && val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="当前是否购买了商业保险">
                  {getFieldDecorator('hasCommercialInsurance', {
                    initialValue: `${pageData.hasCommercialInsurance === null ? '' : pageData.hasCommercialInsurance}`,
                  })(
                    <Select>
                      <Option value="true">是</Option>
                      <Option value="false">否</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col offset={4} span={8}>
                <FormItem label="商业保险类型">
                  {getFieldDecorator('commercialInsuranceType', {
                    initialValue: pageData.commercialInsuranceType,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.commercialInsuranceType && JSON.parse(configInfo.commercialInsuranceType).map((val) => {
                          return <Option key={val && val.value} value={val && val.value}>{val && val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="投保人是否为贷款人本人">
                  {getFieldDecorator('isInsuranceForSelf', {
                    initialValue: `${pageData.isInsuranceForSelf === null ? '' : pageData.isInsuranceForSelf}`,
                  })(
                    <Select>
                      <Option value="true">是</Option>
                      <Option value="false">否</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col offset={4} span={8}>
                <FormItem label="保险投保年限">
                  {getFieldDecorator('insurancePeriod', {
                    initialValue: pageData.insurancePeriod,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.insurancePeriod && JSON.parse(configInfo.insurancePeriod).map((val) => {
                          return <Option key={val && val.value} value={val && val.value}>{val && val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="保险保单总额">
                  {getFieldDecorator('insuranceTotalAmount', {
                    initialValue: pageData.insuranceTotalAmount,
                    rules: [{
                      validator: this.validationRules.bind(this, 'number'),
                    }],
                  })(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col offset={4} span={8}>
                <FormItem label="缴费频率">
                  {getFieldDecorator('payFrequency', {
                    initialValue: pageData.payFrequency,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.payFrequency && JSON.parse(configInfo.payFrequency).map((val) => {
                          return <Option key={val && val.value} value={val && val.value}>{val && val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="每期缴纳保费">
                  {getFieldDecorator('payAmountPerPeriond', {
                    initialValue: pageData.payAmountPerPeriond,
                    rules: [{
                      validator: this.validationRules.bind(this, 'number'),
                    }],
                  })(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col offset={4} span={8}>
                <FormItem label="已缴纳保险期数">
                  {getFieldDecorator('paiedPeriods', {
                    initialValue: pageData.paiedPeriods,
                    rules: [{
                      validator: this.validationRules.bind(this, 'number'),
                    }],
                  })(
                    <TrimInput />,
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

ApplyAptitude.propTypes = {
};

export default connect(
  null,
  dispatch => ({
    oneSubmit: (params) => {
      dispatch({ type: 'loanRiver/oneSubmit', payload: params });
    },
  }),
)(Form.create()(ApplyAptitude));

