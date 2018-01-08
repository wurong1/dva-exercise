import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, DatePicker, Button, Table, Spin, TreeSelect, Modal } from 'antd';
import moment from 'moment';
import CascadeSelect from '../../components/select-cascade';
import './report.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;

class AssignReport extends Component {

  componentDidMount() {
    this.props.getEmployeeGroupId();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          ...values,
          autoAssginDateRange: convertDate(values.autoAssginDateRange),
          pageNo: 1,
          pageSize: 50,
        };
        this.props.getRecords(params);
      }
    });
  }

  // 触发二级select框接收新的props
  handleChange = () => {
    this.setState(preState => ({ chageFlag: !preState.chageFlag }));
  }

  handleTableChange = (pagination) => {
    const { formData } = this.props;
    const { current, pageSize } = pagination;
    const params = {
      ...formData,
      pageNo: current,
      pageSize,
    };
    this.props.getRecords(params);
  }

  clearRecord = () => {
    const { resetFields } = this.props.form;
    resetFields();
    this.props.clearRecord();
  }

  disabledDate = (current) => {
    return current && current.valueOf() > moment().endOf('day').valueOf();
  }

  exportReportList = () => {
    const { getFieldsValue } = this.props.form;
    const values = getFieldsValue();
    const params = {
      ...values,
      autoAssginDateRange: convertDate(values.autoAssginDateRange),
    };
    this.props.exportReportList(params);
  }

  downloadReportList = () => {
    this.props.downloadReportList();
  }

  deleteFile = (id, e) => {
    const { deleteFile } = this.props;
    e.preventDefault();
    confirm({
      title: '确认删除?',
      okText: '是',
      cancelText: '否',
      onOk() {
        deleteFile(id);
      },
      onCancel() {
      },
    });
  }

  deleteAll = () => {
    const { deleteAll } = this.props;
    confirm({
      title: '确认全部删除?',
      okText: '是',
      cancelText: '否',
      onOk() {
        deleteAll();
      },
      onCancel() {
      },
    });
  }

  handleCancel = () => {
    this.props.closeModal();
  }

  handleOk = () => {
    this.props.closeModal();
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const employeeIdOptions = {
      remote: '/borrower/getUserByGroupId?groupId={:val}',
      parentName: 'employeeGroupId',
      parentValue: getFieldValue('employeeGroupId'),
    };
    const {
      dataSource: {
        pageNo = 1,
        pageSize = 50,
        records = [],
        totalRecords = 0,
      },
      loading,
      loadingGroups,
      employeeGroups,
      btnLoading,
      visible,
      modalLading,
      fileList,
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
        title: '负责人组别',
        dataIndex: 'employeeGroupName',
        key: 'employeeGroupName',
      }, {
        title: '负责人',
        dataIndex: 'employeeName',
        key: 'employeeName',
      }, {
        title: '自动分配总数',
        render: (text, record) => (record.result && record.result.allCount) || 0,
      }, {
        title: '新注册任务',
        render: (text, record) => (record.result && record.result.NEWREGIST) || 0,
      }, {
        title: '引导进件任务',
        render: (text, record) => (record.result && record.result.LOANAPPGUIDED) || 0,
      }, {
        title: '审核跟进任务',
        render: (text, record) => (record.result && record.result.AUDITFOLLOWUP) || 0,
      }, {
        title: '签约任务',
        render: (text, record) => (record.result && record.result.sign) || 0,
      },
    ];

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
              href={`/borrower/v1/report/borrowtask/file/${record.id}`}
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
      <div className="task-report">
        <h3 className="dr-section-font">自动分配任务报表</h3>
        <Form
          layout="horizontal"
          onSubmit={this.handleSubmit}
        >
          <div className="crm-filter-box">
            <Row gutter={24}>
              <Col span={4}>
                <FormItem
                  label="分配时间"
                >
                  {getFieldDecorator('autoAssginDateRange', {
                    initialValue: [moment().subtract(1, 'months'), moment()],
                  })(
                    <RangePicker disabledDate={this.disabledDate} />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <Spin spinning={loadingGroups}>
                  <FormItem
                    label="负责人组别"
                  >
                    {getFieldDecorator('employeeGroupId', {
                      initialValue: '',
                    })(
                      <TreeSelect
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={employeeGroups}
                        treeDefaultExpandAll={false}
                        onChange={this.handleChange.bind(this)}
                        allowClear
                      />,
                      )}
                  </FormItem>
                </Spin>
              </Col>
              <Col span={3}>
                <FormItem
                  label="负责人"
                >
                  {getFieldDecorator('employeeId', {
                    initialValue: '',
                  })(
                    <CascadeSelect {...employeeIdOptions} />,
                    )}
                </FormItem>
              </Col>
            </Row>
          </div>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
            >
              搜索
            </Button>
          </FormItem>
        </Form>
        <Button className="btn-clear" onClick={this.clearRecord.bind(this)}>
          清空
        </Button>
        <div className="btn-group">
          <Button
            onClick={this.exportReportList}
            loading={btnLoading}
          >
            导出报表
          </Button>
          {<Button onClick={this.downloadReportList}>下载</Button>}
        </div>
        <Table
          columns={columns}
          dataSource={records || []}
          onChange={this.handleTableChange}
          pagination={pagination}
          loading={loading}
          size="middle"
        />
        <Modal
          title="下载导出列表"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Spin spinning={modalLading}>
            {
              (fileList.totalRecords || 0) > 0 ?
                <div>
                  <Table
                    columns={downloadColumns}
                    dataSource={fileList.records || []}
                    size="middle"
                  />
                  <Button onClick={this.deleteAll.bind(this)}>删除全部</Button>
                </div>
                :
                <div>暂无可导出的报表,请确认导出后重试</div>
            }
          </Spin>
        </Modal>
      </div>
    );
  }
}

function convertDate(date) {
  let startDate;
  let endDate;
  if (!date) {
    return '';
  } else {
    startDate = date[0] && +date[0].startOf('day');
    endDate = date[1] && +date[1].endOf('day');
    return `${startDate}-${endDate}`;
  }
}

export default connect(
  state => ({
    formData: state.assignReport.formData,
    dataSource: state.assignReport.dataSource,
    loadingGroups: state.assignReport.loadingGroups,
    loading: state.assignReport.loading,
    btnLoading: state.assignReport.btnLoading,
    employeeGroups: state.assignReport.employeeGroups,
    modalLading: state.assignReport.modalLading,
    visible: state.assignReport.visible,
    fileList: state.assignReport.fileList,
  }),
  dispatch => ({
    getRecords: params => dispatch({ type: 'assignReport/getRecords', payload: params }),
    clearRecord: () => dispatch({ type: 'assignReport/clearRecord' }),
    getEmployeeGroupId: () => dispatch({ type: 'assignReport/getEmployeeGroupId' }),
    exportReportList: params => dispatch({ type: 'assignReport/exportReportList', payload: params }),
    downloadReportList: () => dispatch({ type: 'assignReport/downloadReportList' }),
    closeModal: () => dispatch({ type: 'assignReport/closeModal' }),
    deleteAll: () => dispatch({ type: 'assignReport/deleteAll' }),
    deleteFile: params => dispatch({ type: 'assignReport/deleteFile', payload: params }),
  }),
)(Form.create()(AssignReport));

