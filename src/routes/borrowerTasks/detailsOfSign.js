import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, DatePicker, Radio, Row, Col, Table, Tabs, Modal, Steps, Badge, message, Spin } from 'antd';
import moment from 'moment';
import LoanInfo from '../../components/borrow';
import OperationRecord from './operationRecord';
import DetailsDeploy from './detailsDeploy';
import TrimInput from '../../components/input-trim';
import './borrowerTasks.less';


const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TextArea = Input.TextArea;
const TabPane = Tabs.TabPane;
const Step = Steps.Step;

const columns = [
  {
    title: '批注时间',
    dataIndex: 'date',
    key: 'date',
    width: 150,
  }, {
    title: '描述',
    dataIndex: 'descriptions',
    key: 'descriptions',
  },
];

class SignTaskDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      isDeploy: false,
      isContract: false,
      fileGroup: null,
      isApproval: false,
      isFirstLoad: true,
      showOriginPhone: false,
      showOriginSSn: false,
    };
  }

  componentDidMount() {
    const { getReviewList, taskDetailsList: { customerInfor, loanBaseInfor, operationResult } } = this.props;
    const params = {
      actorId: customerInfor.actorId === 'undefined' ? null : customerInfor.actorId,
      loanAppId: loanBaseInfor.loanAppId === 'undefined' ? null : loanBaseInfor.loanAppId,
      routingSystem: loanBaseInfor.routingSystem === 'undefined' ? null : loanBaseInfor.routingSystem,
      topic: 'CONDITIONS_REVIEW',
      taskStatus: 'sign',
    };
    getReviewList(params);
    if (operationResult && operationResult !== 'DERATE') {
      this.operationResultOnchange(operationResult, true);
    }
  }

  getFormvalue = () => {
    const { getFieldsValue } = this.props.form;
    return getFieldsValue();
  }

  validationRules = (rule, data, value, callback) => {
    let result = null;
    if (value) {
      if (!isNaN(+value)) {
        if (+value % 100 === 0) {
          result = 'success';
        } else {
          result = '请输入为100倍数的整数！';
        }
      } else {
        result = '请输入正确的数字！';
      }
    } else {
      result = '必填项不能为空！';
    }
    callback(result === 'success' ? undefined : result);
  }

  operationResultOnchange = (val, isFirstLoad) => {
    const { getResultOption } = this.props;
    let result;
    if (!isFirstLoad) {
      this.setState({ isFirstLoad: false });
    }
    if (val === 'CUSTOMER_APPROVAL') {
      this.setState({ isApproval: true });
    } else {
      this.setState({ isApproval: false });
    }
    switch (val) {
      case 'NOTIFIED_TO_REFUSE':
        result = [
          {
            name: 'remark',
            required: false,
            type: 'TextArea',
            label: '补充说明',
          }];
        break;
      case 'NOT_REACHABLE':
        result = [
          {
            name: 'remark',
            required: false,
            type: 'TextArea',
            label: '补充说明',
          }];
        break;
      case 'TO_BE_FOLLOWED_UP':
        result = [
          {
            name: 'feedBackTime',
            required: false,
            type: 'DatePicker',
            label: '预约回访时间',
          }];
        break;
      case 'CUSTOMER_CANCEL':
        result = [
          {
            name: 'cancelRemark',
            required: true,
            type: 'TextArea',
            label: '补充说明',
            message: '必填项不能为空！',
          }];
        break;
      case 'RETROVERSION':
        result = [
          {
            name: 'remark',
            required: false,
            type: 'TextArea',
            label: '备注说明',
          }];
        break;
      case 'CUSTOMER_REJECT':
        result = [
          {
            name: 'rejectCode',
            required: true,
            type: 'Select',
            label: '拒绝原因',
          }, {
            name: 'rejectRemark',
            required: true,
            type: 'TextArea',
            label: '补充说明',
            message: '必填项不能为空！',
          }];
        getResultOption(val);
        break;
      case 'DERATE':
        result = [
          {
            name: 'derateAmount',
            required: true,
            type: 'Input',
            label: '降额金额',
            message: '请输入金额为100倍数的金额！',
          }, {
            name: 'derateReason',
            required: true,
            type: 'SelectOption',
            label: '降额原因',
            options: ['客户要求降额', '综合考虑客户资质降额处理', '其他'],
            message: '必填项不能为空！',
          }, {
            name: 'derateRemark',
            required: true,
            type: 'TextArea',
            maxLength: 200,
            label: '备注',
            message: '请输入200字以内的备注！',
          }];
        getResultOption(val);
        break;
      default: result = [];
    }
    this.setState({ result, fileGroup: val });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { saveIntention, taskDetailsList, replyInfo, form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        if (values.operationResult === 'DERATE') {
          const derateAmount = Number(values.derateAmount);
          const feeBaseAmount = Number(replyInfo.feeBaseAmount);
          if (feeBaseAmount < 20000) {
            message.error(`当前批复金额为:${replyInfo.feeBaseAmount}, 小于20000元, 不能发起降额申请！`);
          } else if ((derateAmount >= 20000) && (derateAmount <= feeBaseAmount)) {
            this.setState({ isDeploy: false, isContract: false });
            saveIntention(values, taskDetailsList, replyInfo);
          } else {
            message.error(`您的降额申请金额为${values.derateAmount}, 必须在20000至${replyInfo.feeBaseAmount}之间, 请修改！`);
          }
        } else {
          this.setState({ isDeploy: false, isContract: false });
          saveIntention(values, taskDetailsList, replyInfo);
        }
      }
    });
  }

  saveAndDeploy = () => {
    const { closeEveryModal, deploySaveIntention, getGroupList, taskDetailsList, replyInfo,
      form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        if (values.operationResult === 'DERATE') {
          const derateAmount = Number(values.derateAmount);
          const feeBaseAmount = Number(replyInfo.feeBaseAmount);
          if (feeBaseAmount < 20000) {
            message.error(`当前批复金额为:${replyInfo.feeBaseAmount}, 小于20000元, 不能发起降额申请！`);
          } else if ((derateAmount >= 20000) && (derateAmount <= feeBaseAmount)) {
            this.setState({ isDeploy: true, isContract: false });
            closeEveryModal();
            deploySaveIntention(values, taskDetailsList, replyInfo);
            getGroupList();
          } else {
            message.error(`您的降额申请金额为${values.derateAmount}, 必须在20000至${replyInfo.feeBaseAmount}之间, 请修改！`);
          }
        } else {
          this.setState({ isDeploy: true, isContract: false });
          closeEveryModal();
          deploySaveIntention(values, taskDetailsList, replyInfo);
          getGroupList();
        }
      }
    });
  }

  saveAndContract = () => {
    const { closeEveryModal, deploySaveIntention, getContractGroupList, taskDetailsList, replyInfo,
      form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        if (values.operationResult === 'DERATE') {
          const derateAmount = Number(values.derateAmount);
          const feeBaseAmount = Number(replyInfo.feeBaseAmount);
          if (feeBaseAmount < 20000) {
            message.error(`当前批复金额为:${replyInfo.feeBaseAmount}, 小于20000元, 不能发起降额申请！`);
          } else if ((derateAmount >= 20000) && (derateAmount <= feeBaseAmount)) {
            this.setState({ isDeploy: false, isContract: true });
            closeEveryModal();
            deploySaveIntention(values, taskDetailsList, replyInfo);
            getContractGroupList();
          } else {
            message.error(`您的降额申请金额为${values.derateAmount}, 必须在20000至${replyInfo.feeBaseAmount}之间, 请修改！`);
          }
        } else {
          this.setState({ isDeploy: false, isContract: true });
          closeEveryModal();
          deploySaveIntention(values, taskDetailsList, replyInfo);
          getContractGroupList();
        }
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

  showPhoneNo = () => {
    this.props.getDetailPhone();
    this.setState(prevState => ({
      showOriginPhone: !prevState.showOriginPhone,
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
      isDeploy,
      isContract,
      isApproval,
      isFirstLoad,
      showOriginPhone,
      showOriginSSn,
    } = this.state;
    const {
      resultOptionList,
      reviewList,
      groupList,
      contractGroupList,
      everyModalShow,
      taskDetailsList,
      taskDetailsList: {
        taskId,
        operationResults,
        customerInfor,
        loanBaseInfor,
        readOnly,
        ossDownloadMethod,
        status,
      },
      form: {
        getFieldDecorator,
      },
      getTaskDetailSucceed,
      reload,
      replyInfo = {},
      originPhoneNo,
      originSsn,
      dealFormLoading,
    } = this.props;
    let output;
    const {
      actorId,
      actorName,
      phone,
    } = customerInfor;
    const {
      loanAppId,
      loanId,
      loanAppSource,
      loanAppStatusCode,
      loanTypeCode,
      routingSystem,
      productCode,
      newProductCode,
    } = loanBaseInfor;
    const { parameter, videoDocId, hasSignVideo, workflowTaskId } = replyInfo;
    let configCode;
    let taskStatus;
    if (status === 'AUDITFOLLOWUP') {
      taskStatus = 'hold';
    } else if (status === 'SIGN') {
      taskStatus = 'sign';
    }
    if (loanAppSource === 'CRM' || loanAppSource === 'LITE') {
      configCode = 'crm_created';
    } else {
      configCode = 'crm';
    }
    const loanInfoData = {
      aid: actorId,
      code: configCode,
      configCode: loanAppSource,
      configProductCode: productCode,
      cusName: actorName,
      detailType: status,
      isNewLoanType: 'NO',
      isReadonly: readOnly,
      loanAppStatusCode,
      loanId: loanAppId,
      loanStatus: loanAppStatusCode,
      loanType: loanTypeCode,
      ossDownloadMethod,
      routingSystem,
      taskStatus,
      userPhone: phone,
      realLoanId: loanId,
      isPreAuthorize: false,
      parameter,
      videoDocId,
      hasSignVideo,
      workflowTaskId,
      loading: replyInfo.loading,
      newProductCode,
    };
    const isDeployShow = isDeploy && everyModalShow;
    const isContractShow = isContract && everyModalShow;
    const taskIds = [`${taskDetailsList.taskId}-${customerInfor.customerId}-SIGN`];
    const isButtonShow = isFirstLoad ? isApproval || (loanBaseInfor && loanBaseInfor.productCode === 'DOUBLE_FUND_ONLINE') : isApproval;
    const isRiskResultShow = loanBaseInfor && loanBaseInfor.loanType === 'SpeedLoan';
    const isCustomerReject = isFirstLoad && taskDetailsList && taskDetailsList.operationResult === 'CUSTOMER_REJECT';
    if (!isCustomerReject && result.length > 0) {
      output = result.map((val, idx) => {
        if (val.type === 'Select') {
          return (
            <FormItem label={val.label} key={idx}>
              {getFieldDecorator(val.name, {
                initialValue: '',
                rules: [{ required: val.required, message: '必填项不能为空' }],
              })(
                <Select>
                  <Option value="">请选择</Option>
                  {
                    resultOptionList && resultOptionList.map((item, index) => {
                      return <Option value={item && item.id} key={index}>{item.name}</Option>;
                    })
                  }
                </Select>,
              )}
            </FormItem>);
        } else if (val.type === 'Input') {
          return (
            <FormItem label={val.label}>
              {getFieldDecorator(val.name, {
                rules: [{
                  required: val.required,
                  validator: this.validationRules.bind(this, val.name),
                }],
              })(
                <TrimInput />,
              )}
            </FormItem>);
        } else if (val.type === 'SelectOption') {
          return (
            <FormItem label={val.label}>
              {getFieldDecorator(val.name, {
                initialValue: taskDetailsList && taskDetailsList.intentionRemark,
                rules: [{
                  required: val.required,
                  message: val.message,
                }],
              })(
                <Select>
                  <Option value="">请选择</Option>
                  {
                    val.options && val.options.map((item) => {
                      return <Option value={item} key={item}>{item}</Option>;
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
                rules: [{
                  required: val.required,
                  max: val.maxLength || '',
                  message: val.message,
                }],
              })(
                <TextArea />,
              )}
            </FormItem>);
        } else if (val.type === 'DatePicker') {
          return (
            <FormItem label={val.label}>
              {getFieldDecorator(val.name, {
                initialValue: taskDetailsList && taskDetailsList.feedBackTime && moment(taskDetailsList.feedBackTime),
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
                <div>
                  <div className="step">
                    <Steps current={3}>
                      <Step title="新注册" />
                      <Step title="引导进件" />
                      <Step title="审核跟进" />
                      <Step title="签约" />
                    </Steps>
                  </div>
                  <Row>
                    <Col span={3}>
                      <h3>贷款信息</h3>
                    </Col>
                    <Col span={3}>
                      <p>贷款申请状态</p>
                      <span>{ loanBaseInfor && loanBaseInfor.loanAppStatus }</span>
                    </Col>
                    <Col span={3}>
                      <p>审批系统</p>
                      <span>{ loanBaseInfor && loanBaseInfor.routingSystem }</span>
                    </Col>
                    <Col span={3}>
                      <p>贷款申请ID</p>
                      <span>{ loanBaseInfor && loanBaseInfor.loanAppId }</span>
                    </Col>
                    <Col span={3}>
                      <p>贷款类型</p>
                      <span>{ loanBaseInfor && loanBaseInfor.loanType }</span>
                    </Col>
                    <Col span={3}>
                      <p>贷款创建时间</p>
                      <span>{ loanBaseInfor && loanBaseInfor.createdDate && moment(loanBaseInfor.createdDate).format('YYYY-MM-DD HH:mm:ss') }</span>
                    </Col>
                    <Col span={3}>
                      <p>贷款ID</p>
                      <span>{ loanBaseInfor && loanBaseInfor.loanId }</span>
                    </Col>
                    <Col span={3}>
                      <p>合同金额</p>
                      <span>{ replyInfo && replyInfo.appAmount }</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={3} offset={3}>
                      <p>批复金额</p>
                      <span>{ replyInfo && replyInfo.feeBaseAmount }</span>
                    </Col>
                    <Col span={3}>
                      <p>审批费用</p>
                      <span>{ replyInfo && replyInfo.origFee }</span>
                    </Col>
                    <Col span={3}>
                      <p>出资人服务费</p>
                      <span>{ replyInfo && replyInfo.serviceFee }</span>
                    </Col>
                    <Col span={3}>
                      <p>第三方服务费</p>
                      <span>{ replyInfo && replyInfo.thirdPartyServiceFee }</span>
                    </Col>
                    <Col span={3}>
                      <p>管理费(期缴)</p>
                      <span>{ replyInfo && replyInfo.managementFee }</span>
                    </Col>
                    <Col span={3}>
                      <p>管理费(趸缴)</p>
                      <span>{ replyInfo && replyInfo.upfrontMgmtFee }</span>
                    </Col>
                    <Col span={3}>
                      <p>合同</p>
                      <span>{ replyInfo && replyInfo.contract }</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col offset={3} span={3}>
                      <p>年利率</p>
                      <span>{ replyInfo && replyInfo.intRate }</span>
                    </Col>
                    <Col span={3}>
                      <p>放款日期</p>
                      <span>{ loanBaseInfor && loanBaseInfor.loanAppStatusCode === 'ISSUED' ? (loanBaseInfor && loanBaseInfor.statusDate && moment(loanBaseInfor.statusDate).format('YYYY-MM-DD HH:mm:ss')) : '' }</span>
                    </Col>
                    <Col span={3}>
                      <p>借款人评级</p>
                      <span>{ replyInfo && replyInfo.userGrade }</span>
                    </Col>
                    <Col span={3}>
                      <p>贷款信用风险等级</p>
                      <span>{ replyInfo && replyInfo.loanGrade }</span>
                    </Col>
                    <Col span={3}>
                      <p>贷款来源</p>
                      <span>{ loanBaseInfor && loanBaseInfor.loanAppSource }</span>
                    </Col>
                    <Col span={3}>
                      <p>租户号</p>
                      <span>{ loanBaseInfor && loanBaseInfor.tenant }</span>
                    </Col>
                    <Col span={3}>
                      <p>贷款提交时间</p>
                      <span>{ loanBaseInfor && loanBaseInfor.submitDate && moment(loanBaseInfor.submitDate).format('YYYY-MM-DD HH:mm:ss') }</span>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Row>
                    <Col span={3}>
                      <Badge count={1} style={{ backgroundColor: '#40BF89' }} />
                      <span className="badge-span-title">风控审核结果</span>
                    </Col>
                    <Col span={20}>
                      <Table
                        columns={columns}
                        dataSource={isRiskResultShow ? [] : reviewList}
                        size="small"
                      />
                    </Col>
                  </Row>
                </div>
                <div>
                  {
                    loanBaseInfor && loanBaseInfor.loanAppStatusCode !== 'WITHDRAWN' ?
                      <div>
                        <Spin spinning={dealFormLoading}>
                          <Form>
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
                              <Col offset={3} span={6}>
                                {output}
                              </Col>
                            </Row>
                            <Row>
                              <Col span={3}>
                                <Badge count={3} style={{ backgroundColor: '#40BF89' }} />
                                <span className="badge-span-title">是否结案: {taskDetailsList && taskDetailsList.isClosed === 1 ? '是' : '否'}</span>
                              </Col>
                              {
                                loanBaseInfor && loanBaseInfor.productCode === 'DOUBLE_FUND_ONLINE' ? null :
                                <Col span={3}>
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
                              }
                            </Row>
                            {
                              isButtonShow ? null :
                              <Row>
                                <Col offset={3}>
                                  <Button type="primary" onClick={this.handleSubmit} style={{ marginRight: '10px' }}>保存</Button>
                                  <Button type="primary" ghost onClick={this.saveAndDeploy}>保存并转给分公司</Button>
                                  {
                                    loanBaseInfor && loanBaseInfor.loanType === 'SpeedLoan' ? null :
                                    <Button onClick={this.saveAndContract}>分配签约人</Button>
                                  }
                                </Col>
                              </Row>
                            }
                          </Form>
                        </Spin>
                      </div>
                    :
                      null
                  }
                </div>
              </div>
              <div>
                {
                  getTaskDetailSucceed &&
                    <LoanInfo
                      loanInfoData={loanInfoData}
                      key={reload}
                      fileGroup={this.state.fileGroup || taskDetailsList.operationResult}
                      taskDetail={taskDetailsList}
                      getFormvalue={this.getFormvalue}
                    />
                }
              </div>
              <div>
                <div>
                  <div className="crm-section" style={{ marginTop: '35px' }}>
                    <Row>
                      <Col span={3}>
                        <h3>客户信息</h3>
                      </Col>
                      <Col span={3}>
                        <p>借款人ID</p>
                        <span>{customerInfor && customerInfor.actorId}</span>
                      </Col>
                      <Col span={3}>
                        <p>客户姓名</p>
                        <span>{customerInfor && customerInfor.actorName}</span>
                      </Col>
                      <Col span={3}>
                        <p>用户名</p>
                        <span>{customerInfor && customerInfor.userName}</span>
                      </Col>
                      <Col span={3}>
                        <p>手机号</p>
                        <span>{ showOriginPhone ? originPhoneNo : (customerInfor && customerInfor.cellPhone) } </span>
                        {
                          customerInfor && customerInfor.cellPhone &&
                          <a>
                            <span
                              className={showOriginPhone ? 'icon-showpsw' : 'icon-closepsw'}
                              onClick={this.showPhoneNo}
                              style={{ marginLeft: '5px' }}
                            />
                          </a>
                        }
                      </Col>
                      <Col span={3}>
                        <p>手机所属城市</p>
                        <span>{customerInfor && customerInfor.phoneCity}</span>
                      </Col>
                      <Col span={3}>
                        <p>城市</p>
                        <span>{customerInfor && customerInfor.city}</span>
                      </Col>
                      <Col span={3}>
                        <p>客户来源</p>
                        <span>{customerInfor && customerInfor.customerOrigin}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={3} offset={3}>
                        <p>渠道</p>
                        <span>{customerInfor && customerInfor.marketChannel}</span>
                      </Col>
                      <Col span={3}>
                        <p>注册时间</p>
                        <span>{ customerInfor && customerInfor.borrowerStatusDate && moment(customerInfor.borrowerStatusDate).format('YYYY-MM-DD HH:mm:ss')}</span>
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
                        <p>最后分配时间</p>
                        <span>{ taskDetailsList && taskDetailsList.allocateTime && moment(taskDetailsList.allocateTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                      </Col>
                      <Col span={3}>
                        <p>用户所属销售</p>
                        <span>{ customerInfor && customerInfor.offemployeeName }</span>
                      </Col>
                      <Col span={3}>
                        <p>借款所属销售</p>
                        <span>{loanBaseInfor && loanBaseInfor.loanEmployeeName}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={3} offset={3}>
                        <p>借款所属销售组别</p>
                        <span>{loanBaseInfor && loanBaseInfor.loanEmployeeGroupName}</span>
                      </Col>
                      <Col span={6}>
                        <p>证件号</p>
                        <span>{ showOriginSSn ? originSsn : (customerInfor && customerInfor.ssn) } </span>
                        {
                          customerInfor && customerInfor.ssn &&
                          <a>
                            <span
                              className={showOriginSSn ? 'icon-showpsw' : 'icon-closepsw'}
                              onClick={this.showSsn}
                              style={{ marginLeft: '5px' }}
                            />
                          </a>
                        }
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
              <Modal
                visible={isDeployShow}
                onCancel={this.onCancel}
                title="转给分公司"
                footer={null}
              >
                <DetailsDeploy taskIds={taskIds} groupList={groupList} />
              </Modal>
              <Modal
                visible={isContractShow}
                onCancel={this.onCancel}
                title="分配签约人"
                footer={null}
              >
                <DetailsDeploy taskIds={taskIds} groupList={contractGroupList} isAssign />
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

SignTaskDetails.propTypes = {
};

export default connect(
  state => ({
    taskDetailsList: state.taskDetails.taskDetailsList || {},
    loanDateList: state.taskDetails.loanDateList,
    resultOptionList: state.taskDetails.resultOptionList,
    reviewList: state.taskDetails.reviewList,
    groupList: state.taskDetails.groupList,
    contractGroupList: state.taskDetails.contractGroupList,
    getTaskDetailSucceed: state.taskDetails.getTaskDetailSucceed,
    reload: state.taskDetails.reload,
    everyModalShow: state.taskDetails.everyModalShow,
    replyInfo: state.taskDetails.replyInfo,
    originPhoneNo: state.taskDetails.originPhoneNo,
    originSsn: state.taskDetails.originSsn,
    dealFormLoading: state.taskDetails.dealFormLoading,
  }),
  dispatch => ({
    getReviewList: (params) => {
      dispatch({ type: 'taskDetails/getReviewList', payload: params });
    },
    getResultOption: (params) => {
      dispatch({ type: 'taskDetails/getResultOption', payload: params });
    },
    saveIntention: (formData, pageData, replyInfo) => {
      const resultData = formData;
      for (const x in resultData) {
        if (['feedBackTime'].indexOf(x) > -1 && resultData[x]) {
          if (resultData[x]) {
            resultData[x] = resultData[x].format('YYYY-MM-DD HH:mm');
          } else {
            delete resultData[x];
          }
        }
        if (['rejectRemark', 'cancelRemark', 'derateRemark'].indexOf(x) > -1) {
          resultData.remark = resultData[x];
          delete resultData[x];
        }
      }
      if (resultData.operationResult === 'DERATE') {
        resultData.reviewAmount = replyInfo.feeBaseAmount;
      }
      resultData.customerId = pageData.customerInfor.customerId === 'undefined' ? null : pageData.customerInfor.customerId;
      resultData.taskId = pageData.taskId === 'undefined' ? null : pageData.taskId;
      resultData.actorId = pageData.customerInfor.actorId === 'undefined' ? null : pageData.customerInfor.actorId;
      resultData.taskStatus = pageData.status === 'undefined' ? null : pageData.status;
      resultData.loanId = pageData.loanBaseInfor.loanAppId === 'undefined' ? null : pageData.loanBaseInfor.loanAppId;
      resultData.routingSystem = pageData.loanBaseInfor.routingSystem === 'undefined' ? null : pageData.loanBaseInfor.routingSystem;
      dispatch({ type: 'taskDetails/saveIntention', payload: resultData });
    },
    deploySaveIntention: (formData, pageData, replyInfo) => {
      const resultData = formData;
      for (const x in resultData) {
        if (['feedBackTime'].indexOf(x) > -1 && resultData[x]) {
          if (resultData[x]) {
            resultData[x] = resultData[x].format('YYYY-MM-DD HH:mm');
          } else {
            delete resultData[x];
          }
        }
        if (['rejectRemark', 'cancelRemark'].indexOf(x) > -1) {
          resultData.remark = resultData[x];
          delete resultData[x];
        }
      }
      if (resultData.operationResult === 'DERATE') {
        resultData.reviewAmount = replyInfo.feeBaseAmount;
      }
      resultData.customerId = pageData.customerInfor.customerId === 'undefined' ? null : pageData.customerInfor.customerId;
      resultData.taskId = pageData.taskId === 'undefined' ? null : pageData.taskId;
      resultData.actorId = pageData.customerInfor.actorId === 'undefined' ? null : pageData.customerInfor.actorId;
      resultData.taskStatus = pageData.status === 'undefined' ? null : pageData.status;
      resultData.loanId = pageData.loanBaseInfor.loanAppId === 'undefined' ? null : pageData.loanBaseInfor.loanAppId;
      resultData.routingSystem = pageData.loanBaseInfor.routingSystem === 'undefined' ? null : pageData.loanBaseInfor.routingSystem;
      dispatch({ type: 'taskDetails/deploySaveIntention', payload: resultData });
    },
    getGroupList: () => {
      dispatch({ type: 'taskDetails/getGroupList' });
    },
    getContractGroupList: () => {
      dispatch({ type: 'taskDetails/getContractGroupList' });
    },
    closeEveryModal: () => {
      dispatch({ type: 'taskDetails/closeEveryModal' });
    },
  }),
)(Form.create()(SignTaskDetails));

