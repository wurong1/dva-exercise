import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Spin, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class DetailsDeploy extends Component {


  componentWillMount() {

  }

  onCancel = () => {
    const { closeEveryModal } = this.props;
    closeEveryModal();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { taskIds, deploy, form: { validateFields }, isAssign } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const resultData = {
          employee: values.employee,
          employeeGroup: values.employeeGroup,
          employees: [values.employee],
          taskIds,
          isAssign,
        };
        deploy(resultData);
      }
    });
  }

  handleGroupChange = (value) => {
    const { getPersonalList, form: { setFieldsValue } } = this.props;
    const id = value && value.split('-')[0];
    setFieldsValue({ employee: '' });
    getPersonalList(id);
  }

  render() {
    const { groupList, personalList, form: { getFieldDecorator } } = this.props;
    return (
      <div>
        <Spin spinning={false}>
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
    personalList: state.taskDetails.personalList,
  }),
  dispatch => ({
    getPersonalList: (params) => {
      dispatch({ type: 'taskDetails/getPersonalList', payload: params });
    },
    deploy: (params) => {
      dispatch({ type: 'taskDetails/deploy', payload: params });
    },
    closeEveryModal: () => {
      dispatch({ type: 'taskDetails/closeEveryModal' });
    },
  }),
)(Form.create()(DetailsDeploy));
