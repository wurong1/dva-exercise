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
  namespace: 'wealth',
  state: {
    wealthConfig: { // loanWealth配置
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
        yield put({ type: 'loadingWealth' });
        const data = yield call(getRuleDetail, payload);
        // yield put({ type: 'getWealthSuccess', payload: data || {} });
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
        const wealthList = yield select(state =>
          state.wealth.wealthConfig.allocateValue.memberBlackList,
        );
        const exist = wealthList.some(item => `${item.id}` === `${employee.employeeId}`);
        if (exist) {
          message.warning('您添加的销售已存在');
          yield put({ type: 'setWealthShakeId', payload: `${employee.employeeId}` });
        } else {
          yield put({ type: 'setWealthEmployeeList', payload: employee });
        }
      } catch (e) {
        console.error(e);
      }
    },
    * getUserList({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingWealthUser' });
        const users = yield call(getUserList, payload); // 获取组员
        yield put({ type: 'getWealthUserSuccess', payload: users || [] });
      } catch (e) {
        yield put({ type: 'getUserFaild' });
        console.error(e);
      }
    },
    * saveAssignRlues({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingWealth' });
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
    * getWealthRecordList({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeGetWealthRecordList' });
        const record = yield call(getRecordList, payload);
        yield put({ type: 'getWealthRecordListSuccess', payload: record || {} });
      } catch (e) {
        yield put({ type: 'getWealthRecordListFaild' });
        console.error(e);
      }
    },
  },

  reducers: {
    loadingWealth(state) {
      return {
        ...state,
        wealthConfig: {
          ...state.wealthConfig,
          isFetching: true,
        },
      };
    },
    setSpecificValue(state, { payload }) {
      return {
        ...state,
        wealthConfig: {
          ...state.wealthConfig,
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
        wealthConfig: {
          ...state.wealthConfig,
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
        wealthConfig: {
          ...state.wealthConfig,
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
    setWealthShakeId(state, { payload }) {
      return {
        ...state,
        wealthConfig: {
          ...state.wealthConfig,
          shakeEmployeeId: payload,
        },
      };
    },
    showWealthRecordList(state, { payload }) {
      return {
        ...state,
        wealthConfig: {
          ...state.wealthConfig,
          showRecord: payload,
        },
      };
    },
    clearWealthData(state) {
      return {
        ...state,
        wealthConfig: {
          ...state.wealthConfig,
          record: {
            isFetching: false,
          },
        },
      };
    },
    setWealthEmployeeList(state, { payload }) {
      const id = `${payload.employeeId}`;
      const name = payload.employeeName;
      return {
        ...state,
        wealthConfig: {
          ...state.wealthConfig,
          shakeEmployeeId: '',
          allocateValue: {
            ...state.wealthConfig.allocateValue,
            memberBlackList: [...state.wealthConfig.allocateValue.memberBlackList, { id, name }],
          },
        },
      };
    },
    clearUserList(state) {
      return {
        ...state,
        wealthConfig: {
          ...state.wealthConfig,
          groupUserList: [],
        },
      };
    },
    loadingWealthUser(state) {
      return {
        ...state,
        wealthConfig: {
          ...state.wealthConfig,
          loadingUser: true,
        },
      };
    },
    getWealthUserSuccess(state, { payload }) {
      return {
        ...state,
        wealthConfig: {
          ...state.wealthConfig,
          groupUserList: payload,
          loadingUser: false,
        },
      };
    },
    getUserFaild(state) {
      return {
        ...state,
        wealthConfig: {
          ...state.wealthConfig,
          loadingUser: false,
        },
      };
    },
    addWhiteGroups(state, { payload }) {
      return {
        ...state,
        wealthConfig: {
          ...state.wealthConfig,
          specificValue: {
            ...state.wealthConfig.specificValue,
            groupWhiteList: [...state.wealthConfig.specificValue.groupWhiteList, payload],
          },
        },
      };
    },
    addUser(state, { payload }) {
      return {
        ...state,
        wealthConfig: {
          ...state.wealthConfig,
          specificValue: {
            ...state.wealthConfig.specificValue,
            memberBlackList: [...state.wealthConfig.specificValue.memberBlackList, payload],
          },
        },
      };
    },
    deleteSales(state, { payload }) {
      const wealthList =
        state.wealthConfig.allocateValue.memberBlackList.filter(sale => sale !== payload);
      return {
        ...state,
        wealthConfig: {
          ...state.wealthConfig,
          allocateValue: {
            ...state.wealthConfig.allocateValue,
            memberBlackList: wealthList,
          },
        },
      };
    },
    deleteWhiteGroups(state, { payload }) {
      const loanWealthWhiteList =
        state.wealthConfig.specificValue.groupWhiteList.filter(group => group !== payload);
      return {
        ...state,
        wealthConfig: {
          ...state.wealthConfig,
          specificValue: {
            ...state.wealthConfig.specificValue,
            groupWhiteList: loanWealthWhiteList,
          },
        },
      };
    },
    deleteWhiteUser(state, { payload }) {
      const loanWealthBlackList =
        state.wealthConfig.specificValue.memberBlackList.filter(user => user !== payload);
      return {
        ...state,
        wealthConfig: {
          ...state.wealthConfig,
          specificValue: {
            ...state.wealthConfig.specificValue,
            memberBlackList: loanWealthBlackList,
          },
        },
      };
    },
    saveAssignRluesSuccess(state) {
      return {
        ...state,
        wealthConfig: {
          ...state.wealthConfig,
          isFetching: false,
        },
      };
    },
    beforeGetWealthRecordList(state) {
      return {
        ...state,
        wealthConfig: {
          ...state.wealthConfig,
          showRecord: true,
          record: {
            ...state.wealthConfig.record,
            isFetching: true,
          },
        },
      };
    },
    getWealthRecordListSuccess(state, { payload }) {
      return {
        ...state,
        wealthConfig: {
          ...state.wealthConfig,
          record: {
            isFetching: false,
            ...payload,
          },
        },
      };
    },
    getWealthRecordListFaild(state) {
      return {
        ...state,
        wealthConfig: {
          ...state.wealthConfig,
          record: {
            ...state.wealthConfig.record,
            isFetching: false,
          },
        },
      };
    },
    clearNotAllocateTab(state) {
      return {
        ...state,
        wealthConfig: {
          ...state.wealthConfig,
          allocateValue: {
            memberBlackList: [],
          },
        },
      };
    },
    clearSpecificTab(state) {
      return {
        ...state,
        wealthConfig: {
          ...state.wealthConfig,
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
        wealthConfig: {
          ...state.wealthConfig,
          salesAllocateWay: payload,
        },
      };
    },
  },
};
