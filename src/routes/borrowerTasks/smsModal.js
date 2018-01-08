import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Button, Select, Input, Form } from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

class AddContract extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillReceiveProps(nextPops) {
    const { setFieldsValue } = this.props.form;
    const { smsModal: { templeteId, content } } = nextPops;
    const setContent = templeteId !== this.props.smsModal.templeteId;
    if (setContent) {
      setFieldsValue({ content: htmlDecode(content) });
    }
  }

  handleTempChange = (val) => {
    const { taskDetail: { customerInfor: { customerId } } } = this.props;
    this.props.getContent({ customerId, template: val });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let step;
    const {
      taskDetail: {
        taskId,
        status,
        customerInfor: {
          customerId,
        },
      },
      smsModal: {
        smsInfo: {
          phoneNo,
        } = {},
      },
    } = this.props;
    switch (status) {
      case 'NEWREGIST':
        step = 1; break;
      case 'LOANAPPGUIDED':
        step = 2; break;
      case 'AUDITFOLLOWUP':
        step = 3; break;
      case 'SIGN':
        step = 4; break;
      default:
        step = null;
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          taskId,
          customerId,
          phoneNo,
          step,
          ...values,
        };
        this.props.sendMsg(params);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      smsModal: {
        smsInfo: {
          templates = [],
          phonePwdNo,
        } = {},
        loading,
      },
    } = this.props;
    return (
      <div>
        <Spin spinning={loading}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              label="电话号码"
              {...formItemLayout}
            >
              {getFieldDecorator('phoneNo', {
                initialValue: phonePwdNo,
              })(
                <Input disabled />,
              )}
            </FormItem>
            <FormItem
              label="短信模板"
              {...formItemLayout}
            >
              {getFieldDecorator('template', {
                initialValue: '',
                rules: [{
                  required: true, message: '不能为空！',
                }],
              })(
                <Select
                  onChange={this.handleTempChange}
                >
                  <Option value="">-请选择-</Option>
                  {
                    templates.map((item, idx) => {
                      return <Option value={`${item.id}`} key={idx} >{item.name}</Option>;
                    })
                  }
                </Select>,
              )}
            </FormItem>
            <FormItem
              label="短信内容"
              {...formItemLayout}
            >
              {getFieldDecorator('content', {
                rules: [{
                  required: true, message: '不能为空！',
                }, {
                  max: 300,
                }],
              })(
                <TextArea autosize={{ minRows: 6, maxRows: 6 }} disabled />,
              )}
            </FormItem>
            <div className="crm-footer-btn">
              <Button onClick={() => this.props.showSmsModal(false)}>取消</Button>
              <Button type="primary" htmlType="submit">发送</Button>
            </div>
          </Form>
        </Spin>
      </div>
    );
  }
}
export default connect(
  state => ({
    smsModal: state.taskDetails.smsModal || {},
    taskDetail: state.taskDetails.taskDetailsList || {},
  }),
  dispatch => ({
    showSmsModal: params => dispatch({ type: 'taskDetails/showSmsModal', payload: params }),
    getContent: params => dispatch({ type: 'taskDetails/getContent', payload: params }),
    sendMsg: params => dispatch({ type: 'taskDetails/sendMsg', payload: params }),
  }),
)(Form.create()(AddContract));

function htmlDecode(text) {
  let temp = document.createElement('div');
  temp.innerHTML = text;
  const output = temp.innerText || temp.textContent;
  temp = null;
  return output;
}
