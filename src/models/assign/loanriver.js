import { message } from 'antd';
import {
  getRecordList,
  getRuleDetail,
  getGroups,
  getUserList,
  saveAssignRlues,
  filterEmployee,
} from '../../services/assign';

export default {
  namespace: 'loanriver',
  state: {
    loanRiverConfig: { // loanRiver配置
      isFetching: false,
      groupUserList: [],
      loadingUser: false,
      shakeEmployeeId: '',
      showRecord: false,
      record: {
        isFetching: false,
      },
      specificValue: {
        memberBlackList: [],
        groupWhiteList: [],
      },
      allocateValue: {
        memberBlackList: [],
      },
    },
    groups: [],
  },

  effects: {
    * getRuleDetail({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingLoanRiver' });
        const data = yield call(getRuleDetail, payload);
        // yield put({ type: 'getLoanRiverSuccess', payload: data || {} });
        const { salesAllocateWay } = data;
        if (salesAllocateWay === 'SPECIFIC_SALES') {
          yield put({ type: 'setSpecificValue', payload: data || {} });
        } else {
          yield put({ type: 'setNotAllocateValue', payload: data || {} });
        }
      } catch (e) {
        yield put({ type: 'loadingPageFaild' });
        console.error(e);
      }
    },
    * getGroups({ payload }, { put, call }) {
      try {
        const groups = yield call(getGroups, payload); // 获取销售组别
        yield put({ type: 'getGroupsSuccess', payload: groups || [] });
      } catch (e) {
        console.error(e);
      }
    },
    * filterEmployee({ payload }, { put, call, select }) {
      try {
        const employee = yield call(filterEmployee, payload);
        const loanRiverList = yield select(state =>
          state.loanriver.loanRiverConfig.allocateValue.memberBlackList,
        );
        const exist = loanRiverList.some(item => `${item.id}` === `${employee.employeeId}`);
        if (exist) {
          message.warning('您添加的销售已存在');
          yield put({ type: 'setLoanRiverShakeId', payload: `${employee.employeeId}` });
        } else {
          yield put({ type: 'setLoanRiverEmployeeList', payload: employee });
        }
      } catch (e) {
        console.error(e);
      }
    },
    * getUserList({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingLoanRiverUser' });
        const users = yield call(getUserList, payload); // 获取组员
        yield put({ type: 'getLoanRiverUserSuccess', payload: users || [] });
      } catch (e) {
        yield put({ type: 'getUserFaild' });
        console.error(e);
      }
    },
    * saveAssignRlues({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingLoanRiver' });
        yield call(saveAssignRlues, payload);
        yield put({ type: 'saveAssignRluesSuccess' });
        message.success('保存成功！');
        const { salesAllocateWay } = payload;
        if (salesAllocateWay === 'SPECIFIC_SALES') {
          yield put({ type: 'clearNotAllocateTab' });
        } else {
          yield put({ type: 'clearSpecificTab' });
        }
      } catch (e) {
        yield put({ type: 'loadingPageFaild' });
        console.error(e);
      }
    },
    * getRiverRecordList({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeGetRiverRecordList' });
        const record = yield call(getRecordList, payload);
        yield put({ type: 'getRiverRecordListSuccess', payload: record || {} });
      } catch (e) {
        yield put({ type: 'getRiverRecordListFaild' });
        console.error(e);
      }
    },
  },

  reducers: {
    loadingLoanRiver(state) {
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          isFetching: true,
        },
      };
    },
    setSpecificValue(state, { payload }) {
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          salesAllocateWay: 'SPECIFIC_SALES',
          specificValue: {
            memberBlackList: payload.memberBlackList || [],
            groupWhiteList: payload.groupWhiteList || [],
          },
          isFetching: false,
        },
      };
    },
    setNotAllocateValue(state, { payload }) {
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          salesAllocateWay: 'NOT_ALLOCATE_SALES',
          allocateValue: {
            memberBlackList: payload.memberBlackList || [],
          },
          isFetching: false,
        },
      };
    },
    loadingPageFaild(state) {
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          isFetching: false,
        },
      };
    },
    getGroupsSuccess(state, { payload }) {
      return {
        ...state,
        groups: payload,
      };
    },
    setLoanRiverShakeId(state, { payload }) {
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          shakeEmployeeId: payload,
        },
      };
    },
    showRiverRecordList(state, { payload }) {
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          showRecord: payload,
        },
      };
    },
    clearRiverData(state) {
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          record: {
            isFetching: false,
          },
        },
      };
    },
    setLoanRiverEmployeeList(state, { payload }) {
      const id = `${payload.employeeId}`;
      const name = payload.employeeName;
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          shakeEmployeeId: '',
          allocateValue: {
            ...state.loanRiverConfig.allocateValue,
            memberBlackList: [...state.loanRiverConfig.allocateValue.memberBlackList, { id, name }],
          },
        },
      };
    },
    clearUserList(state) {
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          groupUserList: [],
        },
      };
    },
    loadingLoanRiverUser(state) {
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          loadingUser: true,
        },
      };
    },
    getLoanRiverUserSuccess(state, { payload }) {
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          groupUserList: payload,
          loadingUser: false,
        },
      };
    },
    getUserFaild(state) {
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          loadingUser: false,
        },
      };
    },
    addWhiteGroups(state, { payload }) {
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          specificValue: {
            ...state.loanRiverConfig.specificValue,
            groupWhiteList: [...state.loanRiverConfig.specificValue.groupWhiteList, payload],
          },
        },
      };
    },
    addUser(state, { payload }) {
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          specificValue: {
            ...state.loanRiverConfig.specificValue,
            memberBlackList: [...state.loanRiverConfig.specificValue.memberBlackList, payload],
          },
        },
      };
    },
    deleteSales(state, { payload }) {
      const loanRiverList =
        state.loanRiverConfig.allocateValue.memberBlackList.filter(sale => sale !== payload);
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          allocateValue: {
            ...state.loanRiverConfig.allocateValue,
            memberBlackList: loanRiverList,
          },
        },
      };
    },
    deleteWhiteGroups(state, { payload }) {
      const loanRiverWhiteList =
        state.loanRiverConfig.specificValue.groupWhiteList.filter(group => group !== payload);
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          specificValue: {
            ...state.loanRiverConfig.specificValue,
            groupWhiteList: loanRiverWhiteList,
          },
        },
      };
    },
    deleteWhiteUser(state, { payload }) {
      const loanRiverBlackList =
        state.loanRiverConfig.specificValue.memberBlackList.filter(user => user !== payload);
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          specificValue: {
            ...state.loanRiverConfig.specificValue,
            memberBlackList: loanRiverBlackList,
          },
        },
      };
    },
    saveAssignRluesSuccess(state) {
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          isFetching: false,
        },
      };
    },
    beforeGetRiverRecordList(state) {
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          showRecord: true,
          record: {
            ...state.loanRiverConfig.record,
            isFetching: true,
          },
        },
      };
    },
    getRiverRecordListSuccess(state, { payload }) {
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          record: {
            isFetching: false,
            ...payload,
          },
        },
      };
    },
    getRiverRecordListFaild(state) {
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          record: {
            ...state.loanRiverConfig.record,
            isFetching: false,
          },
        },
      };
    },
    clearNotAllocateTab(state) {
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          allocateValue: {
            memberBlackList: [],
          },
        },
      };
    },
    clearSpecificTab(state) {
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          specificValue: {
            groupWhiteList: [],
            memberBlackList: [],
          },
          groupUserList: [],
        },
      };
    },
    setWay(state, { payload }) {
      return {
        ...state,
        loanRiverConfig: {
          ...state.loanRiverConfig,
          salesAllocateWay: payload,
        },
      };
    },
  },
};
