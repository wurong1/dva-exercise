import { fetchGetDeployGroup, fetchGetEmployeeId } from '../../services/customer';

export default {
  namespace: 'customerDeploy',

  state: {
    groupList: [],
    personalList: [],
    salesList: [],
    groupValue: '',
  },

  effects: {
    * getGroupList({ payload }, { call, put }) {
      try {
        const groupList = yield call(fetchGetDeployGroup);
        yield put({ type: 'getGroupListSucceed', payload: groupList });
      } catch (e) {
        console.error(e);
      }
    },
    * getPersonalList({ payload }, { call, put }) {
      try {
        const personalList = yield call(fetchGetEmployeeId, payload);
        yield put({ type: 'getPersonalListSucceed', payload: personalList });
      } catch (e) {
        console.error(e);
      }
    },
  },

  reducers: {
    getGroupListSucceed(state, { payload }) {
      return { ...state, groupList: payload || [] };
    },
    getPersonalListSucceed(state, { payload }) {
      return { ...state, personalList: payload || [] };
    },
    saveGroupValue(state, { payload }) {
      return { ...state, groupValue: payload };
    },
    setSalesList(state, { payload }) {
      return { ...state, salesList: payload };
    },
    clearSalesList(state) {
      return { ...state, salesList: [] };
    },
  },
};
