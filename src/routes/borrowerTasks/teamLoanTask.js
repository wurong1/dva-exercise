import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { DatePicker, Table, Form, Select, Button, Row, Col, TreeSelect, Modal, Spin } from 'antd';
import moment from 'moment';

import PageNav from '../../components/page-nav';
import DeployModal from './teamDeployModal';
import TransferModal from './teamTransferModal';
import SignModal from './teamSignModal';
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
    id: 'NEW',
    name: '意向申请',
  }, {
    id: 'CREATED',
    name: '用户资料已经完成',
  }, {
    id: 'PREHOLD',
    name: '进件退回',
  }, {
    id: 'WITHDRAWN',
    name: '进件已取消',
  },
];

const columns = [
  {
    title: '借款人Id',
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
    title: '客户姓名',
    dataIndex: 'customerName',
    key: 'customerName',
    width: 100,
    fixed: 'left',
  }, {
    title: '电话号码',
    dataIndex: 'cellPhone',
    key: 'cellPhone',
    width: 100,
  }, {
    title: '贷款申请城市',
    dataIndex: 'appCity ',
    key: 'appCity ',
    width: 150,
  }, {
    title: '注册时间',
    dataIndex: 'borrowerStatusDate',
    key: 'borrowerStatusDate',
    sorter: true,
    sorterKey: 'BORROW_STATUS_DATE',
    width: 150,
    render: text => <span>{text ? moment(Number(text)).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
  }, {
    title: '注册来源',
    dataIndex: 'customerOrigin',
    key: 'customerOrigin',
    width: 150,
  }, {
    title: '渠道',
    dataIndex: 'marketChannel',
    key: 'marketChannel',
    width: 150,
  }, {
    title: '意向用户来源',
    dataIndex: 'intentionSourceType',
    key: 'intentionSourceType',
    width: 100,
  }, {
    title: '进件类型',
    dataIndex: 'guideSubTask',
    key: 'guideSubTask',
    width: 100,
  }, {
    title: '贷款类型',
    dataIndex: 'productCode',
    key: 'productCode',
    width: 100,
  }, {
    title: '贷款状态',
    dataIndex: 'appStatus',
    key: 'appStatus',
    width: 100,
  }, {
    title: '处理结果',
    dataIndex: 'operationResult',
    key: 'operationResult',
    width: 150,
  }, {
    title: '客户资料已完成',
    dataIndex: 'customerDocumentStatus',
    key: 'customerDocumentStatus',
    width: 100,
  }, {
    title: '最后处理时间',
    dataIndex: 'lastProcessTime',
    key: 'lastProcessTime',
    sorter: true,
    sorterKey: 'LAST_PROCESS_TIME',
    width: 150,
    render: text => <p>{text ? moment(Number(text)).format('YYYY-MM-DD HH:mm:ss') : ''}</p>,
  }, {
    title: '负责人组别',
    dataIndex: 'employeeGroupName',
    key: 'employeeGroupName',
    width: 200,
  }, {
    title: '负责人',
    dataIndex: 'employeeName',
    key: 'employeeName',
    width: 200,
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
    title: '借款销售组别',
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

class TeamLoanTaskPage extends Component {
  state = {
    isReset: false,
    isFollowedUp: false,
    defaultDate: [moment().subtract(3, 'months'), moment().startOf('day')],
  };

  componentWillMount() {
    const {
      getEmployeeGroup,
      getIntentionsource,
      getLoanProductcode,
      getButtonConfig,
    } = this.props;
    getEmployeeGroup();
    getIntentionsource();
    getLoanProductcode('');
    getButtonConfig('LOANAPPGUIDED');
  }

  getProductcodeList = (type) => {
    const { getLoanProductcode } = this.props;
    getLoanProductcode(type);
  }

  handleChange = () => {
    this.setState(preState => ({ chageFlag: !preState.chageFlag }));
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { loanTaskSearch, searchList: { records }, form: { getFieldsValue } } = this.props;
    if (records && records.length > 0) {
      const formData = getFieldsValue();
      const resultData = formData;
      if (sorter.order) {
        resultData.column = sorter.column && sorter.column.sorterKey;
        resultData.order = sorter.order === 'ascend' ? 'asc' : 'desc';
        loanTaskSearch(resultData, { pageNo: 1 });
      }
    }
  }

  deploy = (btnConfig) => {
    const { buttonType } = btnConfig;
    const { showLoanDeployModal, showLoanTransferModal, showSignTransferModal } = this.props;
    if (buttonType === 'TO_ALLOCATE') {
      showLoanDeployModal(true);
    }
    if (buttonType === 'TO_BRANCH') {
      showLoanTransferModal(true);
    }
    if (buttonType === 'TO_CONTRACT') {
      showSignTransferModal(true);
    }
  }

  handleDeployCancel = () => {
    const { showLoanDeployModal } = this.props;
    showLoanDeployModal(false);
  }

  handleTransferCancel = () => {
    const { showLoanTransferModal } = this.props;
    showLoanTransferModal(false);
  }

  handleSignCancel = () => {
    const { showSignTransferModal } = this.props;
    showSignTransferModal(false);
  }

  pageChange = (pageNo) => {
    const { taskLoan: { formData = {} } } = this.props;
    const params = {
      ...formData,
      pageNo,
    };
    this.props.taskLoanPageChange(params);
  }

  isFollowedUp = (val) => {
    if (val === 'TO_BE_FOLLOWED_UP') {
      this.setState({ isFollowedUp: true });
    } else {
      this.setState({ isFollowedUp: false });
    }
  }

  handleReset = () => {
    const { form: { resetFields }, getLoanProductcode, loanSearchListReset } = this.props;
    this.setState({ isReset: true, isFollowedUp: false });
    resetFields();
    getLoanProductcode('');
    loanSearchListReset();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { loanTaskSearch, form: { getFieldsValue } } = this.props;
    const formData = getFieldsValue();
    loanTaskSearch(formData, { pageNo: 1 });
  };

  disabledDate = (current) => {
    return current && current.valueOf() >= moment().endOf('day');
  }

  render() {
    const { isFollowedUp, defaultDate } = this.state;
    const {
      employeeGroupList,
      intentionsourceList,
      productcodeList,
      searchList,
      loading,
      form: {
        getFieldDecorator,
        getFieldValue,
      },
      taskLoan = {},
      modal,
    } = this.props;
    const { buttonConfig, selectedRows = [], formData, reload } = taskLoan;
    const { loanDeployVisible, loanTransferVisible, loanSignVisible } = modal;
    const records = searchList.records || [];
    const employeeIdOptions = {
      remote: '/borrower/getUserByGroupId?groupId={:val}',
      parentName: 'employeeGroupId',
      parentValue: getFieldValue('employeeGroupId'),
    };
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
        taskOptions: 'LOANAPPGUIDED',
        flag: 'GROUP_TASK',
      },
    };

    const rowSelection = {
      onChange: (selectedRowKeys, selectedrows) => {
        this.props.taskLoansetRows(selectedrows);
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
                  <FormItem label="证件号码" >
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
                  <FormItem label="邮箱" >
                    {getFieldDecorator('email')(
                      <TrimInput />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={2}>
                  <FormItem label="市场推广渠道" >
                    {getFieldDecorator('borrowMarketChannel')(
                      <TrimInput />,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="进件类型" >
                    {getFieldDecorator('guideSubTask', {
                      initialValue: '',
                    })(
                      <Select
                        onChange={this.getProductcodeList}
                      >
                        <Option value="">全部</Option>
                        <Option value="BORROW_APPLICATION">借款申请</Option>
                        <Option value="BORROW_AUTHORIZED">预授信申请</Option>
                        <Option value="BORROW_PRE_APPLICATION">预申请</Option>
                      </Select>,
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
                  <FormItem label="意向用户来源" >
                    {getFieldDecorator('intentionSourceType', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">全部</Option>
                        {
                          intentionsourceList && intentionsourceList.map((val) => {
                            return <Option key={val.code} value={val.code}>{val.name}</Option>;
                          })
                        }
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="注册来源" >
                    {getFieldDecorator('customerOrigin', {
                      initialValue: '',
                    })(
                      <Select dropdownMatchSelectWidth={false}>
                        <Option value="">全部</Option>
                        <Option value="LOANRIVER">Loan River</Option>
                        <Option value="BA">Borrow app</Option>
                        <Option value="LP">Landing Page</Option>
                        <Option value="WX">Wechat</Option>
                        <Option value="SP">salesApp</Option>
                        <Option value="CL">Cash loan</Option>
                        <Option value="MS">Main Site</Option>
                        <Option value="NB">New borrower</Option>
                        <Option value="BD">BD</Option>
                        <Option value="CRM">CRM</Option>
                        <Option value="SL">SPEEDLOAN</Option>
                        <Option value="LT">LITE</Option>
                        <Option value="NOTSET">来源为空</Option>
                        <Option value="UN">UNKNOWN</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="客户资料已完成" >
                    {getFieldDecorator('customerData', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">全部</Option>
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="负责人组别" >
                    {getFieldDecorator('employeeGroupId')(
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
                  <FormItem label="负责人" >
                    {getFieldDecorator('employeeId')(
                      <CascadeSelect {...employeeIdOptions} />,
                    )}
                  </FormItem>
                </Col>
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
              </Row>
              <Row gutter={24}>
                <Col span={2}>
                  <FormItem label="贷款销售" >
                    {getFieldDecorator('loanEmployeeId')(
                      <CascadeSelect {...loanEmployeeIdOptions} />,
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
                        <Option value="APPWAIT">待安装APP</Option>
                        <Option value="lOANAPPWAIT">待提交贷款申请</Option>
                        <Option value="DATAWAIT">待完善资料</Option>
                        <Option value="LOANRETURN">电销退回进件</Option>
                        <Option value="NOT_REACHABLE">联系不上</Option>
                        <Option value="TO_BE_FOLLOWED_UP">待跟进</Option>
                        <Option value="VALID">符合要求</Option>
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
            pagination={false}
            rowSelection={rowSelection}
            scroll={{ x: 2900, y: 550 }}
            rowKey={(record, idx) => idx}
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
          visible={loanDeployVisible}
          onCancel={this.handleDeployCancel}
          footer={null}
        >
          <Spin spinning={modal.loading}>
            <DeployModal key={loanDeployVisible} taskOptions="LOANAPPGUIDED" taskType="GROUP_TASK" />
          </Spin>
        </Modal>
        <Modal
          title="转给分公司"
          visible={loanTransferVisible}
          onCancel={this.handleTransferCancel}
          footer={null}
        >
          <Spin spinning={modal.loading}>
            <TransferModal key={loanTransferVisible} taskOptions="LOANAPPGUIDED" taskType="GROUP_TASK" />
          </Spin>
        </Modal>
        <Modal
          title="分配签约人"
          visible={loanSignVisible}
          onCancel={this.handleSignCancel}
          footer={null}
        >
          <Spin spinning={modal.loading}>
            <SignModal key={loanSignVisible} taskOptions="LOANAPPGUIDED" taskType="GROUP_TASK" />
          </Spin>
        </Modal>
      </div>
    );
  }
}

TeamLoanTaskPage.propTypes = {
};

export default connect(
  state => ({
    employeeGroupList: state.teamTasks.employeeGroupList,
    intentionsourceList: state.teamTasks.intentionsourceList,
    productcodeList: state.teamTasks.loanProductcodeList,
    searchList: state.teamTasks.loanTaskList,
    loading: state.teamTasks.loanTaskLoading,
    taskLoan: state.teamTasks.taskLoan,
    modal: state.teamTasks.modal,
  }),
  dispatch => ({
    getEmployeeGroup: () => {
      dispatch({ type: 'teamTasks/getEmployeeGroup' });
    },
    getIntentionsource: () => {
      dispatch({ type: 'teamTasks/getIntentionsource' });
    },
    getLoanProductcode: (guidedType) => {
      dispatch({ type: 'teamTasks/getLoanProductcode', payload: guidedType });
    },
    loanSearchListReset: () => {
      dispatch({ type: 'teamTasks/loanSearchListReset' });
    },
    loanTaskSearch: (formData, pageData) => {
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
      resultData.taskOptions = 'LOANAPPGUIDED';
      resultData.flag = 'GROUP_TASK';
      resultData.pageNo = pageData.pageNo;
      resultData.pageSize = pageData.pageSize;
      dispatch({ type: 'teamTasks/loanTaskSearch', payload: resultData });
    },
    getButtonConfig: parmas => dispatch({ type: 'teamTasks/getButtonConfig', payload: parmas }),
    taskLoansetRows: parmas => dispatch({ type: 'teamTasks/taskLoansetRows', payload: parmas }),
    showLoanDeployModal: parmas => dispatch({ type: 'teamTasks/showLoanDeployModal', payload: parmas }),
    showLoanTransferModal: parmas => dispatch({ type: 'teamTasks/showLoanTransferModal', payload: parmas }),
    showSignTransferModal: parmas => dispatch({ type: 'teamTasks/showSignTransferModal', payload: parmas }),
    taskLoanPageChange: parmas => dispatch({ type: 'teamTasks/taskLoanPageChange', payload: parmas }),
  }),
)(Form.create()(TeamLoanTaskPage));
