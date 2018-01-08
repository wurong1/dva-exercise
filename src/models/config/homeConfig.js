import { message } from 'antd';
import {
  fetchGetHomeConfig,
  fetchUpdateHomeConfig,
 } from '../../services/config';

export default {
  namespace: 'homeConfig',

  state: {
    configList: [],
    loading: true,
  },

  effects: {
    * getHomeConfig({ payload }, { put, call }) {
      try {
        yield put({ type: 'getHomeConfigStart' });
        const list = yield call(fetchGetHomeConfig);
        yield put({ type: 'getHomeConfigSucceed', payload: list });
      } catch (e) {
        yield put({ type: 'getHomeConfigFailed' });
        console.error(e);
      }
    },
    * updateHomeConfig({ payload }, { put, call }) {
      try {
        yield put({ type: 'updateHomeConfigStart' });
        const list = yield call(fetchUpdateHomeConfig, payload);
        yield put({ type: 'updateHomeConfigSucceed', payload: list });
      } catch (e) {
        yield put({ type: 'updateHomeConfigFailed' });
        console.error(e);
      }
    },
  },

  reducers: {
    getHomeConfigStart(state) {
      return { ...state, loading: true };
    },
    getHomeConfigSucceed(state, { payload }) {
      return { ...state, configList: payload || [], loading: false };
    },
    getHomeConfigFailed(state) {
      return { ...state, loading: false };
    },
    updateHomeConfigStart(state) {
      return { ...state, loading: true };
    },
    updateHomeConfigSucceed(state) {
      message.success('保存成功！', 2);
      return { ...state, loading: false };
    },
    updateHomeConfigFailed(state) {
      return { ...state, loading: false };
    },
  },
};
