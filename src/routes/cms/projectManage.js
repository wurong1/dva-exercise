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

class ProjectManagePage extends Component {

  state = {
    id: null,
    categoryCode: null,
    categoryName: null,
    parentId: null,
    label: null,
    description: null,
    columncategoryCode: 'PROJECT',
  };

  componentDidMount() {
    const { getProjectList } = this.props;
    const resultData = dealData({ categoryType: 'PROJECT' }, { pageNo: 1, pageSize: 50 });
    getProjectList(resultData);
  }

  getPaginationData(pageNo, pageSize) {
    const { getProjectList } = this.props;
    const resultData = dealData({ categoryType: 'PROJECT' }, { pageNo, pageSize });
    getProjectList(resultData);
  }

  getSortById = (val) => {
    const { getProjectType, resetProjectType } = this.props;
    if (val) {
      getProjectType(val);
    } else {
      resetProjectType();
    }
  }

  goSortManage = () => {
    hashHistory.push('/sortManage');
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
      parentId: records.parentId,
      label: records.label,
      description: records.description,
      columncategoryCode: 'PROJECT',
    });
    const { openEditModal, getProjectType } = this.props;
    openEditModal();
    getProjectType(records.categoryCode);
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
    const { editProject, form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const result = {
          ...values,
          id,
          categoryCode,
          columncategoryCode: 'PROJECT',
        };
        editProject(result);
      }
    });
  };

  saveAdd = (e) => {
    e.preventDefault();
    const { addProject, form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const result = {
          ...values,
          columncategoryCode: 'PROJECT',
        };
        addProject(result);
      }
    });
  };

  delete = (id) => {
    const { deleteProject } = this.props;
    Modal.confirm({
      title: '确定要删除吗？',
      onOk: () => {
        deleteProject(id);
      },
    });
  }

  render() {
    const { categoryName, label, description, parentId } = this.state;
    const { searchList, searchLoading, isEditModalShow, isAddModalShow, projectType,
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
        <h3>项目管理</h3>
        <div className="button-container">
          <div>
            <div className="cursor-div tab-default" onClick={this.goSortManage}>分类管理</div>
            <div className="cursor-div focus-btn tab-default">项目管理</div>
            <Button onClick={this.openAddModal} style={{ float: 'right' }}>新增项目</Button>
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
            <Modal title="编辑项目" width={400} onCancel={this.closeEditModal} footer={null} visible={isEditModalShow}>
              <Form onSubmit={this.saveEdit}>
                <span>{`分类所属:${categoryName}`}</span>
                <FormItem label="分类名称">
                  {getFieldDecorator('parentId', {
                    initialValue: parentId,
                    rules: [{ required: true, message: '必填项不能为空' }],
                  })(
                    <Select disabled={projectType && projectType.length <= 0}>
                      <Option value="">请选择</Option>
                      {
                        projectType && projectType.map((val) => {
                          return <Option key={val.id} value={val.id}>{val.label}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
                <FormItem label="项目名称">
                  {getFieldDecorator('label', {
                    initialValue: label,
                    rules: [{ required: true, message: '必填项不能为空' }],
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
            <Modal title="新增项目" width={400} onCancel={this.closeAddModal} footer={null} visible={isAddModalShow}>
              <Form onSubmit={this.saveAdd}>
                <FormItem label="分类所属">
                  {getFieldDecorator('categoryCode', {
                    initialValue: '',
                    rules: [{ required: true, message: '必填项不能为空' }],
                    onChange: value => this.getSortById(value),
                  })(
                    <Select>
                      <Option value="">请选择</Option>
                      <Option value="NOTICE">公告</Option>
                      <Option value="REPOSITORY">知识库</Option>
                    </Select>,
                  )}
                </FormItem>
                <FormItem label="分类名称">
                  {getFieldDecorator('parentId', {
                    initialValue: '',
                    rules: [{ required: true, message: '必填项不能为空' }],
                  })(
                    <Select disabled={projectType && projectType.length <= 0}>
                      <Option value="">请选择</Option>
                      {
                        projectType && projectType.map((val) => {
                          return <Option key={val.id} value={val.id}>{val.label}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
                <FormItem label="项目名称">
                  {getFieldDecorator('label', {
                    rules: [{ required: true, message: '必填项不能为空' }],
                  })(
                    <TrimInput />,
                  )}
                </FormItem>
                <FormItem label="描述">
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

ProjectManagePage.propTypes = {
};

export default connect(
  state => ({
    searchList: state.projectManage.projectList,
    searchLoading: state.projectManage.searchLoading,
    isEditModalShow: state.projectManage.isEditModalShow,
    isAddModalShow: state.projectManage.isAddModalShow,
    projectType: state.projectManage.projectType,
  }),
  dispatch => ({
    getProjectList: (params) => {
      dispatch({ type: 'projectManage/getProjectList', payload: params });
    },
    editProject: (params) => {
      dispatch({ type: 'projectManage/editProject', payload: params });
    },
    addProject: (params) => {
      dispatch({ type: 'projectManage/addProject', payload: params });
    },
    deleteProject: (params) => {
      dispatch({ type: 'projectManage/deleteProject', payload: params });
    },
    getProjectType: (params) => {
      dispatch({ type: 'projectManage/getProjectType', payload: params });
    },
    resetProjectType: (params) => {
      dispatch({ type: 'projectManage/resetProjectType', payload: params });
    },
    openEditModal: () => {
      dispatch({ type: 'projectManage/openEditModal' });
    },
    closeEditModal: () => {
      dispatch({ type: 'projectManage/closeEditModal' });
    },
    openAddModal: () => {
      dispatch({ type: 'projectManage/openAddModal' });
    },
    closeAddModal: () => {
      dispatch({ type: 'projectManage/closeAddModal' });
    },
  }),
)(Form.create()(ProjectManagePage));

function dealData(formData, pageData) {
  const resultData = formData;
  resultData.pageNo = pageData.pageNo;
  resultData.pageSize = pageData.pageSize;
  return resultData;
}
