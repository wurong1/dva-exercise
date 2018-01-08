import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Input, Spin, Select, Radio, Form, Steps, Tabs } from 'antd';
import moment from 'moment';
import BaseInfo from './baseInfo';
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

class LoanNotcreatedReadonly extends Component {

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
    } = loanDetail;
    const showOnOffGroup = (this.state.operationResult || operationResult) !== 'INVALID';
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
                      showOnOffGroup &&
                      <div>
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
                      </div>
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
                  </Form>
                </Spin>
              </div>
              <BaseInfo
                getDetailPhone={this.props.getDetailPhone}
                getDetailSsn={this.props.getDetailSsn}
              />
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
  }),
)(Form.create()(LoanNotcreatedReadonly));

