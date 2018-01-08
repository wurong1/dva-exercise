const MSG = {
  'BackMsg_01': '参数不能为空',
  'BackMsg_02': '组织标识错误或不存在',
  'BackMsg_03': '工号不存在或密码错误',
  'BackMsg_05': '坐席所属帐号被禁用',
  'BackMsg_06': '坐席所属帐号不存在',
  'BackMsg_07': '密码错误',
  'BackMsg_12': '不存在此座席',
  'BackMsg_15': '帐号不存在',
  'BackMsg_16': '呼叫失败,坐席未签入',
  'BackMsg_17': '呼叫失败,坐席状态异常',
  'BackMsg_17[ringing]': '当前坐席占线',
  'BackMsg_18': '呼叫失败,坐席当前外呼受限制',
  'BackMsg_20': '呼叫失败'
};

/**
 * coccErrorMsg 云牛呼叫异常提醒
 * @param  {String}
 * @return {String}
 */
const coccErrorMsg = (code) => {
  return MSG[code] || '抱歉,请求异常,请刷新页面后重新尝试';
};

export {
  coccErrorMsg
};
