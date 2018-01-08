import request from '../utils/request';

// 获取页面数据
export function fetchGetPageData(params) {
  return request(`/borrower/v1/getLeadsDetail?taskId=${params}`);
}
// 获取表单配置信息
export function fetchGetFormConfig() {
  return request('/borrower/v1/getLoanRiverEnums');
}
// 单个表单提交
export function fetchOneSubmit(params) {
  return request('/borrower/v1/updateLeads', { method: 'post', body: JSON.stringify(params) });
}
// 同步信息到loanRiver
export function fetchAllSubmit(params) {
  return request(`/borrower/v1/sysLeads?taskId=${params.taskId}&taskResult=${params.taskResult}&borrowerId=${params.borrowerId}&comment=${params.comment}`);
}
// 同步信息到CRM
export function fetchSaveIntention(params) {
  return request('/borrower/v1/task/intention', { method: 'post', body: JSON.stringify(params) });
}
