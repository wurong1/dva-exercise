import request from '../utils/request';

// 认证借款用户或企业用户
export function fetchAuthActor(params) {
  return request('/borrower/v1/authActor', { method: 'post', body: JSON.stringify(params) });
}
// 创建借款用户或企业用户
export function fetchCreateActor(params) {
  return request('/borrower/v1/createActor', { method: 'post', body: JSON.stringify(params) });
}
// 创建借款
export function fetchCreateLoan(params) {
  return request('/borrower/v1/createLoan', { method: 'post', body: JSON.stringify(params) });
}
// 已注册用户创建借款
export function fetchExistedCreateLoan(params) {
  return request('/borrower/v1/createLoanForExistingCustomer', { method: 'post', body: JSON.stringify(params) });
}
// 已注册用户查询
export function fetchSearchCustomer(params) {
  return request('/borrower/v1/searchCustomer', { method: 'post', body: JSON.stringify(params) });
}
// 查找可创建贷款列表
export function fetchFindLoanList(params) {
  return request(`/borrower/v1/findLoanList?configCode=crm_created&company=${params.company}`);
}
// 是否是新注册任务过来的创建借款
export function fetchNewRegistCreate(params) {
  return request('/borrower/v1/loan/direct', { method: 'post', body: JSON.stringify(params) })
}
// 负责人组别
export function fetchGetEmployeeGroupId() {
  return request('/borrower/getGroupAndSubGroupsByUer');
}
// 负责人联动
export function fetchGetEmployeeId(params) {
  return request(`/borrower/getUserByGroupId?groupId=${params}`);
}
