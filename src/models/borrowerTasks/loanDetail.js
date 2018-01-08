import {
  getEmployeeGroup,
  getEmployeeList,
  getLoanTypeList,
  saveProductCode,
  saveInfo,
  taskDeploy,
  updateclose,
  getDetailTypeList,
} from '../../services/taskDetails';

export default {
  namespace: 'loanDetail',

  state: {
    dealStatus: '',
    showothers: false,
    showdealModal: false,
    showbackeditModal: false,
    showreviewModal: false,
    showupdatecloseModal: false,
    showResult: false,
    reviewloading: false,
    backeditloading: false,
    updatecloseloading: false,
    dealModal: {
      employeeGroup: [],
      employeeList: [],
      loading: false,
    },
    typeModal: {
      visible: false,
      list: [],
      loading: false,
    },
    notCreateDetail: {
      loading: false,
      detailTypeList: [],
      isFetching: false,
      showTransfer: false,
    },
    deployModal: {
      employeeGroup: [],
      employeeList: [],
      loading: false,
      visible: false,
    },
  },

  effects: {
    * getEmployeeGroup({ payload }, { call, put }) {
      try {
        yield put({ type: 'dealModalLoading' });
        const list = yield call(getEmployeeGroup);
        yield put({ type: 'getEmployeeGroupSucceed', payload: list });
      } catch (e) {
        yield put({ type: 'dealModalLoadingFaild' });
        console.error(e);
      }
    },
    * getTransferEmployeeGroup({ payload }, { call, put }) {
      try {
        yield put({ type: 'deployModalLoading' });
        const list = yield call(getEmployeeGroup);
        yield put({ type: 'getTransferEmployeeGroupSucceed', payload: list });
      } catch (e) {
        yield put({ type: 'deployModalLoadingFaild' });
        console.error(e);
      }
    },
    * getEmployeeList({ payload }, { call, put }) {
      try {
        yield put({ type: 'dealModalLoading' });
        const list = yield call(getEmployeeList, payload);
        yield put({ type: 'getEmployeeListSucceed', payload: list });
      } catch (e) {
        yield put({ type: 'dealModalLoadingFaild' });
        console.error(e);
      }
    },
    * getTransferEmployeeList({ payload }, { call, put }) {
      try {
        yield put({ type: 'deployModalLoading' });
        const list = yield call(getEmployeeList, payload);
        yield put({ type: 'getTransferEmployeeListSucceed', payload: list });
      } catch (e) {
        yield put({ type: 'deployModalLoadingFaild' });
        console.error(e);
      }
    },
    * getLoanTypeList({ payload }, { call, put }) {
      try {
        yield put({ type: 'typeModalLoading' });
        const list = yield call(getLoanTypeList, payload);
        yield put({ type: 'getLoanTypeListSucceed', payload: list });
      } catch (e) {
        yield put({ type: 'typeModalLoadingFaild' });
        console.error(e);
      }
    },
    * dealSubmit({ payload }, { call, put, select }) {
      try {
        yield put({ type: 'dealModalLoading' });
        yield call(saveInfo, payload);
        yield put({ type: 'dealSubmitSucceed' });
        const dealStatus = yield select(state => state.loanDetail.dealStatus);
        if (dealStatus === 'WITHDRAWAL') { // 重新加载页面
          yield put({ type: 'taskDetails/getTaskDetails', payload: payload.taskId });
        }
      } catch (e) {
        yield put({ type: 'dealModalLoadingFaild' });
        console.error(e);
      }
    },
    * taskDeploy({ payload }, { call, put }) {
      try {
        yield put({ type: 'dealModalLoading' });
        yield call(taskDeploy, payload);
        yield put({ type: 'taskDeploySucceed' });
      } catch (e) {
        yield put({ type: 'dealModalLoadingFaild' });
        console.error(e);
      }
    },
    * taskDeploySubmit({ payload }, { call, put }) {
      try {
        yield put({ type: 'deployModalLoading' });
        yield call(taskDeploy, payload);
        yield put({ type: 'taskDeploySubmitSucceed' });
      } catch (e) {
        yield put({ type: 'deployModalLoadingFaild' });
        console.error(e);
      }
    },
    * reviewSubmit({ payload }, { call, put }) {
      try {
        yield put({ type: 'reviewLoading' });
        yield call(saveInfo, payload);
        yield put({ type: 'reviewSubmitSucceed' });
        // 重新加载页面
        yield put({ type: 'taskDetails/getTaskDetails', payload: payload.taskId });
      } catch (e) {
        yield put({ type: 'reviewSubmitFaild' });
        console.error(e);
      }
    },
    * backeditSubmit({ payload }, { call, put }) {
      try {
        yield put({ type: 'backeditLoading' });
        yield call(saveInfo, payload);
        yield put({ type: 'backeditSubmitSucceed' });
        // 重新加载页面
        yield put({ type: 'taskDetails/getTaskDetails', payload: payload.taskId });
      } catch (e) {
        yield put({ type: 'backeditSubmitFaild' });
        console.error(e);
      }
    },
    * updatecloseSubmit({ payload }, { call, put }) {
      try {
        yield put({ type: 'updatecloseLoading' });
        yield call(updateclose, payload);
        yield put({ type: 'updatecloseSucceed' });
        // 重新加载页面
        yield put({ type: 'taskDetails/getTaskDetails', payload: payload.taskId });
      } catch (e) {
        yield put({ type: 'updatecloseFaild' });
        console.error(e);
      }
    },
    * saveProductCode({ payload }, { call, put }) {
      try {
        yield put({ type: 'typeModalLoading' });
        yield call(saveProductCode, payload.value);
        yield put({ type: 'saveProductCodeSucceed' });
        yield put({ type: 'taskDetails/getTaskDetails', payload: payload.taskId });
      } catch (e) {
        yield put({ type: 'typeModalLoadingFaild' });
        console.error(e);
      }
    },
    * getDetailTypeList({ payload }, { call, put }) {
      try {
        yield put({ type: 'beforeGetDetailTypeList' });
        const list = yield call(getDetailTypeList, payload);
        yield put({ type: 'getDetailTypeListSucceed', payload: list || [] });
      } catch (e) {
        yield put({ type: 'getDetailTypeListFaild' });
        console.error(e);
      }
    },
    * notCreatedSubmit({ payload }, { call, put }) {
      try {
        yield put({ type: 'loadingNotcreate' });
        yield call(saveInfo, payload.value);
        yield put({ type: 'notCreatedSubmitSucceed' });
        const { flag } = payload;
        if (flag === 'DEPLOY') {
          yield put({ type: 'showNotcreateTransfer', payload: true });
        }
      } catch (e) {
        yield put({ type: 'loadingNotcreateFaild' });
        console.error(e);
      }
    },
  },

  reducers: {
    showOthers(state, { payload }) {
      return {
        ...state,
        showothers: payload,
      };
    },
    showDealModal(state, { payload }) {
      return {
        ...state,
        showdealModal: payload && payload.show,
        dealStatus: payload && payload.value,
      };
    },
    getTransferEmployeeGroupSucceed(state, { payload }) {
      return {
        ...state,
        deployModal: {
          ...state.deployModal,
          employeeGroup: payload || [],
          loading: false,
        },
      };
    },
    getEmployeeGroupSucceed(state, { payload }) {
      return {
        ...state,
        dealModal: {
          ...state.dealModal,
          employeeGroup: payload || [],
          loading: false,
        },
      };
    },
    getEmployeeListSucceed(state, { payload }) {
      return {
        ...state,
        dealModal: {
          ...state.dealModal,
          employeeList: payload || [],
          loading: false,
        },
      };
    },
    getTransferEmployeeListSucceed(state, { payload }) {
      return {
        ...state,
        deployModal: {
          ...state.deployModal,
          employeeList: payload || [],
          loading: false,
        },
      };
    },
    deployModalLoading(state) {
      return {
        ...state,
        deployModal: {
          ...state.deployModal,
          loading: true,
        },
      };
    },
    dealModalLoading(state) {
      return {
        ...state,
        dealModal: {
          ...state.dealModal,
          loading: true,
        },
      };
    },
    deployModalLoadingFaild(state) {
      return {
        ...state,
        deployModal: {
          ...state.deployModal,
          loading: false,
        },
      };
    },
    dealModalLoadingFaild(state) {
      return {
        ...state,
        dealModal: {
          ...state.dealModal,
          loading: false,
        },
      };
    },
    typeModalLoading(state) {
      return {
        ...state,
        typeModal: {
          ...state.typeModal,
          loading: true,
        },
      };
    },
    getLoanTypeListSucceed(state, { payload }) {
      return {
        ...state,
        typeModal: {
          ...state.typeModal,
          list: payload || [],
          loading: false,
        },
      };
    },
    typeModalLoadingFaild(state) {
      return {
        ...state,
        typeModal: {
          ...state.typeModal,
          loading: false,
        },
      };
    },
    showTypeModal(state, { payload }) {
      return {
        ...state,
        typeModal: {
          ...state.typeModal,
          visible: payload,
        },
      };
    },
    saveProductCodeSucceed(state) {
      return {
        ...state,
        typeModal: {
          ...state.typeModal,
          visible: false,
          loading: false,
        },
      };
    },
    dealSubmitSucceed(state) {
      return {
        ...state,
        showResult: true,
        showdealModal: false,
        dealModal: {
          ...state.dealModal,
          loading: false,
        },
      };
    },
    taskDeploySucceed(state) {
      return {
        ...state,
        showdealModal: false,
        dealModal: {
          ...state.dealModal,
          loading: false,
          visible: false,
        },
      };
    },
    taskDeploySubmitSucceed(state) {
      return {
        ...state,
        deployModal: {
          ...state.deployModal,
          loading: false,
          visible: false,
        },
      };
    },
    showBackeditModal(state, { payload }) {
      return {
        ...state,
        showbackeditModal: payload,
      };
    },
    showReviewModal(state, { payload }) {
      return {
        ...state,
        showreviewModal: payload,
      };
    },
    showUpdatecloseModal(state, { payload }) {
      return {
        ...state,
        showupdatecloseModal: payload,
      };
    },
    reviewLoading(state) {
      return {
        ...state,
        reviewloading: true,
      };
    },
    reviewSubmitSucceed(state) {
      return {
        ...state,
        reviewloading: false,
        showreviewModal: false,
      };
    },
    reviewSubmitFaild(state) {
      return {
        ...state,
        reviewloading: false,
      };
    },
    backeditLoading(state) {
      return {
        ...state,
        backeditloading: true,
      };
    },
    backeditSubmitSucceed(state) {
      return {
        ...state,
        showbackeditModal: false,
        backeditloading: false,
      };
    },
    backeditSubmitFaild(state) {
      return {
        ...state,
        backeditloading: false,
      };
    },
    updatecloseLoading(state) {
      return {
        ...state,
        updatecloseloading: true,
      };
    },
    updatecloseSucceed(state) {
      return {
        ...state,
        showupdatecloseModal: false,
        updatecloseloading: false,
      };
    },
    updatecloseFaild(state) {
      return {
        ...state,
        updatecloseloading: false,
      };
    },
    beforeGetDetailTypeList(state) {
      return {
        ...state,
        notCreateDetail: {
          ...state.notCreateDetail,
          loading: true,
        },
      };
    },
    getDetailTypeListSucceed(state, { payload }) {
      return {
        ...state,
        notCreateDetail: {
          ...state.notCreateDetail,
          loading: false,
          detailTypeList: payload,
        },
      };
    },
    getDetailTypeListFaild(state) {
      return {
        ...state,
        notCreateDetail: {
          ...state.notCreateDetail,
          loading: false,
        },
      };
    },
    loadingNotcreate(state) {
      return {
        ...state,
        notCreateDetail: {
          ...state.notCreateDetail,
          isFetching: true,
        },
      };
    },
    notCreatedSubmitSucceed(state) {
      return {
        ...state,
        notCreateDetail: {
          ...state.notCreateDetail,
          isFetching: false,
        },
      };
    },
    loadingNotcreateFaild(state) {
      return {
        ...state,
        notCreateDetail: {
          ...state.notCreateDetail,
          isFetching: false,
        },
      };
    },
    showNotcreateTransfer(state, { payload }) {
      return {
        ...state,
        deployModal: {
          ...state.deployModal,
          visible: payload,
        },
      };
    },
  },
};
