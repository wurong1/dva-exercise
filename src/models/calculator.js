import { getCycleList, getRepayList } from '../services/calculator';

export default {
  namespace: 'calculator',
  state: {
    loanCycleList: [],
    loanRepayList: [],
    loadingCycleList: false,
    loadingRepayList: false,
  },

  effects: {
    * getCycleList({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeGetCycleList' });
        if (payload) {
          const data = yield call(getCycleList, payload);
          yield put({ type: 'getCycleListSucceed', payload: data });
        } else {
          yield put({ type: 'clearCycleList' });
        }
      } catch (e) {
        yield put({ type: 'getCycleListFaild' });
        console.error(e);
      }
    },
    * getRepayList({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeGetRepayList' });
        if (payload) {
          const data = yield call(getRepayList, payload);
          yield put({ type: 'getRepayListSucceed', payload: data });
        } else {
          yield put({ type: 'clearRepayList' });
        }
      } catch (e) {
        yield put({ type: 'getRepayListFaild' });
        console.error(e);
      }
    },
  },

  reducers: {
    beforeGetCycleList(state) {
      return {
        ...state,
        loadingCycleList: true,
      };
    },
    getCycleListSucceed(state, { payload }) {
      return {
        ...state,
        loanCycleList: payload || [],
        loadingCycleList: false,
      };
    },
    getCycleListFaild(state) {
      return {
        ...state,
        loadingCycleList: false,
      };
    },
    beforeGetRepayList(state) {
      return {
        ...state,
        loadingRepayList: true,
      };
    },
    getRepayListSucceed(state, { payload }) {
      return {
        ...state,
        loanRepayList: payload || [],
        loadingRepayList: false,
      };
    },
    getRepayListFaild(state) {
      return {
        ...state,
        loadingRepayList: false,
      };
    },
    clearCycleList(state) {
      return {
        ...state,
        loanCycleList: [],
        loadingCycleList: false,
      };
    },
    clearRepayList(state) {
      return {
        ...state,
        loanRepayList: [],
        loadingRepayList: false,
      };
    },
  },
};
