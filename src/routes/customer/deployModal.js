import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Spin, Button, message, Icon, Modal } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class CustomerDeploy extends Component {
  state = {
    salesList: [],
  };

  componentDidMount() {
    const { getGroupList } = this.props;
    getGroupList();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { salesList } = this.state;
    const { customerIds, deploy, form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const data = {
          employee: values.employee,
          employeeGroup: values.employeeGroup,
          employees: salesList,
          customerIds,
        };
        deploy(data);
      }
    });
  }

  handleGroupChange = (value) => {
    const { getPersonalList, saveGroupValue, form: { setFieldsValue } } = this.props;
    const id = value && value.split('-')[0];
    setFieldsValue({ employee: '' });
    getPersonalList(id);
    saveGroupValue(value);
  }

  employeeChange = (value) => {
    const { salesList } = this.state;
    const isExit = salesList.find(item => item === value);
    if (isExit) {
      message.error('请勿重复选择！', 2);
      return false;
    }
    salesList[salesList.length] = value;
    this.setState({ salesList });
  }

  deleteEmployee = (id) => {
    const { salesList } = this.state;
    const newSalesList = salesList.filter(item => item !== id);
    this.setState({ salesList: newSalesList });
  }

  render() {
    const { salesList } = this.state;
    const { isModalShow, groupList, personalList, groupValue, isDisabled, loading,
      modalOpen, modalClose, form: { getFieldDecorator } } = this.props;
    return (
      <div>
        <Button disabled={isDisabled} onClick={modalOpen}>调配</Button>
        <Modal
          visible={isModalShow}
          footer={null}
          onCancel={modalClose}
        >
          <div>
            <Spin spinning={loading}>
              <Form
                onSubmit={this.handleSubmit}
              >
                <FormItem
                  label="分公司"
                >
                  {getFieldDecorator('employeeGroup', {
                    initialValue: groupValue,
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
                        groupList && groupList.map((item, idx) => {
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
                    onChange: this.employeeChange,
                    rules: [{
                      required: true, message: '不能为空！',
                    }],
                  })(
                    <Select
                      disabled={personalList.length < 1}
                    >
                      <Option value="">-请选择-</Option>
                      {
                        personalList && personalList.map((item, idx) => {
                          return <Option value={`${item.id}-${item.name}`} key={idx}>{item.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
                <div className="content-row item-row" style={{ marginLeft: '80px' }}>
                  {
                    salesList.map(item =>
                      <span
                        key={item}
                      >
                        {item && item.split('-')[1]}
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
                <div className="crm-footer-btn">
                  <Button onClick={modalClose}>取消</Button>
                  <Button type="primary" htmlType="submit">确定</Button>
                </div>
              </Form>
            </Spin>
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(
  state => ({
    groupList: state.customerDeploy.groupList,
    personalList: state.customerDeploy.personalList,
    salesList: state.customerDeploy.salesList,
    groupValue: state.customerDeploy.groupValue,
  }),
  dispatch => ({
    getGroupList: () => {
      dispatch({ type: 'customerDeploy/getGroupList' });
    },
    getPersonalList: (params) => {
      dispatch({ type: 'customerDeploy/getPersonalList', payload: params });
    },
    saveGroupValue: (params) => {
      dispatch({ type: 'customerDeploy/saveGroupValue', payload: params });
    },
  }),
)(Form.create()(CustomerDeploy));
