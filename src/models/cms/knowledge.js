import { message } from 'antd';
import {
  fetchGetKnowledgeType,
  fetchGetKnowledgeProject,
  fetchSearchKnowledge,
  fetchKnowledgeOperateAuth,
  fetchDeleteKnowledge,
  fetchTopKnowledge,
  fetchCollectKnowledge,
 } from '../../services/cms';

message.config({
  top: 100,
});

export default {
  namespace: 'knowledge',

  state: {
    knowledgeTypeList: [],
    knowledgeProjectList: [],
    searchParams: {},
    searchList: {},
    searchLoading: false,
    operateAuthList: [],
  },

  effects: {
    * getKnowledgeType({ payload }, { call, put }) {
      try {
        const knowledgeType = yield call(fetchGetKnowledgeType, payload);
        yield put({ type: 'getKnowledgeTypeSucceed', payload: knowledgeType });
      } catch (e) {
        console.error(e);
      }
    },
    * getKnowledgeProject({ payload }, { call, put }) {
      try {
        const knowledgeProject = yield call(fetchGetKnowledgeProject, payload);
        yield put({ type: 'getKnowledgeProjectSucceed', payload: knowledgeProject });
      } catch (e) {
        console.error(e);
      }
    },
    * search({ payload }, { call, put }) {
      try {
        yield put({ type: 'searchStart' });
        const searchList = yield call(fetchSearchKnowledge, payload);
        yield put({ type: 'searchSucceed', payload: searchList });
        yield put({ type: 'setSearchParams', payload });
      } catch (e) {
        console.error(e);
        yield put({ type: 'searchFailed' });
      }
    },
    * knowledgeOperateAuth({ payload }, { call, put }) {
      try {
        const operateAuth = yield call(fetchKnowledgeOperateAuth, payload);
        yield put({ type: 'knowledgeOperateAuthSucceed', payload: operateAuth });
      } catch (e) {
        console.error(e);
      }
    },
    * deleteKnowledge({ payload }, { call, put, select }) {
      try {
        const deleteKnowledge = yield call(fetchDeleteKnowledge, payload);
        yield put({ type: 'deleteKnowledgeSucceed', payload: deleteKnowledge });
        const searchData = yield select(state => state.knowledge.searchParams);
        yield put({ type: 'search', payload: searchData });
      } catch (e) {
        console.error(e);
      }
    },
    * topKnowledge({ payload }, { call, put, select }) {
      try {
        const topKnowledge = yield call(fetchTopKnowledge, payload);
        yield put({ type: 'topKnowledgeSucceed', payload: topKnowledge });
        const searchData = yield select(state => state.knowledge.searchParams);
        yield put({ type: 'search', payload: searchData });
      } catch (e) {
        console.error(e);
      }
    },
    * collectKnowledge({ payload }, { call, put, select }) {
      try {
        const collectKnowledge = yield call(fetchCollectKnowledge, payload);
        yield put({ type: 'collectKnowledgeSucceed', payload: collectKnowledge });
        const searchData = yield select(state => state.knowledge.searchParams);
        yield put({ type: 'search', payload: searchData });
      } catch (e) {
        console.error(e);
      }
    },
  },

  reducers: {
    getKnowledgeTypeSucceed(state, { payload }) {
      return { ...state, knowledgeTypeList: payload || [] };
    },
    getKnowledgeProjectSucceed(state, { payload }) {
      return { ...state, knowledgeProjectList: payload || [] };
    },
    resetKnowledgeProject(state) {
      return { ...state, knowledgeProjectList: [] };
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
    knowledgeReset(state) {
      return { ...state, searchList: {} };
    },
    knowledgeOperateAuthSucceed(state, { payload }) {
      return { ...state, operateAuthList: payload || [] };
    },
    deleteKnowledgeSucceed(state, { payload }) {
      return { ...state, searchList: payload || {} };
    },
    topKnowledgeSucceed(state, { payload }) {
      return { ...state, searchList: payload || {} };
    },
    collectKnowledgeSucceed(state, { payload }) {
      return { ...state, searchList: payload || {} };
    },
  },
};
