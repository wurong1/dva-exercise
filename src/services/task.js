import request from '../utils/request';

export function getHistotyList(params) {
  return request('/borrower/v1/loan/history', { method: 'POST', body: JSON.stringify(params) });
}

export function getWithholdInfo(params) {
  return request(`/borrower/v1/loan/${params}/withholding`);
}

export function getRepaymentPlan(params) {
  return request(`/borrower/v1/loan/${params}/repayment/plans`);
}


export function getRepaymentDetail(params) {
  return request(`/borrower/v1/loan/${params}/repayment/details`);
}

export function getPosInfo(params) {
  return request(`/borrower/pos/getPosInfomations?cardNo=${params.cardNo}`);
}

export function addPosInfo(params) {
  return request('/borrower/pos/addPosInformation', { method: 'post', body: JSON.stringify(params) });
}

export function getEditData(params) {
  return request(`/borrower/pos/getPosInfomation?id=${params}`);
}

export function editPosInfo(params) {
  return request('/borrower/pos/addPosInformation', { method: 'post', body: JSON.stringify(params) });
}

export function getCommercialInfo(params) {
  return request('/borrower/pos/getCommercialTenantes', { method: 'post', body: JSON.stringify(params) });
}

export function deployCommercial(params) {
  return request('/borrower/pos/addPosInformation', { method: 'post', body: JSON.stringify(params) });
}

export function getPosDetail(params) {
  return request(`/borrower/pos/getMcaInfomationResponse?id=${params}`);
}

export function getTaskDelay() {
  return request('/borrower/v1/task/task-delay-times');
}

export function submitTaskDelay(params) {
  return request('/borrower/v1/task/task-delay-times', { method: 'post', body: JSON.stringify(params) });
}

