import request from '../utils/request';

// 负责人组别
export function fetchGetEmployeeGroupId() {
  return request('/borrower/getGroupAndSubGroupsByUer');
}
// 负责人联动
export function fetchGetEmployeeId(params) {
  return request(`/borrower/getUserByGroupId?groupId=${params}`);
}
// 查询请求
export function fetchSearch(params) {
  return request('/borrower/v1/task/list', { method: 'post', body: JSON.stringify(params) });
}
// 获取查询条件“意向用户来源”的下拉列表
export function fetchGetIntentionsource() {
  return request('/borrower/v1/condition/intentionsource');
}
// 获取查询条件“首次推荐贷款产品”的下拉列表
export function fetchGetFirstRecommend() {
  return request('/borrower/v1/condition/firstrecommendproduct');
}
// 进件类型 ------> 贷款类型联动接口
export function fetchGetProductcode(params) {
  return request(`/borrower/v1/condition/productcode?guidedType=${params}`);
}

// 所有任务查询
export function taskAllsubmit(params) {
  return request('/borrower/v1/task/list', { method: 'post', body: JSON.stringify(params) });
}

export function getButtonConfig(params) {
  return request(`/borrower/v1/task/${params}/operation/button`);
}

export function getGroup(params) {
  return request(`/borrower/v1/task/${params.taskType}/operation/${params.operationType}/group`);
}

export function getEmployeeUser(params) {
  return request(`/borrower/getUserByGroupId?groupId=${params}`);
}

export function modalSubmit(params) {
  return request('/borrower/v1/task/deployment', { method: 'post', body: JSON.stringify(params) });
}

export function assignSubmit(params) {
  return request('/borrower/v1/task/assignment', { method: 'post', body: JSON.stringify(params) });
}
