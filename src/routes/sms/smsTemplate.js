import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Row, Col, Select, Button, Table, Spin, Tooltip, Modal, Icon } from 'antd';
import moment from 'moment';
import TrimInput from '../../components/input-trim';
import TemplateModal from './templateModal';
import './sms.less';


const FormItem = Form.Item;
const Option = Select.Option;

class SmsTemplate extends Component {

  componentDidMount() {
    this.props.getSteps();
    this.props.getScopes();
    this.props.getEnablestatus();
    this.props.getPrivilege(); // 获取操作权限
  }

  onCancel= () => {
    this.props.onCancel();
  }

  cancelEdit = () => {
    this.props.cancelEdit();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          ...values,
          pageNo: 1,
          pageSize: 50,
        };
        this.props.getTemplateList(params);
      }
    });
  }

  handleTableChange = (pagination) => {
    const { formData } = this.props;
    const { current, pageSize } = pagination;
    const params = {
      ...formData,
      pageNo: current,
      pageSize,
    };
    this.props.getTemplateList(params);
  }

  clearRecord = () => {
    const { resetFields } = this.props.form;
    resetFields();
    this.props.clearRecord();
  }

  showModal = () => {
    this.props.getTemplateFields();
  }

  showEditModal = (id) => {
    this.setState({ id });
    this.props.getEditFields(id);
  }

  createTemplate = (values) => {
    this.props.createTemplate(values);
  }

  editTemplate = (values) => {
    const { id } = this.state;
    this.props.editTemplate({ ...values, templateId: id });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      dataSource: {
        pageNo = 1,
        pageSize = 50,
        records = [],
        totalRecords = 0,
      },
      loading,
      stepList,
      scopeList,
      statusList,
      loadingSteps,
      loadingScopes,
      loadingStatus,
      hasPrivilege,
      templateFields,
     } = this.props;

    const pagination = {
      current: pageNo,
      total: totalRecords,
      showSizeChanger: true,
      pageSizeOptions: ['50', '80', '100'],
      pageSize,
      showTotal: total => `总条数：${total}`,
    };

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      }, {
        title: '模版名称',
        dataIndex: 'templateName',
        key: 'templateName',
        render: (text) => {
          return (
            <Tooltip title={text}>
              <span>{text && (text.length > 20 ? `${text.substr(0, 20)}...` : text) }</span>
            </Tooltip>
          );
        },
      }, {
        title: '创建人',
        dataIndex: 'createdBy',
        key: 'createdBy',
      }, {
        title: '创建时间',
        dataIndex: 'createdDate',
        key: 'createdDate',
        render: text => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
      }, {
        title: '修改人',
        dataIndex: 'updatedBy',
        key: 'updatedBy',
      }, {
        title: '修改时间',
        dataIndex: 'updateDate',
        key: 'updateDate',
        render: text => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: text => `${text === 'ENABLED' ? '启用' : '禁用'}`,
      }, {
        title: '操作',
        render: (text, record) => {
          return (
            <div>
              <Link to={`templateDetail?id=${record.id}`} target="_blank" className="sms-link">查看</Link>
              {
                hasPrivilege &&
                <Button onClick={this.showEditModal.bind(this, record.id)} type="primary" ghost>编辑</Button>
              }
            </div>
          );
        },
      },
    ];

    return (
      <div className="sms">
        <h3 className="dr-section-font">消息模板</h3>
        <Form
          layout="horizontal"
          onSubmit={this.handleSubmit}
        >
          <div className="crm-filter-box">
            <Row gutter={24}>
              <Col span={3}>
                <FormItem
                  label="模版名称"
                >
                  {getFieldDecorator('templateName')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <Spin spinning={loadingStatus}>
                  <FormItem
                    label="是否启用"
                  >
                    {getFieldDecorator('status', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">全部</Option>
                        {
                          statusList.map((item, idx) => {
                            return <Option value={item.code} key={idx}>{item.name}</Option>;
                          })
                        }
                      </Select>,
                    )}
                  </FormItem>
                </Spin>
              </Col>
              <Col span={3}>
                <Spin spinning={loadingScopes}>
                  <FormItem
                    label="业务使用范围"
                  >
                    {getFieldDecorator('scope', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">全部</Option>
                        {
                          scopeList.map((item, idx) => {
                            return <Option value={item.code} key={idx}>{item.name}</Option>;
                          })
                        }
                      </Select>,
                    )}
                  </FormItem>
                </Spin>
              </Col>
              <Col span={3}>
                <Spin spinning={loadingSteps}>
                  <FormItem
                    label="任务使用阶段"
                  >
                    {getFieldDecorator('step', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">全部</Option>
                        {
                          stepList.map((item, idx) => {
                            return <Option value={item.code} key={idx}>{item.name}</Option>;
                          })
                        }
                      </Select>,
                    )}
                  </FormItem>
                </Spin>
              </Col>
            </Row>
          </div>
          <FormItem className="sms-btn-group">
            <Button
              type="primary"
              htmlType="submit"
            >
              搜索
            </Button>
            <Button style={{ marginLeft: '30px' }} onClick={this.clearRecord}>
              清空
            </Button>
            {
              hasPrivilege &&
              <Button style={{ marginLeft: '30px' }} onClick={this.showModal} type="primary">
                <Icon type="plus" />创建模板
              </Button>
            }
            {
              hasPrivilege &&
              <Link to="/sms-constants" style={{ marginLeft: '15px' }}>管理消息常量</Link>
            }
          </FormItem>
        </Form>
        <div className="sms-table">
          <Table
            columns={columns}
            dataSource={records}
            onChange={this.handleTableChange}
            pagination={pagination}
            loading={loading}
            rowKey={(record, idx) => idx}
            size="middle"
          />
        </div>
        <Modal
          title="创建模板"
          visible={templateFields.visible}
          onCancel={this.onCancel}
          footer={null}
        >
          <Spin spinning={templateFields.loading}>
            <TemplateModal
              fields={templateFields}
              onSubmit={this.createTemplate}
              onCancel={this.onCancel}
              key={templateFields.visible}
              hasPrivilege={hasPrivilege}
            />
          </Spin>
        </Modal>
        <Modal
          title="编辑模板"
          visible={templateFields.editVisible}
          onCancel={this.cancelEdit}
          footer={null}
        >
          <Spin spinning={templateFields.editLoading}>
            <TemplateModal
              fields={templateFields}
              onSubmit={this.editTemplate}
              onCancel={this.cancelEdit}
              values={templateFields.detail}
              key={templateFields.editVisible}
              hasPrivilege={hasPrivilege}
            />
          </Spin>
        </Modal>
      </div>
    );
  }
}

export default connect(
  state => ({
    loading: state.smsTemplate.loading,
    dataSource: state.smsTemplate.dataSource,
    stepList: state.smsTemplate.stepList,
    scopeList: state.smsTemplate.scopeList,
    statusList: state.smsTemplate.statusList,
    loadingSteps: state.smsTemplate.loadingSteps,
    loadingScopes: state.smsTemplate.loadingScopes,
    loadingStatus: state.smsTemplate.loadingStatus,
    formData: state.smsTemplate.formData,
    hasPrivilege: state.smsTemplate.hasPrivilege,
    templateFields: state.smsTemplate.templateFields,
  }),
  dispatch => ({
    getTemplateList: params => dispatch({ type: 'smsTemplate/getTemplateList', payload: params }),
    getSteps: () => dispatch({ type: 'smsTemplate/getSteps' }),
    getScopes: () => dispatch({ type: 'smsTemplate/getScopes' }),
    getEnablestatus: () => dispatch({ type: 'smsTemplate/getEnablestatus' }),
    clearRecord: () => dispatch({ type: 'smsTemplate/clearRecord' }),
    getPrivilege: () => dispatch({ type: 'smsTemplate/getPrivilege' }),
    getTemplateFields: () => dispatch({ type: 'smsTemplate/getTemplateFields' }),
    createTemplate: params => dispatch({ type: 'smsTemplate/createTemplate', payload: params }),
    onCancel: () => dispatch({ type: 'smsTemplate/onCancel' }),
    getEditFields: params => dispatch({ type: 'smsTemplate/getEditFields', payload: params }),
    cancelEdit: () => dispatch({ type: 'smsTemplate/cancelEdit' }),
    editTemplate: params => dispatch({ type: 'smsTemplate/editTemplate', payload: params }),
  }),
)(Form.create()(SmsTemplate));

