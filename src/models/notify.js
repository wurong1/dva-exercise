import request from '../utils/request';
import { getMessageList, readMessage, deleteAll, getNotifySettingList, updateSetting } from '../services/notify';
import createIO from '../utils/im-socket';

export default {
  namespace: 'notify',
  state: {
    unReceivedCount: {
      hold: 0,
      approved: 0,
    },
    holdList: {
      isFetching: false,
    },
    signList: {
      isFetching: false,
    },
    notifySettingList: {
      list: [],
      isFetching: false,
    },
    isFetching: false,
  },

  effects: {
    * getMessageList({ payload }, { put, call }) {
      try {
        if (payload.type === 'hold') {
          yield put({ type: 'beforGetHoldList' });
        } else if (payload.type === 'approved') {
          yield put({ type: 'beforGetSignList' });
        }
        const data = yield call(getMessageList, payload);
        if (payload.type === 'hold') {
          yield put({ type: 'getHoldListSuccess', payload: data });
        } else if (payload.type === 'approved') {
          yield put({ type: 'getSignListSuccess', payload: data });
        }
      } catch (e) {
        if (payload.type === 'hold') {
          yield put({ type: 'getHoldListFaild' });
        } else if (payload.type === 'approved') {
          yield put({ type: 'getSignListFaild' });
        }
        console.error(e);
      }
    },
    * readMessage({ payload }, { put, call }) {
      try {
        yield call(readMessage, payload.msgId);
        if (payload.type === 'hold') {
          yield put({ type: 'updateHoldList', payload: payload.msgId });
        } else if (payload.type === 'approved') {
          yield put({ type: 'updateSignList', payload: payload.msgId });
        }
      } catch (e) {
        console.error(e);
      }
    },
    * deleteAll({ payload }, { put, call }) {
      try {
        if (payload === 'hold') {
          yield put({ type: 'beforeDeleteHold' });
        } else if (payload === 'approved') {
          yield put({ type: 'beforeDeleteSign' });
        }
        yield call(deleteAll, payload);
        if (payload === 'hold') {
          yield put({ type: 'deleteHoldSuccess' });
        } else if (payload === 'approved') {
          yield put({ type: 'deleteSignSuccess' });
        }
      } catch (e) {
        if (payload === 'hold') {
          yield put({ type: 'deleteHoldFaild' });
        } else if (payload === 'approved') {
          yield put({ type: 'deleteSignFaild' });
        }
        console.error(e);
      }
    },
    *getNotifySettingList({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeGetNotifySettingList' });
        const list = yield call(getNotifySettingList);
        yield put({ type: 'getNotifySettingListSuccess', payload: list || [] });
      } catch (e) {
        yield put({ type: 'getNotifySettingListFaild' });
        console.error(e);
      }
    },
    * updateSetting({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeUpdateSetting' });
        yield call(updateSetting, payload);
        yield put({ type: 'updateSettingSuccess' });
      } catch (e) {
        yield put({ type: 'updateSettingFaild' });
        console.error(e);
      }
    },
  },

  reducers: {
    getCountSuccess(state, { payload }) {
      return {
        ...state,
        unReceivedCount: payload.unReceivedMessageCount,
      };
    },
    beforGetHoldList(state) {
      return {
        ...state,
        holdList: {
          ...state.holdList,
          isFetching: true,
        },
      };
    },
    beforGetSignList(state) {
      return {
        ...state,
        signList: {
          ...state.signList,
          isFetching: true,
        },
      };
    },
    getHoldListSuccess(state, { payload }) {
      return {
        ...state,
        holdList: {
          ...payload,
          isFetching: false,
        },
      };
    },
    getSignListSuccess(state, { payload }) {
      return {
        ...state,
        signList: {
          ...payload,
          isFetching: false,
        },
      };
    },
    getHoldListFaild(state) {
      return {
        ...state,
        holdList: {
          ...state.holdList,
          isFetching: false,
        },
      };
    },
    getSignListFaild(state) {
      return {
        ...state,
        signList: {
          ...state.signList,
          isFetching: false,
        },
      };
    },
    beforeDeleteHold(state) {
      return {
        ...state,
        holdList: {
          ...state.holdList,
          isFetching: true,
        },
      };
    },
    beforeDeleteSign(state) {
      return {
        ...state,
        signList: {
          ...state.signList,
          isFetching: true,
        },
      };
    },
    deleteHoldSuccess(state) {
      return {
        ...state,
        holdList: {
          isFetching: false,
        },
        unReceivedCount: {
          ...state.unReceivedCount,
          hold: 0,
        },
      };
    },
    deleteSignSuccess(state) {
      return {
        ...state,
        signList: {
          isFetching: false,
        },
        unReceivedCount: {
          ...state.unReceivedCount,
          approved: 0,
        },
      };
    },
    deleteHoldFaild(state) {
      return {
        ...state,
        holdList: {
          ...state.holdList,
          isFetching: false,
        },
      };
    },
    deleteSignFaild(state) {
      return {
        ...state,
        signList: {
          ...state.signList,
          isFetching: false,
        },
      };
    },
    updateHoldList(state, { payload }) {
      const { holdList = {}, unReceivedCount = {} } = state;
      const { list = [] } = holdList;
      const hold = unReceivedCount.hold > 0 ? unReceivedCount.hold - 1 : 0;
      list.map((item) => {
        const obj = item;
        if (item.msgSeqId === payload) {
          obj.haveRead = true;
        }
        return obj;
      });
      return {
        ...state,
        holdList: {
          ...state.holdList,
          list,
        },
        unReceivedCount: {
          ...state.unReceivedCount,
          hold,
        },
      };
    },
    updateSignList(state, { payload }) {
      const { signList = {}, unReceivedCount = {} } = state;
      const { list = [] } = signList;
      const approved = unReceivedCount.approved > 0 ? unReceivedCount.approved - 1 : 0;
      list.map((item) => {
        const obj = item;
        if (item.msgSeqId === payload) {
          obj.haveRead = true;
        }
        return obj;
      });
      return {
        ...state,
        signList: {
          ...state.signList,
          list,
        },
        unReceivedCount: {
          ...state.unReceivedCount,
          approved,
        },
      };
    },
    beforeInitSocket(state) {
      return {
        ...state,
        isFetching: true,
      };
    },
    initSocketSuccess(state) {
      return {
        ...state,
        isFetching: false,
      };
    },
    initSocketFaild(state) {
      return {
        ...state,
        isFetching: false,
      };
    },
    beforeGetNotifySettingList(state) {
      return {
        ...state,
        notifySettingList: {
          ...state.notifySettingList,
          isFetching: true,
        },
      };
    },
    getNotifySettingListSuccess(state, { payload }) {
      return {
        ...state,
        notifySettingList: {
          isFetching: false,
          list: payload,
        },
      };
    },
    getNotifySettingListFaild(state) {
      return {
        ...state,
        notifySettingList: {
          ...state.notifySettingList,
          isFetching: false,
        },
      };
    },
    beforeUpdateSetting(state) {
      return {
        ...state,
        notifySettingList: {
          ...state.notifySettingList,
          isFetching: true,
        },
      };
    },
    updateSettingSuccess(state) {
      return {
        ...state,
        notifySettingList: {
          ...state.notifySettingList,
          isFetching: false,
        },
      };
    },
    updateSettingFaild(state) {
      return {
        ...state,
        notifySettingList: {
          ...state.notifySettingList,
          isFetching: false,
        },
      };
    },
    updateCheckStatus(state, { payload }) {
      const type = payload;
      const { list = [] } = state.notifySettingList;
      const newList = [...list];
      newList.map((item) => {
        const obj = item;
        if (item.notificationType === type) {
          obj.notificationStatus = !item.notificationStatus;
        }
        return obj;
      });
      return {
        ...state,
        notifySettingList: {
          isFetching: false,
          list: newList,
        },
      };
    },
  },

  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'beforeInitSocket' });
      let imId = '';
      // IM 上线接口(上线后才能推送消息)
      request('/saas/im/employee/online').then(() => {
        // 获取当前用户信息
        return request('/borrower/v1/auth/me');
      })
        .then((res) => {
          // 获取imId
          const { id = '' } = res;
          return request(`/borrower/v1/notify/getOrCreateImCustomer?employeeId=${id}`);
        })
          .then((res) => {
            // 获取未读消息数量
            imId = res || '';
            return request(`/borrower/v1/notify/getUnReadMsgCount?userId=${imId}`);
          })
            .then((res) => {
              dispatch({ type: 'getCountSuccess', payload: res || {} });
              // 获取长连接url
              return request('/saas/im/getConnector');
            })
              .then((res) => {
                const url = res || '';
                createIO({ to: imId })(url)
                  .then((socket) => {
                    socket.on('msg', () => {
                      request(`/borrower/v1/notify/getUnReadMsgCount?userId=${imId}`)
                        .then((data) => {
                          dispatch({ type: 'getCountSuccess', payload: data || {} });
                        });
                    });
                  });
                dispatch({ type: 'initSocketSuccess' });
              })
                .catch((e) => {
                  dispatch({ type: 'initSocketFaild' });
                  console.error(e);
                });
    },
  },

};
