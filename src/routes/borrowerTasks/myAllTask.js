import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { DatePicker, Table, Form, Select, Button, Row, Col, TreeSelect, Modal, Spin } from 'antd';
import MultipleSelect from '../../components/select-multiple';
import CascadeSelect from '../../components/select-cascade';
import TrimInput from '../../components/input-trim';
import PageNav from '../../components/page-nav';
import DeployModal from './myDeployModal';
import TransferModal from './myTransferModal';
import SignModal from './mySignModal';
import './borrowerTasks.less';

moment.locale('zh-cn');
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;

const options = [{
  id: 'NEWREGIST',
  name: '新注册',
}, {
  id: 'LOANAPPGUIDED',
  name: '引导进件',
}, {
  id: 'AUDITFOLLOWUP',
  name: '审核跟进',
}, {
  id: 'SIGN',
  name: '签约',
}];

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
    title: '进件类型',
    dataIndex: 'guideSubTask',
    width: 100,
  }, {
    title: '贷款产品',
    dataIndex: 'productCode',
    width: 100,
  }, {
    title: '任务状态',
    dataIndex: 'taskStatus',
    width: 150,
  }, {
    title: '贷款申请状态',
    dataIndex: 'appStatus',
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
    title: '任务所有人组别',
    dataIndex: 'ownerEmployeeGroupName',
    width: 200,
  }, {
    title: '任务所有人',
    dataIndex: 'ownerEmployeeName',
    width: 200,
  }, {
    title: '用户推荐人组别',
    dataIndex: 'offEmployeeGroupName',
    width: 200,
  }, {
    title: '用户推荐人',
    dataIndex: 'offEmployeeName',
    width: 200,
  }, {
    title: '借款销售组别',
    dataIndex: 'loanEmployeeGroupName',
    width: 200,
  }, {
    title: '借款所属销售',
    dataIndex: 'loanEmployeeName',
    width: 200,
  },
];

class MyAllTaskPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultDate: [moment().subtract(3, 'months'), moment().startOf('day')],
    };
  }

  componentWillMount() {
    const { getEmployeeGroup, getIntentionsource, getFirstRecommend, getButtonConfig } = this.props;
    getEmployeeGroup();
    getIntentionsource();
    getFirstRecommend();
    getButtonConfig('ALL');
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const borrowerStatusDateStr = convertDateRange(values.borrowerStatusDate);
      const lastProcessTimeStr = convertDateRange(values.lastProcessTime);
      const taskStartedDateStr = convertDateRange(values.taskStartedDate);
      const loanStatusDateStr = convertDateRange(values.loanStatusDate);
      const lastContactTimeStr = convertDateRange(values.lastContactTime);
      const taskAllocateDateStr = convertDateRange(values.taskAllocateDate);
      const appDateStr = convertDateRange(values.appDate);
      const submitDateStr = convertDateRange(values.submitDate);
      const feedbackTimeStr = convertDateRange(values.feedbackTime);
      const issueDateStr = convertDateRange(values.issueDate);
      const params = {
        ...values,
        borrowerStatusDate: borrowerStatusDateStr,
        lastProcessTime: lastProcessTimeStr,
        taskStartedDate: taskStartedDateStr,
        loanStatusDate: loanStatusDateStr,
        lastContactTime: lastContactTimeStr,
        taskAllocateDate: taskAllocateDateStr,
        appDate: appDateStr,
        submitDate: submitDateStr,
        feedbackTime: feedbackTimeStr,
        issueDate: issueDateStr,
        pageNo: 1,
        flag: 'MINE_TASK',
        taskOptions: 'ALL',
      };
      this.props.taskAllsubmit(params);
    });
  }

  clearTakAll = () => {
    const { resetFields } = this.props.form;
    resetFields();
    this.props.clearTakAll();
  }

  pageChange = (pageNo) => {
    const { taskAll: { formData = {} } } = this.props;
    const params = {
      ...formData,
      pageNo,
    };
    this.props.taskAllPageChange(params);
  }

   // 触发二级select框接收新的props
  handleChange = () => {
    this.setState(preState => ({ chageFlag: !preState.chageFlag }));
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { taskAllsubmit, taskAll: { records }, form: { validateFields } } = this.props;
    if (records && records.length > 0) {
      if (sorter.order) {
        validateFields((err, values) => {
          const borrowerStatusDateStr = convertDateRange(values.borrowerStatusDate);
          const lastProcessTimeStr = convertDateRange(values.lastProcessTime);
          const taskStartedDateStr = convertDateRange(values.taskStartedDate);
          const loanStatusDateStr = convertDateRange(values.loanStatusDate);
          const lastContactTimeStr = convertDateRange(values.lastContactTime);
          const taskAllocateDateStr = convertDateRange(values.taskAllocateDate);
          const appDateStr = convertDateRange(values.appDate);
          const submitDateStr = convertDateRange(values.submitDate);
          const feedbackTimeStr = convertDateRange(values.feedbackTime);
          const issueDateStr = convertDateRange(values.issueDate);
          const column = sorter.column && sorter.column.sorterKey;
          const order = sorter.order === 'ascend' ? 'asc' : 'desc';
          const params = {
            ...values,
            borrowerStatusDate: borrowerStatusDateStr,
            lastProcessTime: lastProcessTimeStr,
            taskStartedDate: taskStartedDateStr,
            loanStatusDate: loanStatusDateStr,
            lastContactTime: lastContactTimeStr,
            taskAllocateDate: taskAllocateDateStr,
            appDate: appDateStr,
            submitDate: submitDateStr,
            feedbackTime: feedbackTimeStr,
            issueDate: issueDateStr,
            column,
            order,
            pageNo: 1,
            flag: 'MINE_TASK',
            taskOptions: 'ALL',
          };
          taskAllsubmit(params);
        });
      }
    }
  }

  deploy = (btnConfig) => {
    const { buttonType } = btnConfig;
    const { showAllDeployModal, showAllTransferModal, showAllSignModal } = this.props;
    if (buttonType === 'TO_ALLOCATE') {
      showAllDeployModal(true);
    }
    if (buttonType === 'TO_BRANCH') {
      showAllTransferModal(true);
    }
    if (buttonType === 'TO_CONTRACT') {
      showAllSignModal(true);
    }
  }

  handleDeployCancel = () => {
    const { showAllDeployModal } = this.props;
    showAllDeployModal(false);
  }

  handleTransferCancel = () => {
    const { showAllTransferModal } = this.props;
    showAllTransferModal(false);
  }

  handleSignCancel = () => {
    const { showAllSignModal } = this.props;
    showAllSignModal(false);
  }

  disabledDate = (current) => {
    return current && current.valueOf() >= moment().endOf('day');
  }

  render() {
    const { defaultDate } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {
      taskAll = {},
      employeeGroupList = [],
      intentionsourceList = [],
      firstRecommendList = [],
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
      buttonConfig = [],
      selectedRows = [],
    } = taskAll;
    const { allDeployVisible, allTransferVisible, allSignVisible } = modal;
    const operationResult = getFieldValue('operationResult');
    const showFeedbackTime = ['TO_BE_FOLLOWED_UP', 'APPOINTMENT_CONTRACT'].indexOf(operationResult) > -1;
    const borrowEmployeeIdOptions = {
      remote: '/borrower/getUserByGroupId?groupId={:val}',
      parentName: 'borrowEmployeeGroupId',
      parentValue: getFieldValue('borrowEmployeeGroupId'),
    };

    const loanEmployeeIdOptions = {
      remote: '/borrower/getUserByGroupId?groupId={:val}',
      parentName: 'loanEmployeeGroupId',
      parentValue: getFieldValue('loanEmployeeGroupId'),
    };

    const operationResultOptions = {
      remote: '/borrower/v1/condition/operationresult?taskStatus={:val}',
      parentName: 'taskStatus',
      parentValue: getFieldValue('taskStatus'),
      parentType: 'multiple',
    };

    const loanStatusOptions = {
      remote: '/borrower/v1/condition/loanstatus?loanStatus={:val}',
      parentName: 'taskStatus',
      parentValue: getFieldValue('taskStatus'),
      parentType: 'multiple',
    };

    const guideSubTaskOptions = {
      remote: '/borrower/v1/condition/guidedtype?guidedtype={:val}',
      parentName: 'taskStatus',
      parentValue: getFieldValue('taskStatus'),
      parentType: 'multiple',
    };

    const loanTypeOptions = {
      remote: '/borrower/v1/condition/productcode?guidedType={:val}',
      parentName: 'guideSubTask',
      parentValue: getFieldValue('guideSubTask'),
    };

    const operationDetailResulOptions = {
      remote: '/borrower/v1/condition/operationdetail?operationResult={:val}',
      parentName: 'operationResult',
      parentValue: getFieldValue('operationResult'),
    };

    const footer = buttonConfig.filter(item => item.visible).map((item, idx) => {
      return (
        <Button
          type="primary"
          onClick={this.deploy.bind(this, item)}
          disabled={selectedRows.length < 1}
          style={{ marginRight: '20px' }}
          key={idx}
        >
          {item.buttonName}
        </Button>
      );
    });

    const pagination = {
      currentCount: totalRecords,
      pageSize,
      pageNo,
      showPageNav: records.length > 0,
      values: {
        ...formData,
        taskOptions: 'ALL',
        flag: 'MINE_TASK',
      },
    };

    const rowSelection = {
      onChange: (selectedRowKeys, selectedrows) => {
        this.props.taskAllsetRows(selectedrows);
      },
    };

    return (
      <div>
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
              <Col span={4}>
                <FormItem
                  label="最后处理时间"
                >
                  {getFieldDecorator('lastProcessTime')(
                    <RangePicker disabledDate={this.disabledDate} />,
                    )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="任务生效起始时间"
                >
                  {getFieldDecorator('taskStartedDate', {
                    initialValue: defaultDate,
                  })(
                    <RangePicker disabledDate={this.disabledDate} />,
                    )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="贷款状态变更时间"
                >
                  {getFieldDecorator('loanStatusDate')(
                    <RangePicker disabledDate={this.disabledDate} />,
                    )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="最后去电时间"
                >
                  {getFieldDecorator('lastContactTime')(
                    <RangePicker disabledDate={this.disabledDate} />,
                    )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="最后分配时间"
                >
                  {getFieldDecorator('taskAllocateDate')(
                    <RangePicker disabledDate={this.disabledDate} />,
                    )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
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
                  label="贷款申请城市"
                >
                  {getFieldDecorator('appCity')(
                    <TrimInput />,
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
              <Col span={2}>
                <FormItem
                  label="贷款申请ID"
                >
                  {getFieldDecorator('loanAppId')(
                    <TrimInput />,
                    )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="证件号"
                >
                  {getFieldDecorator('ssn')(
                    <TrimInput />,
                    )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="线下信息渠道"
                >
                  {getFieldDecorator('offlineMessageChannel')(
                    <TrimInput />,
                    )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="用户类型"
                >
                  {getFieldDecorator('customerType', {
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">全部</Option>
                      <Option value="INTENTION">意向用户</Option>
                      <Option value="REGISTERED">已注册</Option>
                    </Select>,
                    )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="任务状态"
                >
                  {getFieldDecorator('taskStatus', {
                    initialValue: [],
                  })(
                    <MultipleSelect options={options} onChange={this.handleChange.bind(this)} />,
                  )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="处理结果"
                >
                  {getFieldDecorator('operationResult', {
                    initialValue: '',
                  })(
                    <CascadeSelect
                      {...operationResultOptions}
                      onChange={this.handleChange.bind(this)}
                      dropdownMatchSelectWidth={false}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="贷款申请状态"
                >
                  {getFieldDecorator('appStatus', {
                    initialValue: [],
                  })(
                    <MultipleSelect
                      {...loanStatusOptions}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={2}>
                <FormItem
                  label="进件类型"
                >
                  {getFieldDecorator('guideSubTask', {
                    initialValue: '',
                  })(
                    <CascadeSelect
                      {...guideSubTaskOptions}
                      onChange={this.handleChange.bind(this)}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={2} style={{ display: `${operationResult === 'INVALID' ? 'block' : 'none'}` }}>
                <FormItem
                  label="处理详细类型"
                >
                  {getFieldDecorator('operationDetailResult', {
                    initialValue: '',
                  })(
                    <CascadeSelect
                      {...operationDetailResulOptions}
                    />,
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
              {
                showFeedbackTime &&
                  <Col span={4}>
                    <FormItem
                      label="预约回访时间"
                    >
                      {getFieldDecorator('feedbackTime')(
                        <RangePicker />,
                        )}
                    </FormItem>
                  </Col>
                }
              <Col span={2}>
                <FormItem
                  label="意向用户来源"
                >
                  {getFieldDecorator('intentionSourceType', {
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">全部</Option>
                      {
                        intentionsourceList.map((item, idx) =>
                          <Option key={idx} value={item.code}>{item.name}</Option>,
                        )
                      }
                    </Select>,
                    )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="注册来源"
                >
                  {getFieldDecorator('customerOrigin', {
                    initialValue: '',
                  })(
                    <Select dropdownMatchSelectWidth={false}>
                      <Option value="" >全部</Option>
                      <Option value="LOANRIVER">Loan River</Option>
                      <Option value="BA" >Borrow app</Option>
                      <Option value="LP" >Landing Page</Option>
                      <Option value="WX" >Wechat</Option>
                      <Option value="SP">salesApp</Option>
                      <Option value="CL">Cash loan</Option>
                      <Option value="MS">Main Site</Option>
                      <Option value="NB">New borrower</Option>
                      <Option value="BD">BD</Option>
                      <Option value="CRM">CRM</Option>
                      <Option value="SL" >SPEEDLOAN</Option>
                      <Option value="LT" >LITE</Option>
                      <Option value="NOTSET" >来源为空</Option>
                      <Option value="UN" >UNKNOWN</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="首次推荐贷款类型"
                >
                  {getFieldDecorator('firstRecommendPreLoanProduct', {
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">全部</Option>
                      {
                        firstRecommendList.map((item, idx) =>
                          <Option key={idx} value={item.id}>{item.name}</Option>,
                        )
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="用户推荐人组别"
                >
                  {getFieldDecorator('borrowEmployeeGroupId', {
                    initialValue: '',
                  })(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={employeeGroupList}
                      treeDefaultExpandAll={false}
                      dropdownMatchSelectWidth={false}
                      onChange={this.handleChange.bind(this)}
                      allowClear
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="用户推荐人"
                >
                  {getFieldDecorator('borrowEmployeeId', {
                    initialValue: '',
                  })(
                    <CascadeSelect {...borrowEmployeeIdOptions} />,
                  )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="贷款销售组别"
                >
                  {getFieldDecorator('loanEmployeeGroupId', {
                    initialValue: '',
                  })(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={employeeGroupList}
                      treeDefaultExpandAll={false}
                      dropdownMatchSelectWidth={false}
                      onChange={this.handleChange.bind(this)}
                      allowClear
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="贷款销售"
                >
                  {getFieldDecorator('loanEmployeeId', {
                    initialValue: '',
                  })(
                    <CascadeSelect {...loanEmployeeIdOptions} />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={2}>
                <FormItem
                  label="提交风控方式"
                >
                  {getFieldDecorator('isNewLoanType', {
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">全部</Option>
                      <Option value="YES">自动提交</Option>
                      <Option value="NO">手动提交</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="是否在黑名单"
                >
                  {getFieldDecorator('isInBlackList', {
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">全部</Option>
                      <Option value="1">是</Option>
                      <Option value="2">否</Option>
                    </Select>,
                    )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="是否下载app"
                >
                  {getFieldDecorator('isDownloadApp', {
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">全部</Option>
                      <Option value="YES">是</Option>
                      <Option value="NO">否</Option>
                    </Select>,
                    )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="是否实名认证"
                >
                  {getFieldDecorator('isRealName', {
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">全部</Option>
                      <Option value="YES">是</Option>
                      <Option value="NO">否</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="是否人脸认证"
                >
                  {getFieldDecorator('isFaceVerification', {
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">全部</Option>
                      <Option value="YES">是</Option>
                      <Option value="NO">否</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="是否结案"
                >
                  {getFieldDecorator('isClosed', {
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">全部</Option>
                      <Option value="1">是</Option>
                      <Option value="2">否</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="邮箱"
                >
                  {getFieldDecorator('email')(
                    <TrimInput />,
                    )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem
                  label="贷款来源"
                >
                  {getFieldDecorator('loanAppSource', {
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">全部</Option>
                      <Option value="WEB">web</Option>
                      <Option value="BORROWER_APP">borrowapp</Option>
                      <Option value="SALES_APP">salesapp</Option>
                      <Option value="CASH_LOAN">cashloan</Option>
                      <Option value="SPEED_LOAN">speedloan</Option>
                      <Option value="LITE">lite</Option>
                      <Option value="APP51">51公积金</Option>
                      <Option value="CRM">CRM</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="贷款创建时间"
                >
                  {getFieldDecorator('appDate')(
                    <RangePicker disabledDate={this.disabledDate} />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="贷款提交时间"
                >
                  {getFieldDecorator('submitDate')(
                    <RangePicker disabledDate={this.disabledDate} />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <FormItem
                  label="放款日期"
                >
                  {getFieldDecorator('issueDate')(
                    <RangePicker />,
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
        <Button className="btn-clear" onClick={this.clearTakAll.bind(this)}>
          清空
        </Button>
        <div>
          <Table
            dataSource={records}
            columns={columns}
            loading={isFetching}
            pagination={false}
            rowKey={(record, idx) => idx}
            rowSelection={rowSelection}
            scroll={{ x: 2850, y: 550 }}
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
          visible={allDeployVisible}
          onCancel={this.handleDeployCancel}
          footer={null}
        >
          <Spin spinning={modal.loading}>
            <DeployModal key={allDeployVisible} taskOptions="ALL" taskType="MINE_TASK" />
          </Spin>
        </Modal>
        <Modal
          title="转给分公司"
          visible={allTransferVisible}
          onCancel={this.handleTransferCancel}
          footer={null}
        >
          <Spin spinning={modal.loading}>
            <TransferModal key={allTransferVisible} taskOptions="ALL" taskType="MINE_TASK" />
          </Spin>
        </Modal>
        <Modal
          title="分配签约人"
          visible={allSignVisible}
          onCancel={this.handleSignCancel}
          footer={null}
        >
          <Spin spinning={modal.loading}>
            <SignModal key={allSignVisible} taskOptions="ALL" taskType="MINE_TASK" />
          </Spin>
        </Modal>
      </div>
    );
  }
}

export default connect(
  state => ({
    taskAll: state.myTasks.taskAll,
    employeeGroupList: state.myTasks.employeeGroupList,
    intentionsourceList: state.myTasks.intentionsourceList,
    firstRecommendList: state.myTasks.firstRecommendList,
    modal: state.myTasks.modal,
  }),
  dispatch => ({
    getEmployeeGroup: () => dispatch({ type: 'myTasks/getEmployeeGroup' }),
    getIntentionsource: () => dispatch({ type: 'myTasks/getIntentionsource' }),
    getFirstRecommend: () => dispatch({ type: 'myTasks/getFirstRecommend' }),
    taskAllsubmit: parmas => dispatch({ type: 'myTasks/taskAllsubmit', payload: parmas }),
    taskAllPageChange: parmas => dispatch({ type: 'myTasks/taskAllPageChange', payload: parmas }),
    taskAllsetRows: parmas => dispatch({ type: 'myTasks/taskAllsetRows', payload: parmas }),
    getButtonConfig: parmas => dispatch({ type: 'myTasks/getButtonConfig', payload: parmas }),
    showAllDeployModal: parmas => dispatch({ type: 'myTasks/showAllDeployModal', payload: parmas }),
    showAllTransferModal: parmas => dispatch({ type: 'myTasks/showAllTransferModal', payload: parmas }),
    showAllSignModal: parmas => dispatch({ type: 'myTasks/showAllSignModal', payload: parmas }),
    clearTakAll: () => dispatch({ type: 'myTasks/clearTakAll' }),
  }),
)(Form.create()(MyAllTaskPage));

function convertDateRange(data) {
  let startStr = '';
  let endStr = '';
  if (!Array.isArray(data)) return undefined;
  if (Array.isArray(data) && data.length < 2) return undefined;
  startStr = data[0] && +data[0].startOf('day');
  endStr = data[1] && +data[1].startOf('day') + 86399999;
  return `${startStr}-${endStr}`;
}
