import request from '../utils/request';

export function fetchAuditSearch(params) {
  return request('/borrower/v1/loan/review/record', { method: 'post', body: JSON.stringify(params) });
}

export function fetchAuditResult(params) {
  return request('/borrower/v1/loan/review/operation', { method: 'post', body: JSON.stringify(params) });
}

export function fetchAuditDetails(params) {
  return request(`/borrower/v1/loan/review/detail?loanAppId=${params.loanAppId}&reviewId=${params.reviewId ? params.reviewId : params.reviewVersion}`);
}

export function fetchConfig(params) {
  return request(`/borrower/v1/loan/review/config?loanAppId=${params.loanAppId}`);
}

export function fetchBaseInfo(params) {
  return request(`/borrower/v1/loan/baseinfo?loanAppId=${params.loanAppId}`);
}

export function fetchLoanAuditResult(params) {
  return request(`/borrower/v1/loan/auditresult?aid=${params.aid}&loanAppId=${params.loanId}&topic=CONDITIONS_REVIEW&routingSystem=${params.routingSystem}&taskStatus=${params.taskStatus}&pageNo=${params.pageNo ? params.pageNo : 1}&pageSize=${params.pageSize ? params.pageSize : 10}`);
}
export function fetchGetEmployeeGroupId() {
  return request('/borrower/getGroupAndSubGroupsByUer');
}
export function fetchGetActorBaseInfo(params) {
  return request(`/borrower/v1/actor/baseinfo?loanAppId=${params.loanAppId}`);
}
export function fetchGetEmployeeId(params) {
  return request(`/borrower/getUserByGroupId?groupId=${params}`);
}
export function getOriginPhone(params) { // 获取未脱敏的电话号码
  return request(`/borrower/v1/customer/phone?actorId=${params}`);
}
