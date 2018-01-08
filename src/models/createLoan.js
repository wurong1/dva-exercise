import {
  fetchFindLoanList,
  fetchAuthActor,
  fetchCreateActor,
  fetchCreateLoan,
  fetchExistedCreateLoan,
  fetchSearchCustomer,
  fetchNewRegistCreate,
  fetchGetEmployeeGroupId,
  fetchGetEmployeeId,
} from '../services/createLoan';

export default {
  namespace: 'createLoan',

  state: {
    employeeGroupId: [],
    employeeId: [],
    loanList: [], // 贷款类型
    step: 1,
    stepOneData: null,
    stepOneLoading: false,
    stepTwoData: null,
    stepTwoLoading: false,
    stepThreeData: null,
    stepThreeLoading: false,
    searchCustomerLoading: false,
    existedCreateLoanLoading: false,
    isResgisterModalShow: false,
    createLoanList: null, // 创建借款成功回调
    searchCustomerList: null, // 查找已注册用户
    searchCompanyCustomerList: null, // 查找已注册企业用户
    chooseList: null, // 储存已注册用户选择列表
  },

  effects: {
    * getEmployeeGroupId({ payload }, { call, put }) {
      try {
        const employeeGroupId = yield call(fetchGetEmployeeGroupId);
        yield put({ type: 'getEmployeeGroupIdSucceed', payload: employeeGroupId });
      } catch (e) {
        console.error(e);
      }
    },
    * getEmployeeId({ payload }, { call, put }) {
      try {
        const employeeId = yield call(fetchGetEmployeeId, payload);
        yield put({ type: 'getEmployeeIdSucceed', payload: employeeId });
      } catch (e) {
        console.error(e);
      }
    },
    * findLoanList({ payload }, { put, call }) {
      try {
        const loanList = yield call(fetchFindLoanList, payload);
        yield put({ type: 'findLoanListSucceed', payload: loanList });
      } catch (e) {
        console.error(e);
      }
    },
    * authActor({ payload }, { call, put }) {
      try {
        yield put({ type: 'authActorStart' });
        const authActorList = yield call(fetchAuthActor, payload);
        yield put({ type: 'authActorSucceed', payload: authActorList });
      } catch (e) {
        yield put({ type: 'authActorFailed' });
        console.error(e);
      }
    },
    * createActor({ payload }, { call, put }) {
      try {
        yield put({ type: 'createActorStart' });
        const createActorList = yield call(fetchCreateActor, payload);
        yield put({ type: 'createActorSucceed', payload: createActorList });
      } catch (e) {
        yield put({ type: 'createActorFailed' });
        console.error(e);
      }
    },
    * createLoan({ payload }, { call, put }) {
      try {
        yield put({ type: 'createLoanStart' });
        const createLoanList = yield call(fetchCreateLoan, payload);
        yield put({ type: 'createLoanSucceed', payload: createLoanList });
      } catch (e) {
        yield put({ type: 'createLoanFailed' });
        console.error(e);
      }
    },
    * existedCreateLoan({ payload }, { call, put }) {
      try {
        yield put({ type: 'existedCreateLoanStart' });
        const existedCreateLoanList = yield call(fetchExistedCreateLoan, payload);
        yield put({ type: 'existedCreateLoanSucceed', payload: existedCreateLoanList });
      } catch (e) {
        yield put({ type: 'existedCreateLoanFailed' });
        console.error(e);
      }
    },
    * searchCustomer({ payload }, { call, put }) {
      try {
        yield put({ type: 'searchCustomerStart' });
        if (payload.company) {
          const searchCustomerList = yield call(fetchSearchCustomer, payload);
          yield put({ type: 'searchCompanyCustomerSucceed', payload: searchCustomerList });
        } else {
          const searchCustomerList = yield call(fetchSearchCustomer, payload);
          yield put({ type: 'searchCustomerSucceed', payload: searchCustomerList });
        }
      } catch (e) {
        yield put({ type: 'searchCustomerFailed' });
        console.error(e);
      }
    },
    * temporaryId({ payload }, { put }) {
      yield put({ type: 'temporaryIdSucceed', payload });
    },
    * newRegistCreate({ payload }, { call, put }) {
      try {
        const newRegistCreateList = yield call(fetchNewRegistCreate, payload);
        yield put({ type: 'newRegistCreateSucceed', payload: newRegistCreateList });
      } catch (e) {
        console.error(e);
      }
    },
  },

  reducers: {
    getEmployeeGroupIdSucceed(state, { payload }) {
      return { ...state, employeeGroupId: payload || [] };
    },
    getEmployeeIdSucceed(state, { payload }) {
      return { ...state, employeeId: payload || [] };
    },
    findLoanListSucceed(state, { payload }) {
      return { ...state, loanList: payload || [] };
    },
    createActorStart(state) {
      return { ...state, stepOneLoading: true };
    },
    createActorSucceed(state, { payload }) {
      return { ...state, stepTwoData: payload, step: 2, stepOneLoading: false };
    },
    createActorFailed(state) {
      return { ...state, stepOneLoading: false };
    },
    authActorStart(state) {
      return { ...state, stepTwoLoading: true };
    },
    authActorSucceed(state, { payload }) {
      return { ...state, stepThreeData: payload, step: 3, stepTwoLoading: false };
    },
    authActorFailed(state) {
      return { ...state, stepTwoLoading: false };
    },
    createLoanStart(state) {
      return { ...state, stepThreeLoading: HTMLMarqueeElement };
    },
    createLoanSucceed(state, { payload }) {
      return { ...state, createLoanList: payload, stepThreeLoading: false };
    },
    createLoanFailed(state) {
      return { ...state, stepThreeLoading: false };
    },
    existedCreateLoanStart(state) {
      return { ...state, existedCreateLoanLoading: true };
    },
    existedCreateLoanSucceed(state, { payload }) {
      if (payload.step === 2) {
        return { ...state, stepTwoData: payload, step: 2, existedCreateLoanLoading: false, isResgisterModalShow: false };
      } else {
        return { ...state, stepThreeData: payload, step: 3, existedCreateLoanLoading: false, isResgisterModalShow: false };
      }
    },
    existedCreateLoanFailed(state) {
      return { ...state, existedCreateLoanLoading: false };
    },
    searchCustomerStart(state) {
      return { ...state, searchCustomerLoading: true };
    },
    searchCustomerSucceed(state, { payload }) {
      return { ...state, searchCustomerList: payload && payload.id ? payload : null, searchCustomerLoading: false };
    },
    searchCompanyCustomerSucceed(state, { payload }) {
      return { ...state, searchCompanyCustomerList: payload && payload.id ? payload : null, searchCustomerLoading: false };
    },
    searchCustomerFailed(state) {
      return { ...state, searchCustomerLoading: false };
    },
    temporaryIdSucceed(state, { payload }) {
      return { ...state, chooseList: payload };
    },
    newRegistCreateSucceed(state, { payload }) {
      if (payload.step === 2) {
        return { ...state, step: 2, stepTwoData: payload };
      } else if (payload.step === 3) {
        return { ...state, step: 3, stepThreeData: payload };
      } else {
        return { ...state, step: 1, stepOneData: payload };
      }
    },
    openResgisterModal(state) {
      return { ...state, isResgisterModalShow: true };
    },
    closeResgisterModal(state) {
      return { ...state, isResgisterModalShow: false };
    },
  },
};
