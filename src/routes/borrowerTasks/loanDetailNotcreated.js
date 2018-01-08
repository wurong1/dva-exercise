import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Input, Modal, DatePicker, Spin, Select, Radio, Form, Steps, Tabs } from 'antd';
import moment from 'moment';
import BaseInfo from './baseInfo';
import DeployModal from './deployModal';
import OperationRecord from './operationRecord';
import './borrowerTasks.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Step = Steps.Step;
const TabPane = Tabs.TabPane;

const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 14 },
};

class LoanDetailNotcreated extends Component {

  constructor(props) {
    super(props);
    this.state = {
      operationResult: '',
      detailType: '',
    };
  }

  componentWillMount() {
    const { taskInfo: { operationResult } } = this.props;
    if (operationResult === 'INVALID' || operationResult === 'NOT_REACHABLE') {
      this.props.getDetailTypeList(operationResult);
    }
  }

  onCancel = () => {
    this.props.showNotcreateTransfer(false);
  }

  handleBtnChange = (e) => {
    const operationResult = e.target.value;
    this.setState({ operationResult }, () => {
      this.props.form.validateFields(['intentionRemark'], { force: true });
    });
    if (operationResult === 'INVALID' || operationResult === 'NOT_REACHABLE') {
      this.props.getDetailTypeList(operationResult);
    }
  }

  handleDetailTypeChange = (value) => {
    this.setState({ detailType: value }, () => {
      this.props.form.validateFields(['intentionRemark'], { force: true });
    });
  }

  handleSubmit = (flag, e) => {
    e.preventDefault();
    const {
      taskInfo: {
        customerInfor: {
          customerId,
          actorId,
        } = {},
        taskId,
        status,
      },
    } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const operationResult = values && values.operationResult;
        let feedBackTime;
        let result = { ...values };
        if (operationResult === 'TO_BE_FOLLOWED_UP') {
          feedBackTime = values.feedBackTime && moment(values.feedBackTime).format('YYYY-MM-DD HH:mm:ss');
        }
        if (operationResult === 'NOT_REACHABLE') {
          const detailType = values.notreach_detailType;
          delete result.notreach_detailType;
          result = { ...result, detailType };
        }
        const params = {
          value: { ...result, customerId, actorId, taskId, taskStatus: status, feedBackTime },
          flag,
        };
        this.props.notCreatedSubmit(params);
      }
    });
  }

  disabledDate = (current) => {
    return current && current.valueOf() < moment().startOf('day');
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      taskInfo: {
        loanBaseInfor = {},
        operationResults = [],
        operationResult,
        detailType,
        intentionRemark,
        isClosed,
        feedBackTime,
        isClosedList,
        taskId,
      },
      loanDetail = {},
    } = this.props;
    const {
      loanAppStatus,
      loanAppId,
      loanId,
      loanType,
      createdDate,
    } = loanBaseInfor;
    const {
      notCreateDetail: {
        isFetching,
        loading,
        detailTypeList,
      } = {},
      deployModal: {
        visible,
      } = {},
    } = loanDetail;
    const showInvalidDetailType = (this.state.operationResult || operationResult) === 'INVALID';
    const showNotreachDetailType = (this.state.operationResult || operationResult) === 'NOT_REACHABLE';
    const showIntentionRemark = ['INVALID', 'NOT_REACHABLE', 'TO_BE_FOLLOWED_UP'].indexOf(this.state.operationResult || operationResult) > -1;
    return (
      <div className="crm-tab">
        <Tabs defaultActiveKey="details" className="tabs">
          <TabPane tab="任务详情" key="details">
            <div>
              <div className="crm-section">
                <div className="step">
                  <Steps current={1}>
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
                    <span>{loanAppStatus}</span>
                  </Col>
                  <Col span={3}>
                    <p>贷款申请ID</p>
                    <span>{loanAppId}</span>
                  </Col>
                  <Col span={3}>
                    <p>贷款类型</p>
                    <span>{loanType}</span>
                  </Col>
                  <Col span={3}>
                    <p>贷款创建时间</p>
                    <span>{createdDate && moment(createdDate).format('YYYY-MM-DD')}</span>
                  </Col>
                  <Col span={3}>
                    <p>贷款ID</p>
                    <span>{loanId}</span>
                  </Col>
                </Row>
              </div>
              <div className="not-create">
                <Spin spinning={isFetching}>
                  <Form onSubmit={this.handleSubmit.bind(this, 'SAVE')}>
                    <FormItem
                      label="处理结果"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('operationResult', {
                        initialValue: operationResult,
                      })(
                        <Radio.Group
                          onChange={this.handleBtnChange}
                        >
                          {
                            operationResults.map((item, idx) => {
                              if (item.id === 'LOANRETURN' || item.id === 'SUBMITTED') return null;
                              return <Radio.Button value={item.id} key={idx}>{item.name}</Radio.Button>;
                            })
                          }
                        </Radio.Group>,
                      )}
                    </FormItem>
                    {
                      showInvalidDetailType &&
                      <Spin spinning={loading}>
                        <FormItem
                          label="详细类型"
                          {...formItemLayout}
                        >
                          {getFieldDecorator('detailType', {
                            initialValue: operationResult === 'INVALID' ? detailType : '',
                          })(
                            <Select
                              onChange={this.handleDetailTypeChange}
                            >
                              <Option value="">-请选择-</Option>
                              {
                                detailTypeList.map((item, idx) => {
                                  return <Option vlaue={item.id} key={idx}>{item.name}</Option>;
                                })
                              }
                            </Select>,
                          )}
                        </FormItem>
                      </Spin>
                    }
                    {
                      showNotreachDetailType &&
                      <Spin spinning={loading}>
                        <FormItem
                          label="详细类型"
                          {...formItemLayout}
                        >
                          {getFieldDecorator('notreach_detailType', {
                            initialValue: operationResult === 'NOT_REACHABLE' ? detailType : '',
                            rules: [{
                              required: true, message: '不能为空！',
                            }],
                          })(
                            <Select
                              onChange={this.handleDetailTypeChange}
                            >
                              <Option value="">-请选择-</Option>
                              {
                                detailTypeList.map((item, idx) => {
                                  return <Option vlaue={item.id} key={idx}>{item.name}</Option>;
                                })
                              }
                            </Select>,
                          )}
                        </FormItem>
                      </Spin>
                    }
                    {
                      (this.state.operationResult || operationResult) === 'TO_BE_FOLLOWED_UP' &&
                      <FormItem
                        label="预约回访时间"
                        {...formItemLayout}
                      >
                        {getFieldDecorator('feedBackTime', {
                          initialValue: feedBackTime && moment(feedBackTime),
                        })(
                          <DatePicker disabledDate={this.disabledDate} showTime format="YYYY-MM-DD HH:mm:ss" size="large" style={{ width: '200px' }} />,
                        )}
                      </FormItem>
                    }
                    {
                      showIntentionRemark &&
                      <FormItem
                        label="补充说明"
                        {...formItemLayout}
                      >
                        {getFieldDecorator('intentionRemark', {
                          initialValue: intentionRemark,
                          rules: [{
                            max: 200, message: '请限制在200字以内！',
                          }, {
                            required: (this.state.detailType || detailType) === '10' && (this.state.operationResult || operationResult) === 'INVALID',
                            message: '不能为空',
                          }],
                        })(
                          <TextArea autosize={{ minRows: 2, maxRows: 6 }} />,
                        )}
                      </FormItem>
                    }
                    <FormItem
                      label="备注"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('remark', {
                        initialValue: '',
                        rules: [{
                          max: 500, message: '请限制在500字以内！',
                        }],
                      })(
                        <TextArea autosize={{ minRows: 2, maxRows: 6 }} />,
                      )}
                    </FormItem>
                    <FormItem
                      label="是否结案"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('isClosed', {
                        initialValue: `${isClosed}`,
                      })(
                        <Select
                          style={{ width: '150px' }}
                        >
                          <Option value="">-请选择-</Option>
                          {
                            isClosedList.map((item, idx) => {
                              return <Option value={item.code} key={idx}>{item.name}</Option>;
                            })
                          }
                        </Select>,
                      )}
                    </FormItem>
                    <div className="crm-footer-btn" style={{ textAlign: 'left' }}>
                      <Button type="primary" htmlType="submit">保存</Button>
                      <Button onClick={this.handleSubmit.bind(this, 'DEPLOY')}>转给分公司</Button>
                    </div>
                  </Form>
                </Spin>
              </div>
              <BaseInfo
                getDetailPhone={this.props.getDetailPhone}
                getDetailSsn={this.props.getDetailSsn}
              />
              <Modal
                visible={visible}
                footer={null}
                onCancel={this.onCancel}
                title="转给分公司"
              >
                <DeployModal />
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

export default connect(
  state => ({
    taskInfo: state.taskDetails.taskDetailsList || {},
    loanDetail: state.loanDetail,
  }),
  dispatch => ({
    getDetailTypeList: params => dispatch({ type: 'loanDetail/getDetailTypeList', payload: params }),
    notCreatedSubmit: params => dispatch({ type: 'loanDetail/notCreatedSubmit', payload: params }),
    showNotcreateTransfer: params => dispatch({ type: 'loanDetail/showNotcreateTransfer', payload: params }),
  }),
)(Form.create()(LoanDetailNotcreated));

