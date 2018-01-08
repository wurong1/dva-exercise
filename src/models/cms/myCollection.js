import { message } from 'antd';
import {
  fetchGetCollectionType,
  fetchGetCollectionProject,
  fetchSearchCollection,
  fetchDeleteCollection,
 } from '../../services/cms';

message.config({
  top: 100,
});

export default {
  namespace: 'collection',

  state: {
    collectionTypeList: [],
    collectionProjectList: [],
    searchParams: {},
    searchList: {},
    searchLoading: false,
  },

  effects: {
    * getCollectionType({ payload }, { call, put }) {
      try {
        const collectionType = yield call(fetchGetCollectionType, payload);
        yield put({ type: 'getCollectionTypeSucceed', payload: collectionType });
      } catch (e) {
        console.error(e);
      }
    },
    * getCollectionProject({ payload }, { call, put }) {
      try {
        const collectionProject = yield call(fetchGetCollectionProject, payload);
        yield put({ type: 'getCollectionProjectSucceed', payload: collectionProject });
      } catch (e) {
        console.error(e);
      }
    },
    * search({ payload }, { call, put }) {
      try {
        yield put({ type: 'searchStart' });
        const searchList = yield call(fetchSearchCollection, payload);
        yield put({ type: 'searchSucceed', payload: searchList });
        yield put({ type: 'setSearchParams', payload });
      } catch (e) {
        console.error(e);
        yield put({ type: 'searchFailed' });
      }
    },
    * deleteCollection({ payload }, { call, put, select }) {
      try {
        const deleteCollection = yield call(fetchDeleteCollection, payload);
        yield put({ type: 'deleteCollectionSucceed', payload: deleteCollection });
        const searchData = yield select(state => state.collection.searchParams);
        yield put({ type: 'search', payload: searchData });
      } catch (e) {
        console.error(e);
      }
    },
  },

  reducers: {
    getCollectionTypeSucceed(state, { payload }) {
      return { ...state, collectionTypeList: payload || [] };
    },
    getCollectionProjectSucceed(state, { payload }) {
      return { ...state, collectionProjectList: payload || [] };
    },
    resetCollectionTypeList(state) {
      return { ...state, collectionProjectList: [] };
    },
    resetCollectionProject(state) {
      return { ...state, collectionProjectList: [] };
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
    collectionReset(state) {
      return { ...state, searchList: {} };
    },
    deleteCollectionSucceed(state) {
      return { ...state };
    },
  },
};
