

// function log(msg) {
//   //IE has no console
//   if ('console' in window) console.log(msg);
// }

// agentData = {
//   cocc_agentno: '',
//   cocc_agentgroupid: ''
// } / {
//     ola_queue: '',
//     ola_extn: ''
//   };
// listenData = {
//   uuid: '',
//   onEvent: {
//     onAgentRingingIn: func(ringingTime, sessionid, callinNo),
//     onAgentRingingOut: func(ringingTime),
//     onAgentAnswerIn: func(callStartTime, sessionid, callinNo),
//     onAgentAnswerOut: func(agentAnswerTime, sessionid),
//     onCalleeAnswerOut: func(callStartTime, sessionid),
//     onAgentHangupIn: func(callStopTime, sessionid, callinNo),
//     onAgentHangupOut: func(callStopTime, sessionid),
//     onAgentNotAnswerIn: func(notAnswerTime, sessionid, callinNo),
//     onAgentNotAnswerOut: func(notAnswerTime)
//   },
//   onReady: func(notAnswerTime),
//   platform: {
//     url: "wss://crm-dev.dianrong.com:8080/ola_socket"
//   }
// };
window.startListen = function(type, agentData, listenData) {
  IDB.add(IDB.CRM_LOG_STORE, {
    time: new Date().getTime(),
    msg: 'start listen ' + type + '. ' + listenData.uuid
  }, '');
  window['_startListen' + type](agentData, listenData);
}
window._startListenCOCC = function (agentData, listenData) {
  var onEvent = listenData.onEvent;

  window.sonAccept = function (message) {
    var aryMessage = message.split('&');
    var aryEvent = new Array();

    for (var i = 0; i < aryMessage.length; i++) {
      var tmp = aryMessage[i].split('=');
      eval("aryEvent['" + tmp[0] + "'] = '" + tmp[1] + "';");
    }
    parseEventData(aryEvent);
  };

  coccNginxHttpPushNAPI();
  listenData.onReady && listenData.onReady();

  function parseEventData(data) {
    if (typeof data != 'object') {
      return;
    }


    var userType = data.source,
      userEvent = data.event,
      calltype = data.calltype,
      sessionid = data.sessionid,
      activenum = data.activenum;

    //呼入
    if (calltype == 'dialin') {
      if (userEvent === 'incoming' && userType === 'CALLER') {
        window.callinNo = activenum;
        onEvent.onAgentComeIn && onEvent.onAgentComeIn(data.eventTime, sessionid, activenum);
      }
      if (userEvent === 'ringing' && data.agentno == agentData.agentId && data.AgentGroupId == agentData.agentGroupId) {
        IDB.add(IDB.CRM_LOG_STORE, {
          time: new Date().getTime(),
          msg: 'COCC agent ringing in. ' + window.genUuid + '.sessionid ' + sessionid
        }, '');
        onEvent.onAgentRingingIn && onEvent.onAgentRingingIn(data.eventTime, sessionid, callinNo);
      } else if (userEvent == 'answer' && data.agentno == agentData.agentId) {
        IDB.add(IDB.CRM_LOG_STORE, {
          time: new Date().getTime(),
          msg: 'COCC agent answer in. ' + window.genUuid + '.sessionid ' + sessionid
        }, '');
        onEvent.onAgentAnswerIn && onEvent.onAgentAnswerIn(data.eventTime, sessionid, callinNo);
      } else if (userEvent == 'hangup' && userType == 'CONVERSATION' && data.agentno == agentData.agentId) {
        IDB.add(IDB.CRM_LOG_STORE, {
          time: new Date().getTime(),
          msg: 'COCC agent hangup in. ' + window.genUuid + '.sessionid ' + sessionid
        }, '');
        onEvent.onAgentHangupIn && onEvent.onAgentHangupIn(data.eventTime, sessionid, callinNo);
      } else if (userEvent == 'hangup' && typeof(data.hangupfirst) == 'undefined' && data.agentno == agentData.agentId) {
        IDB.add(IDB.CRM_LOG_STORE, {
          time: new Date().getTime(),
          msg: 'COCC agent not answer in. ' + window.genUuid + '.sessionid ' + sessionid
        }, '');
        onEvent.onAgentNotAnswerIn && onEvent.onAgentNotAnswerIn(data.eventTime, sessionid, callinNo);
      }
    } else if (calltype === 'dialout') {//外呼
      if (!data.userdata || data.userdata != window.genUuid) {
        return;
      }
      if (userEvent === 'ringing' && userType === 'AGENT' && data.agentno == agentData.agentId) {

        IDB.add(IDB.CRM_LOG_STORE, {
          time: new Date().getTime(),
          msg: 'COCC agent ringing out. ' + data.userdata + '.sessionid ' + sessionid
        }, '');
        onEvent.onAgentRingingOut && onEvent.onAgentRingingOut(data.eventTime, sessionid);
      }
      if (userEvent === 'answer' && userType === 'AGENT' && data.agentno == agentData.agentId) {
        IDB.add(IDB.CRM_LOG_STORE, {
          time: new Date().getTime(),
          msg: 'COCC agent answer out. ' + data.userdata + '.sessionid ' + sessionid
        }, '');
        onEvent.onAgentAnswerOut && onEvent.onAgentAnswerOut(data.eventTime, sessionid);
      }
      if (userType === 'CALLEE' && userEvent == 'answer' && data.agentno == agentData.agentId) {
        IDB.add(IDB.CRM_LOG_STORE, {
          time: new Date().getTime(),
          msg: 'COCC callee answer out. ' + data.userdata + '.sessionid ' + sessionid
        }, '');
        onEvent.onCalleeAnswerOut && onEvent.onCalleeAnswerOut(data.eventTime, sessionid);
      }
      if (userEvent == 'hangup' && userType == 'CONVERSATION' && data.agentno == agentData.agentId) {
        IDB.add(IDB.CRM_LOG_STORE, {
          time: new Date().getTime(),
          msg: 'COCC agent hangup out. ' + data.userdata + '.sessionid ' + sessionid
        }, '');
        onEvent.onAgentHangupOut && onEvent.onAgentHangupOut(data.eventTime, sessionid);
      }
    } else {
      IDB.add(IDB.CRM_LOG_STORE, {
        time: new Date().getTime(),
        msg: 'COCC unknown dail type. ' + JSON.stringify(data)
      }, '');
    }
  }
};

window._startListenOLA = function (agentData, listenData) {
  var onEvent = listenData.onEvent;

  var ola_queue = agentData.agentGroupId;
  var ola_extn = agentData.agentId;

  if (ola_extn != "") {
    websocket_connect();
  }

  function websocket_connect() {
    ola.connect(listenData.platform.url);
    ola.onConnect = onConnect;
    ola.onClose = onClose;
    ola.onMessage = onMessage;
  }

  function onMessage(evt) {
    var data = JSON.parse(evt.data);
    if (typeof data != 'object') {
      return;
    }

    if (data.event_type == "agent_state") {
      if (data.state == "login") {
        ola.go_ready();
      }
      if (data.state == "logout") {
        _checkinOLA(ola_queue, ola_extn);
      }
      if (data.state == "unready") {
        // ola.go_ready();
      }

      var userEvent = data.private_data,
        calltype = data.call_direction,
        sessionid = data.call_accept,
        activenum = data.other_dn,
        state = data.state,
        timestamp = data.timestamp;

      // 外呼直接挂断
      if (userEvent === '' && state === 'unready' && data.old_state === 'busy' && !data.other_answered && calltype === 'undefined' && data.agent_id == ola_extn) {
        IDB.add(IDB.CRM_LOG_STORE, {
          time: new Date().getTime(),
          msg: 'OLA agent hangup directly. ' + window.genUuid + '.sessionid ' + sessionid
        }, '');
        onEvent.onAgentHangupOut && onEvent.onAgentHangupOut(moment((timestamp) * 1000).format('YYYY-MM-DD HH:mm:ss'), sessionid);
        // ola.logout();
        return;
      }

      if (userEvent === '' && state === 'ready' && data.old_state === 'acw' && !data.ther_answered && calltype == 'undefined' && data.agent_id == ola_extn) {
        listenData.onReady && listenData.onReady();
      }

      if (userEvent === '' && state === 'ready' && data.old_state === 'unready'&& !data.ther_answered && calltype == 'undefined' && data.agent_id == ola_extn) {
         listenData.onReady && listenData.onReady();
      }

      if (calltype == 'inbound') {
        var callinNo = '';

        if (userEvent === 'ring' && state === 'busy' && data.agent_id == ola_extn && data.queue_id == ola_queue) {
          callinNo = activenum;
          IDB.add(IDB.CRM_LOG_STORE, {
            time: new Date().getTime(),
            msg: 'OLA agent ringing in. ' + window.genUuid + '.sessionid ' + sessionid
          }, '');
          onEvent.onAgentRingingIn && onEvent.onAgentRingingIn(moment((timestamp) * 1000).format('YYYY-MM-DD HH:mm:ss'), sessionid, callinNo);
        } else if (userEvent == 'answered' && state === 'busy' && data.agent_id == ola_extn) {
          IDB.add(IDB.CRM_LOG_STORE, {
            time: new Date().getTime(),
            msg: 'OLA agent answer in. ' + window.genUuid + '.sessionid ' + sessionid
          }, '');
          onEvent.onAgentAnswerIn && onEvent.onAgentAnswerIn(moment((timestamp) * 1000).format('YYYY-MM-DD HH:mm:ss'), sessionid, callinNo);
        } else if (userEvent == 'answered' && state === 'acw' && data.agent_id == ola_extn) {
          IDB.add(IDB.CRM_LOG_STORE, {
            time: new Date().getTime(),
            msg: 'OLA agent hangup in. ' + window.genUuid + '.sessionid ' + sessionid
          }, '');
          onEvent.onAgentHangupIn && onEvent.onAgentHangupIn(moment((timestamp) * 1000).format('YYYY-MM-DD HH:mm:ss'), sessionid, callinNo);
          callinNo = '';
          ola.go_ready();
        } else if (data.state == "unready" && data.old_state == "busy" && data.agent_id == ola_extn) {
          IDB.add(IDB.CRM_LOG_STORE, {
            time: new Date().getTime(),
            msg: 'OLA agent not answer in. ' + window.genUuid + '.sessionid ' + sessionid
          }, '');
          onEvent.onAgentNotAnswerIn && onEvent.onAgentNotAnswerIn(moment((timestamp) * 1000).format('YYYY-MM-DD HH:mm:ss'), sessionid, callinNo);
          ola.go_ready();
        }
      } else if (calltype === 'outbound') {//外呼
        if (userEvent === 'calling' && state === 'busy' && data.agent_id == ola_extn) {
          IDB.add(IDB.CRM_LOG_STORE, {
            time: new Date().getTime(),
            msg: 'OLA agent ringing out. ' + window.genUuid + '.sessionid ' + sessionid
          }, '');
          onEvent.onAgentRingingOut && onEvent.onAgentRingingOut(moment((timestamp) * 1000).format('YYYY-MM-DD HH:mm:ss'));
        }
        //坐席接听->挂断----------------------------------------------
        if (userEvent === 'calling' && state === 'ready' && data.old_state === 'busy' && data.agent_id == ola_extn) {
          IDB.add(IDB.CRM_LOG_STORE, {
            time: new Date().getTime(),
            msg: 'OLA agent hangup out. ' + window.genUuid + '.sessionid ' + sessionid
          }, '');
          onEvent.onAgentHangupOut && onEvent.onAgentHangupOut(moment((timestamp) * 1000).format('YYYY-MM-DD HH:mm:ss'), sessionid);
        }
        //----------------------------------------------

        if (userEvent === 'answered' && state === 'busy' && !data.other_answered && data.agent_id == ola_extn) {
          IDB.add(IDB.CRM_LOG_STORE, {
            time: new Date().getTime(),
            msg: 'OLA agent answer out. ' + window.genUuid + '.sessionid ' + sessionid
          }, '');
          onEvent.onAgentAnswerOut && onEvent.onAgentAnswerOut(moment((timestamp) * 1000).format('YYYY-MM-DD HH:mm:ss'), sessionid);
        }
        if (userEvent == 'answered' && state === 'busy' && data.other_answered && data.agent_id == ola_extn) {
          IDB.add(IDB.CRM_LOG_STORE, {
            time: new Date().getTime(),
            msg: 'OLA callee answer out. ' + window.genUuid + '.sessionid ' + sessionid
          }, '');
          onEvent.onCalleeAnswerOut && onEvent.onCalleeAnswerOut(moment((timestamp) * 1000).format('YYYY-MM-DD HH:mm:ss'), sessionid);
        }
        if (userEvent == 'answered' && state === 'acw' && data.agent_id == ola_extn) {
          IDB.add(IDB.CRM_LOG_STORE, {
            time: new Date().getTime(),
            msg: 'OLA agent hangup out. ' + window.genUuid + '.sessionid ' + sessionid
          }, '');
          onEvent.onAgentHangupOut && onEvent.onAgentHangupOut(moment((timestamp) * 1000).format('YYYY-MM-DD HH:mm:ss'), sessionid);

        }
      } else {
        IDB.add(IDB.CRM_LOG_STORE, {
          time: new Date().getTime(),
          msg: 'OLA unknown dail type. ' + JSON.stringify(data)
        }, '');
      }
    } else if (data.event_type == "command/reply") {
      if (data.data && data.data.state) {
        var state = data.data.state;

        if (state == "ready") {
          listenData.onReady && listenData.onReady();
        } else if (state == "unready") {
          ola.go_ready();
        } else if (state == 'logout') {
          window._checkinOLA(ola_queue, ola_extn);
        } else if (state == 'acw') {
          ola.go_ready();
        }
      }
    }
  }

  function onConnect() {
    console.log("websocket connected!");
    ola._extn = ola_extn;

    changeQueue(ola_extn, ola_queue, function() {
      window._checkinOLA(ola_queue, ola_extn);
      ola.subscribe('ola.queue.' + ola_queue + '.' + ola_extn);
      ola.subscribe('ola.caller.' + ola_extn);
      ola.get_agent_state(ola_extn);
    });
  }

  function onClose() {
  }
};
window.changeQueue =  function(ola_extn, ola_queue, cb) {
  jQuery311.getJSON(callingRouteConf.vendors[callingRouteConf.firstVendor].callLogUrl + "/api/ola/agents/" + ola_extn, function(data) {
    var history_queue = data.code == "404" ? "" : data.agent[0].queue;
    if (history_queue && history_queue !== ola_queue) {
      ola.unsubscribe('ola.queue.' + history_queue + '.' + ola_extn);
      ola.unsubscribe('ola.caller.' + ola_extn);
      ola.logout();
    }
    cb();
  });
}
window.closeListen = function(type, uuid) {
  IDB.add(IDB.CRM_LOG_STORE, {
    time: new Date().getTime(),
    msg: 'close listen ' + type + '. ' + uuid
  }, '');
  window['_closeListen' + type]();
}
window._closeListenCOCC = function () {
  //TBI
  // TODO pliman
};
window._closeListenOLA = function () {
  ola.close();
};

window.bindAgentNo = function(type, bindData, cb) {
  IDB.add(IDB.CRM_LOG_STORE, {
    time: new Date().getTime(),
    msg: 'bind agent No. ' + type + '. '
  }, '');
  window['_bindAgentNo' + type](bindData, cb);
}
// 密码指定采用md5加密的方式
window._bindAgentNoCOCC = function (bindData, cb) {
  setdeviceCJI(bindData.cocc_identity, bindData.extensionNo, bindData.cocc_agentno, "md5", bindData.agentPwdMd5, cb);
};
window._bindAgentNoOLA = function (bindData, cb) {
  // doing nothing for now
  cb();
};

window.unbindAgentNo = function(type) {
  IDB.add(IDB.CRM_LOG_STORE, {
    time: new Date().getTime(),
    msg: 'unbind agent No. ' + type + '. '
  }, '');
  window['_unbindAgentNo' + type]();
}
window.unbindAgentNoCOCC = function () {
  //TBI
  // TODO jiahe
};
window.unbindAgentNoOLA = function () {
  //TBI
  // TODO jiahe
};

window.callout = function(type, callObj) {
  var phoneNo = callObj.phoneNo;

  IDB.add(IDB.CRM_LOG_STORE, {
    time: new Date().getTime(),
    msg: 'callout ' + phoneNo + ' ' + type + '. ' + callObj.uuid
  }, '');

  window['_callout' + type](callObj);
}
window._calloutCOCC = function (callObj) {
  var phoneNo = callObj.phoneNo,
    uuid = callObj.uuid,
    dialouted = false;

  IDB.add(IDB.CRM_LOG_STORE, {
    time: new Date().getTime(),
    msg: 'start calling  ' + phoneNo + ' COCC. ' + uuid
  }, '');
  makeCallCJI(phoneNo, "exter", callObj.agentGroupId, "agent", callObj.agentId, callObj.orgidentity
    , "md5", callObj.agentPwdMd5, "Campaign", callObj.modelId, uuid, function (json) {
      IDB.add(IDB.CRM_LOG_STORE, {
        time: new Date().getTime(),
        msg: 'call req returned. ' + uuid
      }, '');
      try {
        dialouted = true;
        callObj.cb && callObj.cb(null, json);
      } catch (e) {
        alert('call-api=>makeCallCJI error:' + e);
        callObj.cb && callObj.cb(e);
      }
    }, "", "", "", "", "", "");


  //30秒后会响应提示
  // setTimeout(function () {
  //   if (!dialouted) {
  //     alert(_e("msg_makecall_timeout"));
  //   }
  // }, 30000);
};
window._calloutOLA = function (callObj) {
  IDB.add(IDB.CRM_LOG_STORE, {
    time: new Date().getTime(),
    msg: 'start calling  ' + callObj.phoneNo + ' OLA. ' + callObj.uuid
  }, '');

  ola.dial(callObj.phoneNo);
  callObj.cb && callObj.cb(null, 'OLA');
};

window.hangup = function(type, hangupObj) {
  IDB.add(IDB.CRM_LOG_STORE, {
    time: new Date().getTime(),
    msg: 'hang up. ' + type + '. ' + hangupObj.uuid
  }, '');
  window['_hangup' + type](hangupObj);
}
window._hangupCOCC = function (hangupObj) {
  hangupCJI('', cocc_agentno, 'agent', 'md5', cocc_pwd, 'agent', cocc_agentno, cocc_identity, function (json) {
    hangupObj.cb && hangupObj.cb(json);
  });
};
window._hangupOLA = function (hangupObj) {
  ola.hangup();
  hangupObj.cb && hangupObj.cb('');
};

window.saveCall = function(type) {
}

window.getCallRecordAddress = function(type) {
}

window.checkin = function(type, agentObj) {
  IDB.add(IDB.CRM_LOG_STORE, {
    time: new Date().getTime(),
    msg: 'check in. ' + type + '. '
  }, '');
  window['_checkin' + type](agentObj);
}
window._checkinCOCC = function (agentObj) {
  // TBI
  // TODO jiahe
  queueActionCJI('1',agentObj.agenttype,
  agentObj.agentno,agentObj.orgidentity,agentObj.agentgroupid,
  'md5',agentObj.pwd,'','no',function (json) {
    IDB.add(IDB.CRM_LOG_STORE, {
      time: new Date().getTime(),
      msg: 'agent checkin returned. COCC'
    }, '');
    try {
      agentObj.cb && agentObj.cb(null, json);
    } catch (e) {
      agentObj.cb && agentObj.cb(e);
    }
  },'');

};
window._checkinOLA = function (ola_queue, ola_extn) {
  ola.login(ola_queue, ola_extn, {type: "onhook"});
};

window.checkout = function(type, agentObj) {
  IDB.add(IDB.CRM_LOG_STORE, {
    time: new Date().getTime(),
    msg: 'check out. ' + type + '. '
  }, '');
  window['_checkout' + type](agentObj);
}
window._checkoutCOCC = function (agentObj) {
  queueActionCJI('2',agentObj.agenttype,
  agentObj.agentno,agentObj.orgidentity,agentObj.agentgroupid,
  'md5',agentObj.pwd,'','no',function (json) {
    IDB.add(IDB.CRM_LOG_STORE, {
      time: new Date().getTime(),
      msg: 'agent checkout returned. COCC'
    }, '');
    try {
      agentObj.cb && agentObj.cb(null, json);
    } catch (e) {
      agentObj.cb && agentObj.cb(e);
    }
  },'');
};
window._checkoutOLA = function () {
  ola.logout();
};

window.goBusy = function(type) {
  IDB.add(IDB.CRM_LOG_STORE, {
    time: new Date().getTime(),
    msg: 'go busy. ' + type + '. '
  }, '');
  window['_goBusy' + type]();
}
window._goBusyCOCC = function () {
  queuePauseCJI(2, 'agent', cocc_agentno, cocc_identity, 'md5',
    cocc_pwd, 'other', 'no', afterPause, '');
};
window._goBusyOLA = function () {
  ola.go_break();
};
window.afterPause = function(json) {
  var backCode = json.message;
  if (backCode == 'BackMsg_14') {
    setCheckBtn();
  } else {
    alert("msg_service_state_error: " + backCode)
  }
  loadingboxEle.close();
}

window.goFree = function(type) {
  IDB.add(IDB.CRM_LOG_STORE, {
    time: new Date().getTime(),
    msg: 'go free. ' + type + '. '
  }, '');
  window['_goFree' + type]();
}
window._goFreeCOCC = function () {
  queuePauseCJI(1, 'agent', cocc_agentno, cocc_identity, 'md5',
    cocc_pwd, 'other', 'no', afterPause, '');
};
window._goFreeOLA = function () {
  ola.go_ready();
};

window.getAgentStatus = function(type) {
}

window.getCallLog = function(type, callLogObj) {
  IDB.add(IDB.CRM_LOG_STORE, {
    time: new Date().getTime(),
    msg: 'get call log. ' + type + '. ' + callLogObj.sessionId
  }, '');
  window['_getCallLog' + type](callLogObj);
}
window._getCallLogCOCC = function (callLogObj) {
  getMonitorCJI(callLogObj.sessionid, callLogObj.callDate, callLogObj.cb, 'yes');
};
window._getCallLogOLA = function (callLogObj) {
  // "http://114.55.105.139:29002/tianr/httpService/callLog?call_accept=";
  jQuery311.getJSON(callLogObj.callLogUrl + callLogObj.sessionid, callLogObj.cb);
};

window.getAgentState = function(type, agentObj) {
  IDB.add(IDB.CRM_LOG_STORE, {
    time: new Date().getTime(),
    msg: 'get agent state. ' + type + '. '
  }, '');
  try {
    window['_getAgentState' + type](type, agentObj);
  } catch(e) {

  }


}
window._getAgentStateCOCC = function(type, agentObj) {
  agentStatusCJI(agentObj.orgidentity, agentObj.usertype, agentObj.agentno, 'md5', agentObj.pwd, function (json) {
    IDB.add(IDB.CRM_LOG_STORE, {
      time: new Date().getTime(),
      msg: 'get agent state returned. COCC'
    }, '');
    try {
      agentObj.cb && agentObj.cb(null, json);
    } catch (e) {
      agentObj.cb && agentObj.cb(e);
    }
  });
}
window._getAgentStateOLA = function() {

}
