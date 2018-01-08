import React, { Component } from 'react';
import { connect } from 'dva';
import { hashHistory } from 'react-router';
import { Link } from 'dva/router';
import moment from 'moment';
import { DatePicker, Table, Form, Button, Row, Col, Select, Modal } from 'antd';

import TrimInput from '../../components/input-trim';
import './cms.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class KnowledgePage extends Component {

  state = {

  };

  componentDidMount() {
    const { getKnowledgeType, knowledgeOperateAuth } = this.props;
    getKnowledgeType('REPOSITORY');
    knowledgeOperateAuth();
  }

  getProjectId = (val) => {
    const { getKnowledgeProject, resetKnowledgeProject, form: { setFieldsValue } } = this.props;
    if (val) {
      getKnowledgeProject(val);
    } else {
      resetKnowledgeProject();
    }
    setFieldsValue({ projectId: '' });
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
    const { knowledgeReset, form: { resetFields } } = this.props;
    resetFields();
    knowledgeReset();
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

  addKnowledge= () => {
    hashHistory.push('/article-add');
  }

  show = (id) => {
    hashHistory.push(`/articleDetail?id=${id}`);
  }

  edit = (id) => {
    hashHistory.push(`/articleEdit?id=${id}`);
  }

  delete = (id) => {
    const { deleteKnowledge } = this.props;
    Modal.confirm({
      title: '确定要删除吗？',
      onOk: () => {
        deleteKnowledge(id);
      },
    });
  }

  top = (params) => {
    const { topKnowledge } = this.props;
    const top = !(params.split('-')[1] === 'true');
    const resultData = {
      id: params.split('-')[0],
      top,
    };
    topKnowledge(resultData);
  }

  collect = (params) => {
    const { collectKnowledge } = this.props;
    const collected = params.split('-')[1] === 'null';
    const resultData = {
      id: params.split('-')[0],
      collected,
    };
    collectKnowledge(resultData);
  }

  operateAuthFun = (records, list) => {
    const { id, top, collected } = records;
    const isCollected = collected !== null;
    return list.map((val) => {
      switch (val) {
        case 'SHOW':
          return <Link target="_blank" to={`/articleDetail?id=${id}`} className="cms-link">查看</Link>;
        case 'EDIT':
          return <Link target="_blank" to={`/articleEdit?id=${id}`} className="cms-link">编辑</Link>;
        case 'DELETE':
          return <Button style={{ marginLeft: '4px' }} value={id} onClick={e => this.delete(e.target.value)} type="primary" ghost >删除</Button>;
        case 'TOP':
          return <Button style={{ marginLeft: '4px' }} value={`${id}-${top}`} onClick={e => this.top(e.target.value)} type="primary" ghost >{top ? '取消置顶' : '置顶'}</Button>;
        case 'COLLECT':
          return <Button style={{ marginLeft: '4px' }} value={`${id}-${collected}`} onClick={e => this.collect(e.target.value)} type="primary" ghost >{isCollected ? '取消收藏' : '收藏'}</Button>;
        default: return null;
      }
    });
  }

  render() {
    const { knowledgeTypeList, knowledgeProjectList, operateAuthList, searchList, searchLoading,
      form: { getFieldDecorator } } = this.props;
    const pagination = {
      total: searchList.totalRecords || 0,
      current: searchList.pageNo || 1,
      pageSize: searchList.pageSize || 50,
      onChange: (pageNo, pageSize) => this.getPaginationData(pageNo, pageSize),
      showTotal: total => `总条数:  ${total}`,
    };
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      }, {
        title: '标题',
        dataIndex: 'title',
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
        title: '修改人',
        dataIndex: 'updatedBy',
      }, {
        title: '修改时间',
        dataIndex: 'updatedDate',
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
        render: (text, records) => this.operateAuthFun(records, operateAuthList),
      },
    ];
    return (
      <div className="cms">
        <h3 className="dr-section-font">知识库</h3>
        <div>
          <Form onSubmit={this.handleSubmit} className="crm-filter-box">
            <Row gutter={16}>
              <Col span={4}>
                <FormItem label="创建时间">
                  {getFieldDecorator('createdDate')(
                    <RangePicker />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="创建人">
                  {getFieldDecorator('createdBy')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="标题">
                  {getFieldDecorator('title')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="关键字">
                  {getFieldDecorator('keywords')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="类别">
                  {getFieldDecorator('columnId', {
                    onChange: value => this.getProjectId(value),
                  })(
                    <Select>
                      <Option value="">全部</Option>
                      {
                        knowledgeTypeList && knowledgeTypeList.map((val) => {
                          return <Option key={val.id} value={`${val.id}`}>{val.label}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="项目">
                  {getFieldDecorator('projectId')(
                    <Select disabled={knowledgeProjectList && knowledgeProjectList.length <= 0}>
                      <Option value="">全部</Option>
                      {
                        knowledgeProjectList && knowledgeProjectList.map((val) => {
                          return <Option key={val.id} value={val.id}>{val.label}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Button type="primary" htmlType="submit">查询</Button>
              <a onClick={this.handleReset} className="btn-link">清空</a>
              <Link to="/article-add">新增知识</Link>
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

KnowledgePage.propTypes = {
};

export default connect(
  state => ({
    knowledgeTypeList: state.knowledge.knowledgeTypeList,
    knowledgeProjectList: state.knowledge.knowledgeProjectList,
    operateAuthList: state.knowledge.operateAuthList,
    searchList: state.knowledge.searchList,
    searchLoading: state.knowledge.searchLoading,
  }),
  dispatch => ({
    getKnowledgeType: (params) => {
      dispatch({ type: 'knowledge/getKnowledgeType', payload: params });
    },
    getKnowledgeProject: (params) => {
      dispatch({ type: 'knowledge/getKnowledgeProject', payload: params });
    },
    resetKnowledgeProject: () => {
      dispatch({ type: 'knowledge/resetKnowledgeProject' });
    },
    knowledgeOperateAuth: (params) => {
      dispatch({ type: 'knowledge/knowledgeOperateAuth', payload: params });
    },
    search: (params) => {
      dispatch({ type: 'knowledge/search', payload: params });
    },
    deleteKnowledge: (params) => {
      dispatch({ type: 'knowledge/deleteKnowledge', payload: params });
    },
    topKnowledge: (params) => {
      dispatch({ type: 'knowledge/topKnowledge', payload: params });
    },
    collectKnowledge: (params) => {
      dispatch({ type: 'knowledge/collectKnowledge', payload: params });
    },
    knowledgeReset: () => {
      dispatch({ type: 'knowledge/knowledgeReset' });
    },
  }),
)(Form.create()(KnowledgePage));

function dealData(formData, pageData) {
  const resultData = formData;
  for (const x in resultData) {
    if (['createdDate'].indexOf(x) > -1 && resultData[x]) {
      if (resultData[x].length > 0) {
        const startDay = +resultData[x][0].startOf('day');
        const endDay = +resultData[x][1].startOf('day') + 86399999;
        resultData.createdDateStart = startDay;
        resultData.createdDateEnd = endDay;
        delete resultData[x];
      } else {
        delete resultData[x];
      }
    }
  }
  resultData.column = formData.column;
  resultData.order = formData.order;
  resultData.pageNo = pageData.pageNo;
  resultData.pageSize = pageData.pageSize;
  return resultData;
}
