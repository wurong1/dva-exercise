import request from '../utils/request';

export function getUserInfo() {
  return request('/borrower/v1/auth/me');
}

export function getAgentConf() {
  return request('/borrower/v1/auth/me/preferredline');
}

export function getAgentInfo(params) {
  return request('/borrower/v1/auth/me/line', { method: 'post', body: JSON.stringify(params) });
}
// 设置分机
export function setExtNo(params) {
  return request('/borrower/v1/auth/me/lines/bound', { method: 'put', body: JSON.stringify(params) });
}
// 分机解绑
export function unBindAgent(params) {
  return request('/borrower/v1/auth/me/lines/unbind', { method: 'put', body: JSON.stringify(params) });
}
// 创建坐席
export function createAgent(params) {
  return request(`/borrower/v1/auth/me/lines/${params.agentId}`, { method: 'post', body: JSON.stringify(params) });
}
