import request from '../utils/request';

export function getMyRecords(params) {
  return request('/borrower/v1/sms/my-records', { method: 'POST', body: JSON.stringify(params) });
}

export function getAllRecords(params) {
  return request('/borrower/v1/sms/all-records', { method: 'POST', body: JSON.stringify(params) });
}

export function resend(params) {
  return request(`/borrower/v1/sms/resend?recordId=${params}`);
}

export function getTemplates() {
  return request('/borrower/v1/sms/templates');
}

export function getSendModes() {
  return request('/borrower/v1/sms/send-modes');
}

export function getSteps() {
  return request('/borrower/v1/sms/steps');
}

export function getEmployeeGroups() {
  return request('/borrower/getGroupAndSubGroupsByUer');
}

export function getScopes() {
  return request('/borrower/v1/sms/template/scopes');
}

export function getEnablestatus() {
  return request('/borrower/v1/sms/template/enable-status');
}

export function getTemplateList(params) {
  return request('/borrower/v1/sms/template/list', { method: 'POST', body: JSON.stringify(params) });
}

export function getPrivilege() {
  return request('/borrower/v1/sms/template/has-update-privilege');
}

export function getTemplateFields() {
  return request('/borrower/v1/sms/template/form-fields');
}

export function getLiteralList() {
  return request('/borrower/v1/sms/template/constants/list-literal');
}

export function createTemplate(params) {
  return request('/borrower/v1/sms/template/create', { method: 'POST', body: JSON.stringify(params) });
}

export function getDetail(params) {
  return request(`/borrower/v1/sms/template/detail/${params}`);
}

export function editTemplate(params) {
  return request('/borrower/v1/sms/template/update', { method: 'POST', body: JSON.stringify(params) });
}

export function getConstansList(params) {
  return request('/borrower/v1/sms/template/constants/list', { method: 'POST', body: JSON.stringify(params) });
}

export function getConstantsDetail(params) {
  return request(`/borrower/v1/sms/template/constants/detail/${params}`);
}

export function updateConstants(params) {
  return request('/borrower/v1/sms/template/constants/update', { method: 'POST', body: JSON.stringify(params) });
}

export function addConstants(params) {
  return request('/borrower/v1/sms/template/constants/create', { method: 'POST', body: JSON.stringify(params) });
}

export function getContent(params) {
  return request(`/borrower/v1/sms/template/detail/${params}`);
}

export function getFaieldList(params) {
  return request('/borrower/v1/sms/batch/failure-list', { method: 'POST', body: JSON.stringify(params) });
}

export function getFaieldUserList(params) {
  return request('/borrower/v1/sms/batch/actor/failure-list', { method: 'POST', body: JSON.stringify(params) });
}

export function getUploadFaieldDetail(params) {
  return request(`/borrower/v1/sms/batch/detail/${params}`);
}
