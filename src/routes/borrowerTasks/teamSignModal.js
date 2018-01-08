import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Spin, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class SignModal extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount() {
    const { taskType } = this.props;
    const params = { taskType, operationType: 'TO_CONTRACT' };
    this.props.getGroup(params);
  }

  handleChange = (value) => {
    const { setFieldsValue } = this.props.form;
    const params = value ? value.split('-')[0] : '';
    this.props.getEmployeeUser(params);
    setFieldsValue({ employee: '' });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      modalSubmit,
      taskNew = {},
      taskLoan = {},
      taskHold = {},
      taskAll = {},
      taskSign = {},
      taskContract = {},
      taskOptions,
    } = this.props;
    let selectedRows = [];
    switch (taskOptions) {
      case 'ALL':
        selectedRows = taskAll.selectedRows; break;
      case 'NEWREGIST':
        selectedRows = taskNew.selectedRows; break;
      case 'LOANAPPGUIDED':
        selectedRows = taskLoan.selectedRows; break;
      case 'AUDITFOLLOWUP':
        selectedRows = taskHold.selectedRows; break;
      case 'SIGN':
        selectedRows = taskSign.selectedRows; break;
      case 'CONTRACT':
        selectedRows = taskContract.selectedRows; break;
      default:
        selectedRows = [];
    }
    const rows = selectedRows.map((item) => {
      return `${item.taskId}-${item.customerId}-${item.taskStatusCode}`;
    });
    this.props.form.validateFields((err, values) => {
      if (err) return false;
      const params = {
        taskOptions,
        isAssign: true,
        values: { ...values, employees: [values.employee], taskIds: rows },
      };
      modalSubmit(params);
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modal: { groupList = [], employeeList = [], isFetching } } = this.props;
    return (
      <div>
        <Form
          onSubmit={this.handleSubmit}
        >
          <FormItem label="分公司">
            {getFieldDecorator('employeeGroup', {
              initialValue: '',
              rules: [{ required: true, message: '必填项不能为空！' }],
            })(
              <Select
                onChange={this.handleChange}
                optionFilterProp="children"
                showSearch
              >
                <Option value="" >全部</Option>
                {
                  groupList.map((item, idx) => {
                    return <Option key={idx} value={`${item.id}-${item.name}-${item.type}`}>{item.name}</Option>;
                  })
                }
              </Select>,
            )}
          </FormItem>
          <Spin spinning={isFetching}>
            <FormItem
              label="客服"
            >
              {getFieldDecorator('employee', {
                initialValue: '',
                rules: [{ required: true, message: '必填项不能为空！' }],
              })(
                <Select
                  disabled={employeeList.length < 1}
                >
                  <Option value="" >全部</Option>
                  {
                    employeeList.map((item, idx) => {
                      return <Option key={idx} value={`${item.id}-${item.name}`}>{item.name}</Option>;
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Spin>
          <div style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              htmlType="submit"
            >
              确定
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default connect(
  state => ({
    taskNew: state.teamTasks.taskNew,
    taskHold: state.teamTasks.taskHold,
    taskLoan: state.teamTasks.taskLoan,
    taskSign: state.teamTasks.taskSign,
    taskAll: state.teamTasks.taskAll,
    modal: state.teamTasks.modal,
    taskContract: state.teamTasks.taskContract,
  }),
  dispatch => ({
    getGroup: params => dispatch({ type: 'teamTasks/getGroup', payload: params }),
    getEmployeeUser: params => dispatch({ type: 'teamTasks/getEmployeeUser', payload: params }),
    modalSubmit: params => dispatch({ type: 'teamTasks/modalSubmit', payload: params }),
  }),
)(Form.create()(SignModal));
