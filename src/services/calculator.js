import request from '../utils/request';

export function getCycleList(params) {
  return request(`/borrower/v1/actor/getloancycle?loanType=${params}`);
}

export function getRepayList(params) {
  return request(`/borrower/v1/loan/find-payment-method?loanType=${params}`);
}
