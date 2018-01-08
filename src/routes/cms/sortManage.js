import React, { Component } from 'react';
import { connect } from 'dva';
import { hashHistory } from 'react-router';
import moment from 'moment';
import { Table, Form, Button, Row, Col, Select, Modal, Input } from 'antd';

import TrimInput from '../../components/input-trim';
import './cms.less';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

class SortManagePage extends Component {

  state = {
    id: null,
    categoryCode: null,
    categoryName: null,
    label: null,
    description: null,
  };

  componentDidMount() {
    const { getSortList } = this.props;
    const resultData = dealData({ categoryType: 'CATEGORY' }, { pageNo: 1, pageSize: 50 });
    getSortList(resultData);
  }

  getPaginationData(pageNo, pageSize) {
    const { getSortList } = this.props;
    const resultData = dealData({ categoryType: 'CATEGORY' }, { pageNo, pageSize });
    getSortList(resultData);
  }

  goProjectManage = () => {
    hashHistory.push('/projectManage');
  }

  openAddModal = () => {
    const { openAddModal } = this.props;
    openAddModal();
  }

  openEditModal = (records) => {
    this.setState({
      id: records.id,
      categoryCode: records.categoryCode,
      categoryName: records.categoryName,
      label: records.label,
      description: records.description,
    });
    const { openEditModal } = this.props;
    openEditModal();
  }

  closeEditModal = () => {
    const { closeEditModal } = this.props;
    closeEditModal();
  }

  closeAddModal = () => {
    const { closeAddModal } = this.props;
    closeAddModal();
  }

  saveEdit = (e) => {
    e.preventDefault();
    const { id, categoryCode } = this.state;
    const { editSort, form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const result = {
          ...values,
          id,
          categoryCode,
          columncategoryCode: 'CATEGORY',
        };
        editSort(result);
      }
    });
  };

  saveAdd = (e) => {
    e.preventDefault();
    const { addSort, form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const result = {
          ...values,
          columncategoryCode: 'CATEGORY',
        };
        addSort(result);
      }
    });
  };

  delete = (id) => {
    const { deleteSort } = this.props;
    Modal.confirm({
      title: '确定要删除吗？',
      onOk: () => {
        deleteSort(id);
      },
    });
  }

  render() {
    const { categoryName, label, description } = this.state;
    const { searchList, searchLoading, isEditModalShow, isAddModalShow,
      form: { getFieldDecorator } } = this.props;
    const total = searchList.totalRecords || null;
    const pagination = {
      total: searchList.totalRecords || 0,
      current: searchList.pageNo || 1,
      pageSize: searchList.pageSize || 50,
      onChange: (pageNo, pageSize) => this.getPaginationData(pageNo, pageSize),
    };
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      }, {
        title: '分类名称',
        dataIndex: 'label',
      }, {
        title: '分类所属',
        dataIndex: 'categoryName',
      }, {
        title: '描述',
        dataIndex: 'description',
      }, {
        title: '创建人',
        dataIndex: 'createdBy',
      }, {
        title: '创建时间',
        dataIndex: 'createdDate',
        render: text => <p>{text ? moment(Number(text)).format('YYYY-MM-DD HH:mm:ss') : ''}</p>,
      }, {
        title: '修改人',
        dataIndex: 'updatedBy',
      }, {
        title: '修改时间',
        dataIndex: 'updatedDate',
        render: text => <p>{text ? moment(Number(text)).format('YYYY-MM-DD HH:mm:ss') : ''}</p>,
      }, {
        title: '操作',
        dataIndex: '',
        render: (text, records) => <div>
          <Button onClick={() => this.openEditModal(records)}>编辑</Button>
          <Button value={records.id} style={{ marginLeft: '4px' }} onClick={e => this.delete(e.target.value)}>删除</Button>
        </div>,
      },
    ];
    return (
      <div className="cms">
        <h3>分类管理</h3>
        <div className="button-container">
          <div>
            <div className="cursor-div focus-btn tab-default">分类管理</div>
            <div className="cursor-div tab-default" onClick={this.goProjectManage}>项目管理</div>
            <Button onClick={this.openAddModal} style={{ float: 'right' }}>新增分类</Button>
          </div>
        </div>
        <div>
          <Table
            className="crm-table"
            dataSource={searchList && searchList.records}
            columns={columns}
            loading={searchLoading}
            pagination={pagination}
          />
          {
            total ?
              <span>{`总条数:${total}`}</span>
              : null
          }
        </div>
        {
          isEditModalShow ?
            <Modal title="编辑分类" width={400} onCancel={this.closeEditModal} footer={null} visible={isEditModalShow}>
              <Form onSubmit={this.saveEdit}>
                <span>{`分类所属:${categoryName}`}</span>
                <FormItem label="分类名称">
                  {getFieldDecorator('label', {
                    rules: [{ required: true, message: '必填项不能为空' }],
                    initialValue: label,
                  })(
                    <TrimInput />,
                  )}
                </FormItem>
                <FormItem label="分类描述">
                  {getFieldDecorator('description', {
                    rules: [{ required: true, message: '必填项不能为空' }],
                    initialValue: description,
                  })(
                    <TextArea />,
                  )}
                </FormItem>
                <Button type="primary" htmlType="submit">保存</Button>
                <a onClick={this.closeEditModal} className="btn-link">取消</a>
              </Form>
            </Modal>
          : null
        }
        {
          isAddModalShow ?
            <Modal title="新增分类" width={400} onCancel={this.closeAddModal} footer={null} visible={isAddModalShow}>
              <Form onSubmit={this.saveAdd}>
                <FormItem label="分类所属">
                  {getFieldDecorator('categoryCode', {
                    rules: [{ required: true, message: '必填项不能为空' }],
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">请选择</Option>
                      <Option value="NOTICE">公告</Option>
                      <Option value="REPOSITORY">知识库</Option>
                    </Select>,
                  )}
                </FormItem>
                <FormItem label="分类名称">
                  {getFieldDecorator('label', {
                    rules: [{ required: true, message: '必填项不能为空' }],
                  })(
                    <TrimInput />,
                  )}
                </FormItem>
                <FormItem label="分类描述">
                  {getFieldDecorator('description')(
                    <TextArea />,
                  )}
                </FormItem>
                <Button type="primary" htmlType="submit">保存</Button>
                <a onClick={this.closeAddModal} className="btn-link">取消</a>
              </Form>
            </Modal>
            : null
        }
      </div>
    );
  }
}

SortManagePage.propTypes = {
};

export default connect(
  state => ({
    searchList: state.sortManage.sortList,
    searchLoading: state.sortManage.searchLoading,
    isEditModalShow: state.sortManage.isEditModalShow,
    isAddModalShow: state.sortManage.isAddModalShow,
  }),
  dispatch => ({
    getSortList: (params) => {
      dispatch({ type: 'sortManage/getSortList', payload: params });
    },
    editSort: (params) => {
      dispatch({ type: 'sortManage/editSort', payload: params });
    },
    addSort: (params) => {
      dispatch({ type: 'sortManage/addSort', payload: params });
    },
    deleteSort: (params) => {
      dispatch({ type: 'sortManage/deleteSort', payload: params });
    },
    openEditModal: () => {
      dispatch({ type: 'sortManage/openEditModal' });
    },
    closeEditModal: () => {
      dispatch({ type: 'sortManage/closeEditModal' });
    },
    openAddModal: () => {
      dispatch({ type: 'sortManage/openAddModal' });
    },
    closeAddModal: () => {
      dispatch({ type: 'sortManage/closeAddModal' });
    },
  }),
)(Form.create()(SortManagePage));

function dealData(formData, pageData) {
  const resultData = formData;
  resultData.pageNo = pageData.pageNo;
  resultData.pageSize = pageData.pageSize;
  return resultData;
}
