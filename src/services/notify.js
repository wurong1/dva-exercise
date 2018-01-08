import request from '../utils/request';

export function getMessageList(params) {
  return request(`/saas/im/employee/userMessage/secondType/${params.type}?pageNo=${params.pageNo}&pageSize=${params.pageSize}`);
}

export function readMessage(params) {
  return request(`/saas/im/employee/userMessage/ack/${params}`);
}

export function deleteAll(params) {
  return request(`/saas/im/employee/userMessage/delete/secondType/${params}`);
}

export function getNotifySettingList() {
  return request('/borrower/v1/notify/findAllNotificationSettingList');
}

export function updateSetting(params) {
  return request(`/borrower/v1/notify/updateSetting?type=${params.type}&status=${params.status}`);
}

