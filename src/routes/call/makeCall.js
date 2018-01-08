import { connect } from 'dva';
import React, { Component } from 'react';
import { message } from 'antd';
import UUID from 'uuid';
import moment from 'moment';

import { coccErrorMsg } from '../../plugs/call/coccMsg';

class MakeCall extends Component {
  static propTypes = {
    callVendor: React.PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = {
      callTime: '',
      endTime: '',
      timer: null,
      // 定义几个时间
    };

    this.callWait = {
      callWaitTimer: null,
      callWaitSeconds: 0,
      isConnected: false,
    };
  }

  componentDidMount() {
    this.props.getAgentConf();
  }

  componentDidUpdate(prevProps) {
    // const match = location.href.match(/phoneNo=(\d+)/);
    // const phoneNo = (match && match.length > 1) ? match[1] : null;
    const phoneNo = this.props.callInfo.callResponse.phoneNo;
    const _self = this;
    const callVendor = this.props.callVendor;
    const _vendorType = callVendor.vendorType || 'COCC';

    if (callVendor && prevProps.callVendor.endpoint !== callVendor.endpoint) {
      if (_vendorType === 'COCC') {
        window.cocc_ip = callVendor.endpoint.replace('https://', '');
        window.cocc_is_ssl = true;
        require('../../plugs/call/api/cocc_CJI.js');
      }
      // require.ensure([], (require) => {
      //   if (_vendorType === 'COCC') {
      //     window.cocc_ip = callVendor.endpoint.replace('https://', '');
      //     window.cocc_is_ssl = true;
      //     require('../../plugs/call/api/cocc_CJI.js');
      //   }
      // });
    }

    if (callVendor && callVendor.extNo && prevProps.callVendor.extNo !== callVendor.extNo) {
      window.genUuid = '';
      window.cocc_ip = callVendor.endpoint.replace('https://', '');
      window.cocc_is_ssl = true;
      window.cocc_pwd = this.props.callVendor.agentPwdMd5;
      window.cocc_agentno = this.props.callVendor.agentNo;
      if (this.props.callVendor.agentPwdMd5 === '' || this.props.callVendor.agentNo === '') return false;
      if (_vendorType === 'COCC') {
        window.cocc_lastmodified = null;
        window.cocc_identity = _self.props.callVendor.orgidentity;
        require('../../plugs/call/api/cocc_nginx_http_push.js');
        // 这里调用外呼
        this.onDialOut(`${phoneNo}`, {}, () => {
          // 外呼成功回调
        });
      }
      // require.ensure([], (require) => {
      //   if (_vendorType === 'COCC') {
      //     window.cocc_lastmodified = null;
      //     window.cocc_identity = _self.props.callVendor.orgidentity;
      //     require('../../plugs/call/api/cocc_nginx_http_push.js');
      //     // 这里调用外呼
      //     this.onDialOut(`${phoneId}`, {}, () => {
      //       // 外呼成功回调
      //     });
      //   }
      // });
    }
  }

  onDialOut = (dialOutNumber, params, callback, error) => {
    if ( !dialOutNumber) return message.error('请输入合法的手机号码');

    const agentObj = this.props.callVendor;
    if (!agentObj.extNo || agentObj.extNo === '未绑定') {
      return message.error('您未绑定分机号,不能使用呼叫功能');
    }

    this.callWait.isConnected = false;

    const _vendorType = agentObj.vendorType || 'COCC';
    const calloutUuid = UUID.v4();
    const _self = this;
    window.genUuid = calloutUuid;
    this.setState({
      dialOutDst: dialOutNumber,
      callTime: '',
    }, () => {
      window.startListen(_vendorType, {
        agentId: agentObj.agentNo + '',
        agentGroupId: agentObj.vendorAgentGroupId + ''
      }, {
        uuid: calloutUuid,
        onEvent: {
          onAgentAnswerOut: _self.onAgentAnswerOut,
          onCalleeAnswerOut: _self.onCalleeAnswerOut,
          onAgentHangupOut: _self.onAgentHangupOut,
        },
        onReady: function () {
          // error log
          _self.checkCallOutSuccess(agentObj, calloutUuid);

          window.callout(_vendorType, {
            cb: (err, json) => {
              if (err) {
                _self.props.showLoading(false);
                _self.props.setEndFlag();
                return message.error('makeCallCJI error!');
              }
              const backCode = json.message;
              if (backCode !== 'BackMsg_19') {
                error && error();
                _self.props.showLoading(false);
                _self.props.setEndFlag();
                return message.error('error.' + coccErrorMsg(backCode));
              }

              clearTimeout(_self.callWait.callWaitTimer);
              _self.callWait = {
                callWaitTimer: null,
                callWaitSeconds: 0,
                isConnected: true,
              };
              callback();
            },
            phoneNo: dialOutNumber,
            uuid: calloutUuid,
            agentId: agentObj.agentNo + '',
            agentGroupId: agentObj.vendorAgentGroupId + '',
            orgidentity: agentObj.orgidentity + '',
            agentPwdMd5: agentObj.agentPwdMd5 + '',
            modelId: agentObj.vendorModelId
          });
        },
        platform: { // platform only user for OLA
          url: _self.state.callurl
        }
      });
    });
  }

  checkCallOutSuccess = (params, calloutUuid) => {
    const check = () => {
      const { callWaitSeconds, isConnected } = this.callWait;
      if (callWaitSeconds === 30 && !isConnected) {
        message.error('外呼请求超时,请稍后刷新页面重试.');
        const errorMsg = {
          code: 'crm-flag',
          message: 'connect cocc timeout'
        };
      } else if (!isConnected) {
        this.callWait.callWaitSeconds = callWaitSeconds + 1;
        this.callWait.callWaitTimer = setTimeout(check, 1000);
      }
    };
    check();
  }

  onAgentRingingOut = () => {
    // 坐席话机响铃
  }
  // 坐席接听电话
  onAgentAnswerOut = (agentAnswerTime, sessionid) => {
    console.log('坐席接听电话');
  }
  // 客户接听电话
  onCalleeAnswerOut = (callStartTime, sessionid) => {
    console.log('客户接听电话');
    // 开始计时
    let count = 0;
    const timer = setInterval(() => this.props.setCounter(count += 1), 1000);
    const callTime = moment(callStartTime).format('YYYY-MM-DD HH:mm:ss');
    this.setState({
      callTime,
      timer,
    });
    this.props.showLoading(false);
    this.props.setCallTime(callTime);
  }
  // 坐席挂断电话
  onAgentHangupOut = (callStopTime, sessionid) => {
    console.log('电话结束');
    const { timer } = this.state;
    const duration = this.state.callTime ? ( moment(callStopTime) - moment(this.state.callTime) ) / 1000 : 0;
    this.setState({
      sessionid,
      endTime: callStopTime,
    });
    window.clearInterval(timer);
    this.props.showLoading(false);
    this.props.setEndTime(callStopTime);
    this.props.setEndFlag();
    this.props.setSessionid(sessionid);
    const trnode = document.getElementById('cocc_NginxHttpPushFrame');
    trnode.parentNode.removeChild(trnode);
    window.genUuid = '';
  }

  goSaveTalk = (data) => {
    const IDB = window.IDB;
    IDB.add(IDB.CRM_LOG_STORE, {
      time: new Date().getTime(),
      msg: 'hangup, save callout'
    }, '');
    // 写你的保存逻辑
  }

  // onTest = (phoneId) => {
  //   this.onDialOut(`${phoneId}`, {}, ()=> {
  //     console.log('外呼成功.');
  //   })
  // }

  render() {
    return null;
  }
}

export default connect(
  state => ({
    callVendor: state.user.callVendor,
    callInfo: state.call.callInfo,
  }),
  dispatch => ({
    getAgentConf: () => dispatch({ type: 'user/getAgentConf' }),
    setCounter: params => dispatch({ type: 'call/setCounter', payload: params }),
    showLoading: params => dispatch({ type: 'call/showLoading', payload: params }),
    setCallTime: params => dispatch({ type: 'call/setCallTime', payload: params }),
    setEndTime: params => dispatch({ type: 'call/setEndTime', payload: params }),
    setSessionid: params => dispatch({ type: 'call/setSessionid', payload: params }),
    setEndFlag: () => dispatch({ type: 'call/setEndFlag' }),
  }), null,
  {withRef: true}
)(MakeCall);
