import request from '../utils/request';

export function getMenuList() {
  return request('/borrower/v1/auth/me/navlinks');
}
