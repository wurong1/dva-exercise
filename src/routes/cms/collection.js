import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { hashHistory } from 'react-router';
import moment from 'moment';
import { Table, Form, Button, Row, Col, Select } from 'antd';

import './cms.less';

const FormItem = Form.Item;
const Option = Select.Option;

class CollectionPage extends Component {

  state = {

  };

  componentDidMount() {

  }

  getTypeById = (val) => {
    const { getCollectionType, resetCollectionProject, resetCollectionTypeList,
      form: { setFieldsValue } } = this.props;
    if (val) {
      setFieldsValue({ columnId: '' });
      setFieldsValue({ projectId: '' });
      getCollectionType(val);
      resetCollectionProject();
    } else {
      setFieldsValue({ columnId: '' });
      setFieldsValue({ projectId: '' });
      resetCollectionTypeList();
      resetCollectionProject();
    }
  }

  getProjectById = (val) => {
    const { getCollectionProject, resetCollectionProject, form: { setFieldsValue } } = this.props;
    if (val) {
      setFieldsValue({ columnId: '' });
      setFieldsValue({ projectId: '' });
      getCollectionProject(val);
    } else {
      setFieldsValue({ projectId: '' });
      resetCollectionProject();
    }
  }

  getPaginationData(pageNo, pageSize) {
    const { search, form: { getFieldsValue } } = this.props;
    const resultData = dealData(getFieldsValue(), { pageNo, pageSize });
    search(resultData);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { search, form: { getFieldsValue } } = this.props;
    const resultData = dealData(getFieldsValue(), { pageNo: 1, pageSize: 50 });
    search(resultData);
  };

  handleReset = () => {
    const { collectionReset, form: { resetFields } } = this.props;
    resetFields();
    collectionReset();
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { search, searchList: { records }, form: { getFieldsValue } } = this.props;
    if (records && records.length > 0) {
      const formData = getFieldsValue();
      const resultData = formData;
      if (sorter.order) {
        resultData.column = sorter && sorter.columnKey;
        resultData.order = sorter.order === 'ascend' ? 'ASC' : 'DESC';
        search(dealData(resultData, { pageNo: 1, pageSize: 50 }));
      }
    }
  }

  show = (id) => {
    hashHistory.push(`/articleDetail?id=${id}`);
  }

  delete = (id) => {
    const { deleteCollection } = this.props;
    deleteCollection(id);
  }

  render() {
    const { collectionTypeList, collectionProjectList, searchList, searchLoading,
      form: { getFieldDecorator } } = this.props;
    const total = searchList.totalRecords || null;
    const pagination = {
      total: searchList.totalRecords || 0,
      current: searchList.pageNo || 1,
      pageSize: searchList.pageSize || 50,
      onChange: (pageNo, pageSize) => this.getPaginationData(pageNo, pageSize),
      showTotal: num => `总条数:  ${num}`,
    };
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      }, {
        title: '标题',
        dataIndex: 'title',
      }, {
        title: '信息类别',
        dataIndex: 'categoryCode',
      }, {
        title: '类别',
        dataIndex: 'columnName',
      }, {
        title: '项目',
        dataIndex: 'projectName',
      }, {
        title: '创建人',
        dataIndex: 'createdBy',
      }, {
        title: '创建时间',
        dataIndex: 'createdDate',
        sorter: true,
        render: text => <p>{text ? moment(Number(text)).format('YYYY-MM-DD HH:mm:ss') : ''}</p>,
      }, {
        title: '查看次数',
        dataIndex: 'clickVolume',
      }, {
        title: '收藏次数',
        dataIndex: 'collectionTimes',
      }, {
        title: '状态',
        dataIndex: 'status',
        render: (text) => text === 'Y' ? '启用' : '禁用',
      }, {
        title: '操作',
        dataIndex: '',
        render: (text, records) => <div>
          <Link target="_blank" to={`/articleDetail?id=${records.id}`} className="cms-link" >查看</Link>
          <Button value={records.id} style={{ marginLeft: '4px' }} onClick={e => this.delete(e.target.value)} type="primary" ghost >{records.collected ? '取消收藏' : '收藏'}</Button>
        </div>,
      },
    ];
    return (
      <div className="cms">
        <h3 className="dr-section-font">我的收藏</h3>
        <div>
          <Form onSubmit={this.handleSubmit} className="crm-filter-box">
            <Row gutter={16}>
              <Col span={3}>
                <FormItem label="信息类别">
                  {getFieldDecorator('categoryCode', {
                    initialValue: '',
                    onChange: value => this.getTypeById(value),
                  })(
                    <Select>
                      <Option value="">全部</Option>
                      <Option value="NOTICE">公告</Option>
                      <Option value="REPOSITORY">知识库</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="类别">
                  {getFieldDecorator('columnId', {
                    initialValue: '',
                    onChange: value => this.getProjectById(value),
                  })(
                    <Select disabled={collectionTypeList && collectionTypeList.length <= 0}>
                      <Option value="">全部</Option>
                      {
                        collectionTypeList && collectionTypeList.map((val) => {
                          return <Option key={val.id} value={val.id}>{val.label}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="项目">
                  {getFieldDecorator('projectId', {
                    initialValue: '',
                  })(
                    <Select disabled={collectionProjectList && collectionProjectList.length <= 0}>
                      <Option value="">全部</Option>
                      {
                        collectionProjectList && collectionProjectList.map((val) => {
                          return <Option key={val.id} value={val.id}>{val.label}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row style={{ marginTop: '5px' }}>
              <Button type="primary" htmlType="submit">搜索</Button>
              <a onClick={this.handleReset} className="btn-link">清空</a>
            </Row>
          </Form>
        </div>
        <div>
          <Table
            className="crm-table"
            dataSource={searchList && searchList.records}
            columns={columns}
            loading={searchLoading}
            pagination={pagination}
            onChange={this.handleTableChange}
          />
        </div>
      </div>
    );
  }
}

CollectionPage.propTypes = {
};

export default connect(
  state => ({
    collectionTypeList: state.collection.collectionTypeList,
    collectionProjectList: state.collection.collectionProjectList,
    searchList: state.collection.searchList,
    searchLoading: state.collection.searchLoading,
  }),
  dispatch => ({
    getCollectionType: (params) => {
      dispatch({ type: 'collection/getCollectionType', payload: params });
    },
    getCollectionProject: (params) => {
      dispatch({ type: 'collection/getCollectionProject', payload: params });
    },
    resetCollectionTypeList: () => {
      dispatch({ type: 'collection/resetCollectionTypeList' });
    },
    resetCollectionProject: () => {
      dispatch({ type: 'collection/resetCollectionProject' });
    },
    search: (params) => {
      dispatch({ type: 'collection/search', payload: params });
    },
    deleteCollection: (params) => {
      dispatch({ type: 'collection/deleteCollection', payload: params });
    },
    collectionReset: () => {
      dispatch({ type: 'collection/collectionReset' });
    },
  }),
)(Form.create()(CollectionPage));

function dealData(formData, pageData) {
  const resultData = formData;
  resultData.pageNo = pageData.pageNo;
  resultData.pageSize = pageData.pageSize;
  return resultData;
}
