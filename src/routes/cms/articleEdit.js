import React, { Component } from 'react';
import { connect } from 'dva';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Form, Input, Select, Checkbox, Button, Row, Col, Spin, Icon, Modal, message, Upload } from 'antd';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import request from '../../utils/request';
import './cms.less';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
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
      offset: 2,
    },
  },
};

class ArticleEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      disableColumn: false,
      disableProject: false,
      visiable: false,
      groupType: null,
      groupTarge: null,
    };
  }

  componentDidMount() {
    const { id } = this.props;
    this.props.getArticleDetail(id);
    this.props.getGroups();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.articleDetail !== this.props.articleDetail) {
      const html = nextProps.articleDetail.content || '';
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.setState({ editorState });
      }
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  }

  handleCategoryChange = (value) => {
    const { setFieldsValue } = this.props.form;
    if (value) {
      this.setState({ disableColumn: false });
      this.props.getColumnList(value);
    } else {
      this.setState({ disableColumn: true });
    }
    this.setState({ disableProject: true });
    setFieldsValue({ columnId: '', projectId: '' });
  }

  handleColumnChange = (value) => {
    const { setFieldsValue } = this.props.form;
    if (value) {
      this.setState({ disableProject: false });
      this.props.getProjectList(value);
    } else {
      this.setState({ disableProject: true });
    }
    setFieldsValue({ projectId: '' });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { editorState } = this.state;
    const { id, articleDetail: { attachments } } = this.props;
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    this.props.form.validateFields((error, values) => {
      if (!error) {
        const params = {
          value: { ...values, content, attachments },
          id,
        };
        this.props.saveInfo(params);
      }
    });
  }

  uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/borrower/v1/borrow-cms/image-upload');
        const data = new FormData();
        data.append('upfile', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          resolve({ data: { link: response.data && `//${response.data.url}` } });
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      },
    );
  }

  showModal = (e) => {
    e.preventDefault();
    this.setState({ visiable: true });
  }

  handleCancel = () => {
    this.setState({ visiable: false });
  }

  handleOk = () => {
    const { groupType, groupTarge } = this.state;
    if (groupType && groupTarge) {
      if (groupType.trim() && groupTarge.trim()) {
        this.props.addGroup({ groupType, groupTarge });
      } else {
        message.error('组类型、组Targe都不能为空!');
      }
    } else {
      message.error('组类型、组Targe都不能为空!');
    }
  }

  deletFile = (item) => {
    const { attachments } = this.props.articleDetail;
    this.props.deletFile(attachments.filter(file => file !== item));
  }

  preview = (item, e) => {
    e.preventDefault();
    const match = item.title && item.title.match(/^.+\.([A-Za-z]+)$/);
    const { id } = item;
    if (match && match.length > 1) {
      const type = match[1];
      if (['zip', 'rar', 'eml'].indexOf(type) > -1) {
        message.error('当前格式不支持预览');
      } else {
        // 浏览器会拦截异步请求弹窗，先打开空白页然后重定向到预览页面
        const newWin = window.open('/bcrm/preview.html');
        request(`/borrower/v1/borrow-cms/show-image?path=${item.path}&swfPath=${item.swfPath}`)
        .then((res) => {
          const { status, filePath } = res;
          if (status) {
            localStorage.setItem(`path_${id}`, filePath);
            newWin.location.href = `/bcrm/preview.html?id=${id}`;
          } else {
            message.error('该文件不支持预览！');
          }
        }).catch(() => {
        });
      }
    }
  }

  render() {
    const { editorState, disableColumn, disableProject, visiable } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {
      loading,
      articleDetail = {},
      columList,
      projectList,
      groupList,
      loadingColumn,
      loadingProject,
      loadingGroups,
      loadingModal,
      setLoadingState,
    } = this.props;
    const {
      categoryCode,
      title,
      columnId,
      groupIds = [],
      projectId,
      status,
      visibleScope,
      attachments = [],
    } = articleDetail;
    const departmentOptions = groupList.map(item => ({ label: item.groupType, value: item.id }));
    const toolbarOptions = [
      'inline',
      'blockType',
      'fontSize',
      'fontFamily',
      'list',
      'textAlign',
      'colorPicker',
      'link',
      'embedded',
      'image',
      'remove',
      'history',
    ];
    const self = this;
    const uploadProps = {
      name: 'files',
      action: '/borrower/v1/borrow-cms/borrow-files',
      multiple: true,
      onChange(info) {
        let res;
        setLoadingState(true);
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          res = info.file.response;
          if (res.code === 0) {
            self.props.uploadFiles(res.data || []);
            message.success(`${info.file.name} file uploaded successfully`);
          } else {
            setLoadingState(false);
            message.error(res.message);
          }
        } else if (info.file.status === 'error') {
          setLoadingState(false);
          message.error(`${info.file.name} file upload failed.`);
        }
      },
      showUploadList: false,
    };
    return (
      <div className="cms">
        <Spin spinning={loading}>
          <Row>
            <Col span={2}>
              <h3 className="cms-title">编辑</h3>
            </Col>
          </Row>
          <Form onSubmit={this.handleSubmit} className="cms-edit">
            <FormItem
              {...formItemLayout}
              label="标题"
            >
              {getFieldDecorator('title', {
                initialValue: title || '',
                rules: [{
                  required: true, message: '不能为空！',
                }],
              })(
                <Input />,
              )}
            </FormItem>
            <Spin spinning={loadingGroups}>
              <FormItem
                {...formItemLayout}
                label="部门"
              >
                {getFieldDecorator('groupIds', {
                  initialValue: groupIds,
                  rules: [{
                    required: true, message: '不能为空！',
                  }],
                })(
                  <CheckboxGroup options={departmentOptions} />,
                )}
              </FormItem>
            </Spin>
            <FormItem
              {...formItemLayout}
              label="信息类型"
            >
              {getFieldDecorator('categoryCode', {
                initialValue: categoryCode || '',
                rules: [{
                  required: true, message: '不能为空！',
                }],
              })(
                <Select onChange={this.handleCategoryChange}>
                  <Option value="">-请选择-</Option>
                  <Option value="NOTICE">公告</Option>
                  <Option value="REPOSITORY">知识库</Option>
                </Select>,
              )}
            </FormItem>
            <Spin spinning={loadingColumn}>
              <FormItem
                {...formItemLayout}
                label="类别"
              >
                {getFieldDecorator('columnId', {
                  initialValue: `${columnId || ''}`,
                  rules: [{
                    required: true, message: '不能为空！',
                  }],
                })(
                  <Select onChange={this.handleColumnChange} disabled={disableColumn}>
                    <Option value="">-请选择-</Option>
                    {
                      columList.map((item, idx) => {
                        return <Option value={`${item.id}`} key={idx}>{item.label}</Option>;
                      })
                    }
                  </Select>,
                )}
              </FormItem>
            </Spin>
            <Spin spinning={loadingProject}>
              <FormItem
                {...formItemLayout}
                label="项目"
              >
                {getFieldDecorator('projectId', {
                  initialValue: `${projectId || ''}`,
                  rules: [{
                    required: true, message: '不能为空！',
                  }],
                })(
                  <Select disabled={disableProject}>
                    <Option value="">-请选择-</Option>
                    {
                      projectList.map((item, idx) => {
                        return <Option value={`${item.id}`} key={idx}>{item.label}</Option>;
                      })
                    }
                  </Select>,
                )}
              </FormItem>
            </Spin>
            <FormItem
              {...formItemLayout}
              label="关键字"
            >
              {getFieldDecorator('keywords', {
                rules: [{
                  max: 5, message: '最多只能输入5个字符！',
                }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="可见范围"
            >
              {getFieldDecorator('visibleScope', {
                initialValue: `${visibleScope || ''}`,
                rules: [{
                  required: true, message: '不能为空！',
                }],
              })(
                <Select>
                  <Option value="">-请选择-</Option>
                  <Option value="0">所有人可见</Option>
                  <Option value="1">组长及以上可见</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="状态"
            >
              {getFieldDecorator('status', {
                initialValue: status || '',
                rules: [{
                  required: true, message: '不能为空！',
                }],
              })(
                <Select>
                  <Option value="">-请选择-</Option>
                  <Option value="Y">启用</Option>
                  <Option value="N">关闭</Option>
                </Select>,
              )}
            </FormItem>
            <Row>
              <Col span={2} style={{ textAlign: 'right' }}>
                <span className="cms-label">内容:</span>
              </Col>
              <Col offset={2}>
                <Editor
                  editorState={editorState}
                  editorClassName="article-editor"
                  onEditorStateChange={this.onEditorStateChange}
                  toolbar={{
                    image: {
                      uploadCallback: this.uploadImageCallBack,
                    },
                    options: toolbarOptions,
                  }}
                  onChange={this.handleChange}
                  localization={{ locale: 'zh' }}
                />
              </Col>
            </Row>
            <Row className="cms-file-section">
              <Col span={2} style={{ textAlign: 'right' }}>
                <span className="cms-label">附件:</span>
              </Col>
              <Col span={22} >
                <div>
                  <Upload {...uploadProps}>
                    <Button>
                      <Icon type="upload" /> 上传文件
                    </Button>
                  </Upload>
                </div>
                <div className="cms-file-list">
                  {
                    attachments.map((item, idx) => {
                      return (
                        <div key={idx} className="cms-file">
                          <p title={item.title}>{item.title && (item.title.length > 10 ? `${item.title.substr(0, 10)}...` : item.title)}</p>
                          <a href={`/borrower/v1/borrow-cms/load-file?path=${item.path}&title=${item.title}`}><Icon type="download" />下载</a>
                          {
                            item.id && <a onClick={this.preview.bind(this, item)}><Icon type="eye" />预览</a>
                          }
                          <a onClick={this.deletFile.bind(this, item)}><Icon type="close" />删除</a>
                        </div>
                      );
                    })
                  }
                </div>
              </Col>
            </Row>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">保存</Button>
            </FormItem>
          </Form>
        </Spin>
        <Modal
          title="新增部门"
          visible={visiable}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Spin spinning={loadingModal}>
            <div>
              <label htmlFor="groupType" style={{ }}>
                组类型:
              </label>
              <Input onChange={(e) => { this.setState({ groupType: e.target.value }); }} style={{ marginTop: '10px' }} />
            </div>
            <div>
              <label htmlFor="groupTarge">
                组Targe:
              </label>
              <Input onChange={(e) => { this.setState({ groupTarge: e.target.value }); }} style={{ marginTop: '10px' }} />
            </div>
          </Spin>
        </Modal>
      </div>
    );
  }
}

export default connect(
  state => ({
    loading: state.cmsDetail.loading,
    loadingColumn: state.cmsDetail.loadingColumn,
    loadingProject: state.cmsDetail.loadingProject,
    loadingGroups: state.cmsDetail.loadingGroups,
    loadingModal: state.cmsDetail.loadingModal,
    articleDetail: state.cmsDetail.articleDetail,
    columList: state.cmsDetail.columList || [],
    projectList: state.cmsDetail.projectList || [],
    groupList: state.cmsDetail.groupList || [],
    id: state.routing.locationBeforeTransitions.query.id,
  }),
  dispatch => ({
    getArticleDetail: params => dispatch({ type: 'cmsDetail/getArticleDetail', payload: params }),
    getColumnList: params => dispatch({ type: 'cmsDetail/getColumnList', payload: params }),
    getProjectList: params => dispatch({ type: 'cmsDetail/getProjectList', payload: params }),
    getGroups: () => dispatch({ type: 'cmsDetail/getGroups' }),
    addGroup: params => dispatch({ type: 'cmsDetail/addGroup', payload: params }),
    saveInfo: params => dispatch({ type: 'cmsDetail/saveInfo', payload: params }),
    uploadFiles: params => dispatch({ type: 'cmsDetail/uploadFiles', payload: params }),
    deletFile: params => dispatch({ type: 'cmsDetail/deletFile', payload: params }),
    setLoadingState: params => dispatch({ type: 'cmsDetail/setLoadingState', payload: params }),
  }),
)(Form.create()(ArticleEdit));
