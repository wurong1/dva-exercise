import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Modal, Steps, Spin, Select, Tabs } from 'antd';
import moment from 'moment';
import DealModal from './dealModal';
import LoanInfo from '../../components/borrow';
import BaseInfo from './baseInfo';
import OperationRecord from './operationRecord';

const { Option } = Select;
const Step = Steps.Step;
const TabPane = Tabs.TabPane;

class PreAuthorizeDetail extends Component {

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
      loanAppSource,
      loanAppStatusCode,
      loanTypeCode,
      routingSystem,
      productCode,
    } = loanBaseInfor;
    const {
      showothers,
      showdealModal,
      showupdatecloseModal,
      updatecloseloading,
      dealStatus,
      showResult,
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
      isPreAuthorize: true,
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
                    <span>{createdDate && moment(createdDate).format('YYYY-MM-DD HH:mm:ss')}</span>
                  </Col>
                  <Col span={3}>
                    <p>贷款ID</p>
                    <span>{loanId}</span>
                  </Col>
                  <Col span={3}>
                    <p>是否结案</p>
                    <span>{ isClosed && (isClosed === 2 ? '否' : '是')}</span>
                  </Col>
                  <Col span={3} offset={3}>
                    <p>贷款过期时间</p>
                    <span>{expiredDate && moment(expiredDate).format('YYYY-MM-DD')}</span>
                  </Col>
                </Row>
              </div>
              <div style={{ display: showothers ? 'block' : 'none' }} className="crm-btn-group">
                <p style={{ marginBottom: '10px' }}>其他处理方式</p>
                <Button onClick={this.handleButtonChange.bind(this, 'DATAWAIT')}>待完善资料</Button>
                <Button onClick={this.handleButtonChange.bind(this, 'TO_BE_FOLLOWED_UP')}>待跟进</Button>
                <Button onClick={this.handleButtonChange.bind(this, 'NOT_REACHABLE')}>联系不上</Button>
                <Button onClick={this.handleButtonChange.bind(this, 'TRANSFER')}>保存并转给分公司</Button>
                { showResult &&
                  <div style={{ margin: '10px 0px' }}>
                    <p>处理结果 <span style={{ color: '#999999' }}>{title}</span></p>
                  </div>
                }
                <a onClick={this.showOthers.bind(this, false)}>返回</a>
              </div>
              <div style={{ display: showothers ? 'none' : 'block' }}>
                {
                  getTaskDetailSucceed &&
                    <LoanInfo loanInfoData={loanInfoData} key={reload} />
                }
                <div className="crm-btn-group">
                  <Button onClick={this.showUpdatecloseModal.bind(this, true)}>修改结案状态</Button>
                  <Button onClick={this.showOthers.bind(this, true)}>其他处理方式</Button>
                </div>
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
                visible={showupdatecloseModal}
                onOk={this.handleUpdateclose.bind(this)}
                onCancel={this.showUpdatecloseModal.bind(this, false)}
                title="修改结案状态"
              >
                <Spin spinning={updatecloseloading}>
                  <Row>
                    <Col span={6}>
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
    showUpdatecloseModal: params => dispatch({ type: 'loanDetail/showUpdatecloseModal', payload: params }),
    updatecloseSubmit: params => dispatch({ type: 'loanDetail/updatecloseSubmit', payload: params }),
  }),
)(PreAuthorizeDetail);

