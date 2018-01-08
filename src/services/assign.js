import request from '../utils/request';

export function getEmployList(params) {
  return request(`/borrower/v1/assignruleconfig/getexistingemployee?type=${params}`);
}

export function addEmployee(params) {
  return request(`/borrower/v1/assignruleconfig/getemployee?email=${params}&type=WEALTH`);
}

export function updateConfig(params) {
  return request('/borrower/v1/assignruleconfig/updateassignruleconfig', { method: 'POST', body: JSON.stringify(params) });
}

export function getRecordList(params) {
  return request('/borrower/v1/assignruleconfig/getassignruleconfigrecord', { method: 'POST', body: JSON.stringify(params) });
}

export function getOperationResultList(params) {
  return request(`/borrower/v1/assignruleconfig/getTaskProcessResult?loanCode=${params.loanCode}&taskStatus=${params.taskStatus}`);
}

export function getExistResultList(params) {
  return request(`/borrower/v1/assignruleconfig/getExistingTaskProcessResult?loanCode=${params}`);
}

export function updateStatusConfig(params) {
  return request('/borrower/v1/assignruleconfig/updateAssginRuleTaskStatus', { method: 'POST', body: JSON.stringify(params) });
}

export function getRuleDetail(params) {
  return request(`/borrower/v1/assignruleconfig/assign-rule/detail/${params}`);
}

export function getGroups() {
  return request('/borrower/getGroupAndSubGroupsByUer');
}

export function getUserList(params) {
  return request(`/borrower/getUserByGroupId?groupId=${params}`);
}

export function saveAssignRlues(params) {
  return request('/borrower/v1/assignruleconfig/save-assign-rule', { method: 'POST', body: JSON.stringify(params) });
}

export function filterEmployee(params) {
  return request(`/borrower/v1/assignruleconfig/getemployee?email=${params.email}&type=${params.assignType}`);
}

export function getButtonConfig() {
  return request('/borrower//v1/auth/page/EMPLOYEE_FILTER/buttons');
}
