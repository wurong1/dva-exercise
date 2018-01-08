import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { DatePicker, Table, Form, Select, Button, Row, Col, Modal, Spin } from 'antd';
import moment from 'moment';
import PageNav from '../../components/page-nav';
import DeployModal from './teamDeployModal';
import TransferModal from './teamTransferModal';
import SignModal from './teamSignModal';
import TrimInput from '../../components/input-trim';
import MultipleSelect from '../../components/select-multiple';
import './borrowerTasks.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;

const appStatusList = [
  {
    id: 'REJECTED',
    name: '审核拒绝',
  }, {
    id: 'OFFER_ACCEPTED',
    name: '客户接受',
  }, {
    id: 'ACCEPTED',
    name: '签约条件已验证',
  }, {
    id: 'WITHDRAWN',
    name: '客户取消',
  }, {
    id: 'APPROVED',
    name: '等待客户确认',
  }, {
    id: 'IN_FUNDING',
    name: '投资中',
  }, {
    id: 'ISSUING',
    name: '放款中',
  }, {
    id: 'ISSUED',
    name: '已放款',
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
    title: '客户姓名',
    dataIndex: 'customerName',
    key: 'customerName',
    width: 100,
  }, {
    title: '电话号码',
    dataIndex: 'cellPhone',
    key: 'cellPhone',
    width: 100,
  }, {
    title: '城市',
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
    width: 150,
    render: text => <span>{text ? moment(Number(text)).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
  }, {
    title: '贷款申请状态',
    dataIndex: 'appStatus',
    key: 'appStatus',
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
    title: '任务所有人组别',
    dataIndex: 'ownerEmployeeGroupName',
    key: 'ownerEmployeeGroupName',
    width: 200,
  }, {
    title: '任务所有人',
    dataIndex: 'ownerEmployeeName',
    key: 'ownerEmployeeName',
    width: 200,
  },
];

class ContractorPage extends Component {
  state = {
    isFollowedUp: false,
  };

  componentWillMount() {
    const { getButtonConfig, getSignProductcode } = this.props;
    getButtonConfig('CONTRACT');
    getSignProductcode('');
  }

  isFollowedUp = (val) => {
    if (val === 'TO_BE_FOLLOWED_UP') {
      this.setState({ isFollowedUp: true });
    } else {
      this.setState({ isFollowedUp: false });
    }
  }

  handleReset = () => {
    const { contractorSearchListReset, form: { resetFields } } = this.props;
    this.setState({ isFollowedUp: false });
    resetFields();
    contractorSearchListReset();
  };

  deploy = (btnConfig) => {
    const { buttonType } = btnConfig;
    const {
      showContractDeployModal,
      showContractTransferModal,
      showContractSignModal,
    } = this.props;
    if (buttonType === 'TO_ALLOCATE') {
      showContractDeployModal(true);
    }
    if (buttonType === 'TO_BRANCH') {
      showContractTransferModal(true);
    }
    if (buttonType === 'TO_CONTRACT') {
      showContractSignModal(true);
    }
  }

  handleDeployCancel = () => {
    const { showContractDeployModal } = this.props;
    showContractDeployModal(false);
  }

  handleTransferCancel = () => {
    const { showContractTransferModal } = this.props;
    showContractTransferModal(false);
  }

  handleSignCancel = () => {
    const { showContractSignModal } = this.props;
    showContractSignModal(false);
  }

  pageChange = (pageNo) => {
    const { taskContract: { formData = {} } } = this.props;
    const params = {
      ...formData,
      pageNo,
    };
    this.props.taskContractPageChange(params);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { contractorSearch, form: { getFieldsValue } } = this.props;
    const formData = getFieldsValue();
    contractorSearch(formData, { pageNo: 1 });
  };

  disabledDate = (current) => {
    return current && current.valueOf() >= moment().endOf('day');
  }

  render() {
    const { isFollowedUp } = this.state;
    const {
      productcodeList,
      searchList,
      loading,
      form: {
        getFieldDecorator,
      },
      taskContract = {},
      modal,
    } = this.props;
    const { buttonConfig, selectedRows = [], formData, reload } = taskContract;
    const { contractDeployVisible, contractTransferVisible, contractSignVisible } = modal;
    const records = searchList.records || [];

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
        taskOptions: 'SIGN',
        flag: 'GROUP_CONTRACT',
      },
    };

    const rowSelection = {
      onChange: (selectedRowKeys, selectedrows) => {
        this.props.taskContractsetRows(selectedrows);
      },
    };

    return (
      <div className="task">
        <h3>签约人分配后查询</h3>
        <div style={{ marginTop: '30px' }}>
          <Form onSubmit={this.handleSubmit}>
            <div className="crm-filter-box">
              <Row gutter={16}>
                <Col span={4}>
                  <FormItem label="最后处理时间" >
                    {getFieldDecorator('lastProcessTime')(
                      <RangePicker disabledDate={this.disabledDate} />,
                    )}
                  </FormItem>
                </Col>
                <Col span={4}>
                  <FormItem label="任务生效起始时间" >
                    {getFieldDecorator('taskStartedDate')(
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
                  <FormItem label="城市" >
                    {getFieldDecorator('intentionCity')(
                      <TrimInput />,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="贷款类型" >
                    {getFieldDecorator('productCodes')(
                      <MultipleSelect options={productcodeList || []} />,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="贷款申请状态" >
                    {getFieldDecorator('appStatus')(
                      <MultipleSelect options={appStatusList || []} />,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="提交风控方式" >
                    {getFieldDecorator('isNewLoanType')(
                      <Select
                        onChange={value => this.isFollowedUp(value)}
                      >
                        <Option value="">全部</Option>
                        <Option value="YES">自动提交</Option>
                        <Option value="NO">手动提交</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem label="处理结果" >
                    {getFieldDecorator('operationResult')(
                      <Select
                        onChange={value => this.isFollowedUp(value)}
                      >
                        <Option value="">全部</Option>
                        <Option value="EMPTY">空</Option>
                        <Option value="NOTIFIED_TO_REFUSE">已通知客户拒绝</Option>
                        <Option value="NOT_REACHABLE">联系不上</Option>
                        <Option value="CUSTOMER_CANCEL">客户取消</Option>
                        <Option value="CUSTOMER_APPROVAL">客户确认</Option>
                        <Option value="TO_BE_FOLLOWED_UP">待跟进</Option>
                        <Option value="DERATE">降额</Option>
                        <Option value="RETROVERSION">签约回退</Option>
                      </Select>,
                  )}
                  </FormItem>
                </Col>
              </Row>
              {
                isFollowedUp ?
                  <Row>
                    <Col span={4}>
                      <FormItem label="预约回访时间" >
                        {getFieldDecorator('feedbackTime')(
                          <RangePicker />,
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                : null
              }
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
          <Button className="btn-clear" onClick={this.handleReset}>
            清空
          </Button>
        </div>
        <div>
          <Table
            dataSource={records}
            columns={columns}
            loading={loading}
            rowKey={(record, idx) => idx}
            rowSelection={rowSelection}
            pagination={false}
            scroll={{ x: 2150, y: 550 }}
            size="middle"
            footer={(currentPageData) => {
              return currentPageData.length > 0 ? footer : null;
            }}
            key={loading}
          />
        </div>
        <PageNav {...pagination} onChange={this.pageChange} key={reload} />
        <Modal
          title="调配"
          visible={contractDeployVisible}
          onCancel={this.handleDeployCancel}
          footer={null}
        >
          <Spin spinning={modal.loading}>
            <DeployModal key={contractDeployVisible} taskOptions="CONTRACT" taskType="GROUP_CONTRACT" />
          </Spin>
        </Modal>
        <Modal
          title="转给分公司"
          visible={contractTransferVisible}
          onCancel={this.handleTransferCancel}
          footer={null}
        >
          <Spin spinning={modal.loading}>
            <TransferModal key={contractTransferVisible} taskOptions="CONTRACT" taskType="GROUP_CONTRACT" />
          </Spin>
        </Modal>
        <Modal
          title="分配签约人"
          visible={contractSignVisible}
          onCancel={this.handleSignCancel}
          footer={null}
        >
          <Spin spinning={modal.loading}>
            <SignModal key={contractSignVisible} taskOptions="CONTRACT" taskType="GROUP_CONTRACT" />
          </Spin>
        </Modal>
      </div>
    );
  }
}

ContractorPage.propTypes = {
};

export default connect(
    state => ({
      productcodeList: state.teamTasks.signProductcodeList,
      searchList: state.teamTasks.contractorList,
      loading: state.teamTasks.contractorLoading,
      taskContract: state.teamTasks.taskContract,
      modal: state.teamTasks.modal,
    }),
    dispatch => ({
      getSignProductcode: (guidedType) => {
        dispatch({ type: 'teamTasks/getSignProductcode', payload: guidedType });
      },
      contractorSearchListReset: () => {
        dispatch({ type: 'teamTasks/contractorSearchListReset' });
      },
      contractorSearch: (formData) => {
        const resultData = formData;
        for (const x in resultData) {
          if (['taskStartedDate', 'lastProcessTime', 'feedbackTime'].indexOf(x) > -1 && resultData[x]) {
            if (resultData[x].length > 0) {
              const startDay = +resultData[x][0].startOf('day');
              const endDay = +resultData[x][1].startOf('day') + 86399999;
              resultData[x] = `${startDay}-${endDay}`;
            } else {
              delete resultData[x];
            }
          }
        }
        resultData.taskOptions = 'SIGN';
        resultData.flag = 'GROUP_CONTRACT';
        dispatch({ type: 'teamTasks/contractorSearch', payload: resultData });
      },
      getButtonConfig: parmas => dispatch({ type: 'teamTasks/getButtonConfig', payload: parmas }),
      taskContractsetRows: parmas => dispatch({ type: 'teamTasks/taskContractsetRows', payload: parmas }),
      showContractDeployModal: parmas => dispatch({ type: 'teamTasks/showContractDeployModal', payload: parmas }),
      showContractTransferModal: parmas => dispatch({ type: 'teamTasks/showContractTransferModal', payload: parmas }),
      showContractSignModal: parmas => dispatch({ type: 'teamTasks/showContractSignModal', payload: parmas }),
      taskContractPageChange: parmas => dispatch({ type: 'teamTasks/taskContractPageChange', payload: parmas }),
    }),
)(Form.create()(ContractorPage));
