import request from '../utils/request';

// 获取预申请客户信息
export function fetchGetCustomerInfo(params) {
  return request(`/borrower/v1/customer/base-preloan?customerId=${params}`);
}
// 客户历史预申请查询
export function fetchGetTabList(params) {
  return request('/borrower/v1/customer/preloans', { method: 'post', body: JSON.stringify(params) });
}
