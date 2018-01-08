import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Modal, Form, Select, Input, Spin, Icon } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

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

class CmsGroup extends Component {

  componentDidMount() {
    this.props.getDataSource({ pageNo: 1, pageSize: 50 });
    this.props.getTagList();
  }

  handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    const params = {
      pageNo: current,
      pageSize,
    };
    this.props.getDataSource(params);
  }

  showModal = (flag) => {
    const { resetFields } = this.props.form;
    resetFields();
    this.props.showModal(flag);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(['groupTarge', 'groupType'], (err, values) => {
      if (!err) {
        this.props.addGroup(values);
      }
    });
  }

  editGroup= (e) => {
    const { id } = this.props.detailValue;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll([`groupTarge-${id}`, `groupType-${id}`], (err, values) => {
      if (!err) {
        this.props.editGroup({
          groupTarge: values[`groupTarge-${id}`],
          groupType: values[`groupType-${id}`],
          id,
        });
      }
    });
  }

  showEditModal = (item) => {
    this.props.showEditModal(item);
  }

  closeEditModal = () => {
    this.props.closeEditModal();
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
      visible,
      tagList,
      loadingModal,
      detailValue,
     } = this.props;
    const { id, groupTarge, groupType } = detailValue;
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
        title: '组名称',
        dataIndex: 'groupType',
        key: 'groupType',
      }, {
        title: '组TAG',
        dataIndex: 'groupTarge',
        key: 'groupTarge',
      }, {
        title: '操作',
        render: (text, record) => <Button type="primary" ghost onClick={this.showEditModal.bind(this, record)}>修改</Button>,
      },
    ];

    return (
      <div className="sms">
        <h3 className="dr-section-font">公告知识库组管理</h3>
        <div style={{ textAlign: 'right' }}>
          <Button onClick={this.showModal.bind(this, true)} type="primary"><Icon type="plus" />新增</Button>
        </div>
        <Table
          columns={columns}
          dataSource={records || []}
          onChange={this.handleTableChange}
          pagination={pagination}
          loading={loading}
          rowKey={(record, idx) => idx}
          size="middle"
          className="sms-table"
          style={{ marginTop: '10px' }}
        />
        <Modal
          title="新增"
          visible={visible}
          onOk={this.showModal.bind(this, false)}
          onCancel={this.showModal.bind(this, false)}
          footer={null}
        >
          <Spin spinning={loadingModal}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                label="组名称"
              >
                {getFieldDecorator('groupType', {
                  rules: [{
                    required: true, message: '不能为空',
                  }],
                })(
                  <Input />,
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="组TAG"
              >
                {getFieldDecorator('groupTarge', {
                  initialValue: '',
                  rules: [{
                    required: true, message: '不能为空',
                  }],
                })(
                  <Select>
                    <Option value="">-请选择-</Option>
                    {
                      tagList.map((item, idx) =>
                        <Option value={item} key={idx}>{item}</Option>,
                      )
                    }
                  </Select>,
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <div className="crm-footer-btn">
                  <Button onClick={this.showModal.bind(this, false)}>取消</Button>
                  <Button type="primary" htmlType="submit">保存</Button>
                </div>
              </FormItem>
            </Form>
          </Spin>
        </Modal>
        <Modal
          title="编辑"
          visible={detailValue.visible}
          onOk={this.closeEditModal}
          onCancel={this.closeEditModal}
          footer={null}
        >
          <Spin spinning={detailValue.loading}>
            <Form onSubmit={this.editGroup}>
              <FormItem
                {...formItemLayout}
                label="组名称"
              >
                {getFieldDecorator(`groupType-${id}`, {
                  initialValue: groupType,
                  rules: [{
                    required: true, message: '不能为空',
                  }],
                })(
                  <Input />,
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="组TAG"
              >
                {getFieldDecorator(`groupTarge-${id}`, {
                  initialValue: groupTarge,
                  rules: [{
                    required: true, message: '不能为空',
                  }],
                })(
                  <Select>
                    <Option value="">-请选择-</Option>
                    {
                      tagList.map((item, idx) =>
                        <Option value={item} key={idx}>{item}</Option>,
                      )
                    }
                  </Select>,
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <div className="crm-footer-btn">
                  <Button onClick={this.closeEditModal}>取消</Button>
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
    dataSource: state.smsGroup.dataSource || {},
    loading: state.smsGroup.loading,
    visible: state.smsGroup.visible,
    tagList: state.smsGroup.tagList,
    loadingModal: state.smsGroup.loadingModal,
    detailValue: state.smsGroup.detailValue,
  }),
  dispatch => ({
    getDataSource: params => dispatch({ type: 'smsGroup/getDataSource', payload: params }),
    showModal: params => dispatch({ type: 'smsGroup/showModal', payload: params }),
    getTagList: () => dispatch({ type: 'smsGroup/getTagList' }),
    addGroup: params => dispatch({ type: 'smsGroup/addGroup', payload: params }),
    showEditModal: params => dispatch({ type: 'smsGroup/showEditModal', payload: params }),
    editGroup: params => dispatch({ type: 'smsGroup/editGroup', payload: params }),
    closeEditModal: () => dispatch({ type: 'smsGroup/closeEditModal' }),
  }),
)(Form.create()(CmsGroup));
