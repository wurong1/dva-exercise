import {
  getEmployeeGroupId,
  fetchGetEmployeeId,
  fetchGetCallAllInfo,
  fetchCalloutSearch,
  fetchCalloutExport,
  fetchCalloutExportList,
  fetchCalloutDelete,
  fetchCalloutDeleteAll,
  } from '../../services/report';

export default {
  namespace: 'calloutReport',

  state: {
    employeeGroupList: [],
    employeeList: [],
    calloutInfo: {},
    calloutInfoLoading: false,
    calloutList: {},
    calloutListLoading: false,
    calloutExportLoading: false,
    isDownloadModalShow: false,
    deleteStatus: false,
    calloutExportList: [],
  },

  effects: {
    * getEmployeeGroup({ payload }, { call, put }) {
      try {
        const employeeGroup = yield call(getEmployeeGroupId, payload);
        yield put({ type: 'getEmployeeGroupSuccessed', payload: employeeGroup });
      } catch (e) {
        console.error(e);
      }
    },
    * getEmployee({ payload }, { call, put }) {
      try {
        const employee = yield call(fetchGetEmployeeId, payload);
        yield put({ type: 'getEmployeeSuccessed', payload: employee });
      } catch (e) {
        console.error(e);
      }
    },
    * getCalloutInfo({ payload }, { call, put }) {
      try {
        yield put({ type: 'getCalloutInfoStart' });
        const calloutInfo = yield call(fetchGetCallAllInfo, payload);
        yield put({ type: 'getCalloutInfoSuccessed', payload: calloutInfo });
      } catch (e) {
        console.error(e);
        yield put({ type: 'getCalloutInfoFailed' });
      }
    },
    * searchCalloutList({ payload }, { call, put }) {
      try {
        yield put({ type: 'searchCalloutListStart' });
        const search = yield call(fetchCalloutSearch, payload);
        yield put({ type: 'searchCalloutListSuccessed', payload: search });
      } catch (e) {
        console.error(e);
        yield put({ type: 'searchCalloutListFailed' });
      }
    },
    * exportCallout({ payload }, { call, put }) {
      try {
        yield put({ type: 'exportCalloutStart' });
        const search = yield call(fetchCalloutExport, payload);
        yield put({ type: 'exportCalloutSuccessed', payload: search });
      } catch (e) {
        console.error(e);
        yield put({ type: 'exportCalloutFailed' });
      }
    },
    * exportCalloutList({ payload }, { call, put }) {
      try {
        const search = yield call(fetchCalloutExportList);
        yield put({ type: 'exportCalloutListSuccessed', payload: search });
      } catch (e) {
        console.error(e);
      }
    },
    * deleteCallout({ payload }, { call, put }) {
      try {
        yield put({ type: 'deleteStart' });
        const search = yield call(fetchCalloutDelete, payload);
        yield put({ type: 'deleteCalloutSuccessed', payload: search });
        const list = yield call(fetchCalloutExportList);
        yield put({ type: 'deleteCallback', payload: list });
      } catch (e) {
        console.error(e);
        yield put({ type: 'deleteFailed' });
      }
    },
    * deleteCalloutAll({ payload }, { call, put }) {
      try {
        yield put({ type: 'deleteCalloutAllStart' });
        const search = yield call(fetchCalloutDeleteAll);
        yield put({ type: 'deleteCalloutAllSuccessed', payload: search });
      } catch (e) {
        console.error(e);
        yield put({ type: 'deleteCalloutAllFailed' });
      }
    },
  },

  reducers: {
    getEmployeeGroupSuccessed(state, { payload }) {
      return { ...state, employeeGroupList: payload || [] };
    },
    getEmployeeSuccessed(state, { payload }) {
      return { ...state, employeeList: payload || [] };
    },
    getCalloutInfoStart(state) {
      return { ...state, calloutInfoLoading: true };
    },
    getCalloutInfoSuccessed(state, { payload }) {
      return { ...state, calloutInfo: payload || {}, calloutInfoLoading: false };
    },
    getCalloutInfoFailed(state) {
      return { ...state, calloutInfoLoading: false };
    },
    searchCalloutListStart(state) {
      return { ...state, calloutListLoading: true };
    },
    searchCalloutListSuccessed(state, { payload }) {
      return { ...state, calloutList: payload || {}, calloutListLoading: false };
    },
    searchCalloutListFailed(state) {
      return { ...state, calloutListLoading: false };
    },
    resetCalloutList(state) {
      return {
        ...state,
        employeeList: [],
        calloutInfo: {},
        calloutList: {},
      };
    },
    resetEmployeeId(state) {
      return { ...state, employeeList: [] };
    },
    exportCalloutStart(state) {
      return { ...state, calloutExportLoading: true };
    },
    exportCalloutSuccessed(state) {
      return { ...state, calloutExportLoading: false };
    },
    exportCalloutFailed(state) {
      return { ...state, calloutExportLoading: false };
    },
    exportCalloutListSuccessed(state, { payload }) {
      return { ...state, calloutExportList: payload, isDownloadModalShow: true };
    },
    deleteStart(state) {
      return { ...state, deleteStatus: true };
    },
    deleteCalloutSuccessed(state) {
      return { ...state };
    },
    deleteCallback(state, { payload }) {
      return { ...state, calloutExportList: payload, deleteStatus: false };
    },
    deleteCalloutAllStart(state) {
      return { ...state, deleteStatus: true };
    },
    deleteCalloutAllSuccessed(state) {
      return { ...state, calloutExportList: [], deleteStatus: false };
    },
    deleteCalloutAllFailed(state) {
      return { ...state, deleteStatus: false };
    },
    deleteFailed(state) {
      return { ...state, deleteStatus: false };
    },
    closecalloutModal(state) {
      return { ...state, isDownloadModalShow: false };
    },
  },
};
