import {
  getMyRecords,
  getAllRecords,
  resend,
  getTemplates,
  getSendModes,
  getSteps,
  getEmployeeGroups,
} from '../../services/sms';

export default {
  namespace: 'smsRecord',
  state: {
    myRecord: {
      formData: {},
      loading: false,
    },
    allRecord: {
      loading: false,
    },
    templates: [],
    sendModes: [],
    steps: [],
    employeeGroups: [],
    loadingTemplate: false,
    loadingSendMode: false,
    loadingStep: false,
    loadingEmployeeGroups: false,
  },

  effects: {
    * getMyRecords({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingMyRecord' });
        const data = yield call(getMyRecords, payload);
        yield put({ type: 'getMyRecordsSuccess', payload: data || {} });
        yield put({ type: 'setMyFormData', payload });
      } catch (e) {
        yield put({ type: 'loadingMyRecordFaild' });
        console.error(e);
      }
    },
    * getAllRecords({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingAllRecord' });
        const data = yield call(getAllRecords, payload);
        yield put({ type: 'getAllRecordsSuccess', payload: data || {} });
        yield put({ type: 'setAllFormData', payload });
      } catch (e) {
        yield put({ type: 'loadingAllRecordFaild' });
        console.error(e);
      }
    },
    * resend({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeResend', payload });
        yield call(resend, payload.recordId);
        yield put({ type: 'resendSuccess', payload });
      } catch (e) {
        yield put({ type: 'resendFaild' });
        console.error(e);
      }
    },
    * getTemplates({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingTemplate' });
        const list = yield call(getTemplates);
        yield put({ type: 'getTemplatesSuccess', payload: list });
      } catch (e) {
        yield put({ type: 'getTemplatesFaild' });
        console.error(e);
      }
    },
    * getSendModes({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingSendModes' });
        const list = yield call(getSendModes);
        yield put({ type: 'getSendModesSuccess', payload: list });
      } catch (e) {
        yield put({ type: 'getSendModesFaild' });
        console.error(e);
      }
    },
    * getSteps({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingSteps' });
        const list = yield call(getSteps);
        yield put({ type: 'getStepsSuccess', payload: list });
      } catch (e) {
        yield put({ type: 'getStepsFaild' });
        console.error(e);
      }
    },
    * getEmployeeGroups({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingEmployeeGroups' });
        const list = yield call(getEmployeeGroups);
        yield put({ type: 'getEmployeeGroupsSuccess', payload: list });
      } catch (e) {
        yield put({ type: 'getEmployeeGroupsFaild' });
        console.error(e);
      }
    },
  },

  reducers: {
    loadingMyRecord(state) {
      return {
        ...state,
        myRecord: {
          ...state.myRecord,
          loading: true,
        },
      };
    },
    getMyRecordsSuccess(state, { payload }) {
      return {
        ...state,
        myRecord: {
          ...state.myRecord,
          ...payload,
          loading: false,
        },
      };
    },
    setMyFormData(state, { payload }) {
      return {
        ...state,
        myRecord: {
          ...state.myRecord,
          formData: payload,
          loading: false,
        },
      };
    },
    loadingMyRecordFaild(state) {
      return {
        ...state,
        myRecord: {
          ...state.myRecord,
          loading: false,
        },
      };
    },
    loadingAllRecord(state) {
      return {
        ...state,
        allRecord: {
          ...state.allRecord,
          loading: true,
        },
      };
    },
    getAllRecordsSuccess(state, { payload }) {
      return {
        ...state,
        allRecord: {
          ...state.allRecord,
          ...payload,
          loading: false,
        },
      };
    },
    setAllFormData(state, { payload }) {
      return {
        ...state,
        allRecord: {
          ...state.allRecord,
          formData: payload,
          loading: false,
        },
      };
    },
    loadingAllRecordFaild(state) {
      return {
        ...state,
        allRecord: {
          ...state.allRecord,
          loading: false,
        },
      };
    },
    clearMyRecord(state) {
      return {
        ...state,
        myRecord: {
          formData: {},
          loading: false,
        },
      };
    },
    clearAllRecord(state) {
      return {
        ...state,
        allRecord: {
          formData: {},
          loading: false,
        },
      };
    },
    beforeResend(state, { payload }) {
      const record = payload || {};
      const records = state.myRecord.records || [];
      const newRecords = records.map((item) => {
        if (record === item) {
          return { ...item, showLoading: true };
        } else {
          return item;
        }
      });
      return {
        ...state,
        myRecord: {
          ...state.myRecord,
          records: newRecords,
        },
      };
    },
    resendSuccess(state, { payload }) {
      const record = payload || {};
      const records = state.myRecord.records || [];
      const newRecords = records.map((item) => {
        if (record.recordId === item.recordId) {
          return { ...item, showLoading: false, status: '成功', statusCode: 'SUCCESS' };
        } else {
          return item;
        }
      });
      return {
        ...state,
        myRecord: {
          ...state.myRecord,
          records: newRecords,
        },
      };
    },
    resendFaild(state, { payload }) {
      const record = payload || {};
      const records = state.myRecord.records || [];
      const newRecords = records.map((item) => {
        if (record.recordId === item.recordId) {
          return { ...item, showLoading: false };
        } else {
          return item;
        }
      });
      return {
        ...state,
        myRecord: {
          ...state.myRecord,
          records: newRecords,
        },
      };
    },
    loadingTemplate(state) {
      return {
        ...state,
        loadingTemplate: true,
      };
    },
    getTemplatesSuccess(state, { payload }) {
      return {
        ...state,
        templates: payload || [],
        loadingTemplate: false,
      };
    },
    getTemplatesFaild(state) {
      return {
        ...state,
        loadingTemplate: false,
      };
    },
    loadingSendModes(state) {
      return {
        ...state,
        loadingSendMode: true,
      };
    },
    getSendModesSuccess(state, { payload }) {
      return {
        ...state,
        sendModes: payload || [],
        loadingSendMode: false,
      };
    },
    getSendModesFaild(state) {
      return {
        ...state,
        loadingSendMode: false,
      };
    },
    loadingSteps(state) {
      return {
        ...state,
        loadingStep: true,
      };
    },
    getStepsSuccess(state, { payload }) {
      return {
        ...state,
        steps: payload || [],
        loadingStep: false,
      };
    },
    getStepsFaild(state) {
      return {
        ...state,
        loadingStep: false,
      };
    },
    loadingEmployeeGroups(state) {
      return {
        ...state,
        loadingEmployeeGroups: true,
      };
    },
    getEmployeeGroupsSuccess(state, { payload }) {
      return {
        ...state,
        employeeGroups: payload || [],
        loadingEmployeeGroups: false,
      };
    },
    getEmployeeGroupsFaild(state) {
      return {
        ...state,
        loadingEmployeeGroups: false,
      };
    },
  },
};
