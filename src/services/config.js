import request from '../utils/request';

// 获取所有配置信息
export function fetchGetHomeConfig() {
  return request('/v1/home/configs');
}
// 更新配置
export function fetchUpdateHomeConfig(params) {
  return request('/borrower/v1/home/config', { method: 'put', body: JSON.stringify(params) });
}
