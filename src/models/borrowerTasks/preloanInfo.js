import { fetchGetCustomerInfo, fetchGetTabList } from '../../services/preloanInfo';

export default {
  namespace: 'preloanInfo',

  state: {
    customerInfo: {},
    tabList: [],
  },

  effects: {
    * getCustomerInfo({ payload }, { call, put }) {
      try {
        const addCustomer = yield call(fetchGetCustomerInfo, payload);
        yield put({ type: 'getCustomerInfoSucceed', payload: addCustomer });
      } catch (e) {
        console.error(e);
      }
    },
    * getTabList({ payload }, { call, put }) {
      try {
        const getLoanTerm = yield call(fetchGetTabList, payload);
        yield put({ type: 'getTabListSucceed', payload: getLoanTerm });
      } catch (e) {
        console.error(e);
      }
    },
  },

  reducers: {
    getCustomerInfoSucceed(state, { payload }) {
      return { ...state, customerInfo: payload || {} };
    },
    getTabListSucceed(state, { payload }) {
      return { ...state, tabList: payload || [] };
    },
    resetTabList(state) {
      return { ...state, tabList: [] };
    },
  },
};
