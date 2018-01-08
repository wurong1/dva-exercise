import { fetchGetEmployeeGroupId, fetchGetEmployeeId, fetchTapeRecordSearch } from '../../services/tapeRecord';

export default {
  namespace: 'tapeRecord',

  state: {
    employeeGroupList: [],
    employeeList: [],
    tapeRecordList: {},
    searchLoading: false,
  },

  effects: {
    * getEmployeeGroup({ payload }, { call, put }) {
      try {
        const employeeGroup = yield call(fetchGetEmployeeGroupId);
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
    * searchTapeRecord({ payload }, { call, put }) {
      try {
        yield put({ type: 'searchTapeRecordStart' });
        const search = yield call(fetchTapeRecordSearch, payload);
        yield put({ type: 'searchTapeRecordSuccessed', payload: search });
      } catch (e) {
        console.error(e);
        yield put({ type: 'searchTapeRecordFailed' });
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
    searchTapeRecordStart(state) {
      return { ...state, searchLoading: true };
    },
    searchTapeRecordSuccessed(state, { payload }) {
      return { ...state, tapeRecordList: payload || {}, searchLoading: false };
    },
    searchTapeRecordFailed(state) {
      return { ...state, searchLoading: false };
    },
    resetEmployeeId(state) {
      return { ...state, employeeList: [] };
    },
    resetTapeRecord(state) {
      return {
        ...state,
        employeeList: [],
        tapeRecordList: {},
      };
    },
  },
};
