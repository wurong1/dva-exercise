import {
  getConstansList,
  getConstantsDetail,
  updateConstants,
  addConstants,
} from '../../services/sms';

export default {
  namespace: 'smsConstants',
  state: {
    dataSource: {},
    loading: false,
    addVisible: false,
    loadingAdd: false,
    detail: {
      loading: false,
      visible: false,
    },
    formData: {},
  },
  effects: {
    * getConstansList({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingPage' });
        const data = yield call(getConstansList, payload);
        yield put({ type: 'setFormData', payload });
        yield put({ type: 'getTemplateListSuccess', payload: data || {} });
      } catch (e) {
        yield put({ type: 'getTemplateListFaild' });
        console.error(e);
      }
    },
    * getConstantsDetail({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingModal' });
        const data = yield call(getConstantsDetail, payload);
        yield put({ type: 'getConstantsDetailSuccess', payload: data || {} });
      } catch (e) {
        yield put({ type: 'getConstantsDetailFaild' });
        console.error(e);
      }
    },
    * updateConstants({ payload }, { put, call, select }) {
      try {
        yield put({ type: 'loadingModal' });
        yield call(updateConstants, payload);
        yield put({ type: 'updateConstantsSuccess' });
        const formData = yield select(state => state.smsConstants.formData);
        yield put({ type: 'getConstansList', payload: formData });
      } catch (e) {
        yield put({ type: 'updateConstantsFaild' });
        console.error(e);
      }
    },
    * addConstants({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingAddModal' });
        yield call(addConstants, payload);
        yield put({ type: 'addConstantsSuccess' });
        yield put({ type: 'getConstansList', payload: { pageNo: 1, pageSize: 50 } });
      } catch (e) {
        yield put({ type: 'addConstantsFaild' });
        console.error(e);
      }
    },
  },

  reducers: {
    loadingPage(state) {
      return {
        ...state,
        loading: true,
      };
    },
    getTemplateListSuccess(state, { payload }) {
      return {
        ...state,
        dataSource: payload || {},
        loading: false,
      };
    },
    getTemplateListFaild(state) {
      return {
        ...state,
        loading: false,
      };
    },
    loadingModal(state) {
      return {
        ...state,
        detail: {
          ...state.detail,
          loading: true,
          visible: true,
        },
      };
    },
    getConstantsDetailSuccess(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          ...payload,
          loading: false,
        },
      };
    },
    getConstantsDetailFaild(state) {
      return {
        ...state,
        detail: {
          ...state.detail,
          loading: false,
        },
      };
    },
    closeEditModal(state) {
      return {
        ...state,
        detail: {
          loading: false,
          visible: false,
        },
      };
    },
    updateConstantsSuccess(state) {
      return {
        ...state,
        detail: {
          loading: false,
          visible: false,
        },
      };
    },
    updateConstantsFaild(state) {
      return {
        ...state,
        detail: {
          ...state.detail,
          loading: false,
        },
      };
    },
    showAddMoal(state, { payload }) {
      return {
        ...state,
        addVisible: payload,
      };
    },
    loadingAddModal(state) {
      return {
        ...state,
        loadingAdd: true,
      };
    },
    addConstantsSuccess(state) {
      return {
        ...state,
        addVisible: false,
        loadingAdd: false,
      };
    },
    addConstantsFaild(state) {
      return {
        ...state,
        loadingAdd: false,
      };
    },
    setFormData(state, { payload }) {
      return {
        ...state,
        formData: payload,
      };
    },
  },
};

