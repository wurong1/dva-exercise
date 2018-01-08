import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Modal, Spin, Select, Steps, Tabs } from 'antd';
import moment from 'moment';
import DealModal from './dealModal';
import TypeModal from './typeModal';
import LoanInfo from '../../components/borrow';
import BaseInfo from './baseInfo';
import OperationRecord from './operationRecord';

const { Option } = Select;
const Step = Steps.Step;
const TabPane = Tabs.TabPane;

class LoanDetailReadonly extends Component {

  onCancel = () => {
    const params = {
      value: '',
      show: false,
      isClosed: '',
    };
    this.props.showDealModal(params);
  }

  getTitle = (status) => {
    let title = '';
    switch (status) {
      case 'DATAWAIT':
        title = '待完善资料'; break;
      case 'TO_BE_FOLLOWED_UP':
        title = '待跟进'; break;
      case 'NOT_REACHABLE':
        title = '联系不上'; break;
      case 'TRANSFER':
        title = '转给分公司'; break;
      case 'WITHDRAWAL':
        title = '取消录单'; break;
      default:
        title = '';
    }
    return title;
  }

  showTypeModal = (flag) => {
    this.props.showTypeModal(flag);
  }

  showOthers = (flag, e) => {
    e.preventDefault();
    this.props.showOthers(flag);
  }

  handleButtonChange = (value) => {
    const params = {
      value,
      show: true,
    };
    this.props.showDealModal(params);
  }

  showBackeditModal = (flag) => {
    this.props.showBackeditModal(flag);
  }

  handleBackedit = () => {
    const {
      taskInfo: {
        customerInfor: {
          customerId,
          actorId,
        } = {},
        loanBaseInfor: {
          loanAppId,
        } = {},
        taskId,
        status,
      },
    } = this.props;
    const params = {
      customerId,
      taskId,
      actorId,
      loanId: loanAppId,
      taskStatus: status,
      operationResult: 'LOANRETURN',
    };
    this.props.backeditSubmit(params);
  }

  showUpdatecloseModal = (flag) => {
    this.props.showUpdatecloseModal(flag);
  }

  handleUpdateclose = () => {
    const { isClosed } = this.state;
    const {
      taskInfo: {
        customerInfor: {
          customerId,
          actorId,
        } = {},
        taskId,
        status,
      },
    } = this.props;
    const params = {
      customerId,
      taskId,
      actorId,
      taskStatus: status,
      isClosed,
    };
    this.props.updatecloseSubmit(params);
  }

  render() {
    const {
      taskInfo: {
        customerInfor = {},
        loanBaseInfor = {},
        isClosed,
        status,
        readOnly,
        ossDownloadMethod,
        isClosedList,
        taskId,
      },
      loanDetail = {},
      getTaskDetailSucceed,
      reload,
    } = this.props;
    const {
      actorId,
      actorName,
      phone,
    } = customerInfor;
    const {
      loanAppStatus,
      loanAppId,
      loanId,
      loanType,
      createdDate,
      expiredDate,
      tenant,
      modified,
      loanAppSource,
      loanAppStatusCode,
      loanTypeCode,
      routingSystem,
      productCode,
      newProductCode,
    } = loanBaseInfor;
    const {
      showothers,
      showdealModal,
      showbackeditModal,
      showupdatecloseModal,
      backeditloading,
      updatecloseloading,
      dealStatus,
      showResult,
      typeModal = {},
    } = loanDetail;
    const title = this.getTitle(dealStatus);
    let configCode;
    let taskStatus;
    if (status === 'AUDITFOLLOWUP') {
      taskStatus = 'hold';
    } else if (status === 'SIGN') {
      taskStatus = 'sign';
    }
    if (loanAppSource === 'CRM' || loanAppSource === 'LITE') {
      configCode = 'crm_created';
    } else {
      configCode = 'crm';
    }
    const loanInfoData = {
      aid: actorId,
      code: configCode,
      configCode: loanAppSource,
      configProductCode: productCode,
      cusName: actorName,
      detailType: status,
      isNewLoanType: 'NO',
      isReadonly: readOnly,
      loanAppStatusCode,
      loanId: loanAppId,
      loanStatus: loanAppStatusCode,
      loanType: loanTypeCode,
      ossDownloadMethod,
      routingSystem,
      taskStatus,
      userPhone: phone,
      realLoanId: loanId,
      isPreAuthorize: false,
      newProductCode,
    };

    return (
      <div className="crm-tab">
        <Tabs defaultActiveKey="details" className="tabs">
          <TabPane tab="任务详情" key="details">
            <div>
              <div className="crm-section">
                <div className="step">
                  <Steps current={1}>
                    <Step title="新注册" />
                    <Step title="引导进件" />
                    <Step title="审核跟进" />
                    <Step title="签约" />
                  </Steps>
                </div>
                <Row>
                  <Col span={3}>
                    <h3>贷款信息</h3>
                  </Col>
                  <Col span={3}>
                    <p>贷款申请状态</p>
                    <span>{loanAppStatus}</span>
                  </Col>
                  <Col span={3}>
                    <p>贷款申请ID</p>
                    <span>{loanAppId}</span>
                  </Col>
                  <Col span={3}>
                    <p>贷款类型</p>
                    <span>{loanType}</span>
                  </Col>
                  <Col span={3}>
                    <p>贷款创建时间</p>
                    <span>{createdDate && moment(createdDate).format('YYYY-MM-DD')}</span>
                  </Col>
                  <Col span={3}>
                    <p>贷款ID</p>
                    <span>{loanId}</span>
                  </Col>
                  <Col span={3}>
                    <p>是否结案</p>
                    <span>{ isClosed && (isClosed === 2 ? '否' : '是')}</span>
                  </Col>
                  {
                    modified &&
                    <Col span={3}>
                      <Button
                        type="primary"
                        onClick={this.showTypeModal.bind(this, true)}
                        style={{ float: 'right', zIndex: 100 }}
                      >
                        修改贷款产品
                      </Button>
                    </Col>
                  }
                </Row>
                <Row>
                  <Col span={3} offset={3}>
                    <p>贷款过期时间</p>
                    <span>{expiredDate && moment(expiredDate).format('YYYY-MM-DD')}</span>
                  </Col>
                  <Col span={3}>
                    <p>贷款来源</p>
                    <span>{loanAppSource}</span>
                  </Col>
                  <Col span={3}>
                    <p>租户号</p>
                    <span>{tenant}</span>
                  </Col>
                </Row>
              </div>
              <div style={{ display: showothers ? 'block' : 'none' }} className="crm-btn-group">
                <p style={{ marginBottom: '10px' }}>其他处理方式</p>
                <Button onClick={this.handleButtonChange.bind(this, 'DATAWAIT')}>待完善资料</Button>
                <Button onClick={this.handleButtonChange.bind(this, 'TO_BE_FOLLOWED_UP')}>待跟进</Button>
                <Button onClick={this.handleButtonChange.bind(this, 'NOT_REACHABLE')}>联系不上</Button>
                <Button onClick={this.handleButtonChange.bind(this, 'WITHDRAWAL')}>取消录单</Button>
                <Button onClick={this.handleButtonChange.bind(this, 'TRANSFER')}>保存并转给分公司</Button>
                { showResult &&
                  <div style={{ margin: '10px 0px' }}>
                    <p>处理结果 <span style={{ color: '#999999' }}>{title}</span></p>
                  </div>
                }
                <a onClick={this.showOthers.bind(this, false)}>返回</a>
              </div>
              <div style={{ display: showothers ? 'none' : 'block' }} className="crm-btn-group">
                {
                  getTaskDetailSucceed &&
                    <LoanInfo loanInfoData={loanInfoData} key={reload} />
                }
                { (loanAppStatusCode === 'CREATED' || loanAppStatusCode === 'NEW') &&
                  <Button
                    onClick={this.showBackeditModal.bind(this, true)}
                    style={{ display: loanType === 'SpeedLoan' ? 'none' : 'inline-block' }}
                  >
                    退回修改
                  </Button>
                }
                {
                  loanAppStatusCode !== 'EXPIRED' &&
                  <Button onClick={this.showUpdatecloseModal.bind(this, true)}>修改结案状态</Button>
                }
                {
                  (loanAppStatusCode === 'CREATED' || loanAppStatusCode === 'PREHOLD' || loanAppStatusCode === 'NEW') &&
                  <Button onClick={this.showOthers.bind(this, true)}>其他处理方式</Button>
                }
              </div>
              <Modal
                visible={showdealModal}
                footer={null}
                onCancel={this.onCancel}
                title={title}
              >
                <DealModal />
              </Modal>
              <Modal
                visible={typeModal.visible}
                footer={null}
                onCancel={this.showTypeModal.bind(this, false)}
                title="修改贷款产品"
              >
                <TypeModal />
              </Modal>
              <Modal
                visible={showbackeditModal}
                onOk={this.handleBackedit.bind(this)}
                onCancel={this.showBackeditModal.bind(this, false)}
                title="退回修改"
              >
                <Spin spinning={backeditloading}>
                  <p>确认将进件退回客户修改?</p>
                  <p>退回后客户需要在borrow app上修改后重新提交。</p>
                </Spin>
              </Modal>
              <Modal
                visible={showupdatecloseModal}
                onOk={this.handleUpdateclose.bind(this)}
                onCancel={this.showUpdatecloseModal.bind(this, false)}
                title="修改结案状态"
              >
                <Spin spinning={updatecloseloading}>
                  <Row>
                    <Col span={4}>
                      是否结案：{ isClosed && (isClosed === 2 ? '否' : '是')}
                    </Col>
                    <Col span={6}>
                      <Select
                        onChange={(value) => { this.setState({ isClosed: value }); }}
                        style={{ width: '150px' }}
                        defaultValue=""
                      >
                        <Option value="">-请选择-</Option>
                        {
                          isClosedList.map((item, idx) => {
                            return <Option value={item.code} key={idx}>{item.name}</Option>;
                          })
                        }
                      </Select>
                    </Col>
                  </Row>
                </Spin>
              </Modal>
              <BaseInfo
                getDetailPhone={this.props.getDetailPhone}
                getDetailSsn={this.props.getDetailSsn}
              />
            </div>
          </TabPane>
          <TabPane tab="操作记录" key="record">
            <OperationRecord taskId={taskId} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default connect(
  state => ({
    taskInfo: state.taskDetails.taskDetailsList || {},
    getTaskDetailSucceed: state.taskDetails.getTaskDetailSucceed,
    reload: state.taskDetails.reload,
    loanDetail: state.loanDetail,
  }),
  dispatch => ({
    showOthers: params => dispatch({ type: 'loanDetail/showOthers', payload: params }),
    showDealModal: params => dispatch({ type: 'loanDetail/showDealModal', payload: params }),
    showTypeModal: params => dispatch({ type: 'loanDetail/showTypeModal', payload: params }),
    showBackeditModal: params => dispatch({ type: 'loanDetail/showBackeditModal', payload: params }),
    showUpdatecloseModal: params => dispatch({ type: 'loanDetail/showUpdatecloseModal', payload: params }),
    reviewSubmit: params => dispatch({ type: 'loanDetail/reviewSubmit', payload: params }),
    backeditSubmit: params => dispatch({ type: 'loanDetail/backeditSubmit', payload: params }),
    updatecloseSubmit: params => dispatch({ type: 'loanDetail/updatecloseSubmit', payload: params }),
  }),
)(LoanDetailReadonly);

