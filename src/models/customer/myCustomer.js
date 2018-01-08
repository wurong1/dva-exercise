import { message } from 'antd';
import { fetchSearch, fetchDeploy } from '../../services/customer';

export default {
  namespace: 'myCustomer',

  state: {
    phoneSalesSearchList: {},
    salesSearchList: {},
    phoneDeployLoading: false,
    deployLoading: false,
    isPhoneModalShow: false,
    isModalShow: false,
    phoneSelectedRowKeys: [],
    selectedRowKeys: [],
    phoneCustomerIds: [],
    customerIds: [],
    phoneSearchParams: {},
    searchParams: {},
  },

  effects: {
    * phoneSalesSearch({ payload }, { call, put }) {
      try {
        const searchList = yield call(fetchSearch, payload);
        yield put({ type: 'phoneSalesSearchSucceed', payload: searchList });
        yield put({ type: 'setPhoneSearchParams', payload });
      } catch (e) {
        console.error(e);
      }
    },
    * salesSearch({ payload }, { call, put }) {
      try {
        const searchList = yield call(fetchSearch, payload);
        yield put({ type: 'salesSearchSucceed', payload: searchList });
        yield put({ type: 'setSearchParams', payload });
      } catch (e) {
        console.error(e);
      }
    },
    * phoneDeploy({ payload }, { call, put, select }) {
      try {
        yield put({ type: 'phoneDeployStart' });
        const deploy = yield call(fetchDeploy, payload);
        yield put({ type: 'phoneDeploySucceed', payload: deploy });
        yield put({ type: 'closePhoneModal' });
        const searchData = yield select(state => state.myCustomer.phoneSearchParams);
        yield put({ type: 'phoneSalesSearch', payload: searchData });
      } catch (e) {
        yield put({ type: 'phoneDeployFailed' });
        console.error(e);
      }
    },
    * deploy({ payload }, { call, put, select }) {
      try {
        yield put({ type: 'deployStart' });
        const deploy = yield call(fetchDeploy, payload);
        yield put({ type: 'deploySucceed', payload: deploy });
        yield put({ type: 'closeModal' });
        const searchData = yield select(state => state.myCustomer.searchParams);
        yield put({ type: 'salesSearch', payload: searchData });
      } catch (e) {
        yield put({ type: 'deployFailed' });
        console.error(e);
      }
    },
  },

  reducers: {
    phoneSalesSearchSucceed(state, { payload }) {
      return { ...state, phoneSalesSearchList: payload || {}, phoneSelectedRowKeys: [], phoneCustomerIds: [] };
    },
    salesSearchSucceed(state, { payload }) {
      return { ...state, salesSearchList: payload || {}, selectedRowKeys: [], customerIds: [] };
    },
    phoneSalesReset(state) {
      return { ...state, phoneSalesSearchList: {}, phoneSelectedRowKeys: [], phoneCustomerIds: [] };
    },
    salesReset(state) {
      return { ...state, salesSearchList: {}, selectedRowKeys: [], customerIds: [] };
    },
    openPhoneModal(state) {
      return { ...state, isPhoneModalShow: true };
    },
    closePhoneModal(state) {
      return { ...state, isPhoneModalShow: false };
    },
    openModal(state) {
      return { ...state, isModalShow: true };
    },
    closeModal(state) {
      return { ...state, isModalShow: false };
    },
    phoneDeployStart(state) {
      return { ...state, phoneDeployLoading: true };
    },
    phoneDeploySucceed(state) {
      message.success('调配成功');
      return { ...state, phoneDeployLoading: false };
    },
    phoneDeployFailed(state) {
      return { ...state, phoneDeployLoading: false };
    },
    deployStart(state) {
      return { ...state, deployLoading: true };
    },
    deploySucceed(state) {
      message.success('调配成功');
      return { ...state, deployLoading: false };
    },
    deployFailed(state) {
      return { ...state, deployLoading: false };
    },
    setPhoneSelectedArr(state, { payload }) {
      return { ...state, phoneSelectedRowKeys: payload };
    },
    setSelectedArr(state, { payload }) {
      return { ...state, selectedRowKeys: payload };
    },
    setPhoneCustomerIds(state, { payload }) {
      return { ...state, phoneCustomerIds: payload };
    },
    setCustomerIds(state, { payload }) {
      return { ...state, customerIds: payload };
    },
    setPhoneSearchParams(state, { payload }) {
      return { ...state, phoneSearchParams: payload };
    },
    setSearchParams(state, { payload }) {
      return { ...state, searchParams: payload };
    },
  },
};
