import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Spin, message, Icon, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class TransferModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shakeValue: '',
    };
  }

  componentWillMount() {
    const { taskType } = this.props;
    const params = { taskType, operationType: 'TO_BRANCH' };
    this.props.getGroup(params);
  }

  handleChange = (value) => {
    const { setFieldsValue } = this.props.form;
    const params = value ? value.split('-')[0] : '';
    this.props.getEmployeeUser(params);
    setFieldsValue({ employee: '' });
  }

  employeeChange = (value) => {
    const { modal: { checkedList = [] }, setCheckedList } = this.props;
    const shakeFlag = checkedList.indexOf(value) > -1;
    if (!value) return false;
    if (shakeFlag) {
      message.warning('您添加的销售已存在');
      this.setState({ shakeValue: value });
      setTimeout(() => {
        this.setState({ shakeValue: '' });
      }, 1000);
    } else {
      setCheckedList([...checkedList, value]);
    }
  }

  deleteEmployee = (value) => {
    const { modal: { checkedList = [] }, setCheckedList } = this.props;
    const list = checkedList.filter(item => item !== value);
    setCheckedList(list);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      modalSubmit,
      modal: {
        checkedList = [],
      },
      taskNew = {},
      taskLoan = {},
      taskHold = {},
      taskAll = {},
      taskSign = {},
      taskContract = {},
      taskNoSales = {},
      taskOptions,
    } = this.props;
    let selectedRows = [];
    if (checkedList.length < 1) {
      message.error('至少选择一个客服！');
      return false;
    }
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
      case 'NO_SALES':
        selectedRows = taskNoSales.selectedRows; break;
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
        values: { ...values, employees: checkedList, taskIds: rows },
      };
      modalSubmit(params);
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modal: { groupList = [], employeeList = [], isFetching, checkedList } } = this.props;
    const { shakeValue } = this.state;

    return (
      <div>
        <Form
          onSubmit={this.handleSubmit}
        >
          <FormItem label="分公司">
            {getFieldDecorator('employeeGroup', {
              initialValue: '',
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
              })(
                <Select
                  disabled={employeeList.length < 1}
                  onChange={this.employeeChange}
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
          <div className="shake-row">
            {
              checkedList.map(item =>
                <span
                  className={`shake ${item && item === shakeValue ? 'shake-constant' : ''}`}
                  key={item}
                >
                  {item ? item.split('-')[1] : ''}
                  <a
                    className="item-move"
                    onClick={this.deleteEmployee.bind(this, item)}
                  >
                    <Icon type="close-circle-o" />
                  </a>
                </span>,
              )
            }
          </div>
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
    taskContract: state.teamTasks.taskContract,
    taskAll: state.teamTasks.taskAll,
    taskNoSales: state.teamTasks.taskNoSales,
    modal: state.teamTasks.modal,
  }),
  dispatch => ({
    getGroup: params => dispatch({ type: 'teamTasks/getGroup', payload: params }),
    getEmployeeUser: params => dispatch({ type: 'teamTasks/getEmployeeUser', payload: params }),
    setCheckedList: params => dispatch({ type: 'teamTasks/setCheckedList', payload: params }),
    modalSubmit: params => dispatch({ type: 'teamTasks/modalSubmit', payload: params }),
  }),
)(Form.create()(TransferModal));
