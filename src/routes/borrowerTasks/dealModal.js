import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, DatePicker, Select, Button, Spin } from 'antd';
import moment from 'moment';

import CascadeSelect from '../../components/select-cascade';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;

class DealModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      detailType: '',
    };
  }

  componentWillMount() {
    this.props.getEmployeeGroup();
  }

  onCancel = () => {
    const params = {
      value: '',
      show: false,
    };
    this.props.showDealModal(params);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { loanDetail: { dealStatus }, taskInfo = {} } = this.props;
    const {
      customerInfor: {
        customerId,
        actorId,
      } = {},
      loanBaseInfor: {
        loanAppId,
      } = {},
      taskId,
      status,
    } = taskInfo;
    const params = {
      customerId,
      taskId,
      actorId,
      taskStatus: status,
    };
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (dealStatus === 'DATAWAIT' || dealStatus === 'NOT_REACHABLE') {
          this.props.dealSubmit({ ...params, operationResult: dealStatus, ...values });
        }
        if (dealStatus === 'TO_BE_FOLLOWED_UP') {
          const feedBackTime = values.feedBackTime && moment(values.feedBackTime).format('YYYY-MM-DD HH:mm:ss');
          this.props.dealSubmit({ ...params, operationResult: dealStatus, feedBackTime });
        }
        if (dealStatus === 'WITHDRAWAL') {
          this.props.dealSubmit(
            {
              ...params,
              whatStatus: dealStatus,
              loanId: loanAppId,
              ...values,
            });
        }
        if (dealStatus === 'TRANSFER') {
          this.props.taskDeploy({ taskIds: [`${taskId}-${customerId}-${status}`], employees: [values.employee], ...values });
        }
      }
    });
  }

  // 触发二级select框接收新的props
  handleReasonChange = () => {
    this.setState(preState => ({ chageFlag: !preState.chageFlag }));
  }

  handleDetailtypeChange = (detailType) => {
    this.setState({ detailType });
  }

  handleGroupChange = (value) => {
    const id = value && value.split('-')[0];
    this.props.getEmployeeList(id);
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { loanDetail: { dealStatus, dealModal = {} }, taskInfo: { feedBackTime } } = this.props;
    const { employeeGroup = [], employeeList = [], loading } = dealModal;
    const { detailType } = this.state;
    const detailTypeOptions = {
      remote: '/borrower/v1/task/invalid-result?cancleOperationResult={:val}',
      parentName: 'operationResult',
      parentValue: getFieldValue('operationResult'),
      val: 'code',
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        { // 待完善，联系不上
          (dealStatus === 'DATAWAIT' || dealStatus === 'NOT_REACHABLE') &&
          <Spin spinning={loading}>
            <FormItem
              label="备注"
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
          </Spin>
        }
        { // 待跟进
          dealStatus === 'TO_BE_FOLLOWED_UP' &&
          <Spin spinning={loading}>
            <FormItem
              label="预约回访时间"
            >
              {getFieldDecorator('feedBackTime', {
                initialValue: feedBackTime && moment(feedBackTime),
              })(
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" size="large" style={{ width: '200px' }} />,
              )}
            </FormItem>
          </Spin>
        }
        { // 取消录单
          dealStatus === 'WITHDRAWAL' &&
          <div>
            <Spin spinning={loading}>
              <FormItem
                label="取消原因"
              >
                {getFieldDecorator('operationResult', {
                  initialValue: '',
                  rules: [{
                    required: true, message: '不能为空！',
                  }],
                })(
                  <Select onChange={this.handleReasonChange}>
                    <Option value="">-请选择-</Option>
                    <Option value="INVALID">不符合要求</Option>
                    <Option value="NODEMAND">无需求</Option>
                  </Select>,
                )}
              </FormItem>
              <FormItem
                label="详细原因"
              >
                {getFieldDecorator('detailType', {
                  initialValue: '',
                })(
                  <CascadeSelect
                    {...detailTypeOptions}
                    onChange={this.handleDetailtypeChange}
                  />,
                )}
              </FormItem>
              {
                detailType === '10' &&
                <FormItem
                  label="补充说明"
                >
                  {getFieldDecorator('intentionRemark', {
                    initialValue: '',
                    rules: [{
                      required: true, message: '不能为空！',
                    }],
                  })(
                    <Input />,
                  )}
                </FormItem>
              }
            </Spin>
          </div>
        }
        { // 转给分公司
          dealStatus === 'TRANSFER' &&
          <div>
            <Spin spinning={loading}>
              <FormItem
                label="分公司"
              >
                {getFieldDecorator('employeeGroup', {
                  initialValue: '',
                  rules: [{
                    required: true, message: '不能为空！',
                  }],
                })(
                  <Select
                    onChange={this.handleGroupChange}
                    optionFilterProp="children"
                    showSearch
                  >
                    <Option value="">-请选择-</Option>
                    {
                      employeeGroup.map((item, idx) => {
                        return <Option key={idx} value={`${item.id}-${item.name}-${item.type}`}>{item.name}</Option>;
                      })
                    }
                  </Select>,
                )}
              </FormItem>
              <FormItem
                label="客服"
              >
                {getFieldDecorator('employee', {
                  initialValue: '',
                  rules: [{
                    required: true, message: '不能为空！',
                  }],
                })(
                  <Select
                    disabled={employeeList.length < 1}
                  >
                    <Option value="">-请选择-</Option>
                    {
                      employeeList.map((item, idx) => {
                        return <Option value={`${item.id}-${item.name}`} key={idx}>{item.name}</Option>;
                      })
                    }
                  </Select>,
                )}
              </FormItem>
            </Spin>
          </div>
        }
        <div className="crm-footer-btn">
          <Button onClick={this.onCancel}>取消</Button>
          <Button type="primary" htmlType="submit">确定</Button>
        </div>
      </Form>
    );
  }
}

export default connect(
  state => ({
    taskInfo: state.taskDetails.taskDetailsList || {},
    loanDetail: state.loanDetail || {},
  }),
  dispatch => ({
    showDealModal: params => dispatch({ type: 'loanDetail/showDealModal', payload: params }),
    getEmployeeGroup: () => dispatch({ type: 'loanDetail/getEmployeeGroup' }),
    getDetailReason: params => dispatch({ type: 'loanDetail/getDetailReason', payload: params }),
    getEmployeeList: params => dispatch({ type: 'loanDetail/getEmployeeList', payload: params }),
    dealSubmit: params => dispatch({ type: 'loanDetail/dealSubmit', payload: params }),
    taskDeploy: params => dispatch({ type: 'loanDetail/taskDeploy', payload: params }),
  }),
)(Form.create()(DealModal));

