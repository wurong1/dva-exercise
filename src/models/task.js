import {
  getHistotyList,
  getWithholdInfo,
  getRepaymentPlan,
  getRepaymentDetail,
  getPosInfo,
  addPosInfo,
  getEditData,
  editPosInfo,
  getCommercialInfo,
  deployCommercial,
  getPosDetail,
  getTaskDelay,
  submitTaskDelay,
} from '../services/task';

export default {
  namespace: 'task',

  state: {
    historyList: {
      isFetching: false,
    },
    repayInfoDetail: {
      withholdInfo: {},
      repaymentPlan: [],
      repaymentDetail: [],
    },
    unionPay: {
      posInfo: {
        isFetching: false,
        list: [],
        showBtn: false,
      },
      posDetail: {},
      addModal: {
        keys: [],
        visiable: false,
        isFetching: false,
      },
      editModal: {
        visiable: false,
        isFetching: false,
        isLoading: false,
        uuid: 0,
        keys: [],
        data: {},
      },
      commercialInfo: {
        isFetching: false,
        list: [],
        selectedRows: [],
        loading: false,
      },
    },
    taskDelay: {
      loading: false,
    },
  },

  effects: {
    * getHistotyList({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeGetHistotyListSucceed' });
        const list = yield call(getHistotyList, payload);
        yield put({ type: 'getHistotyListSucceed', payload: list });
      } catch (e) {
        yield put({ type: 'getHistotyListFaild' });
        console.error(e);
      }
    },
    * getWithholdInfo({ payload }, { put, call }) {
      try {
        const withholdInfo = yield call(getWithholdInfo, payload);
        yield put({ type: 'getWithholdInfoSucceed', payload: withholdInfo });
      } catch (e) {
        console.error(e);
      }
    },
    * getRepaymentPlan({ payload }, { put, call }) {
      try {
        const list = yield call(getRepaymentPlan, payload);
        yield put({ type: 'getRepaymentPlanSucceed', payload: list });
      } catch (e) {
        console.error(e);
      }
    },
    * getRepaymentDetail({ payload }, { put, call }) {
      try {
        const list = yield call(getRepaymentDetail, payload);
        yield put({ type: 'getRepaymentDetailSucceed', payload: list });
      } catch (e) {
        console.error(e);
      }
    },
    * getPosInfo({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeGetPosInfo' });
        const list = yield call(getPosInfo, payload);
        const params = {
          list: list || [],
          ...payload,
        };
        yield put({ type: 'getPosInfoSucceed', payload: params });
      } catch (e) {
        yield put({ type: 'getPosInfoFaild' });
        console.error(e);
      }
    },
    * addPosInfo({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeAddPosInfo' });
        yield call(addPosInfo, payload);
        yield put({ type: 'addPosInfoSucceed' });
        yield put({ type: 'getPosInfo', payload: { cardNo: payload.cardNo } });
      } catch (e) {
        yield put({ type: 'addPosInfoFaild' });
        console.error(e);
      }
    },
    * getEditData({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeGetEditData' });
        const data = yield call(getEditData, payload);
        const list = data.posInfomationDetailResponses || [];
        const keys = list.map((item, idx) => idx + 1);
        yield put({ type: 'setEditKeys', payload: keys });
        yield put({ type: 'setUuid', payload: keys.length });
        yield put({ type: 'getEditDataSucceed', payload: data });
      } catch (e) {
        yield put({ type: 'getEditDataFaild' });
        console.error(e);
      }
    },
    * editPosInfo({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeEditPosInfo' });
        yield call(editPosInfo, payload);
        yield put({ type: 'editPosInfoSucceed' });
        yield put({ type: 'getPosInfo', payload: { cardNo: payload.cardNo } });
      } catch (e) {
        yield put({ type: 'editPosInfoFaild' });
        console.error(e);
      }
    },
    * getCommercialInfo({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeGetCommercialInfo' });
        const data = yield call(getCommercialInfo, payload);
        yield put(
          {
            type: 'getCommercialInfoSucceed',
            payload: {
              cardNo: data.cardNo,
              list: data.mcaPosInfomations || [],
            },
          },
        );
      } catch (e) {
        yield put({ type: 'getCommercialInfoFaild' });
        console.error(e);
      }
    },
    * deployCommercial({ payload }, { put, call }) {
      try {
        const { formData } = payload;
        const params = { ...payload };
        delete params.formData;
        yield put({ type: 'beforeDeployCommercial' });
        yield call(deployCommercial, params);
        yield put({ type: 'deployCommercialSucceed' });
        yield put({ type: 'getCommercialInfo', payload: formData });
      } catch (e) {
        yield put({ type: 'deployCommercialFaild' });
        console.error(e);
      }
    },
    * getPosDetail({ payload }, { put, call }) {
      try {
        const data = yield call(getPosDetail, payload);
        yield put({ type: 'getPosDetailSucceed', payload: data });
      } catch (e) {
        console.error(e);
      }
    },
    * getTaskDelay({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingTaskDelay' });
        const data = yield call(getTaskDelay);
        yield put({ type: 'getTaskDelaySucceed', payload: data || {} });
      } catch (e) {
        yield put({ type: 'loadingTaskDelayEnd' });
        console.error(e);
      }
    },
    * submitTaskDelay({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingTaskDelay' });
        yield call(submitTaskDelay, payload);
        yield put({ type: 'submitTaskDelaySucceed' });
      } catch (e) {
        yield put({ type: 'loadingTaskDelayEnd' });
        console.error(e);
      }
    },
  },

  reducers: {
    beforeGetHistotyListSucceed(state) {
      return {
        ...state,
        historyList: {
          isFetching: true,
        },
      };
    },
    getHistotyListSucceed(state, { payload }) {
      return {
        ...state,
        historyList: {
          ...state.historyList,
          ...payload,
          isFetching: false,
        },
      };
    },
    getHistotyListFaild(state) {
      return {
        ...state,
        historyList: {
          ...state.historyList,
          isFetching: false,
        },
      };
    },
    clearHistoryData(state) {
      return {
        ...state,
        historyList: {
          isFetching: false,
        },
      };
    },
    getWithholdInfoSucceed(state, { payload }) {
      return {
        ...state,
        repayInfoDetail: {
          ...state.repayInfoDetail,
          withholdInfo: payload || {},
        },
      };
    },
    getRepaymentPlanSucceed(state, { payload }) {
      return {
        ...state,
        repayInfoDetail: {
          ...state.repayInfoDetail,
          repaymentPlan: payload || [],
        },
      };
    },
    getRepaymentDetailSucceed(state, { payload }) {
      return {
        ...state,
        repayInfoDetail: {
          ...state.repayInfoDetail,
          repaymentDetail: payload || [],
        },
      };
    },
    beforeGetPosInfo(state) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          posInfo: {
            ...state.unionPay.posInfo,
            isFetching: true,
          },
        },
      };
    },
    getPosInfoSucceed(state, { payload }) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          posInfo: {
            ...state.unionPay.posInfo,
            isFetching: false,
            showBtn: true,
            ...payload,
          },
        },
      };
    },
    getPosInfoFaild(state) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          posInfo: {
            ...state.unionPay.posInfo,
            isFetching: false,
          },
        },
      };
    },
    clearPosInfo(state) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          posInfo: {
            ...state.unionPay.posInfo,
            list: [],
            isFetching: false,
          },
        },
      };
    },
    showAddModal(state, { payload }) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          addModal: {
            ...state.unionPay.addModal,
            visiable: payload,
            keys: payload ? state.unionPay.addModal.keys : [],
          },
        },
      };
    },
    beforeAddPosInfo(state) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          addModal: {
            ...state.unionPay.addModal,
            isFetching: true,
          },
        },
      };
    },
    addPosInfoSucceed(state) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          addModal: {
            ...state.unionPay.addModal,
            visiable: false,
            isFetching: false,
            keys: [],
          },
        },
      };
    },
    addPosInfoFaild(state) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          addModal: {
            ...state.unionPay.addModal,
            isFetching: false,
          },
        },
      };
    },
    setKeys(state, { payload }) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          addModal: {
            ...state.unionPay.addModal,
            keys: payload,
          },
        },
      };
    },
    beforeGetEditData(state) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          editModal: {
            ...state.unionPay.editModal,
            visiable: true,
            isFetching: true,
          },
        },
      };
    },
    getEditDataSucceed(state, { payload }) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          editModal: {
            ...state.unionPay.editModal,
            data: payload || {},
            isFetching: false,
          },
        },
      };
    },
    getEditDataFaild(state) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          editModal: {
            ...state.unionPay.editModal,
            isFetching: false,
          },
        },
      };
    },
    setEditKeys(state, { payload }) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          editModal: {
            ...state.unionPay.editModal,
            keys: payload,
          },
        },
      };
    },
    setUuid(state, { payload }) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          editModal: {
            ...state.unionPay.editModal,
            uuid: payload,
          },
        },
      };
    },
    /* removeEditDate(state, { payload } ){
      const list = state.unionPay.editModal.data.posInfomationDetailResponses || [];
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          editModal: {
            ...state.unionPay.editModal,
            keys: payload.nextKeys,
            data: {
              ...state.unionPay.editModal.data,
              posInfomationDetailResponses: [...list].splice(payload.k - 1, 1),
            }
          },
        }
      }
    }, */
    closeEditModal(state) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          editModal: {
            ...state.unionPay.editModal,
            visiable: false,
          },
        },
      };
    },
    beforeEditPosInfo(state) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          editModal: {
            ...state.unionPay.editModal,
            isLoading: true,
          },
        },
      };
    },
    editPosInfoSucceed(state) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          editModal: {
            ...state.unionPay.editModal,
            isLoading: false,
            visiable: false,
          },
        },
      };
    },
    editPosInfoFaild(state) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          editModal: {
            ...state.unionPay.editModal,
            isLoading: false,
          },
        },
      };
    },
    addEditData(state) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          editModal: {
            ...state.unionPay.editModal,
            uuid: state.unionPay.editModal.uuid + 1,
            keys: [
              ...state.unionPay.editModal.keys,
              state.unionPay.editModal.uuid + 1],
          },
        },
      };
    },
    beforeGetCommercialInfo(state) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          commercialInfo: {
            ...state.unionPay.commercialInfo,
            isFetching: true,
          },
        },
      };
    },
    getCommercialInfoSucceed(state, { payload }) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          commercialInfo: {
            ...state.unionPay.commercialInfo,
            ...payload,
            selectedRows: [],
            isFetching: false,
          },
        },
      };
    },
    getCommercialInfoFaild(state) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          commercialInfo: {
            ...state.unionPay.commercialInfo,
            isFetching: false,
          },
        },
      };
    },
    clearCommercialInfo(state) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          commercialInfo: {
            ...state.unionPay.commercialInfo,
            list: [],
          },
        },
      };
    },
    setSelectedRows(state, { payload }) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          commercialInfo: {
            ...state.unionPay.commercialInfo,
            selectedRows: payload || [],
          },
        },
      };
    },
    beforeDeployCommercial(state) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          commercialInfo: {
            ...state.unionPay.commercialInfo,
            loading: true,
          },
        },
      };
    },
    deployCommercialSucceed(state) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          commercialInfo: {
            ...state.unionPay.commercialInfo,
            loading: false,
          },
        },
      };
    },
    deployCommercialFaild(state) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          commercialInfo: {
            ...state.unionPay.commercialInfo,
            loading: false,
          },
        },
      };
    },
    getPosDetailSucceed(state, { payload }) {
      return {
        ...state,
        unionPay: {
          ...state.unionPay,
          posDetail: payload || {},
        },
      };
    },
    setPlanPageCurrent(state, { payload }) {
      return {
        ...state,
        repayInfoDetail: {
          ...state.repayInfoDetail,
          repaymentPlanPageCurrent: payload,
        },
      };
    },
    loadingTaskDelay(state) {
      return {
        ...state,
        taskDelay: {
          ...state.taskDelay,
          loading: true,
        },
      };
    },
    getTaskDelaySucceed(state, { payload }) {
      return {
        ...state,
        taskDelay: {
          ...state.taskDelay,
          loading: false,
          ...payload,
        },
      };
    },
    loadingTaskDelayEnd(state) {
      return {
        ...state,
        taskDelay: {
          ...state.taskDelay,
          loading: false,
        },
      };
    },
    submitTaskDelaySucceed(state) {
      return {
        ...state,
        taskDelay: {
          ...state.taskDelay,
          loading: false,
        },
      };
    },
  },
};
