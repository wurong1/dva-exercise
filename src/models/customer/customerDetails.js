import { fetchGetCustomerDetails, fetchGetCustomerDealRecord, getOriginPhone } from '../../services/customer';

export default {
  namespace: 'customerDetails',

  state: {
    customerDetailsList: [],
    customerDealRecord: [],
    isFirstLoad: true,
    originPhoneNo: false,
  },

  effects: {
    * getCustomerDetails({ payload }, { call, put }) {
      try {
        const customerDetails = yield call(fetchGetCustomerDetails, payload);
        yield put({ type: 'getCustomerDetailsSucceed', payload: customerDetails });
      } catch (e) {
        console.error(e);
      }
    },
    * getCustomerDealRecord({ payload }, { call, put }) {
      try {
        const customerDealRecord = yield call(fetchGetCustomerDealRecord, payload);
        yield put({ type: 'getCustomerDealRecordSucceed', payload: customerDealRecord });
      } catch (e) {
        console.error(e);
      }
    },
    * getOriginPhone({ payload }, { call, put }) {
      try {
        const data = yield call(getOriginPhone, payload);
        yield put({ type: 'getOriginPhoneSucceed', payload: data || '' });
      } catch (e) {
        console.error(e);
      }
    },
  },

  reducers: {
    getCustomerDetailsSucceed(state, { payload }) {
      return { ...state, customerDetailsList: payload };
    },
    getCustomerDealRecordSucceed(state, { payload }) {
      return { ...state, customerDealRecord: payload, isFirstLoad: false };
    },
    getOriginPhoneSucceed(state, { payload }) {
      return { ...state, originPhoneNo: payload };
    },
  },
};
