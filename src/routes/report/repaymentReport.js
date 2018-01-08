import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Button, Row, Col, DatePicker, TreeSelect, Table, Modal, Spin, Tooltip } from 'antd';
import moment from 'moment';

import TrimInput from '../../components/input-trim';
import MultipleSelect from '../../components/select-multiple';
import './report.less';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const columns = [{
  title: '贷款申请ID',
  dataIndex: 'loanAppId',
  width: 100,
  fixed: 'left',
  key: 'loanAppId',
}, {
  title: '贷款ID',
  dataIndex: 'loanId',
  width: 100,
  fixed: 'left',
  key: 'loanId',
}, {
  title: '借款人姓名',
  dataIndex: 'name',
  width: 150,
  key: 'name',
}, {
  title: '证件号码',
  dataIndex: 'idCard',
  width: 120,
  key: 'idCard',
}, {
  title: '手机号码',
  dataIndex: 'cellPhone',
  width: 150,
  key: 'cellPhone',
}, {
  title: '贷款申请城市',
  dataIndex: 'appCity',
  width: 100,
  key: 'appCity',
}, {
  title: '用户名',
  dataIndex: 'customerName',
  width: 200,
  key: 'customerName',
}, {
  title: '贷款金额',
  dataIndex: 'loanAmount',
  width: 100,
  key: 'loanAmount',
}, {
  title: '贷款类型',
  dataIndex: 'loanType',
  width: 100,
  key: 'loanType',
}, {
  title: '贷款产品',
  dataIndex: 'loanProduct',
  width: 150,
  key: 'loanProduct',
}, {
  title: '贷款申请状态',
  dataIndex: 'loanAppStatus',
  width: 150,
  key: 'loanAppStatus',
}, {
  title: '贷款状态',
  dataIndex: 'loanStatus',
  width: 150,
  key: 'loanStatus',
}, {
  title: '第一还款日',
  dataIndex: 'firstRepaymentDate',
  width: 100,
  key: 'firstRepaymentDate',
  render: (text) => text ? moment(text).format('YYYY-MM-DD') : '',
}, {
  title: '下一还款日',
  dataIndex: 'nextRepaymentDate',
  width: 100,
  key: 'nextRepaymentDate',
  render: (text) => text ? moment(text).format('YYYY-MM-DD') : '',
}, {
  title: '还款日',
  dataIndex: 'repaymentDay',
  key: 'repaymentDay',
  width: 100,
  render: (text) => text ? moment(text).format('YYYY-MM-DD') : '',
}, {
  title: '已还期数',
  dataIndex: 'repaymentPeriod',
  width: 100,
  key: 'repaymentPeriod',
}, {
  title: '剩余期数',
  dataIndex: 'remainRepaymentPeriod',
  width: 100,
  key: 'remainRepaymentPeriod',
}, {
  title: '本期应还',
  dataIndex: 'currentRepaymentAmount',
  width: 100,
  key: 'currentRepaymentAmount',
}, {
  title: '剩余本金',
  dataIndex: 'remainPrincipal',
  width: 100,
  key: 'remainPrincipal',
}, {
  title: '代扣银行',
  dataIndex: 'withHoldBank',
  width: 100,
  key: 'withHoldBank',
}, {
  title: '代扣账户后四位',
  dataIndex: 'withHoldBackCard',
  width: 150,
  key: 'withHoldBackCard',
}, {
  title: '历史逾期数',
  dataIndex: 'overdueNumber',
  width: 100,
  key: 'overdueNumber',
}, {
  title: '录单人',
  dataIndex: 'recordEmployee',
  width: 100,
  key: 'recordEmployee',
}, {
  title: '用户所属销售',
  dataIndex: 'salesEmployeeName',
  width: 200,
  key: 'salesEmployeeName',
}, {
  title: '用户所属销售组别',
  dataIndex: 'salesEmployeeGroupName',
  width: 200,
  key: 'salesEmployeeGroupName',
}, {
    title: '贷款所属销售',
    dataIndex: 'loanEmployeeName',
    width: 200,
    key: 'loanEmployeeName',
}, {
    title: '贷款所属销售组别',
    dataIndex: 'loanEmployeeGroupName',
    width: 200,
    key: 'loanEmployeeGroupName',
}, {
  title: '营业部',
  dataIndex: 'businessDepartment',
  width: 200,
  key: 'businessDepartment',
}];

class RepaymentReport extends Component {

  state = {

  };
  
  componentWillMount() {
    const { getLoanType } = this.props;
    getLoanType();
  }

  getPaginationData = (pageNo, pageSize) => {
    const { repaySearch, form: { validateFields } } = this.props;
    validateFields((err, value) => {
        if(!err){
          value.pageNo = pageNo;
          value.pageSize = pageSize;
          repaySearch(value);
        }
    })
  }


  handleSubmit = (e) => {
    e.preventDefault();
    const { repaySearch, form: { validateFields } } = this.props;
    validateFields((err, value) => {
        if(!err){
          value.pageNo = 1;
          value.pageSize = 50;
          repaySearch(value);
        }
    })
  }


  exportReportList = () => {
    const { repaymentExport, form: { validateFields } } = this.props;
    validateFields((err, value) => {
        if(!err){
          repaymentExport(value);
        }
    })
  }

  downloadReportList = () => {
    const { getRepaymentDownloadList } = this.props;
    getRepaymentDownloadList();
  }

  deleteFile = (id, e) => {
    const { repaymentDelete } = this.props;
    e.preventDefault();
    confirm({
      title: '确认删除?',
      okText: '是',
      cancelText: '否',
      onOk() {
        repaymentDelete(id);
      },
      onCancel() {
      },
    });
  }

  deleteAll = () => {
    const { repaymentDeleteAll } = this.props;
    confirm({
      title: '确认全部删除?',
      okText: '是',
      cancelText: '否',
      onOk() {
        repaymentDeleteAll();
      },
      onCancel() {
      },
    });
  }

  clearData =() => {
    const { repaymentReset, form:{ resetFields } } = this.props;
    resetFields();
    repaymentReset();
  }

  handleOk = () => {
    const { closeRepaymentModal } = this.props;
    closeRepaymentModal();
  }

  handleCancel = () => {
    const { closeRepaymentModal } = this.props;
    closeRepaymentModal();
  }

  render() {
    const { loanTypeList, repaySearchList, repaySearchLoading, repaymentExportStatus, 
      repaymentDownloadList, repaymentDownloadStatus, form:{getFieldDecorator, getFieldValue} } = this.props;
    const repaySearchRecords = (repaySearchList && repaySearchList.records) || [];
    const repaySearchTotalRecords = (repaySearchList && repaySearchList.totalRecords) || 0;
    const repaymentDownloadRecords = (repaymentDownloadList && repaymentDownloadList.records) || [];
    const pagination = {
      total: repaySearchList.totalRecords ? repaySearchList.totalRecords : 0,
      defaultPageSize: repaySearchList.pageSize ? repaySearchList.pageSize : 50,
      onChange: (pageNo, pageSize) => this.getPaginationData(pageNo, pageSize),
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
              href={`/borrower/v1/report/loanrepayment/file/${record.id}`}
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
      <div className="dr-layout task-report">
        <h3>还款提醒表</h3>
        <Form
          layout="horizontal"
          onSubmit={this.handleSubmit}
        >
          <div className="filter-box">
            <Row gutter={24}>
              <Col span={4}>
                <FormItem
                  label="贷款申请ID"
                >
                  {getFieldDecorator('loanAppId')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="贷款ID"
                >
                  {getFieldDecorator('loanId')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>  
              <Col span={4}>
                <FormItem
                  label="下一还款日"
                >
                  {getFieldDecorator('nextRepaymentDay')(
                    <RangePicker
                      format={dateFormat}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="贷款产品"
                >
                  {getFieldDecorator('productCode', {
                    initialValue: [],
                  })(
                    <MultipleSelect options={loanTypeList} />,
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
        <Button className="btn-clear" onClick={this.clearData}>
          清空
        </Button>
        <div className="btn-group">
          <Button onClick={this.exportReportList} loading={repaymentExportStatus}>导出报表</Button>
          <Button onClick={this.downloadReportList}>下载</Button>
        </div>
        <Table
          columns={columns}
          dataSource={repaySearchRecords}
          pagination={pagination}
          scroll={{ x: 3700, y: 650 }}
          size="middle"
          loading={repaySearchLoading}
        />
        {
          repaySearchTotalRecords > 0 ?
            <div className="total-num">
              <div>总条数： <span>{ repaySearchTotalRecords }</span></div>
            </div>
            : ''
        }
        <Modal
          title="下载导出列表"
          visible={repaymentDownloadStatus}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Spin spinning={false}>
            <div>
              <Table
              columns={downloadColumns}
              dataSource={repaymentDownloadRecords}
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

export default connect(
  state => ({
    loanTypeList: state.report.loanTypeList,
    repaySearchList: state.report.repaySearchList,
    repaySearchLoading: state.report.repaySearchLoading,
    repaymentExportStatus: state.report.repaymentExportStatus,
    repaymentDownloadList: state.report.repaymentDownloadList,
    repaymentDownloadStatus: state.report.repaymentDownloadStatus,
  }),
  dispatch => ({
    getLoanType: () => dispatch({ type: 'report/getLoanType' }),
    repaySearch: (formData) => {
      const resultData = formData;
      for (const x in resultData) {
        if (['nextRepaymentDay'].indexOf(x) > -1 && resultData[x]) {
          if (resultData[x].length > 0) {
            const startDay = +resultData[x][0].startOf('day');
            const endDay = +resultData[x][1].startOf('day') + 86400000;
            resultData[x] = `${startDay}-${endDay}`;
          } else {
            delete resultData[x];
          }
        }
      }
      dispatch({ type: 'report/repaySearch', payload: resultData })
    },
    repaymentExport: (formData) => {
      const resultData = formData;
      for (const x in resultData) {
        if (['nextRepaymentDay'].indexOf(x) > -1 && resultData[x]) {
          if (resultData[x].length > 0) {
            const startDay = +resultData[x][0].startOf('day');
            const endDay = +resultData[x][1].startOf('day') + 86400000;
            resultData[x] = `${startDay}-${endDay}`;
          } else {
            delete resultData[x];
          }
        }
      }
      dispatch({ type: 'report/repaymentExport', payload: formData })},
    getRepaymentDownloadList: () => dispatch({ type: 'report/getRepaymentDownloadList' }),
    repaymentReset: () => dispatch({ type: 'report/repaymentReset' }),
    repaymentDelete: (id) => dispatch({ type: 'report/repaymentDelete',payload: id }),
    repaymentDeleteAll: () => dispatch({ type: 'report/repaymentDeleteAll' }),
    closeRepaymentModal: () => dispatch({ type: 'report/closeRepaymentModal' }),
  }),
)(Form.create()(RepaymentReport));

