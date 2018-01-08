import { getGroupList, getTagList, addTag, editGroup } from '../../services/cms';

export default {
  namespace: 'smsGroup',

  state: {
    loading: false,
    dataSource: {},
    tagList: [],
    loadingModal: false,
    detailValue: {
      visible: false,
      loading: false,
    },
  },

  effects: {
    * getDataSource({ payload }, { put, call }) {
      try {
        yield put({ type: 'startLoadingPage' });
        const data = yield call(getGroupList, payload);
        yield put({ type: 'getDataSourceSucceed', payload: data || {} });
      } catch (e) {
        yield put({ type: 'loadingPageEnd' });
        console.error(e);
      }
    },
    * getTagList({ payload }, { put, call }) {
      try {
        const data = yield call(getTagList, payload);
        yield put({ type: 'getTagListSucceed', payload: data || [] });
      } catch (e) {
        console.error(e);
      }
    },
    * addGroup({ payload }, { put, call }) {
      try {
        yield put({ type: 'startLoadingModal' });
        yield call(addTag, payload);
        yield put({ type: 'addGroupSucceed' });
        yield put({ type: 'getDataSource', payload: { pageNo: 1, pageSize: 50 } });
      } catch (e) {
        yield put({ type: 'loadingModalEnd' });
        console.error(e);
      }
    },
    * editGroup({ payload }, { put, call, select }) {
      try {
        yield put({ type: 'beforeEditGroup' });
        yield call(editGroup, payload);
        const pageNo = yield select(state => state.smsGroup.dataSource.pageNo);
        const pageSize = yield select(state => state.smsGroup.dataSource.pageSize);
        yield put({ type: 'editGroupSucceed' });
        yield put({ type: 'getDataSource', payload: { pageNo, pageSize } });
      } catch (e) {
        yield put({ type: 'editGroupFaield' });
        console.error(e);
      }
    },
  },

  reducers: {
    startLoadingPage(state) {
      return {
        ...state,
        loading: true,
      };
    },
    getDataSourceSucceed(state, { payload }) {
      return {
        ...state,
        dataSource: payload,
        loading: false,
      };
    },
    loadingPageEnd(state) {
      return {
        ...state,
        loading: false,
      };
    },
    showModal(state, { payload }) {
      return {
        ...state,
        visible: payload,
      };
    },
    getTagListSucceed(state, { payload }) {
      return {
        ...state,
        tagList: payload,
      };
    },
    startLoadingModal(state) {
      return {
        ...state,
        loadingModal: true,
      };
    },
    addGroupSucceed(state) {
      return {
        ...state,
        loadingModal: false,
        visible: false,
      };
    },
    loadingModalEnd(state) {
      return {
        ...state,
        loadingModal: false,
      };
    },
    showEditModal(state, { payload }) {
      return {
        ...state,
        detailValue: {
          ...state.detailValue,
          ...payload,
          visible: true,
        },
      };
    },
    closeEditModal(state) {
      return {
        ...state,
        detailValue: {
          loading: false,
          visible: false,
        },
      };
    },
    beforeEditGroup(state) {
      return {
        ...state,
        detailValue: {
          ...state.detailValue,
          loading: true,
        },
      };
    },
    editGroupSucceed(state) {
      return {
        ...state,
        detailValue: {
          loading: false,
          visible: false,
        },
      };
    },
    editGroupFaield(state) {
      return {
        ...state,
        detailValue: {
          ...state.detailValue,
          loading: false,
        },
      };
    },
  },
};
