import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { DatePicker, Table, Form, Select, Button, Row, Col, TreeSelect, Modal, Spin } from 'antd';
import moment from 'moment';
import PageNav from '../../components/page-nav';
import DeployModal from './myDeployModal';
import TransferModal from './myTransferModal';
import SignModal from './mySignModal';
import TrimInput from '../../components/input-trim';
import MultipleSelect from '../../components/select-multiple';
import CascadeSelect from '../../components/select-cascade';
import './borrowerTasks.less';

moment.locale('zh-cn');
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;

const appStatusList = [
  {
    id: 'SUBMITTED',
    name: '已提交',
  }, {
    id: 'REJECTED',
    name: '审核拒绝',
  }, {
    id: 'HOLD',
    name: '补件中',
  }, {
    id: 'IN_REVIEW',
    name: '审核中',
  }, {
    id: 'WITHDRAWN',
    name: '客户取消',
  }, {
    id: 'APPROVED',
    name: '等待客户确认',
  },
];
const columns = [
  {
    title: '借款人ID',
    dataIndex: 'actorId',
    key: 'actorId',
    render: (text, record) => {
      return text ?
        <Link target="_blank" to={`/taskDetails?taskId=${record && record.taskId}`}>{text}</Link>
      : '';
    },
    width: 100,
    fixed: 'left',
  }, {
    title: '贷款ID',
    dataIndex: 'realLoanId',
    key: 'realLoanId',
    width: 100,
    fixed: 'left',
  }, {
    title: '电话号码',
    dataIndex: 'cellPhone',
    key: 'cellPhone',
    width: 100,
  }, {
    title: '客户姓名',
    dataIndex: 'customerName',
    key: 'customerName',
    width: 100,
  }, {
    title: '贷款申请城市',
    dataIndex: 'appCity',
    key: 'appCity',
    width: 150,
  }, {
    title: '贷款类型',
    dataIndex: 'productCode',
    key: 'productCode',
    width: 100,
  }, {
    title: '贷款金额',
    dataIndex: 'appAmount',
    key: 'appAmount',
    width: 100,
  }, {
    title: '贷款创建时间',
    dataIndex: 'appDate',
    key: 'appDate',
    sorter: true,
    sorterKey: 'LOAN_APP_DATE',
    width: 150,
    render: text => <span>{text ? moment(Number(text)).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
  }, {
    title: '贷款申请状态',
    dataIndex: 'appStatus',
    key: 'appStatus',
    width: 100,
  }, {
    title: '处理结果',
    dataIndex: 'operationResult',
    key: 'operationResult',
    width: 150,
  }, {
    title: '最后处理时间',
    dataIndex: 'lastProcessTime',
    key: 'lastProcessTime',
    sorter: true,
    sorterKey: 'LAST_PROCESS_TIME',
    width: 150,
    render: text => <span>{text ? moment(Number(text)).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
  }, {
    title: '用户推荐人组别',
    dataIndex: 'offEmployeeGroupName',
    key: 'offEmployeeGroupName',
    width: 200,
  }, {
    title: '用户推荐人',
    dataIndex: 'offEmployeeName',
    key: 'offEmployeeName',
    width: 200,
  }, {
    title: '借款所属销售组别',
    dataIndex: 'loanEmployeeGroupName',
    key: 'loanEmployeeGroupName',
    width: 200,
  }, {
    title: '借款所属销售',
    dataIndex: 'loanEmployeeName',
    key: 'loanEmployeeName',
    width: 200,
  },
];

class MyHoldTaskPage extends Component {
  state = {
    isReset: false,
    isFollowedUp: false,
    defaultDate: [moment().subtract(3, 'months'), moment().startOf('day')],
  };

  componentWillMount() {
    const { getEmployeeGroup, getHoldProductcode, getButtonConfig } = this.props;
    getEmployeeGroup();
    getHoldProductcode('');
    getButtonConfig('AUDITFOLLOWUP');
  }

  isFollowedUp = (val) => {
    if (val === 'TO_BE_FOLLOWED_UP') {
      this.setState({ isFollowedUp: true });
    } else {
      this.setState({ isFollowedUp: false });
    }
  }

  handleChange = () => {
    this.setState(preState => ({ chageFlag: !preState.chageFlag }));
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { holdTaskSearch, searchList: { records }, form: { getFieldsValue } } = this.props;
    if (records && records.length > 0) {
      const formData = getFieldsValue();
      const resultData = formData;
      if (sorter.order) {
        resultData.column = sorter.column && sorter.column.sorterKey;
        resultData.order = sorter.order === 'ascend' ? 'asc' : 'desc';
        holdTaskSearch(resultData, { pageNo: 1 });
      }
    }
  }

  deploy = (btnConfig) => {
    const { buttonType } = btnConfig;
    const { showHoldDeployModal, showHoldTransferModal, showHoldSignModal } = this.props;
    if (buttonType === 'TO_ALLOCATE') {
      showHoldDeployModal(true);
    }
    if (buttonType === 'TO_BRANCH') {
      showHoldTransferModal(true);
    }
    if (buttonType === 'TO_CONTRACT') {
      showHoldSignModal(true);
    }
  }

  handleDeployCancel = () => {
    const { showHoldDeployModal } = this.props;
    showHoldDeployModal(false);
  }

  handleTransferCancel = () => {
    const { showHoldTransferModal } = this.props;
    showHoldTransferModal(false);
  }

  handleSignCancel = () => {
    const { showHoldSignModal } = this.props;
    showHoldSignModal(false);
  }

  pageChange = (pageNo) => {
    const { taskHold: { formData = {} } } = this.props;
    const params = {
      ...formData,
      pageNo,
    };
    this.props.taskHoldPageChange(params);
  }

  handleReset = () => {
    const { holdSearchListReset, form: { resetFields } } = this.props;
    resetFields();
    this.setState({ isReset: true, isFollowedUp: false });
    holdSearchListReset();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { holdTaskSearch } = this.props;
    const formData = this.props.form.getFieldsValue();
    holdTaskSearch(formData, { pageNo: 1 });
  };

  disabledDate = (current) => {
    return current && current.valueOf() >= moment().endOf('day');
  }

  render() {
    const { isFollowedUp, defaultDate } = this.state;
    const {
      employeeGroupList,
      productcodeList,
      searchList,
      loading,
      form: {
        getFieldDecorator,
        getFieldValue,
      },
      taskHold = {},
      modal,
    } = this.props;
    const { buttonConfig, selectedRows = [], formData, reload } = taskHold;
    const { holdDeployVisible, holdTransferVisible, holdSignVisible } = modal;
    const records = searchList.records || [];
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
      currentCount: searchList.totalRecords,
      pageSize: searchList.pageSize,
      pageNo: searchList.pageNo || 1,
      showPageNav: records.length > 0,
      values: {
        ...formData,
        taskOptions: 'AUDITFOLLOWUP',
        flag: 'MINE_TASK',
      },
    };

    const rowSelection = {
      onChange: (selectedRowKeys, selectedrows) => {
        this.props.taskHoldsetRows(selectedrows);
      },
    };

    return (
      <div>
        <div>
          <Form onSubmit={this.handleSubmit}>
            <div className="crm-filter-box">
              <Row gutter={24}>
                <Col span={4}>
                  <FormItem label="注册时间" >
                    {getFieldDecorator('borrowerStatusDate')(
                      <RangePicker disabledDate={this.disabledDate} />,
                    )}
                  </FormItem>
                </Col>
                <Col span={4}>
                  <FormItem label="最后处理时间" >
                    {getFieldDecorator('lastProcessTime')(
                      <RangePicker disabledDate={this.disabledDate} />,
                    )}
                  </FormItem>
                </Col>
                <Col span={4}>
                  <FormItem label="任务生效起始时间" >
                    {getFieldDecorator('taskStartedDate', {
                      initialValue: defaultDate,
                    })(
                      <RangePicker disabledDate={this.disabledDate} />,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="借款人ID" >
                    {getFieldDecorator('actorId')(
                      <TrimInput />,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="证件号" >
                    {getFieldDecorator('ssn')(
                      <TrimInput />,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="客户姓名" >
                    {getFieldDecorator('customerName')(
                      <TrimInput />,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="电话号码" >
                    {getFieldDecorator('cellPhone')(
                      <TrimInput />,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="贷款申请城市" >
                    {getFieldDecorator('appCity')(
                      <TrimInput />,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="贷款类型" >
                    {getFieldDecorator('productCodes', {
                      initialValue: [],
                    })(
                      <MultipleSelect options={productcodeList || []} />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={2}>
                  <FormItem label="贷款申请状态" >
                    {getFieldDecorator('appStatus', {
                      initialValue: [],
                    })(
                      <MultipleSelect options={appStatusList || []} />,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="处理结果" >
                    {getFieldDecorator('operationResult', {
                      initialValue: '',
                    })(
                      <Select
                        onChange={value => this.isFollowedUp(value)}
                        dropdownMatchSelectWidth={false}
                      >
                        <Option value="">全部</Option>
                        <Option value="EMPTY">空</Option>
                        <Option value="TO_BE_FOLLOWED_UP">待跟进</Option>
                        <Option value="NOT_REACHABLE">联系不上</Option>
                        <Option value="FILL_SUBMIT">补件提交</Option>
                        <Option value="APPOINTMENT_CONTRACT">已预约客户签约</Option>
                        <Option value="INVALID">不符合要求</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                {
                  isFollowedUp ?
                    <Col span={4}>
                      <FormItem label="预约回访时间" >
                        {getFieldDecorator('feedbackTime')(
                          <RangePicker />,
                        )}
                      </FormItem>
                    </Col>
                  : null
                }
                <Col span={2}>
                  <FormItem label="用户推荐人组别" >
                    {getFieldDecorator('borrowEmployeeGroupId')(
                      <TreeSelect
                        treeData={employeeGroupList}
                        dropdownMatchSelectWidth={false}
                        treeDefaultExpandAll={false}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        onChange={this.handleChange.bind(this)}
                        allowClear
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="用户推荐人" >
                    {getFieldDecorator('borrowEmployeeId')(
                      <CascadeSelect {...borrowEmployeeIdOptions} />,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="贷款销售组别" >
                    {getFieldDecorator('loanEmployeeGroupId')(
                      <TreeSelect
                        treeData={employeeGroupList}
                        dropdownMatchSelectWidth={false}
                        treeDefaultExpandAll={false}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        onChange={this.handleChange.bind(this)}
                        allowClear
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="贷款销售" >
                    {getFieldDecorator('loanEmployeeId')(
                      <CascadeSelect {...loanEmployeeIdOptions} />,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="提交风控方式" >
                    {getFieldDecorator('isNewLoanType', {
                      initialValue: '',
                    })(
                      <Select
                        onChange={value => this.isFollowedUp.bind(this, value)}
                      >
                        <Option value="">全部</Option>
                        <Option value="YES">自动提交</Option>
                        <Option value="NO">手动提交</Option>
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
          <Button className="btn-clear" onClick={this.handleReset.bind(this)}>
            清空
          </Button>
        </div>
        <div>
          <Table
            dataSource={records}
            columns={columns}
            loading={loading}
            rowSelection={rowSelection}
            pagination={false}
            rowKey={(record, idx) => idx}
            scroll={{ x: 2100, y: 550 }}
            size="middle"
            onChange={this.handleTableChange}
            footer={(currentPageData) => {
              return currentPageData.length > 0 ? footer : null;
            }}
            key={loading}
          />
        </div>
        <PageNav {...pagination} onChange={this.pageChange} key={reload} />
        <Modal
          title="调配"
          visible={holdDeployVisible}
          onCancel={this.handleDeployCancel}
          footer={null}
        >
          <Spin spinning={modal.loading}>
            <DeployModal key={holdDeployVisible} taskOptions="AUDITFOLLOWUP" taskType="MINE_TASK" />
          </Spin>
        </Modal>
        <Modal
          title="转给分公司"
          visible={holdTransferVisible}
          onCancel={this.handleTransferCancel}
          footer={null}
        >
          <Spin spinning={modal.loading}>
            <TransferModal key={holdTransferVisible} taskOptions="AUDITFOLLOWUP" taskType="MINE_TASK" />
          </Spin>
        </Modal>
        <Modal
          title="分配签约人"
          visible={holdSignVisible}
          onCancel={this.handleSignCancel}
          footer={null}
        >
          <Spin spinning={modal.loading}>
            <SignModal key={holdSignVisible} taskOptions="AUDITFOLLOWUP" taskType="MINE_TASK" />
          </Spin>
        </Modal>
      </div>
    );
  }
}

MyHoldTaskPage.propTypes = {
};

export default connect(
  state => ({
    employeeGroupList: state.myTasks.employeeGroupList,
    productcodeList: state.myTasks.holdProductcodeList,
    searchList: state.myTasks.holdTaskList,
    loading: state.myTasks.holdTaskLoading,
    taskHold: state.myTasks.taskHold,
    modal: state.myTasks.modal,
  }),
  dispatch => ({
    getEmployeeGroup: () => {
      dispatch({ type: 'myTasks/getEmployeeGroup' });
    },
    getHoldProductcode: (guidedType) => {
      dispatch({ type: 'myTasks/getHoldProductcode', payload: guidedType });
    },
    holdSearchListReset: () => {
      dispatch({ type: 'myTasks/holdSearchListReset' });
    },
    holdTaskSearch: (formData, pageData) => {
      const resultData = formData;
      for (const x in resultData) {
        if (['borrowerStatusDate', 'lastProcessTime', 'taskStartedDate', 'feedbackTime'].indexOf(x) > -1 && resultData[x]) {
          if (resultData[x].length > 0) {
            const startDay = +resultData[x][0].startOf('day');
            const endDay = +resultData[x][1].startOf('day') + 86399999;
            resultData[x] = `${startDay}-${endDay}`;
          } else {
            delete resultData[x];
          }
        }
      }
      resultData.taskOptions = 'AUDITFOLLOWUP';
      resultData.flag = 'MINE_TASK';
      resultData.pageNo = pageData.pageNo;
      dispatch({ type: 'myTasks/holdTaskSearch', payload: resultData });
    },
    getButtonConfig: parmas => dispatch({ type: 'myTasks/getButtonConfig', payload: parmas }),
    taskHoldsetRows: parmas => dispatch({ type: 'myTasks/taskHoldsetRows', payload: parmas }),
    showHoldDeployModal: parmas => dispatch({ type: 'myTasks/showHoldDeployModal', payload: parmas }),
    showHoldTransferModal: parmas => dispatch({ type: 'myTasks/showHoldTransferModal', payload: parmas }),
    showHoldSignModal: parmas => dispatch({ type: 'myTasks/showHoldSignModal', payload: parmas }),
    taskHoldPageChange: parmas => dispatch({ type: 'myTasks/taskHoldPageChange', payload: parmas }),
  }),
)(Form.create()(MyHoldTaskPage));
