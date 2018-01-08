import fetch from 'dva/fetch';
import _ from 'lodash';
import { message } from 'antd';

message.config({
  top: 100,
  duration: 5,
});

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if (response.status === 500) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const newOptions = _.merge({
    headers: {
      'Accept': 'application/json;charset=utf-8, text/javascript, */*;',
      'content-type': 'application/json',
      'X-Requested-With': 'xmlhttprequest',
    },
    credentials: 'include',
  }, options);

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(parseJSON)
    .then((res) => {
      if (res.info && res.info[0] && res.info[0].name === 'LOGIN_REDIRECT_URL') {
        const redirectUrl = res.info[0].msg;
        window.location.href = redirectUrl;
        return false;
      }
      if(res.status === 500) {
        message.error(res.errorMessage);
        return Promise.reject(res.errorMessage);
      }
      if (res.code !== 0) {
        message.error(res.message);
        return Promise.reject(res.message);
      }
      return res.data;
    })
    // .catch(err => ({ err }));
}
