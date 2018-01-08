import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Spin } from 'antd';

const FormItem = Form.Item;
const positiveRegExp = /^[1-9]\d*$/;

class HomeConfigPage extends Component {
  componentDidMount() {
    const { getHomeConfig } = this.props;
    getHomeConfig();
  }

  handleSubmit = (idx, config, e) => {
    e.preventDefault();
    const { updateHomeConfig, form: { validateFields } } = this.props;
    validateFields([`form${idx}`], (err, values) => {
      if (!err) {
        const params = {
          configCode: config.configCode,
          configRule: values[`form${idx}`],
          id: config.id,
        };
        updateHomeConfig(params);
      }
    });
  }

  render() {
    const { configList, loading, form: { getFieldDecorator } } = this.props;
    const holdConfig = configList.find(val => val.configCode === 'HOMEPAGE_LOAN_HOLD_UNTREATED_DAY') || {};
    const signConfig = configList.find(val => val.configCode === 'HOMEPAGE_LOAN_SIGN_UNTREATED_DAY') || {};
    const callConfig = configList.find(val => val.configCode === 'HOMEPAGE_NEAREST_CALL_DAY') || {};
    return (
      <Spin spinning={loading}>
        <div className="task-delay">
          <h3 className="dr-section-font">首页配置</h3>
          <Form>
            <div>
              <div>
                <h3 className="dr-section-font">首页相关配置,更改后展示维度立即生效,实际数据维度次日生效</h3>
                <div>
                  <span className="delay-span">贷款处理模块，待补件超过</span>
                  <FormItem
                    label={null}
                    style={{ display: 'inline-block', marginBottom: '8px', marginRight: '10px' }}
                  >
                    {getFieldDecorator('form0', {
                      initialValue: holdConfig.configRule,
                      rules: [{
                        required: true, pattern: positiveRegExp, message: '请输入正整数',
                      }],
                    })(
                      <Input type="number" />,
                    )}
                  </FormItem>
                  <span className="delay-span">天未处理</span>
                </div>
                <Button type="primary" className="delay-btn" onClick={this.handleSubmit.bind(this, 0, holdConfig)}>保存</Button>
              </div>
              <div>
                <div>
                  <span className="delay-span">贷款处理模块，待签约超过</span>
                  <FormItem
                    label={null}
                    style={{ display: 'inline-block', marginBottom: '8px', marginRight: '10px' }}
                  >
                    {getFieldDecorator('form1', {
                      initialValue: signConfig.configRule,
                      rules: [{
                        required: true, pattern: positiveRegExp, message: '请输入正整数',
                      }],
                    })(
                      <Input type="number" />,
                    )}
                  </FormItem>
                  <span className="delay-span">天未处理</span>
                </div>
                <Button type="primary" className="delay-btn" onClick={this.handleSubmit.bind(this, 1, signConfig)}>保存</Button>
              </div>
              <div>
                <div>
                  <span className="delay-span">通话时长模块，近</span>
                  <FormItem
                    label={null}
                    style={{ display: 'inline-block', marginBottom: '8px', marginRight: '10px' }}
                  >
                    {getFieldDecorator('form2', {
                      initialValue: callConfig.configRule,
                      rules: [{
                        required: true, pattern: positiveRegExp, message: '请输入正整数',
                      }],
                    })(
                      <Input type="number" />,
                    )}
                  </FormItem>
                  <span className="delay-span">天通话时长</span>
                </div>
                <Button type="primary" className="delay-btn" onClick={this.handleSubmit.bind(this, 2, callConfig)}>保存</Button>
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
    configList: state.homeConfig.configList,
    loading: state.homeConfig.loading,
  }),
  dispatch => ({
    getHomeConfig: () => dispatch({ type: 'homeConfig/getHomeConfig' }),
    updateHomeConfig: params => dispatch({ type: 'homeConfig/updateHomeConfig', payload: params }),
  }),
)(Form.create()(HomeConfigPage));
