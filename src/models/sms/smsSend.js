import {
  getTemplates,
  getContent,
  getFaieldList, // 获取失败的批出理结果
  getFaieldUserList, // 获取批次处理失败用户信息
  getUploadFaieldDetail,
} from '../../services/sms';

export default {
  namespace: 'smsSend',
  state: {
    templates: [],
    loading: false,
    contentVal: '',
    dataSource: {}, // 失败历史列表
    loadingFaieldList: false,
    faieldUserList: {},
    loadingFaieldUserList: false,
    uploadFaieldDetail: {},
  },
  effects: {
    * getTemplates({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingPage' });
        const list = yield call(getTemplates);
        yield put({ type: 'getTemplatesSuccess', payload: list });
      } catch (e) {
        yield put({ type: 'loadingPageFaild' });
        console.error(e);
      }
    },
    * getContent({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingPage' });
        const data = yield call(getContent, payload);
        yield put({ type: 'getContentSuccess', payload: data || {} });
      } catch (e) {
        yield put({ type: 'loadingPageFaild' });
        console.error(e);
      }
    },
    * getFaieldList({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingFaieldList' });
        const data = yield call(getFaieldList, payload);
        yield put({ type: 'getFaieldListSuccess', payload: data || {} });
      } catch (e) {
        yield put({ type: 'loadingFaieldListFaild' });
        console.error(e);
      }
    },
    * getFaieldUserList({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingFaieldUserList' });
        const data = yield call(getFaieldUserList, payload);
        yield put({ type: 'getFaieldUserListSuccess', payload: data || {} });
      } catch (e) {
        yield put({ type: 'loadingFaieldUserListFaild' });
        console.error(e);
      }
    },
    * getUploadFaieldDetail({ payload }, { put, call }) {
      try {
        const data = yield call(getUploadFaieldDetail, payload);
        yield put({ type: 'getUploadFaieldDetailSuccess', payload: data || {} });
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
    getTemplatesSuccess(state, { payload }) {
      return {
        ...state,
        templates: payload || [],
        loading: false,
      };
    },
    loadingPageFaild(state) {
      return {
        ...state,
        loading: false,
      };
    },
    getContentSuccess(state, { payload }) {
      return {
        ...state,
        contentVal: payload.content,
        loading: false,
      };
    },
    setLoadingState(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
    loadingFaieldList(state) {
      return {
        ...state,
        loadingFaieldList: true,
      };
    },
    getFaieldListSuccess(state, { payload }) {
      return {
        ...state,
        dataSource: payload || {},
        loadingFaieldList: false,
      };
    },
    loadingFaieldListFaild(state) {
      return {
        ...state,
        loadingFaieldList: false,
      };
    },
    loadingFaieldUserList(state) {
      return {
        ...state,
        loadingUserList: true,
      };
    },
    getFaieldUserListSuccess(state, { payload }) {
      return {
        ...state,
        faieldUserList: payload || {},
        loadingUserList: false,
      };
    },
    loadingFaieldUserListFaild(state) {
      return {
        ...state,
        loadingUserList: false,
      };
    },
    getUploadFaieldDetailSuccess(state, { payload }) {
      return {
        ...state,
        uploadFaieldDetail: payload,
      };
    },
  },
};
