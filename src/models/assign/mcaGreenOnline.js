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
  namespace: 'mcaGreenOnline',
  state: {
    mcaGreenOnlineConfig: { // mca绿色线上版配置
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
        yield put({ type: 'loadingMcaGo' });
        const data = yield call(getRuleDetail, payload);
        // yield put({ type: 'getMcaGoSuccess', payload: data || {} });
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
        const McaGoList = yield select(state =>
          state.mcaGreenOnline.mcaGreenOnlineConfig.allocateValue.memberBlackList,
        );
        const exist = McaGoList.some(item => `${item.id}` === `${employee.employeeId}`);
        if (exist) {
          message.warning('您添加的销售已存在');
          yield put({ type: 'setMcaGoShakeId', payload: `${employee.employeeId}` });
        } else {
          yield put({ type: 'setMcaGoEmployeeList', payload: employee });
        }
      } catch (e) {
        console.error(e);
      }
    },
    * getUserList({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingMcaGoUser' });
        const users = yield call(getUserList, payload); // 获取组员
        yield put({ type: 'getMcaGoUserSuccess', payload: users || [] });
      } catch (e) {
        yield put({ type: 'getUserFaild' });
        console.error(e);
      }
    },
    * saveAssignRlues({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingMcaGo' });
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
    * getMcaGoRecordList({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforegetMcaGoRecordList' });
        const record = yield call(getRecordList, payload);
        yield put({ type: 'getMcaGoRecordListSuccess', payload: record || {} });
      } catch (e) {
        yield put({ type: 'getMcaGoRecordListFaild' });
        console.error(e);
      }
    },
  },

  reducers: {
    loadingMcaGo(state) {
      return {
        ...state,
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
          isFetching: true,
        },
      };
    },
    setSpecificValue(state, { payload }) {
      return {
        ...state,
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
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
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
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
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
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
    setMcaGoShakeId(state, { payload }) {
      return {
        ...state,
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
          shakeEmployeeId: payload,
        },
      };
    },
    showMcaGoRecordList(state, { payload }) {
      return {
        ...state,
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
          showRecord: payload,
        },
      };
    },
    clearMcaGoData(state) {
      return {
        ...state,
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
          record: {
            isFetching: false,
          },
        },
      };
    },
    setMcaGoEmployeeList(state, { payload }) {
      const id = `${payload.employeeId}`;
      const name = payload.employeeName;
      return {
        ...state,
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
          shakeEmployeeId: '',
          allocateValue: {
            ...state.mcaGreenOnlineConfig.allocateValue,
            memberBlackList: [...state.mcaGreenOnlineConfig.allocateValue.memberBlackList, { id, name }],
          },
        },
      };
    },
    clearUserList(state) {
      return {
        ...state,
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
          groupUserList: [],
        },
      };
    },
    loadingMcaGoUser(state) {
      return {
        ...state,
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
          loadingUser: true,
        },
      };
    },
    getMcaGoUserSuccess(state, { payload }) {
      return {
        ...state,
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
          groupUserList: payload,
          loadingUser: false,
        },
      };
    },
    getUserFaild(state) {
      return {
        ...state,
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
          loadingUser: false,
        },
      };
    },
    addWhiteGroups(state, { payload }) {
      return {
        ...state,
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
          specificValue: {
            ...state.mcaGreenOnlineConfig.specificValue,
            groupWhiteList: [...state.mcaGreenOnlineConfig.specificValue.groupWhiteList, payload],
          },
        },
      };
    },
    addUser(state, { payload }) {
      return {
        ...state,
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
          specificValue: {
            ...state.mcaGreenOnlineConfig.specificValue,
            memberBlackList: [...state.mcaGreenOnlineConfig.specificValue.memberBlackList, payload],
          },
        },
      };
    },
    deleteSales(state, { payload }) {
      const McaGoList =
        state.mcaGreenOnlineConfig.allocateValue.memberBlackList.filter(sale => sale !== payload);
      return {
        ...state,
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
          allocateValue: {
            ...state.mcaGreenOnlineConfig.allocateValue,
            memberBlackList: McaGoList,
          },
        },
      };
    },
    deleteWhiteGroups(state, { payload }) {
      const McaGoWhiteList =
        state.mcaGreenOnlineConfig.specificValue.groupWhiteList.filter(group => group !== payload);
      return {
        ...state,
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
          specificValue: {
            ...state.mcaGreenOnlineConfig.specificValue,
            groupWhiteList: McaGoWhiteList,
          },
        },
      };
    },
    deleteWhiteUser(state, { payload }) {
      const McaGoBlackList =
        state.mcaGreenOnlineConfig.specificValue.memberBlackList.filter(user => user !== payload);
      return {
        ...state,
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
          specificValue: {
            ...state.mcaGreenOnlineConfig.specificValue,
            memberBlackList: McaGoBlackList,
          },
        },
      };
    },
    saveAssignRluesSuccess(state) {
      return {
        ...state,
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
          isFetching: false,
        },
      };
    },
    beforegetMcaGoRecordList(state) {
      return {
        ...state,
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
          showRecord: true,
          record: {
            ...state.mcaGreenOnlineConfig.record,
            isFetching: true,
          },
        },
      };
    },
    getMcaGoRecordListSuccess(state, { payload }) {
      return {
        ...state,
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
          record: {
            isFetching: false,
            ...payload,
          },
        },
      };
    },
    getMcaGoRecordListFaild(state) {
      return {
        ...state,
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
          record: {
            ...state.mcaGreenOnlineConfig.record,
            isFetching: false,
          },
        },
      };
    },
    clearNotAllocateTab(state) {
      return {
        ...state,
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
          allocateValue: {
            memberBlackList: [],
          },
        },
      };
    },
    clearSpecificTab(state) {
      return {
        ...state,
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
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
        mcaGreenOnlineConfig: {
          ...state.mcaGreenOnlineConfig,
          salesAllocateWay: payload,
        },
      };
    },
  },
};
