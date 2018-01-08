import request from '../utils/request';

// -------------------------------------------录音记录----------------------------------------------
// 负责人组别获取联动
export function fetchGetEmployeeGroupId() {
  return request('/borrower/getGroupAndSubGroupsByUer');
}
// 负责人联动
export function fetchGetEmployeeId(params) {
  return request(`/borrower/getUserByGroupId?groupId=${params}`);
}
// 录音记录查询
export function fetchTapeRecordSearch(params) {
  return request('/borrower/v1/call/call-records', { method: 'post', body: JSON.stringify(params) });
}
// -------------------------------------------我的通话记录--------------------------------------------
// 录音记录查询
export function fetchMyRecordSearch(params) {
  return request('/borrower/v1/call/my-call-records', { method: 'post', body: JSON.stringify(params) });
}
