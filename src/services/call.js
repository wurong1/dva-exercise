import request from '../utils/request';

export function getTaskDetail(params) {
  return request(`/borrower/v1/task/detail?taskId=${params}`);
}

export function getCallInfo(params) {
  return request(`/borrower/v1/call/callout_sale?taskId=${params.taskId}&id=${params.id}&customerId=${params.customerId}`);
}

export function saveInfo(params) {
  return request('/borrower/v1/call/callout', { method: 'post', body: JSON.stringify(params) });
}

export function getOriginPhoneNo(params) {
  return request(`/borrower/v1/customer/cellphone?id=${params}`);
}
