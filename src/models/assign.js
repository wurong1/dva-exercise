import {
  getEmployList,
  addEmployee,
  updateConfig,
  getRecordList,
  getOperationResultList,
  getExistResultList,
  updateStatusConfig,
} from '../services/assign';

export default {
  namespace: 'assign',
  state: {
    wealthTab: {
      employList: [],
      isFetching: false,
      showRecord: false,
      record: {
        isFetching: false,
      },
      startValue: '',
      endValue: '',
    },
    statusTab: {
      isFetching: false,
      showRecord: false,
      operationResult: {
        list: [], // 处理状态-处理结果联动
        isFetching: false,
      },
      resultList: [], // 选中的处理结果列表
      record: {
        isFetching: false,
      },
    },
  },

  effects: {

    * getEmployList({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeGetEmployList' });
        const employeeList = yield call(getEmployList, payload);
        yield put({ type: 'getEmployListSuccess', payload: employeeList });
      } catch (e) {
        yield put({ type: 'getEmployListFaild' });
        console.error(e);
      }
    },
    * addEmployee({ payload }, { put, call }) {
      try {
        const employee = yield call(addEmployee, payload);
        yield put({ type: 'addEmployeeSuccess', payload: employee });
      } catch (e) {
        console.error(e);
      }
    },
    * updateConfig({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeUpdateConfig' });
        yield call(updateConfig, payload);
        yield put({ type: 'updateConfigSuccess' });
      } catch (e) {
        yield put({ type: 'updateConfigFaild' });
        console.error(e);
      }
    },
    * updateStatusConfig({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingStatusTab' });
        yield call(updateStatusConfig, payload);
        yield put({ type: 'updateStatusConfigSuccess' });
      } catch (e) {
        yield put({ type: 'loadingStatusTabFaild' });
        console.error(e);
      }
    },
    * getRecordList({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeGetRecordList' });
        const record = yield call(getRecordList, payload);
        yield put({ type: 'getRecordListSuccess', payload: record });
      } catch (e) {
        yield put({ type: 'getRecordListFaild' });
        console.error(e);
      }
    },
    * getStatusRecordList({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeGetStatusRecordList' });
        const record = yield call(getRecordList, payload);
        yield put({ type: 'getStatusRecordListSuccess', payload: record });
      } catch (e) {
        yield put({ type: 'getStatusRecordListFaild' });
        console.error(e);
      }
    },
    * getOperationResultList({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeGetOperationResultList' });
        const record = yield call(getOperationResultList, payload);
        yield put({ type: 'getOperationResultListSuccess', payload: record });
      } catch (e) {
        yield put({ type: 'getOperationResultListFaild' });
        console.error(e);
      }
    },
    * getExistResultList({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingStatusTab' });
        const list = yield call(getExistResultList, payload);
        yield put({ type: 'getExistResultListSuccess', payload: list });
      } catch (e) {
        yield put({ type: 'loadingStatusTabFaild' });
        console.error(e);
      }
    },
  },

  reducers: {
    beforeGetEmployList(state) {
      return {
        ...state,
        wealthTab: {
          ...state.wealthTab,
          isFetching: true,
        },
      };
    },
    getEmployListSuccess(state, { payload }) {
      return {
        ...state,
        wealthTab: {
          ...state.wealthTab,
          employList: payload || [],
          isFetching: false,
        },
      };
    },
    getEmployListFaild(state) {
      return {
        ...state,
        wealthTab: {
          ...state.wealthTab,
          isFetching: false,
        },
      };
    },
    addEmployeeSuccess(state, { payload }) {
      return {
        ...state,
        wealthTab: {
          ...state.wealthTab,
          employList: [...state.wealthTab.employList, payload],
        },
      };
    },
    deleteEmployee(state, { payload }) {
      const employeeId = payload;
      const list = state.wealthTab.employList && state.wealthTab.employList.filter(item =>
        item.employeeId !== employeeId);
      return {
        ...state,
        wealthTab: {
          ...state.wealthTab,
          employList: list,
        },
      };
    },
    deleteResult(state, { payload }) {
      const deletItem = payload;
      const list = state.statusTab.resultList && state.statusTab.resultList.filter(item =>
        item.code !== deletItem.code || item.status !== deletItem.status);
      return {
        ...state,
        statusTab: {
          ...state.statusTab,
          resultList: list,
        },
      };
    },
    beforeUpdateConfig(state) {
      return {
        ...state,
        wealthTab: {
          ...state.wealthTab,
          isFetching: true,
        },
      };
    },
    updateConfigSuccess(state) {
      return {
        ...state,
        wealthTab: {
          ...state.wealthTab,
          isFetching: false,
        },
      };
    },
    updateConfigFaild(state) {
      return {
        ...state,
        wealthTab: {
          ...state.wealthTab,
          isFetching: false,
        },
      };
    },
    beforeGetStatusRecordList(state) {
      return {
        ...state,
        statusTab: {
          ...state.statusTab,
          record: {
            ...state.statusTab.record,
            isFetching: true,
          },
        },
      };
    },
    getStatusRecordListSuccess(state, { payload }) {
      return {
        ...state,
        statusTab: {
          ...state.statusTab,
          record: {
            ...payload,
            isFetching: false,
          },
        },
      };
    },
    getStatusRecordListFaild(state) {
      return {
        ...state,
        statusTab: {
          ...state.statusTab,
          record: {
            ...state.statusTab.record,
            isFetching: false,
          },
        },
      };
    },
    beforeGetRecordList(state) {
      return {
        ...state,
        wealthTab: {
          ...state.wealthTab,
          showRecord: true,
          record: {
            ...state.wealthTab.record,
            isFetching: true,
          },
        },
      };
    },
    getRecordListSuccess(state, { payload }) {
      return {
        ...state,
        wealthTab: {
          ...state.wealthTab,
          record: {
            isFetching: false,
            ...payload,
          },
        },
      };
    },
    getRecordListFaild(state) {
      return {
        ...state,
        wealthTab: {
          ...state.wealthTab,
          record: {
            ...state.wealthTab.record,
            isFetching: false,
          },
        },
      };
    },
    showRecordList(state, { payload }) {
      return {
        ...state,
        wealthTab: {
          ...state.wealthTab,
          showRecord: payload,
        },
      };
    },
    showStatusRecordList(state, { payload }) {
      return {
        ...state,
        statusTab: {
          ...state.statusTab,
          showRecord: payload,
          record: {
            isFetching: false,
          },
        },
      };
    },
    clearData(state) {
      return {
        ...state,
        wealthTab: {
          ...state.wealthTab,
          record: {
            isFetching: false,
          },
        },
      };
    },
    clearStatusData(state) {
      return {
        ...state,
        statusTab: {
          ...state.statusTab,
          record: {
            isFetching: false,
          },
        },
      };
    },
    beforeGetOperationResultList(state) {
      return {
        ...state,
        statusTab: {
          ...state.statusTab,
          operationResult: {
            isFetching: true,
          },
        },
      };
    },
    getOperationResultListSuccess(state, { payload }) {
      return {
        ...state,
        statusTab: {
          ...state.statusTab,
          operationResult: {
            list: payload || [],
            isFetching: false,
          },
        },
      };
    },
    getOperationResultListFaild(state) {
      return {
        ...state,
        statusTab: {
          ...state.statusTab,
          operationResult: {
            isFetching: false,
          },
        },
      };
    },
    loadingStatusTab(state) {
      return {
        ...state,
        statusTab: {
          ...state.statusTab,
          isFetching: true,
        },
      };
    },
    getExistResultListSuccess(state, { payload }) {
      return {
        ...state,
        statusTab: {
          ...state.statusTab,
          resultList: payload || [],
          isFetching: false,
          operationResult: {
            ...state.statusTab.operationResult,
            list: [],
          },
        },
      };
    },
    loadingStatusTabFaild(state) {
      return {
        ...state,
        statusTab: {
          ...state.statusTab,
          isFetching: false,
        },
      };
    },
    addResult(state, { payload }) {
      return {
        ...state,
        statusTab: {
          ...state.statusTab,
          resultList: payload || [],
        },
      };
    },
    updateStatusConfigSuccess(state) {
      return {
        ...state,
        statusTab: {
          ...state.statusTab,
          isFetching: false,
        },
      };
    },
  },
};
