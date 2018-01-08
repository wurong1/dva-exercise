import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { DatePicker, Table, Form, Button, Row, Col, Modal, Spin } from 'antd';
import MultipleSelect from '../../components/select-multiple';
import TrimInput from '../../components/input-trim';
import PageNav from '../../components/page-nav';
import DeployModal from './teamDeployModal';
import TransferModal from './teamTransferModal';
import './borrowerTasks.less';

moment.locale('zh-cn');
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const columns = [
  {
    title: '借款人ID',
    dataIndex: 'actorId',
    render: (text, record) => {
      return text ?
        <Link target="_blank" to={`/taskDetails?taskId=${record && record.taskId}`}>{text}</Link>
      :
        '';
    },
    width: 100,
    fixed: 'left',
  }, {
    title: '客户姓名',
    dataIndex: 'customerName',
    width: 100,
    fixed: 'left',
  }, {
    title: '电话号码',
    dataIndex: 'cellPhone',
    width: 100,
    render: (text, record) => {
      return record && record.actorId ?
        text
      :
        text ?
          <Link target="_blank" to={`/taskDetails?taskId=${record && record.taskId}`}>{text}</Link>
        :
          '';
    },
  }, {
    title: '贷款申请城市',
    dataIndex: 'appCity',
    width: 150,
  }, {
    title: '用户类型',
    dataIndex: 'customerType',
    width: 100,
  }, {
    title: '注册时间',
    dataIndex: 'borrowerStatusDate',
    sorter: true,
    sorterKey: 'BORROW_STATUS_DATE',
    width: 150,
    render: (text) => { return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''; },
  }, {
    title: '注册来源',
    dataIndex: 'customerOrigin',
    width: 150,
  }, {
    title: '渠道',
    dataIndex: 'marketChannel',
    width: 150,
  }, {
    title: '任务状态',
    dataIndex: 'taskStatus',
    width: 150,
  }, {
    title: '处理结果',
    dataIndex: 'operationResult',
    width: 100,
  }, {
    title: '最后处理时间',
    dataIndex: 'lastProcessTime',
    sorter: true,
    sorterKey: 'LAST_PROCESS_TIME',
    width: 150,
    render: (text) => { return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''; },
  }, {
    title: '负责人组别',
    dataIndex: 'employeeGroupName',
    width: 200,
  }, {
    title: '负责人',
    dataIndex: 'employeeName',
    width: 200,
  }, {
    title: '用户推荐人组别',
    dataIndex: 'borrowEmployeeGroupId ',
    width: 200,
  }, {
    title: '用户推荐人',
    dataIndex: 'borrowEmployeeId ',
    width: 200,
  }, {
    title: '贷款类型',
    dataIndex: 'productCodes',
    width: 200,
  }, {
    title: '贷款状态',
    dataIndex: 'appStatus ',
    width: 200,
  },
];

class NoSalesTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultDate: [moment().subtract(3, 'months'), moment().startOf('day')],
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const borrowerStatusDateStr = convertDateRange(values.borrowerStatusDate);
      const params = {
        ...values,
        borrowerStatusDate: borrowerStatusDateStr,
        pageNo: 1,
        flag: 'NOSALES_TASK',
      };
      this.props.taskNoSalesSubmit(params);
    });
  }

  clearTakNoSales = () => {
    const { resetFields } = this.props.form;
    resetFields();
    this.props.clearTakNoSales();
  }

  pageChange = (pageNo) => {
    const { taskNoSales: { formData = {} } } = this.props;
    const params = {
      ...formData,
      pageNo,
    };
    this.props.taskNoSalesPageChange(params);
  }

   // 触发二级select框接收新的props
  handleChange = () => {
    this.setState(preState => ({ chageFlag: !preState.chageFlag }));
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { taskNoSalesSubmit, taskNoSales: { records }, form: { validateFields } } = this.props;
    if (records && records.length > 0) {
      if (sorter.order) {
        validateFields((err, values) => {
          const borrowerStatusDateStr = convertDateRange(values.borrowerStatusDate);
          const column = sorter.column && sorter.column.sorterKey;
          const order = sorter.order === 'ascend' ? 'asc' : 'desc';
          const params = {
            ...values,
            borrowerStatusDate: borrowerStatusDateStr,
            column,
            order,
            pageNo: 1,
            flag: 'NOSALES_TASK',
          };
          taskNoSalesSubmit(params);
        });
      }
    }
  }

  deploy = (buttonType) => {
    const { showNoSalesDeployModal, showNoSalesTransferModal } = this.props;
    if (buttonType === 'TO_ALLOCATE') {
      showNoSalesDeployModal(true);
    }
    if (buttonType === 'TO_BRANCH') {
      showNoSalesTransferModal(true);
    }
  }

  handleDeployCancel = () => {
    const { showNoSalesDeployModal } = this.props;
    showNoSalesDeployModal(false);
  }

  handleTransferCancel = () => {
    const { showNoSalesTransferModal } = this.props;
    showNoSalesTransferModal(false);
  }

  disabledDate = (current) => {
    return current && current.valueOf() >= moment().endOf('day');
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {
      taskNoSales = {},
      modal,
    } = this.props;
    const {
      isFetching,
      formData,
      reload,
      records = [],
      totalRecords = 0,
      pageSize = 50,
      pageNo = 1,
      selectedRows = [],
    } = taskNoSales;
    const { nosalesDeployVisible, nosalesTransferVisible } = modal;
    const loanTypeOptions = {
      remote: '/borrower/v1/condition/productcode?guidedType={:val}',
      parentName: 'guideSubTask',
      parentValue: getFieldValue('guideSubTask'),
    };
    const footer =
      (
        <div>
          <Button
            type="primary"
            onClick={this.deploy.bind(this, 'TO_ALLOCATE')}
            disabled={selectedRows.length < 1}
            style={{ marginRight: '20px' }}
          >
            调配
          </Button>
          <Button
            type="primary"
            onClick={this.deploy.bind(this, 'TO_BRANCH')}
            disabled={selectedRows.length < 1}
            style={{ marginRight: '20px' }}
          >
            转给分公司
          </Button>
        </div>
      );
    const pagination = {
      currentCount: totalRecords,
      pageSize,
      pageNo,
      showPageNav: records.length > 0,
      values: {
        ...formData,
        flag: 'NOSALES_TASK',
      },
    };

    const rowSelection = {
      onChange: (selectedRowKeys, selectedrows) => {
        this.props.taskNoSalesSetRows(selectedrows);
      },
    };

    return (
      <div>
        <h3 className="dr-section-font">未分配任务</h3>
        <Form
          layout="horizontal"
          onSubmit={this.handleSubmit}
        >
          <div className="crm-filter-box">
            <Row gutter={24}>
              <Col span={4}>
                <FormItem
                  label="注册时间"
                >
                  {getFieldDecorator('borrowerStatusDate')(
                    <RangePicker disabledDate={this.disabledDate} />,
                  )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="借款人ID"
                >
                  {getFieldDecorator('actorId')(
                    <TrimInput />,
                    )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="客户姓名"
                >
                  {getFieldDecorator('customerName')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="电话号码"
                >
                  {getFieldDecorator('cellPhone')(
                    <TrimInput />,
                    )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="贷款类型"
                >
                  {getFieldDecorator('productCodes', {
                    initialValue: [],
                  })(
                    <MultipleSelect
                      {...loanTypeOptions}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="贷款ID"
                >
                  {getFieldDecorator('realLoanId')(
                    <TrimInput />,
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
            <Button style={{ marginLeft: '30px' }} onClick={this.clearTakNoSales.bind(this)} >
              清空
            </Button>
          </FormItem>
        </Form>
        <div style={{ border: '1px solid #E4EAEC' }}>
          <Table
            dataSource={records}
            columns={columns}
            loading={isFetching}
            pagination={false}
            rowKey={(record, idx) => idx}
            rowSelection={rowSelection}
            scroll={{ x: 2650, y: 550 }}
            size="middle"
            onChange={this.handleTableChange}
            footer={(currentPageData) => {
              return currentPageData.length > 0 ? footer : null;
            }}
            key={isFetching}
          />
        </div>
        <PageNav {...pagination} onChange={this.pageChange} key={reload} />
        <Modal
          title="调配"
          visible={nosalesDeployVisible}
          onCancel={this.handleDeployCancel}
          footer={null}
        >
          <Spin spinning={modal.loading}>
            <DeployModal key={nosalesDeployVisible} taskOptions="NO_SALES" taskType="NOSALES_TASK" />
          </Spin>
        </Modal>
        <Modal
          title="转给分公司"
          visible={nosalesTransferVisible}
          onCancel={this.handleTransferCancel}
          footer={null}
        >
          <Spin spinning={modal.loading}>
            <TransferModal key={nosalesTransferVisible} taskOptions="NO_SALES" taskType="NOSALES_TASK" />
          </Spin>
        </Modal>
      </div>
    );
  }
}

export default connect(
  state => ({
    taskNoSales: state.teamTasks.taskNoSales,
    modal: state.teamTasks.modal,
  }),
  dispatch => ({
    taskNoSalesSubmit: parmas => dispatch({ type: 'teamTasks/taskNoSalesSubmit', payload: parmas }),
    taskNoSalesPageChange: parmas => dispatch({ type: 'teamTasks/taskNoSalesPageChange', payload: parmas }),
    taskNoSalesSetRows: parmas => dispatch({ type: 'teamTasks/taskNoSalesSetRows', payload: parmas }),
    showNoSalesDeployModal: parmas => dispatch({ type: 'teamTasks/showNoSalesDeployModal', payload: parmas }),
    showNoSalesTransferModal: parmas => dispatch({ type: 'teamTasks/showNoSalesTransferModal', payload: parmas }),
    clearTakNoSales: () => dispatch({ type: 'teamTasks/clearTakNoSales' }),
  }),
)(Form.create()(NoSalesTask));

function convertDateRange(data) {
  let startStr = '';
  let endStr = '';
  if (!Array.isArray(data)) return undefined;
  if (Array.isArray(data) && data.length < 2) return undefined;
  startStr = data[0] && +data[0].startOf('day');
  endStr = data[1] && +data[1].startOf('day') + 86399999;
  return `${startStr}-${endStr}`;
}
