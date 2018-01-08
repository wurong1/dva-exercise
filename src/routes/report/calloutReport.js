import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { DatePicker, Table, Form, Button, Select, TreeSelect, Input, Row, Col, Spin, Modal } from 'antd';

import './report.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const numberReg = /^([1-9]\d*|[0]{1,1})$/;
const columns = [
  {
    title: '姓名',
    dataIndex: 'employeeName',
    key: 'employeeName',
    width: 150,
  }, {
    title: '组别',
    dataIndex: 'employeeGroupName',
    key: 'employeeGroupName',
  }, {
    title: '外呼客户总数',
    dataIndex: 'customerCallTotal',
    key: 'customerCallTotal',
    width: 150,
  }, {
    title: '接通客户总数',
    dataIndex: 'customerCallSuccess',
    key: 'customerCallSuccess',
    width: 150,
  }, {
    title: '客户接通率',
    dataIndex: 'customerCallSuccessRate',
    key: 'customerCallSuccessRate',
    width: 150,
  }, {
    title: '外呼总次数',
    dataIndex: 'callTotal',
    key: 'callTotal',
    width: 150,
  }, {
    title: '接通总次数',
    dataIndex: 'callSuccess',
    key: 'callSuccess',
    width: 150,
  }, {
    title: '外呼总时长',
    dataIndex: 'callTotalTime',
    key: 'callTotalTime',
    width: 150,
  }, {
    title: '平均通话时长',
    dataIndex: 'callAverageTime',
    key: 'callAverageTime',
    width: 150,
  },
];

class CalloutReport extends Component {

  state = {
    pageNo: 1,
    pageSize: 50,
  };

  componentDidMount() {
    const { getEmployeeGroup } = this.props;
    getEmployeeGroup();
  }

  getEmployeeList = (val) => {
    const { getEmployee, resetEmployeeId, form: { setFieldsValue } } = this.props;
    if (val) {
      getEmployee(val);
    } else {
      resetEmployeeId();
    }
    setFieldsValue({ employeeId: '' });
  }

  getPaginationData(pageNo, pageSize) {
    const { searchCalloutList, form: { getFieldsValue } } = this.props;
    const formData = getFieldsValue();
    const params = dealData(formData, { pageNo, pageSize });
    searchCalloutList(params);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { getCalloutInfo, searchCalloutList, form: { validateFields } } = this.props;
    this.setState({
      pageNo: 1,
      pageSize: 50,
    }, () => {
      validateFields((err, value) => {
        if (!err) {
          const resultData = dealData(value, this.state);
          getCalloutInfo(resultData);
          searchCalloutList(resultData);
        }
      });
    });
  };

  exportReportList = () => {
    const { exportCallout, form: { validateFields } } = this.props;
    validateFields((err, value) => {
      if (!err) {
        const resultData = dealData(value, this.state);
        exportCallout(resultData);
      }
    });
  }

  downloadReportList = () => {
    const { exportCalloutList } = this.props;
    exportCalloutList();
  }

  deleteFile = (id, e) => {
    const { deleteCallout } = this.props;
    e.preventDefault();
    Modal.confirm({
      title: '确认删除?',
      okText: '是',
      cancelText: '否',
      onOk() {
        deleteCallout(id);
      },
      onCancel() {
      },
    });
  }

  deleteAll = () => {
    const { deleteCalloutAll } = this.props;
    Modal.confirm({
      title: '确认全部删除?',
      okText: '是',
      cancelText: '否',
      onOk() {
        deleteCalloutAll();
      },
      onCancel() {
      },
    });
  }

  closeModal = () => {
    const { closecalloutModal } = this.props;
    closecalloutModal();
  }

  handleReset = () => {
    const { resetCalloutList, form: { resetFields } } = this.props;
    this.setState({
      pageNo: 1,
      pageSize: 50,
    }, () => {
      resetFields();
      resetCalloutList();
    });
  };

  render() {
    const { employeeGroupList, employeeList, calloutInfo, searchList, searchLoading,
      calloutInfoLoading, calloutExportLoading, isDownloadModalShow, deleteStatus,
      calloutExportList, form: { getFieldDecorator } } = this.props;
    const isInfoShow = Object.keys(calloutInfo).length > 0 || false;
    const pagination = {
      total: searchList.totalRecords || 0,
      current: searchList.pageNo || 1,
      pageSize: searchList.pageSize || 50,
      onChange: (page, pageSize) => this.getPaginationData(page, pageSize),
    };
    const downloadColumns = [{
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
    }, {
      title: '导出时间',
      dataIndex: 'creationDate',
      key: 'creationDate',
      render: (text) => { return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''; },
    }, {
      title: '状态',
      dataIndex: 'fileStatus',
      key: 'fileStatus',
      render: (text) => {
        return text === 'GENERATE_SUCCESS' ? '成功' : '生成中';
      },
    }, {
      title: '操作',
      render: (text, record) => {
        return record.fileStatus === 'GENERATE_SUCCESS' ?
          <span className="a-operate">
            <a
              href={`/borrower/v1/report/call/file/${record.id}`}
            >
              下载
            </a>
            <a
              className="delete"
              onClick={e => this.deleteFile(record.id, e)}
            >
              删除
            </a>
          </span> : '';
      },
    }];
    return (
      <div className="callout-report task-report">
        <h3>通话统计报表</h3>
        <Form onSubmit={this.handleSubmit}>
          <div style={{ marginTop: '20px' }} className="crm-filter-box">
            <FormItem label="通话时间" className="input-2">
              {getFieldDecorator('callTimeRange')(
                <RangePicker />,
              )}
            </FormItem>
            <span style={{ position: 'relative' }}>
              <FormItem label="平均通话时长(分钟)" className="input-1">
                {getFieldDecorator('averageTimeMinuteStart', {
                  rules: [{ pattern: numberReg, message: '请输入整数！' }],
                })(
                  <Input />,
                )}
              </FormItem>
              <span className="double-input">~</span>
              <FormItem label=" " colon={false} className="input-1">
                {getFieldDecorator('averageTimeMinuteEnd', {
                  rules: [{ pattern: numberReg, message: '请输入整数！' }],
                })(
                  <Input />,
                )}
              </FormItem>
            </span>
            <FormItem label="负责人组别" className="input-1">
              {getFieldDecorator('employeeGroupId')(
                <TreeSelect
                  treeData={employeeGroupList}
                  dropdownMatchSelectWidth={false}
                  treeDefaultExpandAll={false}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  allowClear
                  onChange={this.getEmployeeList.bind(this)}
                />,
              )}
            </FormItem>
            <FormItem label="负责人" className="input-1">
              {getFieldDecorator('employeeId', {
                initialValue: '',
              })(
                <Select disabled={employeeList && employeeList.length <= 0}>
                  <Option value="">全部</Option>
                  {
                    employeeList && employeeList.map((val) => {
                      return <Option key={val.id} value={val.id}>{val.name}</Option>;
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </div>
          <FormItem style={{ paddingLeft: '0px' }}>
            <Button
              type="primary"
              htmlType="submit"
            >
              搜索
            </Button>
          </FormItem>
        </Form>
        <Button className="btn-clear" onClick={this.handleReset}>
          清空
        </Button>
        <div className="btn-group">
          <Button onClick={this.exportReportList} loading={calloutExportLoading}>导出报表</Button>
          <Button onClick={this.downloadReportList}>下载</Button>
        </div>
        {
          isInfoShow ?
            <Spin spinning={calloutInfoLoading}>
              <div className="info-readonly">
                <Row>
                  <Col span={3}>
                    <p>外呼客户总数</p>
                    <span>{ calloutInfo && calloutInfo.totalCustomer }</span>
                  </Col>
                  <Col span={3}>
                    <p>接通客户总数</p>
                    <span>{ calloutInfo && calloutInfo.customerCallSuccess }</span>
                  </Col>
                  <Col span={3}>
                    <p>客户接通率</p>
                    <span>{ calloutInfo && calloutInfo.customerCallRate }</span>
                  </Col>
                  <Col span={3}>
                    <p>外呼总次数</p>
                    <span>{ calloutInfo && calloutInfo.callTotal }</span>
                  </Col>
                  <Col span={3}>
                    <p>接通总次数</p>
                    <span>{ calloutInfo && calloutInfo.callSuccess }</span>
                  </Col>
                  <Col span={3}>
                    <p>外呼总时长</p>
                    <span>{ calloutInfo && calloutInfo.totalTime }</span>
                  </Col>
                  <Col span={3}>
                    <p>平均通话时长</p>
                    <span>{ calloutInfo && calloutInfo.averageTime }</span>
                  </Col>
                </Row>
              </div>
            </Spin>
            : null
        }
        <div>
          <Table
            className="crm-table"
            dataSource={searchList && searchList.records}
            columns={columns}
            loading={searchLoading}
            pagination={pagination}
            scroll={{ x: 1400, y: 650 }}
          />
          {
            searchList.totalRecords ?
              <span style={{ position: 'relative', top: '-40px' }}>{`总条数：${searchList.totalRecords}`}</span>
            : null
          }
        </div>
        <Modal
          title="下载导出列表"
          visible={isDownloadModalShow}
          onCancel={this.closeModal}
          footer={null}
        >
          <Spin spinning={deleteStatus}>
            <div>
              <Table
                columns={downloadColumns}
                dataSource={calloutExportList && calloutExportList.records}
                size="middle"
              />
              <Button onClick={this.deleteAll.bind(this)}>删除全部</Button>
            </div>
          </Spin>
        </Modal>
      </div>
    );
  }
}

CalloutReport.propTypes = {
};

export default connect(
  state => ({
    employeeGroupList: state.calloutReport.employeeGroupList,
    employeeList: state.calloutReport.employeeList,
    calloutInfo: state.calloutReport.calloutInfo,
    searchList: state.calloutReport.calloutList,
    calloutInfoLoading: state.calloutReport.calloutInfoLoading,
    searchLoading: state.calloutReport.calloutListLoading,
    calloutExportLoading: state.calloutReport.calloutExportLoading,
    isDownloadModalShow: state.calloutReport.isDownloadModalShow,
    deleteStatus: state.calloutReport.deleteStatus,
    calloutExportList: state.calloutReport.calloutExportList,
  }),
  dispatch => ({
    getEmployeeGroup: () => {
      dispatch({ type: 'calloutReport/getEmployeeGroup' });
    },
    getEmployee: (params) => {
      dispatch({ type: 'calloutReport/getEmployee', payload: params });
    },
    getCalloutInfo: (params) => {
      dispatch({ type: 'calloutReport/getCalloutInfo', payload: params });
    },
    searchCalloutList: (params) => {
      dispatch({ type: 'calloutReport/searchCalloutList', payload: params });
    },
    resetCalloutList: () => {
      dispatch({ type: 'calloutReport/resetCalloutList' });
    },
    resetEmployeeId: () => {
      dispatch({ type: 'calloutReport/resetEmployeeId' });
    },
    exportCallout: (params) => {
      dispatch({ type: 'calloutReport/exportCallout', payload: params });
    },
    exportCalloutList: () => {
      dispatch({ type: 'calloutReport/exportCalloutList' });
    },
    deleteCallout: (params) => {
      dispatch({ type: 'calloutReport/deleteCallout', payload: params });
    },
    deleteCalloutAll: () => {
      dispatch({ type: 'calloutReport/deleteCalloutAll' });
    },
    closecalloutModal: () => {
      dispatch({ type: 'calloutReport/closecalloutModal' });
    },
  }),
)(Form.create()(CalloutReport));

function dealData(formData, pageData) {
  const resultData = formData;
  for (const x in resultData) {
    if (['callTimeRange'].indexOf(x) > -1 && resultData[x]) {
      if (resultData[x].length > 0) {
        const start = +resultData[x][0].startOf('day');
        const end = +resultData[x][1].startOf('day') + 86399999;
        resultData[x] = `${start}-${end}`;
      } else {
        delete resultData[x];
      }
    }
  }
  resultData.pageNo = pageData.pageNo;
  resultData.pageSize = pageData.pageSize;
  return resultData;
}
