import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Spin, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class DeployModal extends Component {


  componentWillMount() {
    this.props.getTransferEmployeeGroup();
  }

  onCancel = () => {
    this.props.showNotcreateTransfer(false);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { taskInfo: { taskId, status, customerInfor: { customerId } = {} } } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.taskDeploySubmit({ taskIds: [`${taskId}-${customerId}-${status}`], employees: [values.employee], ...values });
      }
    });
  }

  handleGroupChange = (value) => {
    const { setFieldsValue } = this.props.form;
    const id = value && value.split('-')[0];
    setFieldsValue({ employee: '' });
    this.props.getTransferEmployeeList(id);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loanDetail: { deployModal } = {} } = this.props;
    const { employeeGroup = [], employeeList = [], loading } = deployModal;
    return (
      <div>
        <Spin spinning={loading}>
          <Form
            onSubmit={this.handleSubmit}
          >
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
            <div className="crm-footer-btn">
              <Button onClick={this.onCancel}>取消</Button>
              <Button type="primary" htmlType="submit">确定</Button>
            </div>
          </Form>
        </Spin>
      </div>
    );
  }
}

export default connect(
  state => ({
    taskInfo: state.taskDetails.taskDetailsList || {},
    loanDetail: state.loanDetail || {},
  }),
  dispatch => ({
    showNotcreateTransfer: params => dispatch({ type: 'loanDetail/showNotcreateTransfer', payload: params }),
    getTransferEmployeeGroup: () => dispatch({ type: 'loanDetail/getTransferEmployeeGroup' }),
    getTransferEmployeeList: params => dispatch({ type: 'loanDetail/getTransferEmployeeList', payload: params }),
    taskDeploySubmit: params => dispatch({ type: 'loanDetail/taskDeploySubmit', payload: params }),
  }),
)(Form.create()(DeployModal));
