import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, DatePicker, Radio, Row, Col, Modal, Tabs, Badge, Steps } from 'antd';
import moment from 'moment';

import TrimInput from '../../components/input-trim';
import OperationRecord from './operationRecord';
import DetailsDeploy from './detailsDeploy';
import './borrowerTasks.less';

const TabPane = Tabs.TabPane;
const Step = Steps.Step;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TextArea = Input.TextArea;

const rules = {
  // 新贵贷
  OUTSTANDING: {
    min: 20000,
    max: 500000,
  },
  // 业主贷
  PROPERTY_OWNER: {
    min: 50000,
    max: 150000,
  },
  // 双金贷
  DOUBLE_FUND: {
    min: 20000,
    max: 150000,
  },
 // 寿险贷
  LIFE_INSURANCE: {
    min: 20000,
    max: 150000,
  },
};
class NewTaskDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      appComuntRule: [],
      isDeploy: false,
      isFirstLoad: true,
      showOriginPhone0: false,
      showOriginPhone1: false,
      showOriginPhone2: false,
      showOriginSSn: false,
    };
  }

  componentDidMount() {
    const { getLoanType, getPreloanInfo, getEnvyInfo,
      taskDetailsList: { operationResult, loanBaseInfor, customerInfor } } = this.props;
    getLoanType();
    if (operationResult) {
      this.operationResultOnchange(operationResult, true);
    }
    if (loanBaseInfor && loanBaseInfor.intentionLoanType) {
      this.loanTypeChange(loanBaseInfor.intentionLoanType, true);
    }
    if (customerInfor && customerInfor.hasPreloanapp) {
      getPreloanInfo(customerInfor.actorId);
    }
    if (loanBaseInfor && loanBaseInfor.envoyId) {
      getEnvyInfo(loanBaseInfor.envoyId);
    }
    this.props.getDetailPhone();
    this.props.getDetailSsn();
  }

  validationRules = (rule, data, value, callback) => {
    let result = null;
    if (value) {
      const checkValue = Number(value);
      if (checkValue.toString() === value.toString()) {
        if (rule && rule.min) {
          if (checkValue > 0 && checkValue >= rule.min && checkValue <= rule.max) {
            result = 'success';
          } else {
            result = `请输入范围为${rule.min}至${rule.max}的数字`;
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

  operationResultOnchange = (val, isFirstLoad) => {
    const { getResultOption } = this.props;
    let result;
    this.setState({ isFirstLoad });
    switch (val) {
      case 'VALID':
        result = [
          {
            name: 'detailType',
            required: false,
            type: 'Select',
            label: '详细类型',
          }, {
            name: 'intentionRemark',
            required: false,
            type: 'TextArea',
            label: '补充说明',
          }];
        getResultOption(val);
        break;
      case 'INVALID':
        result = [
          {
            name: 'detailType',
            required: true,
            type: 'Select',
            label: '详细类型',
          }, {
            name: 'intentionRemark',
            required: false,
            type: 'TextArea',
            label: '补充说明',
          }];
        getResultOption(val);
        break;
      case 'NOT_REACHABLE':
        result = [
          {
            name: 'detailType',
            required: false,
            type: 'Select',
            label: '详细类型',
          }, {
            name: 'intentionRemark',
            required: false,
            type: 'TextArea',
            label: '补充说明',
          }];
        getResultOption(val);
        break;
      case 'TO_BE_FOLLOWED_UP':
        result = [
          {
            name: 'feedBackTime',
            required: false,
            type: 'DatePicker',
            label: '预约回访时间',
          }, {
            name: 'intentionRemark',
            required: false,
            type: 'TextArea',
            label: '补充说明',
          }];
        break;
      default: result = [];
    }
    this.setState({ result });
  }

  loanTypeChange = (val, isFirstLoad) => {
    const { getLoanDate, form: { setFieldsValue } } = this.props;
    this.setState({ appComuntRule: rules[val] });
    getLoanDate(val);
    if (!isFirstLoad) {
      setFieldsValue({ loanCycle: '' });
    }
  }

  handleSubmit = () => {
    const { saveIntention, taskDetailsList, form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        this.setState({ isDeploy: false });
        saveIntention(values, taskDetailsList);
      }
    });
  }

  saveAndDeploy = () => {
    const { closeEveryModal, saveIntention, getGroupList, taskDetailsList, form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        this.setState({ isDeploy: true });
        closeEveryModal();
        saveIntention(values, taskDetailsList);
        getGroupList();
      }
    });
  }

  onCancel = () => {
    const { closeEveryModal } = this.props;
    closeEveryModal();
  }

  disabledDate = (current) => {
    return current && current.valueOf() < moment().startOf('day');
  }

  showPhoneNo = (id) => {
    this.props.getDetailPhone();
    this.setState(prevState => ({
      showOriginPhone0: id === 0 ? !prevState.showOriginPhone0 : prevState.showOriginPhone0,
      showOriginPhone1: id === 1 ? !prevState.showOriginPhone1 : prevState.showOriginPhone1,
      showOriginPhone2: id === 2 ? !prevState.showOriginPhone2 : prevState.showOriginPhone2,
    }));
  }

  showSsn = () => {
    this.props.getDetailSsn();
    this.setState(prevState => ({
      showOriginSSn: !prevState.showOriginSSn,
    }));
  }

  render() {
    const {
      result,
      appComuntRule,
      isFirstLoad,
      isDeploy,
      showOriginPhone0,
      showOriginPhone1,
      showOriginPhone2,
      showOriginSSn,
    } = this.state;
    const { preloanInfoList,
      envyInfoList,
      loanTypeList,
      resultOptionList,
      groupList,
      loanDateList,
      everyModalShow,
      taskDetailsList,
      taskDetailsList: { taskId, operationResults, customerInfor, loanBaseInfor },
      form: { getFieldDecorator },
      originPhoneNo,
      originSsn,
    } = this.props;
    let output;
    const isModalShow = isDeploy && everyModalShow;
    const taskIds = [`${taskDetailsList.taskId}-${customerInfor.customerId}-NEWREGIST`];
    if (result.length > 0) {
      output = result.map((val) => {
        if (val.type === 'Select') {
          return (
            <FormItem label={val.label}>
              {getFieldDecorator(val.name, {
                initialValue: (isFirstLoad && taskDetailsList && taskDetailsList.detailType) || '',
              })(
                <Select>
                  <Option value="">请选择</Option>
                  {
                    resultOptionList && resultOptionList.map((item) => {
                      return <Option value={item && item.id}>{item.name}</Option>;
                    })
                  }
                </Select>,
              )}
            </FormItem>);
        } else if (val.type === 'TextArea') {
          return (
            <FormItem label={val.label}>
              {getFieldDecorator(val.name, {
                initialValue: taskDetailsList && taskDetailsList.intentionRemark,
              })(
                <TextArea />,
              )}
            </FormItem>);
        } else if (val.type === 'DatePicker') {
          return (
            <FormItem label={val.label}>
              {getFieldDecorator(val.name, {
                initialValue: taskDetailsList.feedBackTime ? moment(taskDetailsList.feedBackTime) : '',
              })(
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={this.disabledDate}
                  showTime
                />,
              )}
            </FormItem>);
        } else {
          return null;
        }
      });
    } else {
      output = null;
    }
    return (
      <div className="crm-tab">
        <Tabs defaultActiveKey="details" className="tabs">
          <TabPane tab="任务详情" key="details">
            <div>
              <div className="crm-section">
                <div className="step">
                  <Steps current={0}>
                    <Step title="新注册" />
                    <Step title="引导进件" />
                    <Step title="审核跟进" />
                    <Step title="签约" />
                  </Steps>
                </div>
                {
                  customerInfor && customerInfor.hasPreloanapp ?
                    <div>
                      <Row>
                        <Col span={3}>
                          <h3>客户预申请信息</h3>
                        </Col>
                        <Col span={3}>
                          <p>借款人ID</p>
                          <span>{ customerInfor && customerInfor.actorId }</span>
                        </Col>
                        <Col span={3}>
                          <p>客户姓名</p>
                          <span>{ customerInfor && customerInfor.customerName }</span>
                        </Col>
                        <Col span={3}>
                          <p>手机号</p>
                          <span>{ showOriginPhone0 ? originPhoneNo : (customerInfor && customerInfor.phone) } </span>
                          {
                            customerInfor && customerInfor.phone &&
                            <a>
                              <span
                                className={showOriginPhone0 ? 'icon-showpsw' : 'icon-closepsw'}
                                onClick={this.showPhoneNo.bind(this, 0)}
                                style={{ marginLeft: '5px' }}
                              />
                            </a>
                          }
                        </Col>
                        <Col span={3}>
                          <p>预申请时间</p>
                          <span>{ preloanInfoList && preloanInfoList.preDate }</span>
                        </Col>
                        <Col span={3}>
                          <p>用户申请贷款期限</p>
                          <span>{ preloanInfoList && preloanInfoList.userLoanDuration }</span>
                        </Col>
                        <Col span={3}>
                          <p>户籍所在地</p>
                          <span>{ preloanInfoList && preloanInfoList.permanentResidence }</span>
                        </Col>
                        <Col span={3}>
                          <p>常住地区</p>
                          <span>{ preloanInfoList && preloanInfoList.residence }</span>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={3}>
                          <a target="_blank" rel="noopener noreferrer" href={`/bcrm/#/preloanInfo?customerId=${customerInfor && customerInfor.customerId}&actorId=${customerInfor && customerInfor.actorId}`}>历史预申请</a>
                        </Col>
                        <Col span={3}>
                          <p>期望额度</p>
                          <span>{ preloanInfoList && preloanInfoList.amount }</span>
                        </Col>
                        <Col span={3}>
                          <p>年龄</p>
                          <span>{ (preloanInfoList && preloanInfoList.age) || (preloanInfoList && preloanInfoList.ageType) }</span>
                        </Col>
                        <Col span={3}>
                          <p>工作性质</p>
                          <span>{ preloanInfoList && preloanInfoList.professionType }</span>
                        </Col>
                        <Col span={3}>
                          <p>职位</p>
                          <span>{ preloanInfoList && preloanInfoList.occupation }</span>
                        </Col>
                        <Col span={3}>
                          <p>在现工作单位年限</p>
                          <span>
                            { customerInfor && customerInfor.workingYearsLevel ?
                              customerInfor.workingYearsLevel === 0 ? '0-6个月' :
                              customerInfor.workingYearsLevel === 1 ? '7-12个月' :
                              customerInfor.workingYearsLevel === 2 ? '1-3年' : '3年以上'
                            : preloanInfoList && preloanInfoList.professionTenure
                            }
                          </span>
                        </Col>
                        <Col span={3}>
                          <p>企业经营时间</p>
                          <span>{ preloanInfoList && preloanInfoList.coporationAge }</span>
                        </Col>
                        <Col span={3}>
                          <p>税前平均月收入</p>
                          <span>{ preloanInfoList && preloanInfoList.pretaxIncomeMonth }</span>
                        </Col>
                      </Row>
                      <Row>
                        <Col offset={3} span={3}>
                          <p>是否缴纳公积金或社保</p>
                          <span>{ preloanInfoList && (preloanInfoList.socialInsurance ? '是' : '否') }</span>
                        </Col>
                        <Col span={3}>
                          <p>是否在还房贷</p>
                          <span>{ preloanInfoList && (preloanInfoList.houseProperty ? '是' : '否') }</span>
                        </Col>
                        <Col span={3}>
                          <p>是否买过人寿保险</p>
                          <span>{ preloanInfoList && (preloanInfoList.lifeInsurance ? '是' : '否') }</span>
                        </Col>
                        <Col span={3}>
                          <p>是否拥有房产并愿意抵押</p>
                          <span>{ preloanInfoList && (preloanInfoList.houseMortgage ? '是' : '否') }</span>
                        </Col>
                        <Col span={3}>
                          <p>用户申请贷款类型</p>
                          <span>{ preloanInfoList && preloanInfoList.userLoanType && preloanInfoList.userLoanType.name }</span>
                        </Col>
                        <Col span={3}>
                          <p>用户申请贷款金额</p>
                          <span>{ preloanInfoList && preloanInfoList.userLoanAmount }</span>
                        </Col>
                        <Col span={3}>
                          <p>推荐贷款产品</p>
                          { preloanInfoList && preloanInfoList.recommendLoanProduct && preloanInfoList.recommendLoanProduct.map((val, index) => {
                            return <span style={{ marginLeft: '2px', color: 'white', backgroundColor: index === 0 ? '#f5787a' : '#777' }}>{val && val.name} </span>;
                          }) }
                        </Col>
                      </Row>
                    </div>
                  : null
                }
                {
                  loanBaseInfor && loanBaseInfor.envoyId ?
                    <div>
                      <Row>
                        <Col span={3}>
                          <h3>点融信使信息</h3>
                        </Col>
                        <Col span={3}>
                          <p>客户姓名</p>
                          <span>{ customerInfor && customerInfor.customerName }</span>
                        </Col>
                        <Col span={3}>
                          <p>身份证号</p>
                          <span>{ showOriginSSn ? originSsn : (envyInfoList && envyInfoList.idCard) }</span>
                          {
                            envyInfoList && envyInfoList.idCard &&
                            <a>
                              <span
                                className={showOriginSSn ? 'icon-showpsw' : 'icon-closepsw'}
                                onClick={this.showSsn}
                                style={{ marginLeft: '5px' }}
                              />
                            </a>
                          }
                        </Col>
                        <Col span={3}>
                          <p>手机号</p>
                          <span>{ showOriginPhone1 ? originPhoneNo : (customerInfor && customerInfor.phone) } </span>
                          {
                            customerInfor && customerInfor.phone &&
                            <a>
                              <span
                                className={showOriginPhone1 ? 'icon-showpsw' : 'icon-closepsw'}
                                onClick={this.showPhoneNo.bind(this, 1)}
                                style={{ marginLeft: '5px' }}
                              />
                            </a>
                          }
                        </Col>
                        <Col span={3}>
                          <p>常住地区</p>
                          <span>{ envyInfoList && envyInfoList.city }</span>
                        </Col>
                        <Col span={3}>
                          <p>工作性质</p>
                          <span>{ envyInfoList && envyInfoList.profession }</span>
                        </Col>
                        <Col span={3}>
                          <p>是否有房产</p>
                          <span>{ envyInfoList && (envyInfoList.hasHouse === 1 ? '是' : '否') }</span>
                        </Col>
                        <Col span={3}>
                          <p>是否有人寿保险</p>
                          <span>{ envyInfoList && (envyInfoList.hasInsurance === 1 ? '是' : '否') }</span>
                        </Col>
                      </Row>
                      <Row>
                        <Col offset={3} span={3}>
                          <p>是否缴纳公积金社保</p>
                          <span>{ envyInfoList && (envyInfoList.hasSocialSecurity === 1 ? '是' : '否') }</span>
                        </Col>
                        <Col span={3}>
                          <p>月收入</p>
                          <span>{ envyInfoList && envyInfoList.income }</span>
                        </Col>
                        <Col span={3}>
                          <p>用户申请贷款期限</p>
                          <span>{ envyInfoList && envyInfoList.cycle }{'月'}</span>
                        </Col>
                        <Col span={3}>
                          <p>用户申请贷款金额</p>
                          <span>{ envyInfoList && envyInfoList.appAmount }</span>
                        </Col>
                      </Row>
                    </div>
                    : null
                }
                {
                  customerInfor && customerInfor.actorId ? '' : <h4 style={{ marginBottom: '10px' }}>意向性客户(需先注册)</h4>
                }
                <Form>
                  <Row gutter={16}>
                    <Col span={3}>
                      <Badge count={1} style={{ backgroundColor: '#40BF89' }} />
                      <span className="badge-span-title">确定客户城市</span>
                    </Col>
                    <Col span={4}>
                      <FormItem label="城市" >
                        {getFieldDecorator('city', {
                          initialValue: customerInfor && customerInfor.city,
                        })(
                          <TrimInput />,
                        )}
                        <p>手机归属地:{customerInfor && customerInfor.phoneCity}</p>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={3}>
                      <Badge count={2} style={{ backgroundColor: '#40BF89' }} />
                      <span className="badge-span-title">处理结果</span>
                    </Col>
                    <Col span={20}>
                      <FormItem>
                        {getFieldDecorator('operationResult', {
                          initialValue: taskDetailsList && taskDetailsList.operationResult,
                          onChange: e => this.operationResultOnchange(e.target.value),
                        })(
                          <RadioGroup>
                            {
                              operationResults && operationResults.map((val) => {
                                return <RadioButton key={val.id} value={val.id}>{val.name}</RadioButton>;
                              })
                            }
                          </RadioGroup>,
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col offset={3} span={4}>{output}</Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={3}>
                      <Badge count={3} style={{ backgroundColor: '#40BF89' }} />
                      <span className="badge-span-title">客户意向确认</span>
                    </Col>
                    <Col span={4}>
                      <FormItem label="贷款类型" >
                        {getFieldDecorator('intentionLoanType', {
                          initialValue: (loanBaseInfor && loanBaseInfor.intentionLoanType) || '',
                          onChange: this.loanTypeChange,
                        })(
                          <Select>
                            <Option value="">请选择</Option>
                            {
                              loanTypeList && loanTypeList.map((val) => {
                                return <Option key={val && val.intentionLoanType} value={val && val.intentionLoanType}>{val && val.intentionLoanTypeName}</Option>;
                              })
                            }
                          </Select>,
                        )}
                      </FormItem>
                    </Col>
                    <Col span={4}>
                      <FormItem label="申请金额" >
                        {getFieldDecorator('intentionAmountStr', {
                          initialValue: loanBaseInfor && loanBaseInfor.intentionAmount,
                          rules: [{
                            validator: this.validationRules.bind(this, appComuntRule || ''),
                          }],
                        })(
                          <Input addonAfter="元" />,
                        )}
                      </FormItem>
                    </Col>
                    <Col span={4}>
                      <FormItem label="贷款期限" >
                        {getFieldDecorator('loanCycle', {
                          initialValue: (loanBaseInfor && loanBaseInfor.intentionLoanCycle) || '',
                        })(
                          <Select>
                            <Option value="">请选择</Option>
                            {
                              loanDateList && loanDateList.map((val) => {
                                return <Option key={val && val.code} value={val && val.code}>{val && val.name}</Option>;
                              })
                            }
                          </Select>,
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={3}>
                      <Badge count={4} style={{ backgroundColor: '#40BF89' }} />
                      <span className="badge-span-title">备注</span>
                    </Col>
                    <Col span={6}>
                      <FormItem label="" >
                        {getFieldDecorator('remark', {
                          initialValue: '',
                        })(
                          <TextArea />,
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={3}>
                      <Badge count={5} style={{ backgroundColor: '#40BF89' }} />
                      <span className="badge-span-title">是否结案: {taskDetailsList && taskDetailsList.isClosed === 1 ? '是' : '否'}</span>
                    </Col>
                    <Col span={4}>
                      <FormItem label="" >
                        {getFieldDecorator('isClosed', {
                          initialValue: '',
                        })(
                          <Select>
                            <Option value="">请选择</Option>
                            <Option value="1">是</Option>
                            <Option value="2">否</Option>
                          </Select>,
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col offset={3}>
                      <Button type="primary" onClick={this.handleSubmit} style={{ marginRight: '10px' }}>保存</Button>
                      <Button type="primary" ghost onClick={this.saveAndDeploy} style={{ marginRight: '10px' }}>保存并转给分公司</Button>
                      <a href={`/bcrm/#createLoan?newRegist=true&phone=${originPhoneNo}&email=${customerInfor && customerInfor.email}&ssn=${originSsn}`}>创建借款</a>
                    </Col>
                  </Row>
                </Form>
              </div>
              <div className="crm-section">
                <Row>
                  <Col span={3}>
                    <h3>客户信息</h3>
                  </Col>
                  <Col span={3}>
                    <p>借款人ID</p>
                    <span>{ customerInfor && customerInfor.actorId }</span>
                  </Col>
                  <Col span={3}>
                    <p>客户姓名</p>
                    <span>{ customerInfor && customerInfor.actorName }</span>
                  </Col>
                  <Col span={3}>
                    <p>用户名</p>
                    <span>{ customerInfor && customerInfor.userName }</span>
                  </Col>
                  <Col span={3}>
                    <p>手机号</p>
                    <span>{ showOriginPhone2 ? originPhoneNo : (customerInfor && customerInfor.cellPhone) }</span>
                    {
                      customerInfor && customerInfor.cellPhone &&
                      <a>
                        <span
                          className={showOriginPhone2 ? 'icon-showpsw' : 'icon-closepsw'}
                          onClick={this.showPhoneNo.bind(this, 2)}
                          style={{ marginLeft: '5px' }}
                        />
                      </a>
                    }
                  </Col>
                  <Col span={3}>
                    <p>手机所属城市</p>
                    <span>{ customerInfor && customerInfor.phoneCity }</span>
                  </Col>
                  <Col span={3}>
                    <p>城市</p>
                    <span>{ customerInfor && customerInfor.city }</span>
                  </Col>
                  <Col span={3}>
                    <p>客户来源</p>
                    <span>{ customerInfor && customerInfor.customerOrigin }</span>
                  </Col>
                </Row>
                <Row>
                  <Col offset={3} span={3}>
                    <p>渠道</p>
                    <span>{ customerInfor && customerInfor.marketChannel }</span>
                  </Col>
                  <Col span={3}>
                    <p>注册时间</p>
                    <span>{ customerInfor && customerInfor.borrowerStatusDate && moment(customerInfor.borrowerStatusDate).format('YYYY-MM-DD HH:mm:ss') }</span>
                  </Col>
                  <Col span={3}>
                    <p>在现单位工作年限</p>
                    <span>{ customerInfor && customerInfor.workingYearsLevel }</span>
                  </Col>
                  <Col span={3}>
                    <p>负责人组别</p>
                    <span>{ taskDetailsList && taskDetailsList.employeeGroupName }</span>
                  </Col>
                  <Col span={3}>
                    <p>负责人</p>
                    <span>{ taskDetailsList && taskDetailsList.employeeName }</span>
                  </Col>
                  <Col span={3}>
                    <p>用户所属销售</p>
                    <span>{ customerInfor && customerInfor.offemployeeName }</span>
                  </Col>
                </Row>
                <Row>
                  <Col span={3}>
                    <h3>贷款信息</h3>
                  </Col>
                  <Col span={3}>
                    <p>贷款申请状态</p>
                    <span>{ loanBaseInfor && loanBaseInfor.loanAppStatus }</span>
                  </Col>
                  <Col span={3}>
                    <p>贷款ID</p>
                    <span>{ loanBaseInfor && loanBaseInfor.loanId }</span>
                  </Col>
                  <Col span={3}>
                    <p>贷款类型</p>
                    <span>{ loanBaseInfor && loanBaseInfor.loanType }</span>
                  </Col>
                  <Col span={3}>
                    <p>贷款创建时间</p>
                    <span>{loanBaseInfor && loanBaseInfor.createdDate && moment(loanBaseInfor.createdDate).format('YYYY-MM-DD HH:mm:ss') }</span>
                  </Col>
                </Row>
              </div>
              <Modal
                visible={isModalShow}
                onCancel={this.onCancel}
                title="转给分公司"
                footer={null}
              >
                <DetailsDeploy taskIds={taskIds} groupList={groupList || []} />
              </Modal>
            </div>
          </TabPane>
          <TabPane tab="操作记录" key="record">
            <OperationRecord taskId={taskId} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

NewTaskDetails.propTypes = {
};

export default connect(
  state => ({
    taskDetailsList: state.taskDetails.taskDetailsList,
    loanTypeList: state.taskDetails.loanTypeList,
    loanDateList: state.taskDetails.loanDateList,
    resultOptionList: state.taskDetails.resultOptionList,
    groupList: state.taskDetails.groupList,
    preloanInfoList: state.taskDetails.preloanInfoList,
    envyInfoList: state.taskDetails.envyInfoList,
    everyModalShow: state.taskDetails.everyModalShow,
    originPhoneNo: state.taskDetails.originPhoneNo,
    originSsn: state.taskDetails.originSsn,
  }),
  dispatch => ({
    getPreloanInfo: (params) => {
      dispatch({ type: 'taskDetails/getPreloanInfo', payload: params });
    },
    getEnvyInfo: (params) => {
      dispatch({ type: 'taskDetails/getEnvyInfo', payload: params });
    },
    getLoanType: () => {
      dispatch({ type: 'taskDetails/getLoanType' });
    },
    getLoanDate: (params) => {
      dispatch({ type: 'taskDetails/getLoanDate', payload: params });
    },
    getResultOption: (params) => {
      dispatch({ type: 'taskDetails/getResultOption', payload: params });
    },
    saveIntention: (formData, pageData) => {
      const resultData = formData;
      for (const x in resultData) {
        if (['feedBackTime'].indexOf(x) > -1 && resultData[x]) {
          if (resultData[x]) {
            resultData[x] = resultData[x].format('YYYY-MM-DD HH:mm');
          } else {
            delete resultData[x];
          }
        }
      }
      resultData.customerId = pageData.customerInfor.customerId === 'undefined' ? null : pageData.customerInfor.customerId;
      resultData.taskId = pageData.taskId === 'undefined' ? null : pageData.taskId;
      resultData.actorId = pageData.customerInfor.actorId === 'undefined' ? null : pageData.customerInfor.actorId;
      resultData.taskStatus = pageData.status === 'undefined' ? null : pageData.status;
      dispatch({ type: 'taskDetails/saveIntention', payload: resultData });
    },
    getGroupList: () => {
      dispatch({ type: 'taskDetails/getGroupList' });
    },
    getPersonalList: (params) => {
      dispatch({ type: 'taskDetails/getPersonalList', payload: params });
    },
    deploy: (params) => {
      dispatch({ type: 'taskDetails/deploy', payload: params });
    },
    closeEveryModal: () => {
      dispatch({ type: 'taskDetails/closeEveryModal' });
    },
  }),
)(Form.create()(NewTaskDetails));

