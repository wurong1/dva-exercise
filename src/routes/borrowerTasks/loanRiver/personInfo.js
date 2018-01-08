import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Row, Col, Cascader } from 'antd';
import '../borrowerTasks.less';
import TrimInput from '../../../components/input-trim';
import bAddress from '../../../constants/bapp-address';

const FormItem = Form.Item;
const Option = Select.Option;
const idCardRegExp = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
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

class PersonInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appComuntRule: [],
    };
  }

  componentDidMount() {

  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { oneSubmit, pageData, form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const resultData = values;
        if (resultData.address && resultData.address.length > 0) {
          if (resultData.address[0] && resultData.address[1]) {
            resultData.address = `${resultData.address[0]},${resultData.address[1]}`;
          } else {
            resultData.address = `${resultData.address[0]}`;
          }
        } else {
          resultData.address = pageData.address;
        }
        if (resultData.permanentAddress && resultData.permanentAddress.length > 0) {
          if (resultData.permanentAddress[0] && resultData.permanentAddress[1]) {
            resultData.permanentAddress = `${resultData.permanentAddress[0]},${resultData.permanentAddress[1]}`;
          } else {
            resultData.permanentAddress = `${resultData.permanentAddress[0]}`;
          }
        } else {
          resultData.permanentAddress = pageData.permanentAddress;
        }
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
                <FormItem label="真实姓名">
                  {getFieldDecorator('name', {
                    initialValue: pageData.name,
                  })(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col offset={4} span={8}>
                <FormItem label="身份证号">
                  {getFieldDecorator('ssn', {
                    initialValue: pageData.ssn,
                    rules: [{ pattern: idCardRegExp, message: '请输入正确的证件号码！' }],
                  })(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="性别">
                  {getFieldDecorator('gender', {
                    initialValue: pageData.gender,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.gender && JSON.parse(configInfo.gender).map((val) => {
                          return <Option key={val && val.value} value={val && val.value}>{val && val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col offset={4} span={8}>
                <FormItem label="年龄范围">
                  {getFieldDecorator('ageRange', {
                    initialValue: pageData.ageRange,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.ageRange && JSON.parse(configInfo.ageRange).map((val) => {
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
                <FormItem label="婚姻状况">
                  {getFieldDecorator('marriageStatus', {
                    initialValue: pageData.marriageStatus,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.marriageStatus && JSON.parse(configInfo.marriageStatus).map((val) => {
                          return <Option key={val && val.value} value={val && val.value}>{val && val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col offset={4} span={8}>
                <FormItem label="居住所在地">
                  {getFieldDecorator('address', {
                    initialValue: (pageData.address && pageData.address.split(',')) || [],
                  })(
                    <Cascader options={bappAddress} showSearch />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="居住详细地址">
                  {getFieldDecorator('detailedAddress', {
                    initialValue: pageData.detailedAddress,
                  })(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col offset={4} span={8}>
                <FormItem label="户籍所在地">
                  {getFieldDecorator('permanentAddress', {
                    initialValue: (pageData.permanentAddress && pageData.permanentAddress.split(',')) || [],
                  })(
                    <Cascader options={bappAddress} showSearch />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="职业类型">
                  {getFieldDecorator('jobType', {
                    initialValue: pageData.jobType,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.jobType && JSON.parse(configInfo.jobType).map((val) => {
                          return <Option key={val && val.value} value={val && val.value}>{val && val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col offset={4} span={8}>
                <FormItem label="单位性质">
                  {getFieldDecorator('companyType', {
                    initialValue: pageData.companyType,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.companyType && JSON.parse(configInfo.companyType).map((val) => {
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
                <FormItem label="单位所属行业">
                  {getFieldDecorator('jobCompanySegment', {
                    initialValue: pageData.jobCompanySegment,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.jobCompanySegment && JSON.parse(configInfo.jobCompanySegment).map((val) => {
                          return <Option key={val && val.value} value={val && val.value}>{val && val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col offset={4} span={8}>
                <FormItem label="现单位工作年限">
                  {getFieldDecorator('workingPeriods', {
                    initialValue: pageData.workingPeriods,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.workingPeriods && JSON.parse(configInfo.workingPeriods).map((val) => {
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
                <FormItem label="工资发放形式">
                  {getFieldDecorator('salaryForm', {
                    initialValue: pageData.salaryForm,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.salaryForm && JSON.parse(configInfo.salaryForm).map((val) => {
                          return <Option key={val && val.value} value={val && val.value}>{val && val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col offset={4} span={8}>
                <FormItem label="税后月薪范围">
                  {getFieldDecorator('salaryRange', {
                    initialValue: pageData.salaryRange,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.salaryRange && JSON.parse(configInfo.salaryRange).map((val) => {
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
                <FormItem label="能提供连续几个月流水">
                  {getFieldDecorator('bankFlowRange', {
                    initialValue: pageData.bankFlowRange,
                  })(
                    <Select>
                      {
                        configInfo && configInfo.bankFlowRange && JSON.parse(configInfo.bankFlowRange).map((val) => {
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

PersonInfo.propTypes = {
};

export default connect(
  null,
  dispatch => ({
    oneSubmit: (params) => {
      dispatch({ type: 'loanRiver/oneSubmit', payload: params });
    },
  }),
)(Form.create()(PersonInfo));

