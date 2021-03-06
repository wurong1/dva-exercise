import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, DatePicker, Radio, Row, Col, Table, Tabs, Modal, Steps, Badge } from 'antd';
import moment from 'moment';
import LoanInfo from '../../components/borrow';
import OperationRecord from './operationRecord';
import DetailsDeploy from './detailsDeploy';
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

class HoldTaskDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      isDeploy: false,
      operationResultChange: false,
      fileGroup: null,
      showOriginPhone: false,
      showOriginSSn: false,
    };
  }

  componentDidMount() {
    const { getReviewList, getSchedule, taskDetailsList: { customerInfor, loanBaseInfor, operationResult } } = this.props;
    const params = {
      actorId: customerInfor.actorId === 'undefined' ? null : customerInfor.actorId,
      loanAppId: loanBaseInfor.loanAppId === 'undefined' ? null : loanBaseInfor.loanAppId,
      routingSystem: loanBaseInfor.routingSystem === 'undefined' ? null : loanBaseInfor.routingSystem,
      topic: 'DOCUMENTS_REVIEW',
      taskStatus: 'hold',
    };
    const processStatus = loanBaseInfor.processStatus || '';
    const loanAppId = loanBaseInfor.loanAppId || '';
    getSchedule(loanAppId);
    getReviewList(params);
    if (operationResult && processStatus !== '复议中') {
      this.operationResultOnchange(operationResult, true);
    }
  }

  operationResultOnchange = (val, isFirstLoad) => {
    let result;
    if (!isFirstLoad) {
      this.setState({ operationResultChange: true });
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
      case 'REVIEW_APPLICATION':
        result = [
          {
            name: 'reviewRemark',
            required: true,
            type: 'TextArea',
            label: '复议原因',
            maxLength: 200,
            message: '请输入200字以内的复议原因！',
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
      case 'APPOINTMENT_CONTRACT':
        result = [
          {
            name: 'feedBackTime',
            required: false,
            type: 'DatePicker',
            label: '预约签约时间',
          }];
        break;
      default: result = [];
    }
    this.setState({ result, fileGroup: val });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { saveIntention, taskDetailsList, form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        this.setState({ isDeploy: false });
        saveIntention(values, taskDetailsList);
      }
    });
  }

  getFormvalue = () => {
    const { getFieldsValue } = this.props.form;
    return getFieldsValue();
  }

  saveAndDeploy = () => {
    const { closeEveryModal, deploySaveIntention, getGroupList, taskDetailsList,
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        this.setState({ isDeploy: true });
        closeEveryModal();
        deploySaveIntention(values, taskDetailsList);
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
    const { result, operationResultChange, isDeploy, showOriginPhone, showOriginSSn } = this.state;
    const {
      reviewList,
      groupList,
      everyModalShow,
      taskDetailsList,
      scheduleList,
      taskDetailsList: {
        taskId,
        operationResults,
        customerInfor = {},
        loanBaseInfor = {},
        readOnly,
        ossDownloadMethod,
        status,
      },
      form: {
        getFieldDecorator,
      },
      getTaskDetailSucceed,
      reload,
      originPhoneNo,
      originSsn,
    } = this.props;
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
    let configCode;
    let taskStatus;
    const isModalShow = isDeploy && everyModalShow;
    const taskIds = [`${taskDetailsList.taskId}-${customerInfor.customerId}-AUDITFOLLOWUP`];
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
    let output;
    const isRiskResultShow = loanBaseInfor && loanBaseInfor.loanType === 'SpeedLoan';
    const isButtonShow = !operationResultChange && taskDetailsList.operationResult === 'FILL_SUBMIT';
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
      newProductCode,
    };
    if (result.length > 0) {
      output = result.map((val, idx) => {
        if (val.type === 'TextArea') {
          return (
            <FormItem label={val.label} key={idx}>
              {getFieldDecorator(val.name, {
                initialValue: taskDetailsList && taskDetailsList.intentionRemark,
                rules: [{
                  required: val.required,
                  max: val.maxLength || '',
                  message: val.message || '',
                }],
              })(
                <TextArea />,
              )}
            </FormItem>);
        } else if (val.type === 'DatePicker') {
          return (
            <FormItem label={val.label} key={idx}>
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
                    <Steps current={2}>
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
                      <p>审批进度</p>
                      <span>{ (loanBaseInfor && loanBaseInfor.processStatus) || (scheduleList && scheduleList.activityName) }</span>
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
                  </Row>
                  <Row>
                    <Col span={3} offset={3}>
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
                        size="small"
                        columns={columns}
                        dataSource={isRiskResultShow ? [] : reviewList || []}
                      />
                    </Col>
                  </Row>
                </div>
                <div>
                  {
                    loanBaseInfor && loanBaseInfor.loanAppStatusCode === 'WITHDRAWN' ? null :
                    <Form onSubmit={this.handleSubmit}>
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
                              <RadioGroup onChange={this.operationResultOnchange}>
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
                      </Row>
                      {
                        isButtonShow ? null :
                        <Row>
                          <Col offset={3}>
                            <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>保存</Button>
                            <Button type="primary" ghost onClick={this.saveAndDeploy}>保存并转给分公司</Button>
                          </Col>
                        </Row>
                      }
                    </Form>
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
                  <div className="crm-section">
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
                        <p>意向用户来源</p>
                        <span>{ customerInfor && customerInfor.intentionSourceType }</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={3} offset={3}>
                        <p>首次推荐贷款产品</p>
                        <span>{ customerInfor && customerInfor.firstRecommendPreLoanProduct }</span>
                      </Col>
                      <Col span={3}>
                        <p>线下信息渠道</p>
                        <span>{ customerInfor && customerInfor.offlineMessageChannel }</span>
                      </Col>
                      <Col span={3}>
                        <p>借款所属销售</p>
                        <span>{loanBaseInfor && loanBaseInfor.loanEmployeeName}</span>
                      </Col>
                      <Col span={3}>
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
                visible={isModalShow}
                onCancel={this.onCancel}
                title="转给分公司"
                footer={null}
              >
                <DetailsDeploy taskIds={taskIds} groupList={groupList} />
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

HoldTaskDetails.propTypes = {
};

export default connect(
  state => ({
    taskDetailsList: state.taskDetails.taskDetailsList,
    loanDateList: state.taskDetails.loanDateList,
    reviewList: state.taskDetails.reviewList,
    groupList: state.taskDetails.groupList,
    getTaskDetailSucceed: state.taskDetails.getTaskDetailSucceed,
    reload: state.taskDetails.reload,
    scheduleList: state.taskDetails.scheduleList,
    everyModalShow: state.taskDetails.everyModalShow,
    originPhoneNo: state.taskDetails.originPhoneNo,
    originSsn: state.taskDetails.originSsn,
  }),
  dispatch => ({
    getReviewList: (params) => {
      dispatch({ type: 'taskDetails/getReviewList', payload: params });
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
        if (['reviewRemark', 'cancelRemark'].indexOf(x) > -1) {
          resultData.remark = resultData[x];
          delete resultData[x];
        }
      }
      resultData.customerId = pageData.customerInfor.customerId === 'undefined' ? null : pageData.customerInfor.customerId;
      resultData.taskId = pageData.taskId === 'undefined' ? null : pageData.taskId;
      resultData.actorId = pageData.customerInfor.actorId === 'undefined' ? null : pageData.customerInfor.actorId;
      resultData.taskStatus = pageData.status === 'undefined' ? null : pageData.status;
      resultData.loanId = pageData.loanBaseInfor.loanAppId === 'undefined' ? null : pageData.loanBaseInfor.loanAppId;
      resultData.routingSystem = pageData.loanBaseInfor.routingSystem === 'undefined' ? null : pageData.loanBaseInfor.routingSystem;
      dispatch({ type: 'taskDetails/saveIntention', payload: resultData });
    },
    deploySaveIntention: (formData, pageData) => {
      const resultData = formData;
      for (const x in resultData) {
        if (['feedBackTime'].indexOf(x) > -1 && resultData[x]) {
          if (resultData[x]) {
            resultData[x] = resultData[x].format('YYYY-MM-DD HH:mm');
          } else {
            delete resultData[x];
          }
        }
        if (['reviewRemark', 'cancelRemark'].indexOf(x) > -1) {
          resultData.remark = resultData[x];
          delete resultData[x];
        }
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
    closeEveryModal: () => {
      dispatch({ type: 'taskDetails/closeEveryModal' });
    },
    getSchedule: (params) => {
      dispatch({ type: 'taskDetails/getSchedule', payload: params });
    },
  }),
)(Form.create()(HoldTaskDetails));

