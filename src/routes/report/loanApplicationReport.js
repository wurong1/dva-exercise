import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Button, Row, Col, DatePicker, TreeSelect, Table, Modal, Spin, Tooltip } from 'antd';
import moment from 'moment';
import TrimInput from '../../components/input-trim';
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
  dataIndex: 'customerName',
  width: 150,
  fixed: 'left',
  key: 'customerName',
}, {
  title: '借款人ID',
  dataIndex: 'actorId',
  width: 100,
  key: 'actorId',
}, {
  title: '手机号码',
  dataIndex: 'cellPhone',
  width: 150,
  key: 'cellPhone',
}, {
  title: '注册来源',
  dataIndex: 'clientSourceType',
  width: 100,
  key: 'clientSourceType',
}, {
  title: '贷款类型',
  dataIndex: 'loanType',
  width: 100,
  key: 'loanType',
}, {
  title: '贷款产品',
  dataIndex: 'productCode',
  width: 150,
  key: 'productCode',
}, {
  title: '贷款来源',
  dataIndex: 'loanAppSource',
  width: 100,
  key: 'loanAppSource',
}, {
  title: '申请金额',
  dataIndex: 'appAmount',
  width: 150,
  key: 'appAmount',
}, {
  title: '申请城市',
  dataIndex: 'appCity',
  width: 100,
  key: 'appCity',
}, {
  title: '贷款期限',
  dataIndex: 'maturity',
  width: 100,
  key: 'maturity',
  render: (text, record) => text ? `${text}${record.maturityType || ''}` : '',
}, {
  title: '年利率',
  dataIndex: 'intRate',
  width: 150,
  key: 'intRate',
}, {
  title: '贷款创建时间',
  dataIndex: 'appDate',
  width: 150,
  key: 'appDate',
  render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
}, {
  title: '贷款提交时间',
  dataIndex: 'submitDate',
  width: 150,
  key: 'submitDate',
  render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
}, {
  title: '贷款状态',
  dataIndex: 'loanAppStatus',
  key: 'loanAppStatus',
  width: 100,
}, {
  title: '申请状态变更时间',
  dataIndex: 'statusDate',
  width: 150,
  key: 'statusDate',
  render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
}, {
  title: '拒绝原因',
  dataIndex: 'extraMessage',
  width: 250,
  key: 'extraMessage',
  render: text => <Tooltip title={text && text.length > 18 ? text : ''}>
    <span>{text && text.length > 18 ? `${text.substring(0, 17)}...` : text}</span>
  </Tooltip>,
}, {
  title: '合同金额',
  dataIndex: 'contractAmount',
  width: 100,
  key: 'contractAmount',
  render: (text, record) => record && record.loanAppStatus === '已拒绝' ? '' : text,
}, {
  title: '批复金额',
  dataIndex: 'baseAmount',
  width: 150,
  key: 'baseAmount',
  render: (text, record) => record && record.loanAppStatus === '已拒绝' ? '' : text,
}, {
  title: '批复日期',
  dataIndex: 'baseDate',
  width: 150,
  key: 'baseDate',
  render: (text, record) => record && record.loanAppStatus === '已拒绝' ? '' : text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
}, {
  title: '放款日期',
  dataIndex: 'loanDate',
  width: 150,
  key: 'loanDate',
  render: (text, record) => record && record.loanAppStatus === '已拒绝' ? '' : text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
}, {
  title: '录单人',
  dataIndex: 'submitSales',
  width: 150,
  key: 'submitSales',
}, {
  title: '用户所属组别',
  dataIndex: 'actorEmployeeGroup',
  width: 150,
  key: 'actorEmployeeGroup',
}, {
  title: '用户所属销售',
  dataIndex: 'actorEmployee',
  width: 150,
  key: 'actorEmployee',
}, {
  title: '借款所属组别',
  dataIndex: 'loanEmployeeGroup',
  width: 150,
  key: 'loanEmployeeGroup',
}, {
  title: '借款所属销售',
  dataIndex: 'loanEmployee',
  width: 100,
  key: 'loanEmployee',
}, {
  title: '营业部',
  dataIndex: 'businessDepartment',
  width: 200,
  key: 'businessDepartment',
}];

class LoanApplicationReport extends Component {

  state = {

  };

  componentWillMount() {
    const { getEmployeeGroupId } = this.props;
    getEmployeeGroupId();
  }

  getPaginationData = (pageNo, pageSize) => {
    const { loanApplySearch, form: { validateFields } } = this.props;
    validateFields((err, value) => {
      if (!err) {
        value.pageNo = pageNo;
        value.pageSize = pageSize;
        loanApplySearch(value);
      }
    });
  }


  handleSubmit = (e) => {
    e.preventDefault();
    const { loanApplySearch, form: { validateFields } } = this.props;
    validateFields((err, value) => {
      if (!err) {
        value.pageNo = 1;
        value.pageSize = 50;
        loanApplySearch(value);
      }
    });
  }

  getEmployeeId = (id) => {
    const { getEmployeeId, clearEmployeeId, form: { setFieldsValue } } = this.props;
    if (id) {
      getEmployeeId(id);
    }
    clearEmployeeId();
    setFieldsValue({ actorEmployee: '' });
  }

  exportReportList = () => {
    const { loanApplyExport, form: { validateFields } } = this.props;
    validateFields((err, value) => {
      if (!err) {
        loanApplyExport(value);
      }
    });
  }

  downloadReportList = () => {
    const { loanApplyExportDownloadList } = this.props;
    loanApplyExportDownloadList();
  }

  deleteFile = (id, e) => {
    const { loanApplyDelete } = this.props;
    e.preventDefault();
    confirm({
      title: '确认删除?',
      okText: '是',
      cancelText: '否',
      onOk() {
        loanApplyDelete(id);
      },
      onCancel() {
      },
    });
  }

  deleteAll = () => {
    const { loanApplyDeleteAll } = this.props;
    confirm({
      title: '确认全部删除?',
      okText: '是',
      cancelText: '否',
      onOk() {
        loanApplyDeleteAll();
      },
      onCancel() {
      },
    });
  }

  clearData =() => {
    const { loanApplyReset, form: { resetFields } } = this.props;
    resetFields();
    loanApplyReset();
  }

  handleOk = () => {
    const { closeLoanapplyModal } = this.props;
    closeLoanapplyModal();
  }

  handleCancel = () => {
    const { closeLoanapplyModal } = this.props;
    closeLoanapplyModal();
  }

  render() {
    const { employeeGroupId,
      employeeId,
      loanApplySearchList,
      loanApplyExportStatus,
      loanApplyDownloadStatus,
      loanApplyDownloadList,
      loanApplySearchLoading,
      form: { getFieldDecorator } }
      = this.props;
    const loanApplyRecords = (loanApplySearchList && loanApplySearchList.records) || [];
    const loanApplyTotalRecords = (loanApplySearchList && loanApplySearchList.totalRecords) || 0;
    const loanApplyDownloadRecords = (loanApplyDownloadList && loanApplyDownloadList.records) || [];
    const pagination = {
      total: loanApplySearchList.totalRecords,
      defaultPageSize: loanApplySearchList.pageSize ? loanApplySearchList.pageSize : 50,
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
              href={`/borrower/v1/report/loanapplication/file/${record.id}`}
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
        <h3>贷款申请表</h3>
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
                  label="借款人ID"
                >
                  {getFieldDecorator('actorId')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="贷款提交时间"
                >
                  {getFieldDecorator('submitDate')(
                    <RangePicker
                      format={dateFormat}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="放款时间"
                >
                  {getFieldDecorator('loanDate')(
                    <RangePicker
                      format={dateFormat}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="用户所属销售组别"
                >
                  {getFieldDecorator('actorEmployeeGroup', {
                    initialValue: '',
                  })(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={employeeGroupId}
                      treeDefaultExpandAll={false}
                      onChange={value => this.getEmployeeId(value)}
                      allowClear
                    />,
                    )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="用户所属销售"
                >
                  {getFieldDecorator('actorEmployee', {
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">全部</Option>
                      {
                        employeeId && employeeId.map((val) => {
                          return <Option key={val.id} value={val.id}>{val.name}</Option>;
                        })
                      }
                    </Select>,
                    )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <FormItem
                  label="注册来源"
                >
                  {getFieldDecorator('clientSourceType', {
                    initialValue: 'CRM',
                  })(
                    <Select>
                      <option value="" >全部</option>
                      <option value="BORROW_APP_MARKET" >Borrow app</option>
                      <option value="MARKET_LANDING_PAGE" >Landing Page</option>
                      <option value="Wechat" >Wechat</option>
                      <option value="CASHLOAN">Cash loan</option>
                      <option value="MAIN_SITE">Main Site</option>
                      <option value="Newborrower">New borrower</option>
                      <option value="CRM">CRM</option>
                      <option value="SPEEDLOAN" >SPEEDLOAN</option>
                      <option value="LITE" >LITE</option>
                      <option value="NOTSET" >来源为空</option>
                      <option value="UNKNOWN" >UNKNOWN</option>
                    </Select>,
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
          <Button onClick={this.exportReportList} loading={loanApplyExportStatus}>导出报表</Button>
          <Button onClick={this.downloadReportList}>下载</Button>
        </div>
        <Table
          columns={columns}
          dataSource={loanApplyRecords}
          pagination={pagination}
          scroll={{ x: 3650, y: 650 }}
          size="middle"
          loading={loanApplySearchLoading}
        />
        {
          loanApplyTotalRecords > 0 ?
            <div className="total-num">
              <div>总条数： <span>{ loanApplyTotalRecords }</span></div>
            </div>
            : ''
        }
        <Modal
          title="下载导出列表"
          visible={loanApplyDownloadStatus}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Spin spinning={false}>
            <div>
              <Table
                columns={downloadColumns}
                dataSource={loanApplyDownloadRecords}
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
    employeeGroupId: state.report.employeeGroupId,
    employeeId: state.report.employeeId,
    loanApplySearchList: state.report.loanApplySearchList,
    loanApplyExportStatus: state.report.loanApplyExportStatus,
    loanApplyDownloadList: state.report.loanApplyDownloadList,
    loanApplyDownloadStatus: state.report.loanApplyDownloadStatus,
    loanApplySearchLoading: state.report.loanApplySearchLoading,
  }),
  dispatch => ({
    getEmployeeGroupId: () => dispatch({ type: 'report/getEmployeeGroupId' }),
    getEmployeeId: (id) => dispatch({ type: 'report/getEmployeeId', payload: id }),
    loanApplySearch: (formData) => {
      const resultData = formData;
      for (const x in resultData) {
        if (['loanDate', 'submitDate'].indexOf(x) > -1 && resultData[x]) {
          if (resultData[x].length > 0) {
            const startDay = +resultData[x][0].startOf('day');
            const endDay = +resultData[x][1].startOf('day') + 86400000;
            resultData[x] = `${startDay}-${endDay}`;
          } else {
            delete resultData[x];
          }
        }
      }
      dispatch({ type: 'report/loanApplySearch', payload: resultData });
    },
    loanApplyExport: (formData) => {
      const resultData = formData;
      for (const x in resultData) {
        if (['loanDate', 'submitDate'].indexOf(x) > -1 && resultData[x]) {
          if (resultData[x].length > 0) {
            const startDay = +resultData[x][0].startOf('day');
            const endDay = +resultData[x][1].startOf('day') + 86400000;
            resultData[x] = `${startDay}-${endDay}`;
          } else {
            delete resultData[x];
          }
        }
      }
      dispatch({ type: 'report/loanApplyExport', payload: formData });
    },
    loanApplyExportDownloadList: () => dispatch({ type: 'report/loanApplyExportDownloadList' }),
    loanApplyReset: () => dispatch({ type: 'report/loanApplyReset' }),
    loanApplyDelete: (id) => dispatch({ type: 'report/loanApplyDelete', payload: id }),
    loanApplyDeleteAll: () => dispatch({ type: 'report/loanApplyDeleteAll' }),
    closeLoanapplyModal: () => dispatch({ type: 'report/closeLoanapplyModal' }),
    clearEmployeeId: () => dispatch({ type: 'report/clearEmployeeId' }),
  }),
)(Form.create()(LoanApplicationReport));

