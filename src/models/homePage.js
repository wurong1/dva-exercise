import {
  fetchHomeConfig,
  fetchTaskTotal,
  fetchCallAverageTime,
  fetchTaskDistribution,
  fetchLoanDeal,
  fetchConversation,
  fetchKnowledge,
  fetchNotice,
 } from '../services/homePage';

export default {
  namespace: 'homePage',

  state: {
    configList: [],
    configListLoading: true,
    taskTotal: {},
    taskTotalLoading: true,
    callAverageTime: {},
    callAverageTimeLoading: true,
    task: {},
    taskLoading: true,
    loan: {},
    loanLoading: true,
    conversation: {},
    conversationLoading: true,
    knowledge: [],
    knowledgeLoading: true,
    notice: [],
    noticeLoading: true,
  },

  effects: {
    * getHomeConfig({ payload }, { put, call }) {
      try {
        const list = yield call(fetchHomeConfig);
        yield put({ type: 'getHomeConfigSucceed', payload: list });
      } catch (e) {
        yield put({ type: 'getHomeConfigFailed' });
        console.error(e);
      }
    },
    * getTaskTotal({ payload }, { put, call }) {
      try {
        yield put({ type: 'getTaskTotalStart' });
        const list = yield call(fetchTaskTotal);
        yield put({ type: 'getTaskTotalSucceed', payload: list });
      } catch (e) {
        yield put({ type: 'getTaskTotalFailed' });
        console.error(e);
      }
    },
    * getCallAverageTime({ payload }, { put, call }) {
      try {
        yield put({ type: 'getCallAverageTimeStart' });
        const list = yield call(fetchCallAverageTime);
        yield put({ type: 'getCallAverageTimeSucceed', payload: list });
      } catch (e) {
        yield put({ type: 'getCallAverageTimeFailed' });
        console.error(e);
      }
    },
    * getTask({ payload }, { put, call }) {
      try {
        yield put({ type: 'getTaskStart' });
        const list = yield call(fetchTaskDistribution, payload);
        yield put({ type: 'getTaskSucceed', payload: list });
      } catch (e) {
        yield put({ type: 'getTaskFailed' });
        console.error(e);
      }
    },
    * getLoan({ payload }, { put, call }) {
      try {
        yield put({ type: 'getLoanStart' });
        const list = yield call(fetchLoanDeal, payload);
        yield put({ type: 'getLoanSucceed', payload: list });
      } catch (e) {
        yield put({ type: 'getLoanFailed' });
        console.error(e);
      }
    },
    * getConversation({ payload }, { put, call }) {
      try {
        yield put({ type: 'getConversationStart' });
        const list = yield call(fetchConversation, payload);
        yield put({ type: 'getConversationSucceed', payload: list });
      } catch (e) {
        yield put({ type: 'getConversationFailed' });
        console.error(e);
      }
    },
    * getKnowledge({ payload }, { put, call }) {
      try {
        yield put({ type: 'getKnowledgeStart' });
        const list = yield call(fetchKnowledge, payload);
        yield put({ type: 'getKnowledgeSucceed', payload: list });
      } catch (e) {
        yield put({ type: 'getKnowledgeFailed' });
        console.error(e);
      }
    },
    * getNotice({ payload }, { put, call }) {
      try {
        yield put({ type: 'getNoticeStart' });
        const list = yield call(fetchNotice, payload);
        yield put({ type: 'getNoticeSucceed', payload: list });
      } catch (e) {
        yield put({ type: 'getNoticeFailed' });
        console.error(e);
      }
    },
  },

  reducers: {
    getHomeConfigSucceed(state, { payload }) {
      return { ...state, configList: payload || [], configListLoading: false };
    },
    getHomeConfigFailed(state) {
      return { ...state, configList: [], configListLoading: false };
    },
    getTaskTotalStart(state) {
      return { ...state, taskTotalLoading: true };
    },
    getTaskTotalSucceed(state, { payload }) {
      return { ...state, taskTotal: payload || {}, taskTotalLoading: false };
    },
    getTaskTotalFailed(state) {
      return { ...state, taskTotal: {}, taskTotalLoading: false };
    },
    getCallAverageTimeStart(state) {
      return { ...state, callAverageTimeLoading: true };
    },
    getCallAverageTimeSucceed(state, { payload }) {
      return { ...state, callAverageTime: payload || {}, callAverageTimeLoading: false };
    },
    getCallAverageTimeFailed(state) {
      return { ...state, callAverageTime: {}, callAverageTimeLoading: false };
    },
    getTaskStart(state) {
      return { ...state, taskLoading: true };
    },
    getTaskSucceed(state, { payload }) {
      return { ...state, task: payload || {}, taskLoading: false };
    },
    getTaskFailed(state) {
      return { ...state, taskLoading: false };
    },
    getLoanStart(state) {
      return { ...state, loanLoading: true };
    },
    getLoanSucceed(state, { payload }) {
      return { ...state, loan: payload || {}, loanLoading: false };
    },
    getLoanFailed(state) {
      return { ...state, loanLoading: false };
    },
    getConversationStart(state) {
      return { ...state, conversationLoading: true };
    },
    getConversationSucceed(state, { payload }) {
      return { ...state, conversation: payload || {}, conversationLoading: false };
    },
    getConversationFailed(state) {
      return { ...state, conversationLoading: false };
    },
    getKnowledgeStart(state) {
      return { ...state, knowledgeLoading: true };
    },
    getKnowledgeSucceed(state, { payload }) {
      return { ...state, knowledge: (payload && payload.records) || [], knowledgeLoading: false };
    },
    getKnowledgeFailed(state) {
      return { ...state, knowledgeLoading: false };
    },
    getNoticeStart(state) {
      return { ...state, noticeLoading: true };
    },
    getNoticeSucceed(state, { payload }) {
      return { ...state, notice: (payload && payload.records) || [], noticeLoading: false };
    },
    getNoticeFailed(state) {
      return { ...state, noticeLoading: false };
    },
  },
};
