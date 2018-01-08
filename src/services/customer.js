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
  return request('/borrower/v1/customer/list', { method: 'post', body: JSON.stringify(params) });
}
// 客户详情查询接口
export function fetchGetCustomerDetails(params) {
  return request(`/borrower/v1/customer/${params}/detail`);
}
// 客户详情,操作记录查询接口
export function fetchGetCustomerDealRecord(params) {
  return request(` /borrower/v1/customer/${params.actorId}/operation/records/${params.pageNo}/${params.pageSize}`);
}
// 新增用户,单个新增客户接口
export function fetchAddCustomer(params) {
  return request('/borrower/v1/actor/addborrowcustomer', { method: 'post', body: JSON.stringify(params) });
}
// 新增客户,贷款类型与贷款期限联动接口
export function fetchGetLoanTerm(params) {
  return request(`/borrower/v1/actor/getloancycle?loanType=${params}`);
}
// 客户管理，失败历史，获取上传失败记录接口
export function fetchGetUploadFialedList(params) {
  return request(`/borrower/v1/actor/toUploadFialedList?pageNo=${params.pageNo || 1}&pageSize=${params.pageSize || 50}`);
}
// 客户管理，查询失败历史接口
export function fetchFindUploadFailedList(params) {
  return request('/borrower/v1/actor/findUploadFailedList', { method: 'post', body: JSON.stringify(params) });
}
// 失败历史跳转权限查询
export function fetchPermission(params) {
  return request(`/borrower/v1/permission/?action=toUploadFialedList&customerId=${params}`);
}
// 获取客户调配组别
export function fetchGetDeployGroup() {
  return request('/borrower/v1/customer/deployment/groups');
}
// 客户管理,调配
export function fetchDeploy(params) {
  return request('/borrower/v1/customer/deployment', { method: 'post', body: JSON.stringify(params) });
}
// 获取未脱敏的电话号码
export function getOriginPhone(params) {
  return request(`/borrower/v1/customer/phone?actorId=${params}`);
}

