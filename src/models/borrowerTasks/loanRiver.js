import { message } from 'antd';
import {
  fetchGetPageData,
  fetchGetFormConfig,
  fetchOneSubmit,
  fetchAllSubmit,
  fetchSaveIntention,
  } from '../../services/loanRiver';

export default {
  namespace: 'loanRiver',

  state: {
    pageData: {},
    configInfo: {},
    formLoading: false,
    oneSubmitStatus: false,
    allSubmitStatus: false,
  },

  effects: {
    * getConfigAndData({ payload }, { call, put }) {
      try {
        yield put({ type: 'getConfigAndDataStart' });
        const config = yield call(fetchGetFormConfig);
        yield put({ type: 'getConfigSuccessed', payload: config });
        const data = yield call(fetchGetPageData, payload);
        yield put({ type: 'getConfigAndDataSuccessed', payload: data });
      } catch (e) {
        console.error(e);
        yield put({ type: 'getConfigAndDataFailed' });
      }
    },
    * oneSubmit({ payload }, { call, put }) {
      try {
        yield put({ type: 'oneSubmitStart' });
        const oneSubmit = yield call(fetchOneSubmit, payload);
        yield put({ type: 'oneSubmitSuccessed', payload: oneSubmit });
      } catch (e) {
        console.error(e);
        yield put({ type: 'oneSubmitFailed' });
      }
    },
    * allSubmit({ payload }, { call, put }) {
      try {
        yield put({ type: 'allSubmitStart' });
        yield call(fetchSaveIntention, payload && payload.crmParams);
        const allSubmit = yield call(fetchAllSubmit, payload && payload.loanRiverParams);
        yield put({ type: 'allSubmitSuccessed', payload: allSubmit });
      } catch (e) {
        console.error(e);
        yield put({ type: 'allSubmitFailed' });
      }
    },
    * saveIntention({ payload }, { call, put }) {
      try {
        yield put({ type: 'allSubmitStart' });
        const allSubmit = yield call(fetchSaveIntention, payload.crmParams);
        yield put({ type: 'allSubmitSuccessed', payload: allSubmit });
      } catch (e) {
        console.error(e);
        yield put({ type: 'allSubmitFailed' });
      }
    },
  },

  reducers: {
    getConfigAndDataStart(state) {
      return { ...state, formLoading: true };
    },
    getConfigSuccessed(state, { payload }) {
      return { ...state, configInfo: payload || {} };
    },
    getConfigAndDataSuccessed(state, { payload }) {
      return { ...state, pageData: payload || {}, formLoading: false };
    },
    getConfigAndDataFailed(state) {
      return { ...state, formLoading: false };
    },
    oneSubmitStart(state) {
      return { ...state, formLoading: true };
    },
    oneSubmitSuccessed(state) {
      message.success('保存成功！', 1);
      return { ...state, formLoading: false };
    },
    oneSubmitFailed(state) {
      message.error('保存失败！', 3);
      return { ...state, formLoading: false };
    },
    allSubmitStart(state) {
      return { ...state, allSubmitStatus: true };
    },
    allSubmitSuccessed(state) {
      message.success('提交成功！', 1);
      return { ...state, allSubmitStatus: false };
    },
    allSubmitFailed(state) {
      message.error('提交失败！', 3);
      return { ...state, allSubmitStatus: false };
    },
  },
};
