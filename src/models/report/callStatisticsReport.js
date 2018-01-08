import {
  getEmployeeGroupId,
  fetchGetEmployeeId,
  fetchCallStatisticsByTime,
  fetchCallStatisticsByTeam,
  } from '../../services/report';

export default {
  namespace: 'callStatisticsReport',

  state: {
    employeeGroupList: [],
    employeeList: [],
    timeSearchList: {},
    timeSearchLoading: false,
    teamSearchList: {},
    teamSearchLoading: false,
    showEmployee: false,
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
    * searchCallStatisticsByTime({ payload }, { call, put }) {
      try {
        yield put({ type: 'searchCallStatisticsByTimeStart' });
        const timeSearchList = yield call(fetchCallStatisticsByTime, payload);
        yield put({ type: 'searchCallStatisticsByTimeSuccessed', payload: timeSearchList });
      } catch (e) {
        console.error(e);
        yield put({ type: 'searchCallStatisticsByTimeFailed' });
      }
    },
    * searchCallStatisticsByTeam({ payload }, { call, put }) {
      try {
        yield put({ type: 'searchCallStatisticsByTeamStart' });
        const teamSearchList = yield call(fetchCallStatisticsByTeam, payload);
        yield put({ type: 'searchCallStatisticsByTeamSuccessed', payload: teamSearchList });
        yield put({ type: 'setShowEmployee', payload: payload.showEmployee });
      } catch (e) {
        console.error(e);
        yield put({ type: 'searchCallStatisticsByTeamFailed' });
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
    searchCallStatisticsByTimeStart(state) {
      return { ...state, timeSearchLoading: true };
    },
    searchCallStatisticsByTimeSuccessed(state, { payload }) {
      return { ...state, timeSearchList: payload || {}, timeSearchLoading: false };
    },
    searchCallStatisticsByTimeFailed(state) {
      return { ...state, timeSearchLoading: false };
    },
    searchCallStatisticsByTeamStart(state) {
      return { ...state, teamSearchLoading: true };
    },
    searchCallStatisticsByTeamSuccessed(state, { payload }) {
      return { ...state, teamSearchList: payload || {}, teamSearchLoading: false };
    },
    searchCallStatisticsByTeamFailed(state) {
      return { ...state, teamSearchLoading: false };
    },
    timeListReset(state) {
      return { ...state, timeSearchList: {}, employeeList: [] };
    },
    teamListReset(state) {
      return { ...state, teamSearchList: {}, employeeList: [] };
    },
    resetEmployeeId(state) {
      return { ...state, employeeList: [] };
    },
    setShowEmployee(state, { payload }) {
      return { ...state, showEmployee: payload };
    },
  },
};
