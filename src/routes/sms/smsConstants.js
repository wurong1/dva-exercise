import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Table, Spin, Tooltip, Modal, Icon } from 'antd';
import moment from 'moment';
import TrimInput from '../../components/input-trim';
import './sms.less';

const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
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
class SmsConstants extends Component {

  componentDidMount() {
    this.props.getConstansList({ pageNo: 1, pageSize: 50 });
  }

  onCancel = () => {
    this.props.closeEditModal();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(['constantName', 'description'], (err, values) => {
      if (!err) {
        this.props.addConstants({
          constantName: values.constantName,
          description: values.description,
        });
      }
    });
  }

  handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    const params = {
      pageNo: current,
      pageSize,
    };
    this.props.getConstansList(params);
  }

  handleTextChange = (e) => {
    const description = e.target.value;
    this.setState({ description });
  }

  showEditModal = (id) => {
    this.props.getConstantsDetail(id);
  }

  showAddMoal = (flag) => {
    const { resetFields } = this.props.form;
    resetFields();
    this.props.showAddMoal(flag);
  }

  updateConstants = (e) => {
    e.preventDefault();
    const { detail: { constantName, id }, updateConstants } = this.props;
    this.props.form.validateFieldsAndScroll([`description-${id}`], (err, values) => {
      if (!err) {
        updateConstants({ id, constantName, description: values[`description-${id}`] });
      }
    });
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
      detail,
      addVisible,
      loadingAdd,
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
        title: '常量名称',
        dataIndex: 'constantName',
        key: 'constantName',
      }, {
        title: '内容或描述',
        dataIndex: 'description',
        key: 'description',
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
        dataIndex: 'updateBy',
        key: 'updateBy',
      }, {
        title: '修改时间',
        dataIndex: 'updatedDate',
        key: 'updatedDate',
        render: text => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
      }, {
        title: '常量类型',
        dataIndex: 'variabled',
        key: 'variabled',
        render: text => `${text ? '普通常量' : '系统常量'}`,
      }, {
        title: '操作',
        render: (text, record) => {
          return (
            <div>
              {
                record.variabled &&
                <Button onClick={this.showEditModal.bind(this, record.id)} type="primary" ghost>编辑</Button>
              }
            </div>
          );
        },
      },
    ];

    return (
      <div className="sms">
        <h3 className="dr-section-font">消息常量管理</h3>
        <Button onClick={this.showAddMoal.bind(this, true)} type="primary" style={{ marginBottom: '20px' }}>
          <Icon type="plus" />新建常量
        </Button>
        <Table
          columns={columns}
          dataSource={records || []}
          onChange={this.handleTableChange}
          pagination={pagination}
          loading={loading}
          rowKey={(record, idx) => idx}
          size="middle"
          className="sms-table"
        />
        <Modal
          title="编辑常量"
          visible={detail.visible}
          onCancel={this.onCancel.bind(this)}
          footer={null}
        >
          <Spin spinning={detail.loading}>
            <Form onSubmit={this.updateConstants}>
              <FormItem
                {...formItemLayout}
                label="常量名称"
              >
                {getFieldDecorator(`constantName-${detail.id}`, {
                  initialValue: detail.constantName,
                })(
                  <Input disabled />,
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="常量内容"
              >
                {getFieldDecorator(`description-${detail.id}`, {
                  initialValue: detail.description,
                  rules: [{
                    required: true, message: '不能为空',
                  }],
                })(
                  <TextArea />,
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <div className="crm-footer-btn">
                  <Button onClick={this.onCancel.bind(this)}>取消</Button>
                  <Button type="primary" htmlType="submit">保存</Button>
                </div>
              </FormItem>
            </Form>
          </Spin>
        </Modal>
        <Modal
          title="新增常量"
          visible={addVisible}
          onCancel={this.showAddMoal.bind(this, false)}
          footer={null}
        >
          <Spin spinning={loadingAdd} >
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                label="常量名称"
              >
                {getFieldDecorator('constantName', {
                  rules: [{
                    required: true, message: '不能为空',
                  }],
                })(
                  <TrimInput />,
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="常量内容"
              >
                {getFieldDecorator('description', {
                  rules: [{
                    required: true, message: '不能为空',
                  }],
                })(
                  <TextArea />,
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <div className="crm-footer-btn">
                  <Button onClick={this.showAddMoal.bind(this, false)}>取消</Button>
                  <Button type="primary" htmlType="submit">保存</Button>
                </div>
              </FormItem>
            </Form>
          </Spin>
        </Modal>
      </div>
    );
  }
}

export default connect(
  state => ({
    dataSource: state.smsConstants.dataSource,
    loading: state.smsConstants.loading,
    detail: state.smsConstants.detail,
    addVisible: state.smsConstants.addVisible,
    loadingAdd: state.smsConstants.loadingAdd,
  }),
  dispatch => ({
    getConstansList: params => dispatch({ type: 'smsConstants/getConstansList', payload: params }),
    getConstantsDetail: params => dispatch({ type: 'smsConstants/getConstantsDetail', payload: params }),
    closeEditModal: () => dispatch({ type: 'smsConstants/closeEditModal' }),
    updateConstants: params => dispatch({ type: 'smsConstants/updateConstants', payload: params }),
    showAddMoal: params => dispatch({ type: 'smsConstants/showAddMoal', payload: params }),
    addConstants: params => dispatch({ type: 'smsConstants/addConstants', payload: params }),
  }),
)(Form.create()(SmsConstants));
