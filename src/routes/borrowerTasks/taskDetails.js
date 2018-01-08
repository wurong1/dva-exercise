import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Button, Select, Input, Icon, Modal, message, Dropdown, Menu, BackTop } from 'antd';
import LoanTaskDetail from './loanTaskDetail';
import LoanDetailReadonly from './loanDetailReadonly';
import LoanDetailNotcreated from './loanDetailNotcreated';
import LoanNotcreatedReadonly from './loanNotcreatedReadonly';
import PreAuthorizeDetail from './preAuthorizeDetail';
import NewTaskDetails from './detailsOfNew';
import NewTaskDetailsReadonly from './detailsOfNewReadonly';
import HoldTaskDetails from './detailsOfHold';
import HoldTaskDetailsReadonly from './detailsOfHoldReadonly';
import SignTaskDetails from './detailsOfSign';
import SignTaskDetailsReadonly from './detailsOfSignReadonly';
import AddContract from './addContract';
import SmsModal from './smsModal';
import LoanRiverDetails from './loanRiver/loanRiver';
import request from '../../utils/request';

const InputGroup = Input.Group;
const { Option } = Select;

class TaskDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flage: false,
      phoneId: null,
      phoneNo: null,
    };
  }

  componentWillMount() {
    const { getTaskDetails, routingQuery: { taskId, actorId } } = this.props;
    if (actorId) {
      const url = `/borrower/v1/task/related-task-id/${actorId}`;
      request(url)
      .then((res) => {
        getTaskDetails(res);
      });
    }
    if (taskId) {
      getTaskDetails(taskId);
    }
  }

  getLoanDetail() {
    const {
      taskDetailsList: {
        pageReadOnly,
        guideSubTask,
        loanBaseInfor,
        taskId,
      },
      taskDetailsList,
    } = this.props;
    const { loanAppId, loanIntention } = loanBaseInfor || {};
    let detail;
    if (guideSubTask === 'BORROW_AUTHORIZED') {
      detail = <PreAuthorizeDetail getDetailPhone={this.getDetailPhone} getDetailSsn={this.getDetailSsn} />;
    } else if (guideSubTask === 'BORROW_PRE_APPLICATION') {
      detail = (<LoanRiverDetails
        taskId={taskId}
        taskDetailsList={taskDetailsList}
        getDetailPhone={this.getDetailPhone}
        getDetailSsn={this.getDetailSsn}
      />);
    } else if (loanAppId && loanIntention === '0') {
      if (pageReadOnly) {
        detail = (
          <LoanDetailReadonly
            getDetailPhone={this.getDetailPhone}
            getDetailSsn={this.getDetailSsn}
          />
        );
      } else {
        detail = (
          <LoanTaskDetail
            getDetailPhone={this.getDetailPhone}
            getDetailSsn={this.getDetailSsn}
          />
        );
      }
    } else if (pageReadOnly) {
      detail = (
        <LoanNotcreatedReadonly
          getDetailPhone={this.getDetailPhone}
          getDetailSsn={this.getDetailSsn}
        />
      );
    } else {
      detail = (
        <LoanDetailNotcreated
          getDetailPhone={this.getDetailPhone}
          getDetailSsn={this.getDetailSsn}
        />
      );
    }
    return detail;
  }

  getSmsInfo = () => {
    let step;
    const {
      taskDetailsList: {
        taskId,
        status,
        customerInfor: {
          customerId,
        },
      },
      contract: {
        currentPhoneId,
      },
    } = this.props;
    switch (status) {
      case 'NEWREGIST':
        step = 1; break;
      case 'LOANAPPGUIDED':
        step = 2; break;
      case 'AUDITFOLLOWUP':
        step = 3; break;
      case 'SIGN':
        step = 4; break;
      default:
        step = null;
    }
    this.props.getSmsInfo({ taskId, customerId, id: currentPhoneId, step });
  }

  getDetailPhone = () => { // 详情页面电话号码脱敏
    const {
      taskDetailsList: {
        customerInfor: {
          actorId,
        },
      },
    } = this.props;
    this.props.getDetailPhoneNo(actorId);
  }

  getDetailSsn = () => { // 详情页面身份证码脱敏
    const {
      taskDetailsList: {
        customerInfor: {
          actorId,
        },
      },
    } = this.props;
    this.props.getDetailSsn(actorId);
  }

  showSmsModal = (falg) => {
    this.props.showSmsModal(falg);
  }

  showAddcontractModal = (falg) => {
    this.props.showAddcontractModal(falg);
  }

  handleMenuClick = (e) => { // 电话列表脱敏
    this.props.getPhoneNo(e.key);
  }

  showPhoneNo = (id, e) => {
    e.stopPropagation();
    this.props.showPhoneNo(id);
  }

  handleVisibleChange = (flag) => {
    this.setState({ visible: flag });
  }

  handleCallOut = (params) => {
    if (!params.extNo) {
      message.error('请绑定分机！');
    } else {
      window.open(`/bcrm/call_out.html?taskId=${params.taskId}&phoneId=${params.currentPhoneId}`);
    }
  }

  render() {
    const {
      getTaskDetailsHold,
      getTaskDetailSucceed,
      taskDetailsList: {
        status,
        taskId,
        pageReadOnly,
      },
      smsModal: {
        visible,
      },
      addContractModal,
      contract: {
        mailList,
        phoneList,
        weixinList,
        qqList,
        success,
        defaultMail,
        defaultQq,
        defaultWeixin,
        currentPhoneNo,
        isBusyNo,
        currentPhoneId,
        currentOrginPhoneNo,
      },
      callVendor: {
        extNo,
      } = {},
    } = this.props;
    const dqq = defaultQq || (qqList.length > 0 ? qqList[0].id : '');
    const dweixin = defaultWeixin || (weixinList.length > 0 ? weixinList[0].id : '');
    const dmail = defaultMail || (mailList.length > 0 ? mailList[0].id : '');
    const callParams = {
      taskId,
      currentPhoneId,
      currentOrginPhoneNo,
      extNo,
    };
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        {
          phoneList.map((item) => {
            return (
              <Menu.Item key={item.id}>
                {`${item.showOriginPhone ? item.originNo : item.contactNo}${item.enableBusy === 'Y' ? '(常用)' : ''}`}
                <span
                  className={item.showOriginPhone ? 'icon-showpsw' : 'icon-closepsw'}
                  style={{ marginLeft: '5px' }}
                  onClick={this.showPhoneNo.bind(this, item.id)}
                />
              </Menu.Item>
            );
          })
        }
      </Menu>
    );
    return (
      <div className="">
        <div className="tool">
          {
            success &&
            <InputGroup compact>
              <span className="label">电话：</span>
              <Dropdown
                overlay={menu}
                trigger={['click']}
                onVisibleChange={this.handleVisibleChange}
                visible={this.state.visible}
              >
                <Button>
                  {isBusyNo ? `${currentPhoneNo}(常用)` : currentPhoneNo}
                  <Icon type="down" />
                </Button>
              </Dropdown>
              <Button
                disabled={phoneList.length < 1 || !currentPhoneId}
                onClick={this.handleCallOut.bind(this, callParams)}
              >
                <Icon type="phone" style={{ color: '#00c386' }} />
              </Button>
              {
                qqList.length > 0 &&
                  <span className="label">QQ：</span>
              }
              {
                qqList.length > 0 &&
                <Select
                  defaultValue={`${dqq}`}
                  style={{ width: 'auto' }}
                >
                  {
                    qqList.map((item, idx) => {
                      return <Option value={`${item.id}`} key={idx}>{`${item.contactNo}${item.enableFriendship === 'Y' ? '(已添加)' : ''}`}</Option>;
                    })
                  }
                </Select>
              }
              {
                weixinList.length > 0 &&
                  <span className="label">微信：</span>
              }
              {
                weixinList.length > 0 &&
                <Select
                  defaultValue={`${dweixin}`}
                  style={{ width: 'auto' }}
                >
                  {
                    weixinList.map((item, idx) => {
                      return <Option value={`${item.id}`} key={idx}>{`${item.contactNo}${item.enableFriendship === 'Y' ? '(已添加)' : ''}`}</Option>;
                    })
                  }
                </Select>
              }
              {
                mailList.length > 0 &&
                  <span className="label">邮箱：</span>
              }
              {
                mailList.length > 0 &&
                <Select
                  defaultValue={`${dmail}`}
                  style={{ width: 'auto' }}
                >
                  {
                    mailList.map((item, idx) => {
                      return <Option value={`${item.id}`} key={idx}>{`${item.contactNo}${item.enableBusy === 'Y' ? '(常用)' : ''}`}</Option>;
                    })
                  }
                </Select>
              }
              <Button
                type="primary"
                onClick={this.getSmsInfo}
                disabled={phoneList.length < 1 || !currentPhoneId}
              >
                发短信
              </Button>
              <Button onClick={this.showAddcontractModal.bind(this, true)}><Icon type="plus" /></Button>
            </InputGroup>
          }
        </div>
        <h3 className="dr-section-font">任务详情</h3>
        <Spin spinning={getTaskDetailsHold}>
          <div className="task-container">
            {
              getTaskDetailSucceed && status === 'NEWREGIST' ? pageReadOnly ? <NewTaskDetailsReadonly getDetailPhone={this.getDetailPhone} getDetailSsn={this.getDetailSsn} /> : <NewTaskDetails getDetailPhone={this.getDetailPhone} getDetailSsn={this.getDetailSsn} /> :
              status === 'LOANAPPGUIDED' ? this.getLoanDetail() :
              status === 'AUDITFOLLOWUP' ? pageReadOnly ? <HoldTaskDetailsReadonly getDetailPhone={this.getDetailPhone} getDetailSsn={this.getDetailSsn} /> : <HoldTaskDetails getDetailPhone={this.getDetailPhone} getDetailSsn={this.getDetailSsn} /> :
              status === 'SIGN' ? pageReadOnly ? <SignTaskDetailsReadonly getDetailPhone={this.getDetailPhone} getDetailSsn={this.getDetailSsn} /> : <SignTaskDetails getDetailPhone={this.getDetailPhone} getDetailSsn={this.getDetailSsn} /> :
              <div>加载中...</div>
            }
          </div>
        </Spin>
        <Modal
          title="发短信"
          visible={visible}
          onCancel={this.showSmsModal.bind(this, false)}
          footer={null}
        >
          <SmsModal />
        </Modal>
        <Modal
          title="新增联系方式"
          visible={addContractModal.visible}
          onCancel={this.showAddcontractModal.bind(this, false)}
          footer={null}
        >
          <AddContract />
        </Modal>
        <div className="calculator-box">
          <Link to="/calculator" target="_blank">
            <img src={require('../../assets/ic_calculator.png')} role="presentation" />
          </Link>
          <BackTop visibilityHeight={0}>
            <div className="ant-back-top-inner"><Icon type="arrow-up" /></div>
          </BackTop>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    getTaskDetailsHold: state.taskDetails.getTaskDetailsHold,
    getTaskDetailSucceed: state.taskDetails.getTaskDetailSucceed,
    routingQuery: state.routing.locationBeforeTransitions.query,
    taskDetailsList: state.taskDetails.taskDetailsList || {},
    smsModal: state.taskDetails.smsModal,
    addContractModal: state.taskDetails.addContractModal,
    contract: state.taskDetails.contract,
    callVendor: state.user.callVendor || {},
  }),
  dispatch => ({
    getTaskDetails: (params) => { dispatch({ type: 'taskDetails/getTaskDetails', payload: params }); },
    showSmsModal: (params) => { dispatch({ type: 'taskDetails/showSmsModal', payload: params }); },
    showAddcontractModal: (params) => { dispatch({ type: 'taskDetails/showAddcontractModal', payload: params }); },
    getSmsInfo: (params) => { dispatch({ type: 'taskDetails/getSmsInfo', payload: params }); },
    getPhoneNo: params => dispatch({ type: 'taskDetails/getPhoneNo', payload: params }),
    showPhoneNo: params => dispatch({ type: 'taskDetails/showPhoneNo', payload: params }),
    getDetailPhoneNo: params => dispatch({ type: 'taskDetails/getDetailPhoneNo', payload: params }),
    getDetailSsn: params => dispatch({ type: 'taskDetails/getDetailSsn', payload: params }),
  }),
)(TaskDetails);
