import React, { Component } from 'react';
import { Form, Select, Button, Checkbox, Input, Radio, Row, Col } from 'antd';
import { findDOMNode } from 'react-dom';
import { Link } from 'dva/router';
import TrimInput from '../../components/input-trim';
import './sms.less';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
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

const contentItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14, offset: 6 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    },
  },
};

class TemplateModal extends Component {

  onCancel = () => {
    const { resetFields } = this.props.form;
    resetFields();
    this.props.onCancel();
  }

  handleSubmit = (e) => {
    const { onSubmit } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        onSubmit(values);
      }
    });
  }

  insertValue = (value) => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const contentVal = getFieldValue('content') || '';
    const ele = findDOMNode(this.content);
    const start = ele.selectionStart;
    const end = ele.selectionEnd;
    const s = `${contentVal.substr(0, start)}$\{${value}}${contentVal.substr(start, end)}`;
    setFieldsValue({ content: s });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { fields: { channels, enableStatus, scopes, literalList, steps },
      values = {}, hasPrivilege } = this.props;
    const scopeOptions = scopes.map(item => ({ label: item.name, value: item.code }));
    const stepsOptions = steps.map(item => ({ label: item.name, value: item.code }));
    return (
      <Form onSubmit={this.handleSubmit} className="sms">
        <FormItem
          {...formItemLayout}
          label="模版名称"
        >
          {getFieldDecorator('templateName', {
            initialValue: values.templateName,
            rules: [{
              required: true, message: '不能为空!',
            }],
          })(
            <TrimInput />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="业务使用范围"
        >
          {getFieldDecorator('scopes', {
            initialValue: (values.scopes || []).map(item => item.code) || [],
            rules: [{
              required: true, message: '不能为空!',
            }],
          })(
            <CheckboxGroup options={scopeOptions} />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="任务使用阶段"
        >
          {getFieldDecorator('steps', {
            initialValue: (values.steps || []).map(item => item.code) || [],
            rules: [{
              required: true, message: '不能为空!',
            }],
          })(
            <CheckboxGroup options={stepsOptions} />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="消息发送渠道"
        >
          {getFieldDecorator('channel', {
            initialValue: values.channel,
            rules: [{
              required: true, message: '不能为空!',
            }],
          })(
            <RadioGroup>
              {
                channels.map((item, idx) => <Radio value={item.code} key={idx}>{item.name}</Radio>)
              }
            </RadioGroup>,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="是否启用"
        >
          {getFieldDecorator('status', {
            initialValue: values.status || '',
            rules: [{
              required: true, message: '不能为空!',
            }],
          })(
            <Select>
              <Option value="">全部</Option>
              {
                enableStatus.map((item, idx) => <Option value={`${item.code}`} key={idx}>{item.name}</Option>)
              }
            </Select>,
          )}
        </FormItem>
        <div className="sms-content">
          <Row>
            <Col span={6} className="require-label">
              模版内容
            </Col>
          </Row>
          <div className="sms-fr">
            {
              hasPrivilege &&
              <Link to="/sms-constants" style={{ marginLeft: '30%', float: 'left' }}>管理消息常量</Link>
            }
            <span>插入内容</span>
            <Select onChange={this.insertValue} defaultValue="">
              <Option value="">-请选择-</Option>
              {
                literalList.map((item, idx) => <Option value={`${item}`} key={idx}>{item}</Option>)
              }
            </Select>
          </div>
          <FormItem
            {...contentItemLayout}
            label={null}
          >
            {getFieldDecorator('content', {
              initialValue: values.content || '',
              rules: [{
                required: true, message: '不能为空!',
              }],
            })(
              <TextArea rows={4} ref={(text) => { this.content = text; }} />,
            )}
          </FormItem>
        </div>
        <FormItem {...tailFormItemLayout}>
          <div className="crm-footer-btn">
            <Button onClick={this.onCancel}>取消</Button>
            <Button type="primary" htmlType="submit">保存</Button>
          </div>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(TemplateModal);
