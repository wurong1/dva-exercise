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
import CascadeSelect from '../../components/select-cascade';
import './borrowerTasks.less';

moment.locale('zh-cn');
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;

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
    render: (text, record) => {
      return record && record.actorId ?
        text
      : text ?
        <Link target="_blank" to={`/taskDetails?taskId=${record && record.taskId}`}>{text}</Link>
        : '';
    },
  }, {
    title: '意向城市',
    dataIndex: 'intentionCity',
    key: 'intentionCity',
    width: 150,
  }, {
    title: '手机归属地城市',
    dataIndex: 'phoneCity',
    key: 'phoneCity',
    width: 150,
  }, {
    title: '用户类型',
    dataIndex: 'customerType',
    key: 'customerType',
    width: 100,
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
    title: '首次推荐贷款产品',
    dataIndex: 'firstRecommendPreLoanProduct',
    key: 'firstRecommendPreLoanProduct',
    width: 150,
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
  },
];

class TeamNewTaskPage extends Component {
  state = {
    isReset: false,
    isFollowedUp: false,
    defaultDate: [moment().subtract(3, 'months'), moment().startOf('day')],
    disabledDate: [moment().add(1, 'day'), ''],
  };

  componentWillMount() {
    const { getEmployeeGroup, getIntentionsource, getFirstRecommend, getButtonConfig } = this.props;
    getEmployeeGroup();
    getIntentionsource();
    getFirstRecommend();
    getButtonConfig('NEWREGIST');
  }

  isFollowedUp = (val) => {
    if (val === 'TO_BE_FOLLOWED_UP') {
      this.setState({ isFollowedUp: true });
    } else {
      this.setState({ isFollowedUp: false });
    }
  }

  handleReset = () => {
    const { newSearchListReset, form: { resetFields } } = this.props;
    this.setState({ isReset: true, isFollowedUp: false });
    resetFields();
    newSearchListReset();
  };

  handleChange = () => {
    this.setState(preState => ({ chageFlag: !preState.chageFlag }));
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { newTaskSearch, searchList: { records }, form: { getFieldsValue } } = this.props;
    if (records && records.length > 0) {
      const formData = getFieldsValue();
      const resultData = formData;
      if (sorter.order) {
        resultData.column = sorter.column && sorter.column.sorterKey;
        resultData.order = sorter.order === 'ascend' ? 'asc' : 'desc';
        newTaskSearch(resultData, { pageNo: 1 });
      }
    }
  }

  deploy = (btnConfig) => {
    const { buttonType } = btnConfig;
    const { showNewDeployModal, showNewTransferModal, showNewSignModal } = this.props;
    if (buttonType === 'TO_ALLOCATE') {
      showNewDeployModal(true);
    }
    if (buttonType === 'TO_BRANCH') {
      showNewTransferModal(true);
    }
    if (buttonType === 'TO_CONTRACT') {
      showNewSignModal(true);
    }
  }

  handleDeployCancel = () => {
    const { showNewDeployModal } = this.props;
    showNewDeployModal(false);
  }

  handleTransferCancel = () => {
    const { showNewTransferModal } = this.props;
    showNewTransferModal(false);
  }

  handleSignCancel = () => {
    const { showNewSignModal } = this.props;
    showNewSignModal(false);
  }

  pageChange = (pageNo) => {
    const { taskNew: { formData = {} } } = this.props;
    const params = {
      ...formData,
      pageNo,
    };
    this.props.taskNewPageChange(params);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { newTaskSearch, form: { getFieldsValue } } = this.props;
    const formData = getFieldsValue();
    newTaskSearch(formData, { pageNo: 1 });
  };

  disabledDate = (current) => {
    return current && current.valueOf() >= moment().endOf('day');
  }

  render() {
    const { isFollowedUp, defaultDate } = this.state;
    const {
      employeeGroupList,
      intentionsourceList,
      firstRecommendList,
      searchList,
      loading,
      form: {
        getFieldDecorator,
        getFieldValue,
      },
      taskNew = {},
      modal,
    } = this.props;
    const { buttonConfig, selectedRows = [], formData, reload } = taskNew;
    const { newDeployVisible, newTransferVisible, newSignVisible } = modal;
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
        taskOptions: 'NEWREGIST',
        flag: 'GROUP_TASK',
      },
    };

    const rowSelection = {
      onChange: (selectedRowKeys, selectedrows) => {
        this.props.taskNewsetRows(selectedrows);
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
                  <FormItem label="意向城市" >
                    {getFieldDecorator('intentionCity')(
                      <TrimInput />,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="手机归属地" >
                    {getFieldDecorator('phoneCity')(
                      <TrimInput />,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="市场推广渠道" >
                    {getFieldDecorator('borrowMarketChannel')(
                      <TrimInput />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={2}>
                  <FormItem label="处理结果" >
                    {getFieldDecorator('operationResult', {
                      initialValue: '',
                    })(
                      <Select
                        onChange={value => this.isFollowedUp(value)}
                      >
                        <Option value="">全部</Option>
                        <Option value="EMPTY">空</Option>
                        <Option value="NOT_REACHABLE">联系不上</Option>
                        <Option value="TO_BE_FOLLOWED_UP">待跟进</Option>
                        <Option value="VALID">符合要求</Option>
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
                        <Option value="BA">Borrow app</Option>
                        <Option value="LP">Landing Page</Option>
                        <Option value="WX">Wechat</Option>
                        <Option value="SP">salesApp</Option>
                        <Option value="CL">Cash loan</Option>
                        <Option value="MS">Main Site</Option>
                        <Option value="NB">New borrower</Option>
                        <Option value="BD">BD</Option>
                        <Option value="SL">SPEEDLOAN</Option>
                        <Option value="LT">LITE</Option>
                        <Option value="NOTSET">来源为空</Option>
                        <Option value="UN">UNKNOWN</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="用户类型" >
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
                  <FormItem label="预申请" >
                    {getFieldDecorator('hasPreloanApp', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">全部</Option>
                        <Option value="1">有</Option>
                        <Option value="0">无</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="首次推荐贷款类型" >
                    {getFieldDecorator('firstRecommendPreLoanProduct', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">全部</Option>
                        {
                          firstRecommendList && firstRecommendList.map((val) => {
                            return <Option key={val.id} value={val.id}>{val.name}</Option>;
                          })
                        }
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
            scroll={{ x: 2450, y: 550 }}
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
          visible={newDeployVisible}
          onCancel={this.handleDeployCancel}
          footer={null}
        >
          <Spin spinning={modal.loading}>
            <DeployModal key={newDeployVisible} taskOptions="NEWREGIST" taskType="GROUP_TASK" />
          </Spin>
        </Modal>
        <Modal
          title="转给分公司"
          visible={newTransferVisible}
          onCancel={this.handleTransferCancel}
          footer={null}
        >
          <Spin spinning={modal.loading}>
            <TransferModal key={newTransferVisible} taskOptions="NEWREGIST" taskType="GROUP_TASK" />
          </Spin>
        </Modal>
        <Modal
          title="分配签约人"
          visible={newSignVisible}
          onCancel={this.handleSignCancel}
          footer={null}
        >
          <Spin spinning={modal.loading}>
            <SignModal key={newSignVisible} taskOptions="NEWREGIST" taskType="GROUP_TASK" />
          </Spin>
        </Modal>
      </div>
    );
  }
}

TeamNewTaskPage.propTypes = {
};

export default connect(
  state => ({
    employeeGroupList: state.teamTasks.employeeGroupList,
    intentionsourceList: state.teamTasks.intentionsourceList,
    firstRecommendList: state.teamTasks.firstRecommendList,
    searchList: state.teamTasks.newTaskList,
    loading: state.teamTasks.newTaskLoading,
    taskNew: state.teamTasks.taskNew,
    modal: state.teamTasks.modal,
  }),
  dispatch => ({
    getEmployeeGroup: () => {
      dispatch({ type: 'teamTasks/getEmployeeGroup' });
    },
    getIntentionsource: () => {
      dispatch({ type: 'teamTasks/getIntentionsource' });
    },
    getFirstRecommend: () => {
      dispatch({ type: 'teamTasks/getFirstRecommend' });
    },
    newSearchListReset: () => {
      dispatch({ type: 'teamTasks/newSearchListReset' });
    },
    newTaskSearch: (formData, pageData) => {
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
      resultData.taskOptions = 'NEWREGIST';
      resultData.flag = 'GROUP_TASK';
      resultData.pageNo = pageData.pageNo;
      resultData.pageSize = pageData.pageSize;
      dispatch({ type: 'teamTasks/newTaskSearch', payload: resultData });
    },
    getButtonConfig: parmas => dispatch({ type: 'teamTasks/getButtonConfig', payload: parmas }),
    taskNewsetRows: parmas => dispatch({ type: 'teamTasks/taskNewsetRows', payload: parmas }),
    showNewDeployModal: parmas => dispatch({ type: 'teamTasks/showNewDeployModal', payload: parmas }),
    showNewTransferModal: parmas => dispatch({ type: 'teamTasks/showNewTransferModal', payload: parmas }),
    showNewSignModal: parmas => dispatch({ type: 'teamTasks/showNewSignModal', payload: parmas }),
    taskNewPageChange: parmas => dispatch({ type: 'teamTasks/taskNewPageChange', payload: parmas }),
  }),
)(Form.create()(TeamNewTaskPage));
