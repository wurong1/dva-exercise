import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Input, Button, Spin, Upload, Icon, Select, message } from 'antd';
import './sms.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
class SmsSend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileName: '',
    };
  }

  componentDidMount() {
    this.props.getTemplates();// 获取消息类型列表
  }

  handleChange = (id) => {
    this.props.getContent(id);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.setLoadingState(true);
        const req = new XMLHttpRequest();
        req.open('POST', '/borrower/v1/sms/batch/batch-send', true);
        req.setRequestHeader('Accept-Language', 'zh-CN,zh;q=0.8,en;q=0.6');
        req.setRequestHeader('accept', 'application/json;charset=utf-8, text/javascript, */*;');
        const formData = new FormData();
        formData.append('smsBatchFile', this.smsBatchFile);
        formData.append('templateId', values.templateId);
        formData.append('content', values.content);
        req.send(formData);
        req.onreadystatechange = () => {
          if (req.readyState === 4) {
            this.props.setLoadingState(false);
            let res;
            try {
              res = JSON.parse(req.response);
            } catch (err) {
              res = {};
            }
            if (res.code !== 0) {
              message.error(res.message);
            } else {
              message.success(res.message);
            }
          }
        };
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, templates, contentVal } = this.props;
    const contentHtml = convertTohtml(contentVal);
    const self = this;
    const props = {
      showUploadList: false,
      customRequest(options) {
        const { file } = options;
        self.smsBatchFile = file;
        self.setState({ fileName: file.name });
      },
    };
    return (
      <div className="sms">
        <h3 className="dr-section-font">群发消息</h3>
        <Link to="/sms-faield-list">失败历史</Link>
        <Spin spinning={loading}>
          <Form onSubmit={this.handleSubmit} className="sms-section" style={{ marginTop: '10px' }}>
            <a href="/borrower/v1/sms/batch/download-template-borrow" className="download-link">下载模板</a>
            <FormItem
              label="批量上传客户"
            >
              {getFieldDecorator('smsBatchFile', {
                rules: [{
                  required: true, message: '不能为空!',
                }],
              })(
                <Upload {...props} >
                  <Button>
                    <Icon type="upload" /> 选择文件
                  </Button>
                </Upload>,
              )}
            </FormItem>
            <span>{this.state.fileName}</span>
            <FormItem
              label="消息类型"
            >
              {getFieldDecorator('templateId', {
                initialValue: '',
                rules: [{
                  required: true, message: '不能为空!',
                }],
              })(
                <Select onChange={this.handleChange}>
                  <Option value="">全部</Option>
                  {
                    templates.map((item, idx) => {
                      return <Option value={`${item.id}`} key={idx}>{item.name}</Option>;
                    })
                  }
                </Select>,
              )}
            </FormItem>
            <FormItem
              label="消息内容"
            >
              {getFieldDecorator('content', {
                initialValue: contentHtml,
              })(
                <TextArea rows={4} disabled />,
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <div className="crm-footer-btn">
                <Button type="primary" htmlType="submit">发送短信</Button>
              </div>
            </FormItem>
          </Form>
        </Spin>
      </div>
    );
  }
}

function convertTohtml(str) {
  const div = document.createElement('div');
  div.innerHTML = str;
  return div.innerText;
}

export default connect(
  state => ({
    loading: state.smsSend.loading,
    templates: state.smsSend.templates,
    contentVal: state.smsSend.contentVal,
  }),
  dispatch => ({
    getTemplates: () => dispatch({ type: 'smsSend/getTemplates' }),
    getContent: params => dispatch({ type: 'smsSend/getContent', payload: params }),
    setLoadingState: params => dispatch({ type: 'smsSend/setLoadingState', payload: params }),
  }),
)(Form.create()(SmsSend));
