import request from '../utils/request';

// 获取各模块配置
export function fetchHomeConfig() {
  return request('/borrower/v1/home/configs');
}
// 获取基本信息模块任务总数
export function fetchTaskTotal() {
  return request('/borrower/v1/home/task/count');
}
// 获取基本信息模块平均通话时长
export function fetchCallAverageTime() {
  return request('/borrower/v1/home/call/averagetime');
}
// 获取任务分布模块数据
export function fetchTaskDistribution() {
  return request('/borrower/v1/home/task/distribution');
}
// 获取贷款处理模块数据
export function fetchLoanDeal() {
  return request('/borrower/v1/home/loan/distribution');
}
// 获取近n日通话时长模块数据
export function fetchConversation() {
  return request('/borrower/v1/home/call/distribution');
}
// 获取任务分布模块数据
export function fetchKnowledge(params) {
  return request('/borrower/v1/borrow-cms/repository-list', { method: 'post', body: JSON.stringify(params) });
}
// 获取公告列表
export function fetchNotice(params) {
  return request('/borrower/v1/borrow-cms/notice-list', { method: 'post', body: JSON.stringify(params) });
}

