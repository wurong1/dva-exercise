import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Button, Spin } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class TypeModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      reason: '',
    };
  }

  componentWillMount() {
    const {
      taskInfo: {
        loanBaseInfor: {
          productCode,
          loanAppSource,
        } = {},
      },
    } = this.props;
    const params = { productCode, loanAppSource };
    this.props.getLoanTypeList(params);
  }

  onCancel = () => {
    this.props.showTypeModal(false);
  }

  handleSubmit = (e) => {
    const {
      taskInfo: {
        customerInfor: {
          actorId,
        } = {},
        loanBaseInfor: {
          loanAppId,
          productCode,
        } = {},
        taskId,
      },
    } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          value: { ...values, aid: actorId, loanAppId, currentProductCode: productCode },
          taskId,
        };
        this.props.saveProductCode(params);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loanDetail: { typeModal = {} } } = this.props;
    const { list = [], loading } = typeModal;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Spin spinning={loading}>
          <FormItem
            label="贷款类型"
          >
            {getFieldDecorator('productCode', {
              initialValue: '',
              rules: [{
                required: true, message: '不能为空！',
              }],
            })(
              <Select>
                <Option value="">-请选择-</Option>
                {
                  list.map((item, idx) => {
                    return (
                      <Option
                        key={idx}
                        value={item.intentionLoanType}
                      >
                        {item.intentionLoanTypeName}
                      </Option>
                    );
                  })
                }
              </Select>,
            )}
          </FormItem>
          <div className="crm-footer-btn">
            <Button onClick={this.onCancel}>取消</Button>
            <Button type="primary" htmlType="submit">确定</Button>
          </div>
        </Spin>
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
    showTypeModal: params => dispatch({ type: 'loanDetail/showTypeModal', payload: params }),
    getLoanTypeList: params => dispatch({ type: 'loanDetail/getLoanTypeList', payload: params }),
    saveProductCode: params => dispatch({ type: 'loanDetail/saveProductCode', payload: params }),
  }),
)(Form.create()(TypeModal));

