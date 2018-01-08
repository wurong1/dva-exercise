import { message } from 'antd';
import {
  fetchGetNoticeType,
  fetchGetNoticeProject,
  fetchSearchNotice,
  fetchNoticeOperateAuth,
  fetchDeleteNotice,
  fetchTopNotice,
  fetchCollectNotice,
 } from '../../services/cms';

message.config({
  top: 100,
});

export default {
  namespace: 'notice',

  state: {
    noticeTypeList: [],
    noticeProjectList: [],
    searchParams: {},
    searchList: {},
    searchLoading: false,
    operateAuthList: [],
  },

  effects: {
    * getNoticeType({ payload }, { call, put }) {
      try {
        const noticeType = yield call(fetchGetNoticeType, payload);
        yield put({ type: 'getNoticeTypeSucceed', payload: noticeType });
      } catch (e) {
        console.error(e);
      }
    },
    * getNoticeProject({ payload }, { call, put }) {
      try {
        const noticeProject = yield call(fetchGetNoticeProject, payload);
        yield put({ type: 'getNoticeProjectSucceed', payload: noticeProject });
      } catch (e) {
        console.error(e);
      }
    },
    * search({ payload }, { call, put }) {
      try {
        yield put({ type: 'searchStart' });
        const searchList = yield call(fetchSearchNotice, payload);
        yield put({ type: 'searchSucceed', payload: searchList });
        yield put({ type: 'setSearchParams', payload });
      } catch (e) {
        console.error(e);
        yield put({ type: 'searchFailed' });
      }
    },
    * noticeOperateAuth({ payload }, { call, put }) {
      try {
        const operateAuth = yield call(fetchNoticeOperateAuth, payload);
        yield put({ type: 'noticeOperateAuthSucceed', payload: operateAuth });
      } catch (e) {
        console.error(e);
      }
    },
    * deleteNotice({ payload }, { call, put, select }) {
      try {
        const deleteNotice = yield call(fetchDeleteNotice, payload);
        yield put({ type: 'deleteNoticeSucceed', payload: deleteNotice });
        const searchData = yield select(state => state.notice.searchParams);
        yield put({ type: 'search', payload: searchData });
      } catch (e) {
        console.error(e);
      }
    },
    * topNotice({ payload }, { call, put, select }) {
      try {
        const topNotice = yield call(fetchTopNotice, payload);
        yield put({ type: 'topNoticeSucceed', payload: topNotice });
        const searchData = yield select(state => state.notice.searchParams);
        yield put({ type: 'search', payload: searchData });
      } catch (e) {
        console.error(e);
      }
    },
    * collectNotice({ payload }, { call, put, select }) {
      try {
        const collectNotice = yield call(fetchCollectNotice, payload);
        yield put({ type: 'collectNoticeSucceed', payload: collectNotice });
        const searchData = yield select(state => state.notice.searchParams);
        yield put({ type: 'search', payload: searchData });
      } catch (e) {
        console.error(e);
      }
    },
  },

  reducers: {
    getNoticeTypeSucceed(state, { payload }) {
      return { ...state, noticeTypeList: payload || [] };
    },
    getNoticeProjectSucceed(state, { payload }) {
      return { ...state, noticeProjectList: payload || [] };
    },
    resetNoticeProject(state) {
      return { ...state, noticeProjectList: [] };
    },
    searchStart(state) {
      return { ...state, searchLoading: true };
    },
    searchSucceed(state, { payload }) {
      return { ...state, searchList: payload || {}, searchLoading: false };
    },
    searchFailed(state) {
      return { ...state, searchLoading: false };
    },
    setSearchParams(state, { payload }) {
      return { ...state, searchParams: payload || {} };
    },
    noticeReset(state) {
      return { ...state, searchList: {} };
    },
    noticeOperateAuthSucceed(state, { payload }) {
      return { ...state, operateAuthList: payload || [] };
    },
    deleteNoticeSucceed(state, { payload }) {
      return { ...state, searchList: payload || {} };
    },
    topNoticeSucceed(state, { payload }) {
      return { ...state, searchList: payload || {} };
    },
    collectNoticeSucceed(state, { payload }) {
      return { ...state, searchList: payload || {} };
    },
  },
};
