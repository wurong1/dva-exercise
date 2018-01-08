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
  namespace: 'fund51',
  state: {
    fund51Config: { // 51公积金配置
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
        yield put({ type: 'loadingFund51' });
        const data = yield call(getRuleDetail, payload);
        // yield put({ type: 'getFund51Success', payload: data || {} });
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
        const found51List = yield select(state =>
          state.fund51.fund51Config.allocateValue.memberBlackList,
        );
        const exist = found51List.some(item => `${item.id}` === `${employee.employeeId}`);
        if (exist) {
          message.warning('您添加的销售已存在');
          yield put({ type: 'setFund51ShakeId', payload: `${employee.employeeId}` });
        } else {
          yield put({ type: 'setFund51EmployeeList', payload: employee });
        }
      } catch (e) {
        console.error(e);
      }
    },
    * getUserList({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingFund51User' });
        const users = yield call(getUserList, payload); // 获取组员
        yield put({ type: 'getFund51UserSuccess', payload: users || [] });
      } catch (e) {
        yield put({ type: 'getUserFaild' });
        console.error(e);
      }
    },
    * saveAssignRlues({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingFund51' });
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
    * getFundRecordList({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeGetFundRecordList' });
        const record = yield call(getRecordList, payload);
        yield put({ type: 'getFundRecordListSuccess', payload: record || {} });
      } catch (e) {
        yield put({ type: 'getFundRecordListFaild' });
        console.error(e);
      }
    },
  },

  reducers: {
    loadingFund51(state) {
      return {
        ...state,
        fund51Config: {
          ...state.fund51Config,
          isFetching: true,
        },
      };
    },
    setSpecificValue(state, { payload }) {
      return {
        ...state,
        fund51Config: {
          ...state.fund51Config,
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
        fund51Config: {
          ...state.fund51Config,
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
        fund51Config: {
          ...state.fund51Config,
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
    setFund51ShakeId(state, { payload }) {
      return {
        ...state,
        fund51Config: {
          ...state.fund51Config,
          shakeEmployeeId: payload,
        },
      };
    },
    showFundRecordList(state, { payload }) {
      return {
        ...state,
        fund51Config: {
          ...state.fund51Config,
          showRecord: payload,
        },
      };
    },
    clearFundData(state) {
      return {
        ...state,
        fund51Config: {
          ...state.fund51Config,
          record: {
            isFetching: false,
          },
        },
      };
    },
    setFund51EmployeeList(state, { payload }) {
      const id = `${payload.employeeId}`;
      const name = payload.employeeName;
      return {
        ...state,
        fund51Config: {
          ...state.fund51Config,
          shakeEmployeeId: '',
          allocateValue: {
            ...state.fund51Config.allocateValue,
            memberBlackList: [...state.fund51Config.allocateValue.memberBlackList, { id, name }],
          },
        },
      };
    },
    clearUserList(state) {
      return {
        ...state,
        fund51Config: {
          ...state.fund51Config,
          groupUserList: [],
        },
      };
    },
    loadingFund51User(state) {
      return {
        ...state,
        fund51Config: {
          ...state.fund51Config,
          loadingUser: true,
        },
      };
    },
    getFund51UserSuccess(state, { payload }) {
      return {
        ...state,
        fund51Config: {
          ...state.fund51Config,
          groupUserList: payload,
          loadingUser: false,
        },
      };
    },
    getUserFaild(state) {
      return {
        ...state,
        fund51Config: {
          ...state.fund51Config,
          loadingUser: false,
        },
      };
    },
    addWhiteGroups(state, { payload }) {
      return {
        ...state,
        fund51Config: {
          ...state.fund51Config,
          specificValue: {
            ...state.fund51Config.specificValue,
            groupWhiteList: [...state.fund51Config.specificValue.groupWhiteList, payload],
          },
        },
      };
    },
    addUser(state, { payload }) {
      return {
        ...state,
        fund51Config: {
          ...state.fund51Config,
          specificValue: {
            ...state.fund51Config.specificValue,
            memberBlackList: [...state.fund51Config.specificValue.memberBlackList, payload],
          },
        },
      };
    },
    deleteSales(state, { payload }) {
      const fund51List =
        state.fund51Config.allocateValue.memberBlackList.filter(sale => sale !== payload);
      return {
        ...state,
        fund51Config: {
          ...state.fund51Config,
          allocateValue: {
            ...state.fund51Config.allocateValue,
            memberBlackList: fund51List,
          },
        },
      };
    },
    deleteWhiteGroups(state, { payload }) {
      const fund51WhiteList =
        state.fund51Config.specificValue.groupWhiteList.filter(group => group !== payload);
      return {
        ...state,
        fund51Config: {
          ...state.fund51Config,
          specificValue: {
            ...state.fund51Config.specificValue,
            groupWhiteList: fund51WhiteList,
          },
        },
      };
    },
    deleteWhiteUser(state, { payload }) {
      const fund51BlackList =
        state.fund51Config.specificValue.memberBlackList.filter(user => user !== payload);
      return {
        ...state,
        fund51Config: {
          ...state.fund51Config,
          specificValue: {
            ...state.fund51Config.specificValue,
            memberBlackList: fund51BlackList,
          },
        },
      };
    },
    saveAssignRluesSuccess(state) {
      return {
        ...state,
        fund51Config: {
          ...state.fund51Config,
          isFetching: false,
        },
      };
    },
    beforeGetFundRecordList(state) {
      return {
        ...state,
        fund51Config: {
          ...state.fund51Config,
          showRecord: true,
          record: {
            ...state.fund51Config.record,
            isFetching: true,
          },
        },
      };
    },
    getFundRecordListSuccess(state, { payload }) {
      return {
        ...state,
        fund51Config: {
          ...state.fund51Config,
          record: {
            isFetching: false,
            ...payload,
          },
        },
      };
    },
    getFundRecordListFaild(state) {
      return {
        ...state,
        fund51Config: {
          ...state.fund51Config,
          record: {
            ...state.fund51Config.record,
            isFetching: false,
          },
        },
      };
    },
    clearNotAllocateTab(state) {
      return {
        ...state,
        fund51Config: {
          ...state.fund51Config,
          allocateValue: {
            memberBlackList: [],
          },
        },
      };
    },
    clearSpecificTab(state) {
      return {
        ...state,
        fund51Config: {
          ...state.fund51Config,
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
        fund51Config: {
          ...state.fund51Config,
          salesAllocateWay: payload,
        },
      };
    },
  },
};
