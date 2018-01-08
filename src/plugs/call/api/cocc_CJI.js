// window.cocc_ip = "drcrm.cloudox.net:7443";
// window.cocc_is_ssl = true;
// window.cocc_lastmodified = null;
// window.cocc_identity = "cs02";
// window.cocc_pwd = "bafe258d740b228879fa2da9c0497caf";
// window.cocc_agentno = "300000135";
import $ from 'jquery';

if(typeof(cocc_ip) != 'undefined'){

  if(cocc_ip == ''){
    alert("Please defined cocc_ip");
  }
}else{
  alert("Please defined cocc_ip");
}
window.cocc_cip = (typeof(cocc_is_ssl) != 'undefined' && cocc_is_ssl?"https":"http")+"://"+cocc_ip;
// var cocc_cip = callingRouteConf.vendors["COCC"].ipUrl;

//登录
window.loginCJI = function(orgidentity,usertype,user,pwdtype,password,callbackFuc){
    $.getJSON(cocc_cip+"/setevent/loginCJI?callback=?",{
    usertype:usertype,
    user:user,
    orgidentity:orgidentity,
    pwdtype:pwdtype,
    password:password
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('loginCJI error!');
    }
    });
}

//登出
window.logoutCJI = function(orgidentity,usertype,user,pwdtype,password,callbackFuc){
    $.getJSON(cocc_cip+"/setevent/logoutCJI?callback=?",{
    usertype:usertype,
    user:user,
    orgidentity:orgidentity,
    pwdtype:pwdtype,
    password:password
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('logoutCJI error!');
    }
    });
}


//队列接口(分机示忙，闲)
window.queueActionCJI = function(type,usertype,user,orgidentity,list,pwdtype,password,deviceexten,pushevent,callbackFuc,intparam){
    var pjson = type;
    if (typeof(type) != 'object') {
        pjson = {
        "type": type,
        "usertype": usertype,
        "user": user,
        "orgidentity": orgidentity,
        "list": list,
        "pwdtype": pwdtype,
        "password": password,
        "deviceexten": deviceexten,
        "pushevent": pushevent,
        "intparam": intparam
      };
    } else {
        if (typeof(pjson.callbackFuc) != 'undefined' && pjson.callbackFuc != '') {
            callbackFuc = pjson.callbackFuc;
            delete pjson.callbackFuc;
        }
    }

    $.getJSON(cocc_cip+"/setevent/queueActionCJI?callback=?", pjson, function(json) {
    try {
      if (typeof(callbackFuc) != 'undefined' && callbackFuc != '') {
        callbackFuc(json);
      }
    } catch(e) {
      //alert('queueActionCJI error!');
    }
    });
}


//(暂停/继续)服务
window.queuePauseCJI = function(type,usertype,user,orgidentity,pwdtype,password,pause_reason,pushevent,callbackFuc,dnd,intparam){
    var pjson = type;
    if (typeof(type) != 'object') {
        pjson = {
        "type": type,
        "usertype": usertype,
        "user": user,
        "orgidentity": orgidentity,
        "pwdtype": pwdtype,
        "password": password,
        "pause_reason": pause_reason,
        "pushevent": pushevent,
        "dnd": dnd,
        "intparam": intparam
      };
    } else {
        if (typeof(pjson.callbackFuc) != 'undefined' && pjson.callbackFuc != '') {
            callbackFuc = pjson.callbackFuc;
            delete pjson.callbackFuc;
        }
    }
    $.getJSON(cocc_cip+"/setevent/queuePauseCJI?callback=?", pjson, function (json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('queuePauseCJI error!');
    }
    });
}


//切换事后模式
window.acwActionCJI = function(type,usertype,user,orgidentity,pwdtype,password,agent_group_id,pushevent,callbackFuc){
    var pjson = type;
    if (typeof(type) != 'object') {
        pjson = {
        "type": type,
        "usertype": usertype,
        "user": user,
        "orgidentity": orgidentity,
        "pwdtype": pwdtype,
        "password": password,
        "agent_group_id": agent_group_id,
        "pushevent": pushevent
      };
    } else {
        if (typeof(pjson.callbackFuc) != 'undefined' && pjson.callbackFuc != '') {
            callbackFuc = pjson.callbackFuc;
            delete pjson.callbackFuc;
        }
    }

    $.getJSON(cocc_cip+"/setevent/acwActionCJI?callback=?", pjson, function (json) {
    try {
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    } catch (e) {
      //alert('acwActionCJI error!');
    }
    });
}


//结束事后
window.acwOffCJI = function(usertype,user,orgidentity,pwdtype,password,pushevent,callbackFuc){
    var pjson = usertype;
    if (typeof(usertype) != 'object') {
        pjson = {
        "usertype": usertype,
        "user": user,
        "orgidentity": orgidentity,
        "pwdtype": pwdtype,
        "password": password,
        "pushevent": pushevent
      };
    } else {
        if (typeof(pjson.callbackFuc) != 'undefined' && pjson.callbackFuc != '') {
            callbackFuc = pjson.callbackFuc;
            delete pjson.callbackFuc;
        }
    }

    $.getJSON(cocc_cip+"/setevent/acwOffCJI?callback=?", pjson, function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('acwOffCJI error!');
    }
    });
}


//切换工作模式
window.workwayActionCJI = function(status,usertype,user,orgidentity,pwdtype,password,agent_group_id,pushevent,callbackFuc){
    var pjson = status;
    if (typeof(status) != 'object') {
        pjson = {
            "status": status,
        "usertype": usertype,
        "user": user,
        "orgidentity": orgidentity,
        "pwdtype": pwdtype,
        "password": password,
        "agent_group_id": agent_group_id,
        "pushevent": pushevent
      };
    } else {
        if (typeof(pjson.callbackFuc) != 'undefined' && pjson.callbackFuc != '') {
            callbackFuc = pjson.callbackFuc;
            delete pjson.callbackFuc;
        }
    }

    $.getJSON(cocc_cip+"/setevent/workwayActionCJI?callback=?", pjson, function (json) {
    try {
      if (typeof(callbackFuc) != 'undefined' && callbackFuc != '') {
        callbackFuc(json);
      }
    } catch (e) {
      //alert('workwayActionCJI error!');
    }
    });
}


//呼叫接口
window.makeCallCJI = function(targetdn, targettype, agentgroupid, usertype, user, orgidentity,pwdtype, password, modeltype, model_id, userdata, callbackFuc, agentexten,callerid,callername,trunkidentity,cidtype, ignorerepeat){
    $.getJSON(cocc_cip+"/setevent/makeCallCJI?callback=?",{
    targetdn:targetdn,
    targettype:targettype,
    agentgroupid:agentgroupid,
    usertype:usertype,
    user:user,
    orgidentity:orgidentity,
    pwdtype:pwdtype,
    password:password,
    modeltype:modeltype,
    model_id:model_id,
    userdata:userdata,
    agentexten:agentexten,
    callerid:callerid,
    callername:callername,
    trunkidentity:trunkidentity,
        cidtype:cidtype,
        ignorerepeat:ignorerepeat
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('makeCallCJI error!');
    }
    });
}

//咨询接口
window.consultCJI = function(targetdn, agentgroupid, consulttype, pwdtype,password,usertype,user,orgidentity,callbackFuc){
    $.getJSON(cocc_cip+"/setevent/consultCJI?callback=?",{
    targetdn:targetdn,
    agentgroupid:agentgroupid,
    consulttype:consulttype,
    pwdtype:pwdtype,
    password:password,
    usertype:usertype,
    user:user,
    orgidentity:orgidentity
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('consultCJI error!');
    }
    });
}

//转接接口
window.transferCJI = function(pwdtype,password,usertype,user,orgidentity,callbackFuc){
    $.getJSON(cocc_cip+"/setevent/transferCJI?callback=?",{
    pwdtype:pwdtype,
    password:password,
    usertype:usertype,
    user:user,
    orgidentity:orgidentity
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('transferCJI error!');
    }
    });
}

//接回接口
window.callReturnCJI = function(pwdtype,password,usertype,user,orgidentity,callbackFuc){
    $.getJSON(cocc_cip+"/setevent/callReturnCJI?callback=?",{
    pwdtype:pwdtype,
    password:password,
    usertype:usertype,
    user:user,
    orgidentity:orgidentity
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('callReturnCJI error!');
    }
    });
}

//会议接口
window.conferenceCJI = function(pwdtype,password,usertype,user,orgidentity,callbackFuc){
    $.getJSON(cocc_cip+"/setevent/conferenceCJI?callback=?",{
    pwdtype:pwdtype,
    password:password,
    usertype:usertype,
    user:user,
    orgidentity:orgidentity
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('conferenceCJI error!');
    }
    });
}

//挂断接口
window.hangupCJI = function(uniqueid,targetagent,target,pwdtype,password,usertype,user,orgidentity,callbackFuc){
    $.getJSON(cocc_cip+"/setevent/hangupCJI?callback=?",{
    uniqueid:uniqueid,
    targetagent:targetagent,
    target:target,
    pwdtype:pwdtype,
    password:password,
    usertype:usertype,
    user:user,
    orgidentity:orgidentity
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('hangupCJI error!');
    }
    });
}


//强插接口
window.intrudeCJI = function(target, phonenumber, pwdtype, password, usertype, user, orgidentity, callbackFuc){
    $.getJSON(cocc_cip+"/setevent/intrudeCJI?callback=?",{
    target:target,
    phonenumber:phonenumber,
    pwdtype:pwdtype,
    password:password,
    usertype:usertype,
    user:user,
    orgidentity:orgidentity
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('intrudeCJI error!');
    }
    });
}

//监听接口
window.silentMonitorCJI = function(target, phonenumber, pwdtype, password, usertype, user, orgidentity, callbackFuc){
    $.getJSON(cocc_cip+"/setevent/silentMonitorCJI?callback=?",{
    target:target,
    phonenumber:phonenumber,
    pwdtype:pwdtype,
    password:password,
    usertype:usertype,
    user:user,
    orgidentity:orgidentity
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('silentMonitorCJI error!');
    }
    });
}

//强拆接口
window.forcedReleaseCJI = function(target, phonenumber, pwdtype, password, usertype, user, orgidentity, callbackFuc){
    $.getJSON(cocc_cip+"/setevent/forcedReleaseCJI?callback=?",{
    target:target,
    phonenumber:phonenumber,
    pwdtype:pwdtype,
    password:password,
    usertype:usertype,
    user:user,
    orgidentity:orgidentity
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('forcedReleaseCJI error!');
    }
    });
}

//密语接口
window.whisperCJI = function(target, phonenumber, pwdtype, password, usertype, user, orgidentity, callbackFuc){
    $.getJSON(cocc_cip+"/setevent/whisperCJI?callback=?",{
    target:target,
    phonenumber:phonenumber,
    pwdtype:pwdtype,
    password:password,
    usertype:usertype,
    user:user,
    orgidentity:orgidentity
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('whisperCJI error!');
    }
    });
}

//通话暂停接口
window.holdCJI = function(silence,orgidentity, usertype, user, pwdtype,password,callbackFuc){
    $.getJSON(cocc_cip+"/setevent/holdCJI?callback=?",{
    silence:silence,
    orgidentity:orgidentity,
    usertype:usertype,
    user:user,
    pwdtype:pwdtype,
    password:password
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('holdCJI error!');
    }
    });
}

//通话继续接口
window.resumeCJI = function(orgidentity, usertype, user, pwdtype, password, callbackFuc){
    $.getJSON(cocc_cip+"/setevent/resumeCJI?callback=?",{
    orgidentity:orgidentity,
    usertype:usertype,
    user:user,
    pwdtype:pwdtype,
    password:password
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('resumeCJI error!');
    }
    });
}

//获取团队坐席状态
window.teamStatusCJI = function(orgidentity, usertype, user, pwdtype, password, status, callbackFuc){
    $.getJSON(cocc_cip+"/setevent/teamStatusCJI?callback=?",{
    status:status,
    orgidentity:orgidentity,
    usertype:usertype,
    user:user,
    pwdtype:pwdtype,
    password:password
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('teamStatusCJI error!');
    }
    });
}

//获取坐席组状态
window.agentgroupStatusCJI = function(orgidentity, usertype, user, pwdtype, password, agent_group_id, status, callbackFuc){
    $.getJSON(cocc_cip+"/setevent/agentgroupStatusCJI?callback=?",{
    agent_group_id:agent_group_id,
    status:status,
    orgidentity:orgidentity,
    usertype:usertype,
    user:user,
    pwdtype:pwdtype,
    password:password
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('agentgroupStatusCJI error!');
    }
    });
}

//获取坐席状态接口
window.agentStatusCJI = function(orgidentity, usertype, user, pwdtype,password,callbackFuc){
    $.getJSON(cocc_cip+"/setevent/agentStatusCJI?callback=?",{
    orgidentity:orgidentity,
    usertype:usertype,
    user:user,
    pwdtype:pwdtype,
    password:password
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('agentStatusCJI error!');
    }
    });
}

//预拨号接口
window.dialerListCJI = function(orgidentity, usertype, user, pwdtype, password, campaignid, phonenum, priority, dialtime, callbackFuc){
    $.getJSON(cocc_cip+"/setevent/dialerListCJI?callback=?",{
    orgidentity:orgidentity,
    usertype:usertype,
    user:user,
    pwdtype:pwdtype,
    password:password,
    campaignid:campaignid,
    phonenum:phonenum,
    priority:priority,
    dialtime:dialtime
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('agentStatusCJI error!');
    }
    });
}

//数据导入接口
window.importCJI = function(orgidentity, usertype, user, pwdtype, password, modeltype, model_id, source, context, source_user, source_pwd, exetime, delrow, phone_field, priority_field, dialtime_field, emptyagent, resetstatus, dupway, dupdiallist, changepackage, callbackFuc){
    $.getJSON(cocc_cip+"/setevent/importCJI?callback=?",{
    orgidentity:orgidentity,
    usertype:usertype,
    user:user,
    pwdtype:pwdtype,
    password:password,
    modeltype:modeltype,
    model_id:model_id,
    source:source,
    context:context,
    source_user:source_user,
    source_pwd:source_pwd,
    exetime:exetime,
    delrow:delrow,
    phone_field:phone_field,
    priority_field:priority_field,
    dialtime_field:dialtime_field,
    emptyagent:emptyagent,
    resetstatus:resetstatus,
    dupway:dupway,
    dupdiallist:dupdiallist,
    changepackage:changepackage
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('agentStatusCJI error!');
    }
    });
}

//获取录音存放地址
window.getMonitorCJI = function(sessionid, calldate, callbackFuc, mp3){
    $.getJSON(cocc_cip+"/setevent/getMonitorCJI?callback=?",{
    sessionid:sessionid,
    calldate:calldate,
    mp3:mp3
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('getMonitorCJI error!');
    }
    });
}

//队列中客户数量
window.queueCustomerNumCJI = function(orgidentity, queuenumber, prio, callbackFuc){
    $.getJSON(cocc_cip+"/setevent/queueCustomerNumCJI?callback=?",{
    orgidentity:orgidentity,
    queuenumber:queuenumber,
    prio:prio
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('queueCustomerNumCJI error!');
    }
    });
}

//获取单一坐席实时数据
window.agentRealtimeCJI = function(orgidentity,usertype,user,pwdtype,password,callbackFuc){
    $.getJSON(cocc_cip+"/setevent/agentRealtimeCJI?callback=?",{
    orgidentity:orgidentity,
    usertype:usertype,
    user:user,
    pwdtype:pwdtype,
    password:password
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('agentRealtimeCJI error!');
    }
    });
}

//获取单一坐席今日在坐席组中的统计数据
window.agentStatisticDayCJI = function(orgidentity,usertype,user,pwdtype,password,agent_group_id,callbackFuc){
    $.getJSON(cocc_cip+"/setevent/agentStatisticDayCJI?callback=?",{
    orgidentity:orgidentity,
    usertype:usertype,
    user:user,
    pwdtype:pwdtype,
    password:password,
        agent_group_id:agent_group_id
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('agentStatisticDayCJI error!');
    }
    });
}

//发送DTMF
window.dtmfCJI = function(orgidentity,usertype,user,pwdtype,password,dtmf,callbackFuc){
    $.getJSON(cocc_cip+"/setevent/dtmfCJI?callback=?",{
    orgidentity:orgidentity,
    usertype:usertype,
    user:user,
    pwdtype:pwdtype,
    password:password,
    dtmf:dtmf
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('dtmfCJI error!');
    }
    });
}

//设置随路数据
window.setvarCJI = function(orgidentity,usertype,user,pwdtype,password,varname,varvalue,callbackFuc){
    $.getJSON(cocc_cip+"/setevent/setvarCJI?callback=?",{
    orgidentity:orgidentity,
    usertype:usertype,
    user:user,
    pwdtype:pwdtype,
    password:password,
    varname:varname,
    varvalue:varvalue
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('setvarCJI error!');
    }
    });
}

//坐席转IVR
window.agenttoivrCJI = function(orgidentity,usertype,user,pwdtype,password,ivrexten,ivrflow,transfer,callbackFuc){
    $.getJSON(cocc_cip+"/setevent/agenttoivrCJI?callback=?",{
    orgidentity:orgidentity,
    usertype:usertype,
    user:user,
    pwdtype:pwdtype,
    password:password,
    ivrexten:ivrexten,
    ivrflow:ivrflow,
    transfer:transfer
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('setvarCJI error!');
    }
    });
}


//双呼拨号
window.backcallCJI = function(orgidentity,exten,targetdn,callerid,user,password,pwdtype,userdata,callbackFuc){
    $.getJSON(cocc_cip+"/setevent/backcallCJI?callback=?",{
    orgidentity:orgidentity,
    exten:exten,
    targetdn:targetdn,
    callerid:callerid,
    user:user,
    password:password,
    pwdtype:pwdtype,
        userdata:userdata
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('backcallCJI error!');
    }
    });
}


//Q房双呼拨号
window.qbackcallCJI = function(orgidentity, exten, targetdn, icallerid, xcallerid, user, password, pwdtype, userdata, callbackFuc){
    $.getJSON(cocc_cip+"/setevent/qbackcallCJI?callback=?",{
    orgidentity:orgidentity,
    exten:exten,
    targetdn:targetdn,
    icallerid:icallerid,
    xcallerid:xcallerid,
    user:user,
    password:password,
    pwdtype:pwdtype,
        userdata:userdata
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('backcallCJI error!');
    }
    });
}


//设置分机
window.setdeviceCJI = function(orgidentity, exten, user, pwdtype, password, callbackFuc){
    $.getJSON(cocc_cip+"/setevent/setdeviceCJI?callback=?",{
    orgidentity:orgidentity,
    exten:exten,
    user:user,
    pwdtype:pwdtype,
    password:password
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('setdeviceCJI error!');
    }
    });
}



//yealink 答应接口
window.yealinkAnswerCJI = function(orgidentity, type, target, phoneuser, phonepwd, callbackFuc){
    $.getJSON(cocc_cip+"/setevent/yealinkAnswerCJI?callback=?",{
    orgidentity:orgidentity,
    type:type,
    target:target,
    phoneuser:phoneuser,
    phonepwd:phonepwd
  },function(json) {
    try{
      if(typeof(callbackFuc) != 'undefined' && callbackFuc != ''){
        callbackFuc(json);
      }
    }catch(e){
      //alert('yealinkAnswerCJI error!');
    }
    });
}
