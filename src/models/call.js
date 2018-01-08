import { message } from 'antd';
import {
  getTaskDetail,
  getCallInfo,
  saveInfo,
  getOriginPhoneNo,
} from '../services/call';

export default {
  namespace: 'call',
  state: {
    loading: false,
    taskDetail: {
      customerInfor: {},
      loanBaseInfor: {},
      operationResults: [],
    },
    callInfo: {
      callResponse: {},
    },
    counter: 0,
    endTime: null,
    callTime: null,
    sessionid: null,
    dialTime: null,
    endFlag: false,
    initSuccess: false,
    originPhoneNo: '',
  },

  effects: {

    * getTaskDetail({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingPage' });
        const detailInfo = yield call(getTaskDetail, payload.taskId);
        const params = {
          taskId: detailInfo && detailInfo.taskId,
          id: payload.id,
          customerId: detailInfo && detailInfo.customerInfor && detailInfo.customerInfor.customerId,
        };
        const callInfo = yield call(getCallInfo, params);
        yield put({ type: 'getInitDataSuccess', payload: { detailInfo, callInfo } });
      } catch (e) {
        yield put({ type: 'loadingPageFaild' });
        console.error(e);
      }
    },
    * saveInfo({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingPage' });
        yield call(saveInfo, payload);
        yield put({ type: 'saveInfoSuccess' });
      } catch (e) {
        yield put({ type: 'loadingPageFaild' });
        console.error(e);
      }
    },
    * getOriginPhoneNo({ payload }, { put, call }) {
      try {
        const phone = yield call(getOriginPhoneNo, payload);
        yield put({ type: 'getOriginPhoneNoSuccess', payload: phone });
      } catch (e) {
        console.error(e);
      }
    },
  },

  reducers: {
    loadingPage(state) {
      return {
        ...state,
        loading: true,
      };
    },
    getInitDataSuccess(state, { payload }) {
      const detailInfo = payload.detailInfo || {};
      const callInfo = payload.callInfo || {};
      return {
        ...state,
        callInfo: {
          ...callInfo,
          callResponse: callInfo.callResponse || {},
        },
        taskDetail: {
          ...detailInfo,
          customerInfor: detailInfo.customerInfor || {},
          loanBaseInfor: detailInfo.loanBaseInfor || {},
          operationResults: detailInfo.operationResults || [],
        },
        initSuccess: true,
      };
    },
    loadingPageFaild(state) {
      return {
        ...state,
        loading: false,
      };
    },
    saveInfoSuccess(state) {
      // 保存通话后关闭页面
      message.success('保存成功，2秒侯将关闭页面！');
      const timer = setInterval(() => {
        window.clearInterval(timer);
        window.close();
      }, 2000);
      return {
        ...state,
        loading: true,
      };
    },
    setCounter(state, { payload }) {
      return {
        ...state,
        counter: payload,
      };
    },
    showLoading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
    setEndTime(state, { payload }) {
      return {
        ...state,
        endTime: payload,
      };
    },
    setCallTime(state, { payload }) {
      return {
        ...state,
        callTime: payload,
      };
    },
    setSessionid(state, { payload }) {
      return {
        ...state,
        sessionid: payload,
      };
    },
    setDialTime(state, { payload }) {
      return {
        ...state,
        dialTime: payload,
      };
    },
    setEndFlag(state) {
      return {
        ...state,
        endFlag: true,
      };
    },
    getOriginPhoneNoSuccess(state, { payload }) {
      return {
        ...state,
        originPhoneNo: payload,
      };
    },
  },
};
