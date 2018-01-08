import request from '../utils/request';

// -----------------------------------------任务统计报表相关接口-----------------------------------------
export function getEmployeeGroupId() {
  return request('/borrower/getGroupAndSubGroupsByUer');
}

export function taskReportSubmit(params) {
  return request('/borrower/v1/report/borrowtask', { method: 'post', body: JSON.stringify(params) });
}

export function exportReportList(params) {
  return request('/borrower/v1/report/borrowtask/file?type=borrowTaskNew', { method: 'post', body: JSON.stringify(params) });
}

export function downloadReportList() {
  return request('/borrower/v1/report/borrowtask/files?type=borrowTaskNew');
}

export function deleteFile(params) {
  return request(`/borrower/v1/report/borrowtask/file/${params}`, { method: 'DELETE' });
}

export function deleteAll() {
  return request('/borrower/v1/report/borrowtask/files', { method: 'DELETE' });
}
// -----------------------------------------贷款申请表相关接口-----------------------------------------
// 贷款申请报表查询
export function fetchLoanApplySearch(params) {
  return request('/borrower/v1/report/loanapplication', { method: 'post', body: JSON.stringify(params) });
}
// 负责人联动
export function fetchGetEmployeeId(params) {
  return request(`/borrower/getUserByGroupId?groupId=${params}`);
}
// 贷款申请表报表导出
export function fetchLoanApplyExport(params) {
  return request('/borrower/v1/report/loanapplication/file?type=loanApplicationNew', { method: 'post', body: JSON.stringify(params) });
}
// 获取导出列表
export function fetchExportDownloadList() {
  return request('/borrower/v1/report/loanapplication/files?type=loanApplicationNew');
}
// 导出列表单个删除
export function fetchExportDelete(params) {
  return request(`/borrower/v1/report/loanapplication/file/${params}`, { method: 'DELETE' });
}
// 导出列表全部删除
export function fetchDeleteAll() {
  return request('/borrower/v1/report/loanapplication/files', { method: 'DELETE' });
}
// -----------------------------------------还款提醒表相关接口-----------------------------------------
// 还款提醒报表查询
export function fetchRepaymentSearch(params) {
  return request('/borrower/v1/report/loanrepayment', { method: 'post', body: JSON.stringify(params) });
}
// 还款提醒表报表导出
export function fetchRepaymentExport(params) {
  return request('/borrower/v1/report/loanrepayment/file?type=repaymentReportNew', { method: 'post', body: JSON.stringify(params) });
}
// 还款提醒表获取导出列表
export function fetchRepaymentDownloadList() {
  return request('/borrower/v1/report/loanrepayment/files?type=repaymentReportNew');
}
// 还款提醒表导出列表单个删除
export function fetchRepaymentDelete(params) {
  return request(`/borrower/v1/report/loanrepayment/file/${params}`, { method: 'DELETE' });
}
// 还款提醒表导出列表全部删除
export function fetchRepaymentDeleteAll() {
  return request('/borrower/v1/report/loanrepayment/files', { method: 'DELETE' });
}
// 还款提醒表获取贷款类型
export function fetchGetLoanType() {
  return request('/borrower/v1/condition/repayment/productcode');
}
// ------------------------------------------通话记录报表相关接口-----------------------------------------
// 通话记录报表信息查询
export function fetchGetCallAllInfo(params) {
  return request('/borrower/v1/report/call/statistics', { method: 'post', body: JSON.stringify(params) });
}
// 通话记录报表查询
export function fetchCalloutSearch(params) {
  return request('/borrower/v1/report/call/list', { method: 'post', body: JSON.stringify(params) });
}
// 通话记录报表导出
export function fetchCalloutExport(params) {
  return request('/borrower/v1/report/call/file?type=callRecordStatistics', { method: 'post', body: JSON.stringify(params) });
}
// 通话记录报表获取导出列表
export function fetchCalloutExportList() {
  return request('/borrower/v1/report/call/files?type=callRecordStatistics');
}
// 通话记录报表导出列表单个删除
export function fetchCalloutDelete(params) {
  return request(`/borrower/v1/report/call/file/${params}`, { method: 'DELETE' });
}
// 通话记录报表导出列表全部删除
export function fetchCalloutDeleteAll() {
  return request('/borrower/v1/report/call/files', { method: 'DELETE' });
}
// ------------------------------------------电话统计报表相关接口-----------------------------------------
// 电话统计报表查询时间维度
export function fetchCallStatisticsByTime(params) {
  return request('/borrower/v1/report/tellphone', { method: 'post', body: JSON.stringify(params) });
}
// 电话统计报表查询团队维度
export function fetchCallStatisticsByTeam(params) {
  return request('/borrower/v1/report/tellphone', { method: 'post', body: JSON.stringify(params) });
}

export function getAssignRecords(params) {
  return request('/borrower/v1/report/autoassign', { method: 'post', body: JSON.stringify(params) });
}

export function exportAssignReportList(params) {
  return request('/borrower/v1/report/autoassign/file?type=autoassign', { method: 'post', body: JSON.stringify(params) });
}


export function downloadAssignReportList() {
  return request('/borrower/v1/report/autoassign/files?type=autoassign');
}
