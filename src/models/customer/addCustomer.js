import { message } from 'antd';

import { fetchAddCustomer, fetchGetLoanTerm, fetchPermission } from '../../services/customer';

export default {
  namespace: 'addCustomer',

  state: {
    addCustomerList: null,
    loanTermList: [],
    isPermission: null,
  },

  effects: {
    * addCustomer({ payload }, { call, put }) {
      try {
        const addCustomer = yield call(fetchAddCustomer, payload);
        yield put({ type: 'addCustomerSucceed', payload: addCustomer });
        message.success('创建借款客户成功', 2);
      } catch (e) {
        console.error(e);
      }
    },
    * getLoanTerm({ payload }, { call, put }) {
      try {
        const getLoanTerm = yield call(fetchGetLoanTerm, payload);
        yield put({ type: 'getLoanTermSucceed', payload: getLoanTerm });
      } catch (e) {
        console.error(e);
      }
    },
    * isPermission({ payload }, { call, put }) {
      try {
        const permission = yield call(fetchPermission, payload);
        yield put({ type: 'isPermissionSucceed', payload: permission });
      } catch (e) {
        console.error(e);
      }
    },
  },

  reducers: {
    addCustomerSucceed(state, { payload }) {
      return { ...state, addCustomerList: payload };
    },
    getLoanTermSucceed(state, { payload }) {
      return { ...state, loanTermList: payload };
    },
    isPermissionSucceed(state, { payload }) {
      return { ...state, isPermission: payload };
    },
  },
};
