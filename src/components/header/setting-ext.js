import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Select, message, Spin, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

const SetExtForm = Form.create()(
  (props) => {
    const { onUnbind, onBind, onCancel, form, agentInfo, visible } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      className: 'feedback-lg',
      hasFeedback: true,
    };
    const { agentGroupId, agentGroups, extensionNo } = agentInfo;
    const isFirstBind = agentGroupId === 0;
    const onSubmit = () => {
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        onBind(values);
      });
    };
    return (
      <Modal
        visible={visible}
        title="分机设置"
        width={432}
        okText="Create"
        wrapClassName="wrap-row-infobox"
        onCancel={onCancel}
        onOk={onSubmit}
        footer={[
          <Button
            type="primary" key="0" onClick={onSubmit}
          >绑定</Button>,
          <Button type="cancel" key="1" onClick={onCancel}>取消</Button>,
          <Button type="cancel" key="2" disabled={isFirstBind} style={{ float: 'right' }} onClick={onUnbind}>解除绑定</Button>,
        ]}
      >
        <Spin spinning={agentInfo.isfetching} >
          <Form>
            {isFirstBind ?
              <FormItem
                {...formItemLayout}
                label="所属组"
              >
                {getFieldDecorator('modelGroupStr', {
                  rules: [{ required: true, message: '请选择所属销售组' }],
                })(
                  <Select
                    placeholder="选择您所属销售组"
                  >
                    {
                      agentGroups && agentGroups.map(({ id, name }) => {
                        return (<Option value={id} key={id}>{name}</Option>);
                      })
                    }
                  </Select>,
                )}
              </FormItem>
              : null
            }

            <FormItem
              {...formItemLayout}
              label="分机号"
            >
              {getFieldDecorator('extensionNo', {
                initialValue: extensionNo || '',
                rules: [
                  { required: true, message: '请填写您的分机号' },
                ],
              })(<Input />)}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  },
);

class settingExt extends Component {
  static propTypes = {
    callVendor: React.PropTypes.object,
    app: React.PropTypes.object,
  }

  onUnbind = () => {
    const unbindParams = {
      vendorType: this.props.callVendor.vendorType,
      userId: this.props.app.userInfo.id,
    };
    this.props.unBindAgent(unbindParams);
  }

  onBind = (values) => {
    if (!this.props.agentInfo.agentPwd) {
        // createagent
      const agentParams = {
        ...values,
        agentId: this.props.agentInfo.agentId,
        userId: this.props.app.userInfo.id,
        vendorType: this.props.callVendor.vendorType,
      };
      this.props.createAgent(agentParams);
    } else {
        // setextno
      const extParams = {
        ...values,
        vendorType: this.props.callVendor.vendorType,
        userId: this.props.app.userInfo.id,
      };
      this.props.setExtNo(extParams);
    }
  }

  onCancel = () => {
    this.props.onModalCancel();
  }

  showBindModal = () => {
    const { vendorType } = this.props.callVendor;
    if (!vendorType) return message.error('正在获取供应商信息,请稍后重试.');
    this.props.getAgentInfo({
      vendorType,
      userId: this.props.app.userInfo.id,
    });
  }

  render() {
    const { callVendor, agentInfo, app } = this.props;
    const { extNo } = callVendor;
    const { visible } = app;
    // agentLoading
    return (
      <div className="header-right-info-item" title="绑定分机">
        <span onClick={this.showBindModal}>
          <label htmlFor="phone">分机 :</label> <a className="header-right-info-ext">{ extNo || '未绑定' }</a>
        </span>
        <SetExtForm
          key={visible}
          onCancel={this.onCancel}
          onBind={this.onBind}
          onUnbind={this.onUnbind}
          agentInfo={agentInfo}
          visible={visible}
        />
      </div>);
  }
}

export default connect(
  state => ({
    callVendor: state.user.callVendor,
    agentInfo: state.user.agentInfo,
    app: state.user,
  }),
  dispatch => ({
    getAgentInfo: params => dispatch({ type: 'user/getAgentInfo', payload: params }),
    setExtNo: params => dispatch({ type: 'user/setExtNo', payload: params }),
    unBindAgent: params => dispatch({ type: 'user/unBindAgent', payload: params }),
    createAgent: params => dispatch({ type: 'user/createAgent', payload: params }),
    onModalCancel: () => dispatch({ type: 'user/onModalCancel' }),
  }),
)(Form.create()(settingExt));
