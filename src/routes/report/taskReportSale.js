import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Button, Row, Col, DatePicker, TreeSelect, Table, Modal, Spin, Tooltip } from 'antd';
import moment from 'moment';
import MultipleSelect from '../../components/select-multiple';
import CascadeSelect from '../../components/select-cascade';
import TrimInput from '../../components/input-trim';
import './report.less';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
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
const columns = [{
  title: '借款人ID',
  dataIndex: 'actorId',
  width: 100,
  fixed: 'left',
  key: 'actorId',
}, {
  title: '客户姓名',
  dataIndex: 'customerName',
  width: 100,
  fixed: 'left',
  key: 'customerName',
}, {
  title: '电话号码',
  dataIndex: 'cellPhone',
  width: 150,
  key: 'cellPhone',
}, {
  title: '城市',
  dataIndex: 'city',
  width: 100,
  key: 'city',
}, {
  title: '注册时间',
  dataIndex: 'registerTime',
  width: 150,
  key: 'registerTime',
  render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
}, {
  title: '来源',
  dataIndex: 'customerOrigin',
  width: 100,
  key: 'customerOrigin',
}, {
  title: '推广渠道',
  dataIndex: 'marketChannel',
  width: 100,
  key: 'marketChannel',
}, {
  title: '首次推荐贷款产品',
  dataIndex: 'firstPreProduct',
  width: 150,
  key: 'firstPreProduct',
}, {
  title: '任务状态',
  dataIndex: 'taskStatus',
  width: 100,
  key: 'taskStatus',
}, {
  title: '任务生成时间',
  dataIndex: 'taskCreateTime',
  width: 150,
  key: 'taskCreateTime',
  render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
}, {
  title: '处理结果',
  dataIndex: 'taskResult',
  width: 100,
  key: 'taskResult',
}, {
  title: '详细类型',
  dataIndex: 'detailType',
  width: 100,
  key: 'detailType',
}, {
  title: '最后处理时间',
  dataIndex: 'lastDealTime',
  width: 150,
  key: 'lastDealTime',
  render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
}, {
  title: '最后分配时间',
  dataIndex: 'allocateTime',
  width: 150,
  key: 'allocateTime',
  render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
},, {
  title: '贷款申请ID',
  dataIndex: 'loanAppId',
  key: 'loanAppId',
  width: 100,
}, {
  title: '贷款ID',
  dataIndex: 'loanId',
  key: 'loanId',
  width: 100,
}, {
  title: '贷款申请城市',
  dataIndex: 'appCity',
  key: 'appCity',
  width: 100,
}, {
  title: '申请金额',
  dataIndex: 'appAmount',
  key: 'appAmount',
  width: 100,
}, {
  title: '进件类型',
  dataIndex: 'guideSubTask',
  width: 100,
  key: 'guideSubTask',
}, {
  title: '贷款类型',
  dataIndex: 'productCode',
  width: 100,
  key: 'productCode',
}, {
  title: '贷款申请状态',
  dataIndex: 'loanAppStatus',
  width: 100,
  key: 'loanAppStatus',
}, {
  title: '贷款创建时间',
  dataIndex: 'loanAppDate',
  width: 150,
  key: 'loanAppDate',
  render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
}, {
  title: '贷款提交时间',
  dataIndex: 'submitDate',
  width: 150,
  key: 'submitDate',
  render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
}, {
  title: '贷款期限',
  dataIndex: 'maturity',
  width: 100,
  key: 'maturity',
  render: (text, record) => text ? `${text}${record.maturityType || ''}` : '',
}, {
  title: '合同金额',
  dataIndex: 'contractAmount',
  width: 100,
  key: 'contractAmount',
}, {
  title: '拒绝原因',
  dataIndex: 'extraMessage',
  width: 250,
  key: 'extraMessage',
  render: text => <Tooltip title={text && text.length > 18 ? text : ''}>
    <span>{text && text.length > 18 ? `${text.substring(0, 17)}...` : text}</span>
  </Tooltip>,
}, {
  title: '上标时间',
  dataIndex: 'shelveTime',
  width: 150,
  key: 'shelveTime',
  render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
}, {
  title: '任务所有人组别',
  dataIndex: 'ownerEmployeeGroupName',
  width: 150,
  key: 'ownerEmployeeGroupName',
}, {
  title: '任务所有人',
  dataIndex: 'ownerEmployeeName',
  width: 150,
  key: 'ownerEmployeeName',
}, {
  title: '任务负责人组别',
  dataIndex: 'employeeGroupName',
  width: 150,
  key: 'employeeGroupName',
}, {
  title: '任务负责人',
  dataIndex: 'employeeName',
  width: 150,
  key: 'employeeName',
}, {
  title: '批复时间',
  dataIndex: 'reviewTime',
  width: 150,
  key: 'reviewTime',
  render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
}, {
  title: '批复金额',
  dataIndex: 'reviewAmount',
  width: 100,
  key: 'reviewAmount',
}, {
  title: '放款时间',
  dataIndex: 'issuedTime',
  width: 150,
  key: 'issuedTime',
  render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
}, {
  title: '首次人工处理时间',
  dataIndex: 'firstProcessTime',
  width: 150,
  key: 'firstProcessTime',
  render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
}, {
  title: '首次人工分配时间',
  dataIndex: 'firstAssignTime',
  width: 150,
  key: 'firstAssignTime',
  render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
}, {
  title: '用户推荐人组别',
  dataIndex: 'actorEmployeeGroupName',
  width: 150,
  key: 'actorEmployeeGroupName',
}, {
  title: '用户推荐人',
  dataIndex: 'actorEmployeeName',
  width: 100,
  key: 'actorEmployeeName',
}, {
  title: '贷款销售组别',
  dataIndex: 'loanEmployeeGroupName',
  width: 100,
  key: 'loanEmployeeGroupName',
}, {
  title: '贷款销售',
  dataIndex: 'loanEmployeeName',
  width: 100,
  key: 'loanEmployeeName',
}];

class TaskReport extends Component {

  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
    };
  }

  componentWillMount() {
    this.props.getEmployeeGroupId();
  }

  onPageChange = (pagination) => {
    const params = this.getFormData(pagination);
    this.props.submitForm(params);
  }

  getFormData = (pagination) => {
    const { current = 1, pageSize = 50 } = pagination;
    let result = {};
    this.props.form.validateFields((err, values) => {
      const registerTimeStr = convertDateRange(values.registerTime);
      const closedTimeStr = convertDateRange(values.closedTime);
      const lastDealTimeStr = convertDateRange(values.lastDealTime);
      const firstAssignTimeStr = convertDateRange(values.firstAssignTime);
      const taskAllocateTimeStr = convertDateRange(values.taskAllocateTime);
      const taskCreateTimeStr = convertDateRange(values.taskCreateTime);
      const firstProcessTimeStr = convertDateRange(values.firstProcessTime);
      const submitDateStr = convertDateRange(values.submitDate);
      const loanAppDateStr = convertDateRange(values.loanAppDate);
      const reviewDateStr = convertDateRange(values.reviewDate);
      const issuedDateStr = convertDateRange(values.issuedDate);
      const params = {
        ...values,
        registerTime: registerTimeStr,
        closedTime: closedTimeStr,
        lastDealTime: lastDealTimeStr,
        taskCreateTime: taskCreateTimeStr,
        taskAllocateTime: taskAllocateTimeStr,
        firstAssignTime: firstAssignTimeStr,
        firstProcessTime: firstProcessTimeStr,
        submitDate: submitDateStr,
        loanAppDate: loanAppDateStr,
        reviewDate: reviewDateStr,
        issuedDate: issuedDateStr,
        pageNo: current,
        pageSize,
      };
      result = params;
    });
    return result;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const pagination = {
      current: 1,
      pageSize: 50,
    };
    const params = this.getFormData(pagination);
    this.props.submitForm(params);
  }

  // 触发二级select框接收新的props
  handleChange = () => {
    this.setState(preState => ({ chageFlag: !preState.chageFlag }));
  }

  exportReportList = (pagination) => {
    const params = this.getFormData(pagination);
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

  clearData =() => {
    const { resetFields } = this.props.form;
    resetFields();
    this.props.clearData();
  }

  handleOk = () => {
    this.props.closeModal();
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const
      { employeeGroupId,
        taskReportData,
        taskFileList,
        taskVisible,
        taskExportLoading } = this.props;
    const { listData = {}, taskStatusInfo = {}, loadingTaskReport } = taskReportData;
    const { records = [], totalRecords = 0, isFetching } = taskFileList;
    const { pageNo = 1, pageSize = 50 } = listData;
    const totalrecords = listData.totalRecords || 0;
    const { newRegist = {}, loanApp = {}, auditFollowUp = {}, sign = {} } = taskStatusInfo;

    const operationResultOptions = {
      remote: '/borrower/v1/condition/operationresult?taskStatus={:val}',
      parentName: 'taskStatus',
      parentValue: getFieldValue('taskStatus'),
      parentType: 'multiple',
    };

    const detailTypeOptions = {
      remote: '/borrower/v1/condition/operationdetail?operationResult={:val}',
      parentName: 'dealResult',
      parentValue: getFieldValue('dealResult'),
    };

    const loanTypeOptions = {
      remote: '/borrower/v1/condition/productcode?guidedType={:val}',
      parentName: 'guideSubTask',
      parentValue: getFieldValue('guideSubTask'),
    };

    const ownerEmployeeIdOptions = {
      remote: '/borrower/getUserByGroupId?groupId={:val}',
      parentName: 'ownerEmployeeGroupId',
      parentValue: getFieldValue('ownerEmployeeGroupId'),
    };

    const employeeIdOptions = {
      remote: '/borrower/getUserByGroupId?groupId={:val}',
      parentName: 'employeeGroupId',
      parentValue: getFieldValue('employeeGroupId'),
    };

    const actorEmployeeIdOptions = {
      remote: '/borrower/getUserByGroupId?groupId={:val}',
      parentName: 'actorEmployeeGroupId',
      parentValue: getFieldValue('actorEmployeeGroupId'),
    };

    const loanEmployeeIdOptions = {
      remote: '/borrower/getUserByGroupId?groupId={:val}',
      parentName: 'loanEmployeeGroupId',
      parentValue: getFieldValue('loanEmployeeGroupId'),
    };

    const pagination = {
      current: pageNo,
      total: totalrecords,
      showSizeChanger: true,
      pageSizeOptions: ['50', '80', '100'],
      pageSize,
    };

    const downloadColumns = [{
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
    }, {
      title: '导出时间',
      dataIndex: 'creationDate',
      key: 'creationDate',
      render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
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
      <div className="dr-layout task-report">
        <h3>任务统计报表</h3>
        <Form
          layout="horizontal"
          onSubmit={this.handleSubmit}
        >
          <div className="filter-box">
            <Row gutter={24}>
              <Col span={4}>
                <FormItem
                  label="注册时间"
                >
                  {getFieldDecorator('registerTime')(
                    <RangePicker
                      format={dateFormat}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="任务生成时间"
                >
                  {getFieldDecorator('taskCreateTime')(
                    <RangePicker
                      format={dateFormat}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="最后处理时间"
                >
                  {getFieldDecorator('lastDealTime')(
                    <RangePicker
                      format={dateFormat}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="首次人工处理"
                >
                  {getFieldDecorator('firstProcessTime')(
                    <RangePicker
                      format={dateFormat}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="首次人工分配"
                >
                  {getFieldDecorator('firstAssignTime')(
                    <RangePicker
                      format={dateFormat}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="结案时间"
                >
                  {getFieldDecorator('closedTime')(
                    <RangePicker
                      format={dateFormat}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <FormItem
                  label="最后分配时间"
                >
                  {getFieldDecorator('taskAllocateTime')(
                    <RangePicker
                      format={dateFormat}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="城市"
                >
                  {getFieldDecorator('city')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
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
              <Col span={4}>
                <FormItem
                  label="处理结果"
                >
                  {getFieldDecorator('dealResult', {
                    initialValue: '',
                  })(
                    <CascadeSelect
                      {...operationResultOptions}
                      onChange={this.handleChange.bind(this)}
                    />,
                    )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="处理详细类型"
                >
                  {getFieldDecorator('detailType', {
                    initialValue: '',
                  })(
                    <CascadeSelect {...detailTypeOptions} />,
                    )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="注册来源"
                >
                  {getFieldDecorator('customerOrigin', {
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="" >全部</Option>
                      <Option value="LOANRIVER">Loan River</Option>
                      <Option value="BORROW_APP_MARKET" >Borrow app</Option>
                      <Option value="MARKET_LANDING_PAGE" >Landing Page</Option>
                      <Option value="Wechat" >Wechat</Option>
                      <Option value="Sale_Platform">salesApp</Option>
                      <Option value="CRM">CRM</Option>
                      <Option value="SPEEDLOAN" >SPEEDLOAN</Option>
                      <Option value="LITE" >LITE</Option>
                      <Option value="UNKNOWN" >UNKNOWN</Option>
                    </Select>,
                    )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <FormItem
                  label="任务所有人组别"
                >
                  {getFieldDecorator('ownerEmployeeGroupId', {
                    initialValue: '',
                  })(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={employeeGroupId}
                      treeDefaultExpandAll={false}
                      onChange={this.handleChange.bind(this)}
                      allowClear
                    />,
                    )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="任务所有人"
                >
                  {getFieldDecorator('ownerEmployeeId', {
                    initialValue: '',
                  })(
                    <CascadeSelect {...ownerEmployeeIdOptions} />,
                    )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="负责人组别"
                >
                  {getFieldDecorator('employeeGroupId', {
                    initialValue: '',
                  })(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={employeeGroupId}
                      treeDefaultExpandAll={false}
                      onChange={this.handleChange.bind(this)}
                      allowClear
                    />,
                    )}
                </FormItem>
              </Col>
              <Col span={4}>
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
              <Col span={4}>
                <FormItem
                  label="用户推荐人组别"
                >
                  {getFieldDecorator('actorEmployeeGroupId', {
                    initialValue: '',
                  })(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={employeeGroupId}
                      treeDefaultExpandAll={false}
                      onChange={this.handleChange.bind(this)}
                      allowClear
                    />,
                    )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="用户推荐人"
                >
                  {getFieldDecorator('actorEmployeeId', {
                    initialValue: '',
                  })(
                    <CascadeSelect {...actorEmployeeIdOptions} />,
                    )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <FormItem
                  label="贷款销售组别"
                >
                  {getFieldDecorator('loanEmployeeGroupId', {
                    initialValue: '',
                  })(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={employeeGroupId}
                      treeDefaultExpandAll={false}
                      onChange={this.handleChange.bind(this)}
                      allowClear
                    />,
                    )}
                </FormItem>
              </Col>
              <Col span={4}>
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
              <Col span={4}>
                <FormItem
                  label="是否结案"
                >
                  {getFieldDecorator('closedTag', {
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
              <Col span={4}>
                <FormItem
                  label="首次推荐贷款类型"
                >
                  {getFieldDecorator('firstRecommendPreLoanProduct', {
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">全部</Option>
                      <Option value="DOUBLE_FUND">双金贷</Option>
                      <Option value="OUTSTANDING">新贵贷</Option>
                      <Option value="PROPERTY_OWNER">业主贷</Option>
                      <Option value="LIFE_INSURANCE">寿险贷</Option>
                      <Option value="SPEED_LOAN">SpeedLoan</Option>
                      <Option value="CASH_LOAN">现金贷</Option>
                    </Select>,
                    )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="进件类型"
                >
                  {getFieldDecorator('guideSubTask', {
                    initialValue: '',
                  })(
                    <Select onChange={this.handleChange.bind(this)}>
                      <Option value="">全部</Option>
                      <Option value="BORROW_APPLICATION">贷款申请</Option>
                      <Option value="BORROW_AUTHORIZED">预授信申请</Option>
                    </Select>,
                    )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="贷款类型"
                >
                  {getFieldDecorator('productCode', {
                    initialValue: [],
                  })(
                    <MultipleSelect {...loanTypeOptions} />,
                    )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <FormItem
                  label="贷款创建时间"
                >
                  {getFieldDecorator('loanAppDate')(
                    <RangePicker />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="贷款提交时间"
                >
                  {getFieldDecorator('submitDate')(
                    <RangePicker />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="批复时间"
                >
                  {getFieldDecorator('reviewDate')(
                    <RangePicker />,
                )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="放款时间"
                >
                  {getFieldDecorator('issuedDate')(
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
        <Button className="btn-clear" onClick={this.clearData.bind(this)}>
          清空
        </Button>
        <div className="btn-group">
          <Button
            onClick={this.exportReportList.bind(this, pagination)}
            loading={taskExportLoading}
          >
            导出报表
          </Button>
          <Button onClick={this.downloadReportList.bind(this)}>下载</Button>
        </div>
        <div className="result-section">
          <p>查询结果统计</p>
          <div>
            <p className="result-item-head">新注册<span>{newRegist.total || 0}</span></p>
            <span>符合要求({newRegist.valid || 0})</span>
            <span>不符合要求({newRegist.invalid || 0})</span>
            <span>无需求({newRegist.noDemand || 0})</span>
            <span>联系不上({newRegist.notReachable || 0})</span>
            <span>待跟进({newRegist.followedUp || 0})</span>
            <span>转给直销({newRegist.dirSalesDown || 0})</span>
            <span>未处理({newRegist.doing || 0})</span>
          </div>
          <div>
            <p className="result-item-head">引导进件<span>{loanApp.total || 0}</span></p>
            <span>待安装app({loanApp.appWait || 0})</span>
            <span>待提交贷款申请({loanApp.loanAppWait || 0})</span>
            <span>待完善资料({loanApp.dataWait || 0})</span>
            <span>待跟进({loanApp.followedUp || 0})</span>
            <span>联系不上({loanApp.notReachable || 0})</span>
            <span>无需求({loanApp.noDemand || 0})</span>
            <span>不符合要求({loanApp.invalid || 0})</span>
            <span>退回修改({loanApp.loanReturn || 0})</span>
            <span>已提交审核({loanApp.submitted || 0})</span>
            <span>未处理({loanApp.doing || 0})</span>
          </div>
          <div>
            <p className="result-item-head">审核跟进<span>{auditFollowUp.total || 0}</span></p>
            <span>已通知客户拒绝({auditFollowUp.notifiedToRefuse || 0})</span>
            <span>客户取消({auditFollowUp.customerCancel || 0})</span>
            <span>联系不上({auditFollowUp.notReachable || 0})</span>
            <span>待跟进({auditFollowUp.followedUp || 0})</span>
            <span>补件提交({auditFollowUp.fillSubmit || 0})</span>
            <span>已预约客户签约({auditFollowUp.appointmentContract || 0})</span>
            <span>未处理({auditFollowUp.doing || 0})</span>
          </div>
          <div>
            <p className="result-item-head">签约<span>{sign.total || 0}</span></p>
            <span>已通知客户拒绝({sign.notifiedToRefuse || 0})</span>
            <span>待跟进({sign.followedUp || 0})</span>
            <span>联系不上({sign.notReachable || 0})</span>
            <span>客户取消({sign.customerCancel || 0})</span>
            <span>客户确认({sign.customerApproval || 0})</span>
            <span>签约完成({sign.sign || 0})</span>
            <span>未处理({sign.doing || 0})</span>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={listData && listData.records}
          pagination={pagination}
          onChange={this.onPageChange.bind(this)}
          scroll={{ x: 4900, y: 650 }}
          size="middle"
          loading={loadingTaskReport}
        />
        {
          totalrecords > 0 ?
            <div className="total-num">
              <div>总条数： <span>{ totalrecords }</span></div>
            </div>
            : ''
        }
        <Modal
          title="下载导出列表"
          visible={taskVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Spin spinning={isFetching}>
            {
              totalRecords > 0 ?
                <div>
                  <Table
                    columns={downloadColumns}
                    dataSource={records}
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

export default connect(
  state => ({
    employeeGroupId: state.report.employeeGroupId,
    taskReportData: state.report.taskReportData,
    taskFileList: state.report.taskFileList,
    taskVisible: state.report.taskVisible,
    taskExportLoading: state.report.taskExportLoading,
  }),
  dispatch => ({
    getEmployeeGroupId: () => dispatch({ type: 'report/getEmployeeGroupId' }),
    submitForm: params => dispatch({ type: 'report/taskReportSubmit', payload: params }),
    exportReportList: params => dispatch({ type: 'report/exportReportList', payload: params }),
    downloadReportList: () => dispatch({ type: 'report/downloadReportList' }),
    deleteFile: params => dispatch({ type: 'report/deleteFile', payload: params }),
    deleteAll: () => dispatch({ type: 'report/deleteAll' }),
    closeModal: () => dispatch({ type: 'report/closeModal' }),
    clearData: () => dispatch({ type: 'report/clearTaskReportData' }),
  }),
)(Form.create()(TaskReport));

function convertDateRange(data) {
  let startStr = '';
  let endStr = '';
  if (!Array.isArray(data)) return undefined;
  if (Array.isArray(data) && data.length < 2) return undefined;
  startStr = data[0] && +data[0].startOf('day');
  endStr = data[1] && +data[1].startOf('day') + 86399999;
  return `${startStr}-${endStr}`;
}
