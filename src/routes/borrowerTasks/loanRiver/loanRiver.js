import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Row, Col, Tabs, Spin, Radio, Input, DatePicker, Select, Button, message, Modal, Badge } from 'antd';
import OperationRecord from '../operationRecord';
import LoanApply from './loanApply';
import PersonInfo from './personInfo';
import ApplyAptitude from './applyAptitude';
import AuthorizeInfo from './authorizeInfo';
import DetailsDeploy from '../detailsDeploy';
import '../borrowerTasks.less';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const TextArea = Input.TextArea;
const Option = Select.Option;

class LoanRiverDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFeedBack: false,
      showOriginPhone: false,
    };
  }

  componentDidMount() {
    const { getConfigAndData, taskId, taskDetailsList } = this.props;
    getConfigAndData(taskId);
    if (taskDetailsList && taskDetailsList.operationResult) {
      this.operationResultOnchange(taskDetailsList.operationResult);
    }
  }

  onCancel = () => {
    const { closeEveryModal } = this.props;
    closeEveryModal();
  }

  deploy = () => {
    const { loanRiverOpenModal, getGroupList } = this.props;
    loanRiverOpenModal();
    getGroupList();
  }

  showPhoneNo = () => {
    this.props.getDetailPhone();
    this.setState(prevState => ({
      showOriginPhone: !prevState.showOriginPhone,
    }));
  }

  operationResultOnchange = (val) => {
    if (val === 'TO_BE_FOLLOWED_UP') {
      this.setState({ isFeedBack: true });
    } else {
      this.setState({ isFeedBack: false });
    }
  }

  allSubmit = (e) => {
    e.preventDefault();
    const { isFeedBack } = this.state;
    const { allSubmit, saveIntention, taskDetailsList, pageData, form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const resultData = {
          crmParams: {
            operationResult: values.operationResult,
            remark: values.remark || '',
            customerId: taskDetailsList.customerInfor.customerId === 'undefined' ? null : taskDetailsList.customerInfor.customerId,
            taskId: taskDetailsList.taskId === 'undefined' ? null : taskDetailsList.taskId,
            actorId: taskDetailsList.customerInfor.actorId === 'undefined' ? null : taskDetailsList.customerInfor.actorId,
            taskStatus: taskDetailsList.status === 'undefined' ? null : taskDetailsList.status,
            feedBackTime: isFeedBack ? values.feedBackTime && values.feedBackTime.format('YYYY-MM-DD HH:mm') : '',
            isClosed: values.isClosed,
          },
          loanRiverParams: {
            comment: values.remark || '',
            taskResult: values.operationResult,
            borrowerId: pageData.aid,
            taskId: taskDetailsList.taskId === 'undefined' ? null : taskDetailsList.taskId,
          },
        };
        if ((values.operationResult === 'VALID' || values.operationResult === 'INVALID') && values.isClosed === '1') {
          allSubmit(resultData);
        } else if (values.isClosed === '2') {
          saveIntention(resultData);
        } else {
          message.error('处理结果为符合要求或不符合要求时才能结案!');
        }
      }
    });
  }

  render() {
    const { isFeedBack, showOriginPhone } = this.state;
    const { pageData, configInfo, formLoading, taskDetailsList, everyModalShow, groupList, originPhoneNo,
      allSubmitStatus, taskDetailsList: { customerInfor, taskId }, form: { getFieldDecorator },
    } = this.props;
    const taskIds = [`${taskDetailsList.taskId}-${customerInfor.customerId}-LOANAPPGUIDED`];
    return (
      <div className="crm-tab">
        <Tabs defaultActiveKey="details" className="tabs">
          <TabPane tab="任务处理" key="details">
            <div>
              <div className="crm-section">
                <Row>
                  <Col span={3}>
                    <h3>基本信息</h3>
                  </Col>
                  <Col span={3}>
                    <p>用户ID</p>
                    <span>{ pageData && pageData.aid }</span>
                  </Col>
                  <Col span={3}>
                    <p>注册来源</p>
                    <span>{ pageData && pageData.source }</span>
                  </Col>
                  <Col span={3}>
                    <p>注册时间</p>
                    <span>{ pageData && pageData.createdDate && moment(pageData.createdDate).format('YYYY-MM-DD HH:mm:ss') }</span>
                  </Col>
                  <Col span={3}>
                    <p>申请终端</p>
                    <span>{ pageData && pageData.applyTerminal }</span>
                  </Col>
                  <Col span={3}>
                    <p>商家类型</p>
                    <span>{ pageData && pageData.salesType }</span>
                  </Col>
                </Row>
              </div>
              <div className="loanriver-form-container">
                <Spin spinning={allSubmitStatus}>
                  <Spin spinning={formLoading}>
                    <Tabs defaultActiveKey="loanApply">
                      <TabPane tab="贷款申请概况" key="loanApply">
                        <LoanApply pageData={pageData} configInfo={configInfo} />
                      </TabPane>
                      <TabPane tab="个人信息" key="personalInfo">
                        <PersonInfo pageData={pageData} configInfo={configInfo} />
                      </TabPane>
                      <TabPane tab="申请资质" key="applyAptitude">
                        <ApplyAptitude pageData={pageData} configInfo={configInfo} />
                      </TabPane>
                      <TabPane tab="授权状况" key="authorization">
                        <AuthorizeInfo pageData={pageData} configInfo={configInfo} />
                      </TabPane>
                    </Tabs>
                  </Spin>
                  <div style={{ margin: '40px' }}>
                    <Form onSubmit={this.allSubmit}>
                      <Row>
                        <Col span={3}>
                          <Badge count={1} style={{ backgroundColor: '#40BF89' }} />
                          <span className="badge-span-title">处理结果<span style={{ color: 'red' }}>*</span></span>
                        </Col>
                        <Col span={8}>
                          <FormItem>
                            {getFieldDecorator('operationResult', {
                              initialValue: taskDetailsList && taskDetailsList.operationResult,
                              rules: [{ required: true, message: '必填项不能为空' }],
                              onChange: e => this.operationResultOnchange(e.target.value),
                            })(
                              <RadioGroup>
                                <RadioButton key="TO_BE_FOLLOWED_UP" value="TO_BE_FOLLOWED_UP">待跟进</RadioButton>
                                <RadioButton key="NOT_REACHABLE" value="NOT_REACHABLE">联系不上</RadioButton>
                                <RadioButton key="VALID" value="VALID">符合要求</RadioButton>
                                <RadioButton key="INVALID" value="INVALID">不符合要求</RadioButton>
                              </RadioGroup>,
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      {
                        isFeedBack ?
                          <Row>
                            <Col offset={3} span={6}>
                              <FormItem label="预约回访时间">
                                {getFieldDecorator('feedBackTime', {
                                  initialValue: (taskDetailsList && taskDetailsList.feedBackTime && moment(taskDetailsList.feedBackTime)) || '',
                                })(
                                  <DatePicker
                                    format="YYYY-MM-DD HH:mm:ss"
                                    showTime
                                  />,
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                        : null
                      }
                      <Row>
                        <Col offset={3} span={6}>
                          <FormItem label="备注">
                            {getFieldDecorator('remark')(
                              <TextArea />,
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={3}>
                          <Badge count={2} style={{ backgroundColor: '#40BF89' }} />
                          <span className="badge-span-title">是否结案<span style={{ color: 'red' }}>*</span></span>
                        </Col>
                        <Col span={6}>
                          <FormItem>
                            {getFieldDecorator('isClosed', {
                              initialValue: (taskDetailsList.isClosed && taskDetailsList.isClosed.toString()) || '2',
                              rules: [{ required: true, message: '必填项不能为空' }],
                            })(
                              <Select>
                                <Option value="1">是</Option>
                                <Option value="2">否</Option>
                              </Select>,
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col offset={3}>
                          <Button type="primary" htmlType="submit">提交</Button>
                          <Button style={{ marginLeft: '10px' }} onClick={this.deploy}>调配</Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Spin>
              </div>
              <div style={{ marginTop: '40px' }} className="crm-section">
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
              </div>
            </div>
          </TabPane>
          <TabPane tab="操作记录" key="record">
            <OperationRecord taskId={taskId} />
          </TabPane>
        </Tabs>
        <Modal
          visible={everyModalShow}
          onCancel={this.onCancel}
          title="调配"
          footer={null}
        >
          <DetailsDeploy taskIds={taskIds} groupList={groupList || []} />
        </Modal>
      </div>
    );
  }
}

LoanRiverDetails.propTypes = {
};

export default connect(
  state => ({
    pageData: state.loanRiver.pageData,
    configInfo: state.loanRiver.configInfo,
    formLoading: state.loanRiver.formLoading,
    allSubmitStatus: state.loanRiver.allSubmitStatus,
    everyModalShow: state.taskDetails.everyModalShow,
    groupList: state.taskDetails.groupList,
    originPhoneNo: state.taskDetails.originPhoneNo,
    originSsn: state.taskDetails.originSsn,
  }),
  dispatch => ({
    getConfigAndData: (params) => {
      dispatch({ type: 'loanRiver/getConfigAndData', payload: params });
    },
    allSubmit: (params) => {
      dispatch({ type: 'loanRiver/allSubmit', payload: params });
    },
    saveIntention: (params) => {
      dispatch({ type: 'loanRiver/saveIntention', payload: params });
    },
    getGroupList: () => {
      dispatch({ type: 'taskDetails/getGroupList' });
    },
    loanRiverOpenModal: () => {
      dispatch({ type: 'taskDetails/loanRiverOpenModal' });
    },
    closeEveryModal: () => {
      dispatch({ type: 'taskDetails/closeEveryModal' });
    },
  }),
)(Form.create()(LoanRiverDetails));

