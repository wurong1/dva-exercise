import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Spin } from 'antd';

const FormItem = Form.Item;
const taskName = ['BORROWER_REGIST_APP', 'BORROWER_REGIST_LP', 'BORROWER_REGIST_WX'];

class TaskDelay extends Component {
  componentDidMount() {
    this.props.getTaskDelayInfo();
  }

  handleSubmit = (idx, e) => {
    e.preventDefault();
    this.props.form.validateFields([`delayTime${idx}`], (err, values) => {
      if (!err) {
        const params = {
          taskName: taskName[idx],
          delayTime: values[`delayTime${idx}`],
        };
        this.props.submitTaskDelay(params);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { borrowapp, active, wechat, loading } = this.props.taskDelay;
    return (
      <Spin spinning={loading}>
        <div className="task-delay">
          <h3 className="dr-section-font">任务配置</h3>
          <Form>
            <div>
              <div>
                <h3 className="dr-section-font">任务生成时间配置</h3>
                <div>
                  <span className="delay-span">客户从borrow app注册，距离客户注册</span>
                  <FormItem
                    label={null}
                    style={{ display: 'inline-block', marginBottom: '8px', marginRight: '10px' }}
                  >
                    {getFieldDecorator('delayTime0', {
                      initialValue: borrowapp,
                      rules: [{
                        required: true, message: '不能为空！',
                      }],
                    })(
                      <Input type="number" />,
                    )}
                  </FormItem>
                  <span className="delay-span">分钟后</span>
                </div>
                <div>客户未提交贷款申请，生成任务。任务状态为“新注册”</div>
                <Button type="primary" className="delay-btn" onClick={this.handleSubmit.bind(this, 0)}>保存</Button>
              </div>
              <div>
                <div>
                  <span className="delay-span">客户从市场活动页面注册，距离客户注册</span>
                  <FormItem
                    label={null}
                    style={{ display: 'inline-block', marginBottom: '8px', marginRight: '10px' }}
                  >
                    {getFieldDecorator('delayTime1', {
                      initialValue: active,
                      rules: [{
                        required: true, message: '不能为空！',
                      }],
                    })(
                      <Input />,
                    )}
                  </FormItem>
                  <span className="delay-span">分钟后</span>
                </div>
                <div>客户未提交贷款申请，生成任务。任务状态为“新注册”</div>
                <Button type="primary" className="delay-btn" onClick={this.handleSubmit.bind(this, 1)}>保存</Button>
              </div>
              <div>
                <div>
                  <span className="delay-span">客户从微信注册，距离客户注册</span>
                  <FormItem
                    label={null}
                    style={{ display: 'inline-block', marginBottom: '8px', marginRight: '10px' }}
                  >
                    {getFieldDecorator('delayTime2', {
                      initialValue: wechat,
                      rules: [{
                        required: true, message: '不能为空！',
                      }],
                    })(
                      <Input />,
                    )}
                  </FormItem>
                  <span className="delay-span">分钟后</span>
                </div>
                <div>客户未提交贷款申请，生成任务。任务状态为“新注册”</div>
                <Button type="primary" className="delay-btn" onClick={this.handleSubmit.bind(this, 2)}>保存</Button>
              </div>
            </div>
          </Form>
        </div>
      </Spin>
    );
  }
}
export default connect(
  state => ({
    taskDelay: state.task.taskDelay,
  }),
  dispatch => ({
    getTaskDelayInfo: () => dispatch({ type: 'task/getTaskDelay' }),
    submitTaskDelay: params => dispatch({ type: 'task/submitTaskDelay', payload: params }),
  }),
)(Form.create()(TaskDelay));
