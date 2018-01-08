import {
  getEmployeeGroupId,
  taskReportSubmit,
  exportReportList,
  downloadReportList,
  deleteFile,
  deleteAll,
  fetchLoanApplySearch,
  fetchLoanApplyExport,
  fetchExportDownloadList,
  fetchExportDelete,
  fetchDeleteAll,
  fetchGetEmployeeId,
  fetchRepaymentSearch,
  fetchRepaymentExport,
  fetchRepaymentDownloadList,
  fetchRepaymentDelete,
  fetchRepaymentDeleteAll,
  fetchGetLoanType,
} from '../services/report';

export default {
  namespace: 'report',

  state: {
    employeeGroupId: [],
    employeeId: [],
    taskReportData: {
      loadingTaskReport: false,
    },
    taskFileList: {
      isFetching: false,
    },
    taskVisible: false,
    taskExportLoading: false,
    loanApplySearchLoading: false,
    loanApplySearchList: {},
    loanApplyShowModal: true,
    loanApplyExportStatus: false,
    loanApplyDownloadList: {},
    loanApplyDownloadStatus: false,
    loanTypeList: [],
    repaySearchList: {},
    repaySearchLoading: false,
    repaymentExportStatus: false,
    repaymentDownloadList: {},
    repaymentDownloadStatus: false,
  },

  effects: {
    * getEmployeeGroupId({ payload }, { put, call }) {
      try {
        const groupId = yield call(getEmployeeGroupId);
        yield put({ type: 'getEmployeeGroupIdSucceed', payload: groupId });
      } catch (e) {
        console.error(e);
      }
    },
    * getEmployeeId({ payload }, { call, put }) {
      try {
        const employeeId = yield call(fetchGetEmployeeId, payload);
        yield put({ type: 'getEmployeeIdSucceed', payload: employeeId });
      } catch (e) {
        console.error(e);
      }
    },
    * taskReportSubmit({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeTaskReportSubmit' });
        const data = yield call(taskReportSubmit, payload);
        yield put({ type: 'taskReportSubmitSucceed', payload: data });
      } catch (e) {
        yield put({ type: 'taskReportSubmitFaild' });
        console.error(e);
      }
    },
    * exportReportList({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeExportReportList' });
        yield call(exportReportList, payload);
        yield put({ type: 'exportReportListSucceed' });
      } catch (e) {
        yield put({ type: 'exportReportListFaild' });
        console.error(e);
      }
    },
    * downloadReportList({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeDownloadReportList' });
        const data = yield call(downloadReportList);
        yield put({ type: 'downloadReportListSucceed', payload: data });
      } catch (e) {
        console.error(e);
      }
    },
    * deleteFile({ payload }, { put, call }) {
      try {
        yield call(deleteFile, payload);
        const data = yield call(downloadReportList);
        yield put({ type: 'downloadReportListSucceed', payload: data });
      } catch (e) {
        console.error(e);
      }
    },
    * deleteAll({ payload }, { put, call }) {
      try {
        yield call(deleteAll);
        const data = yield call(downloadReportList);
        yield put({ type: 'downloadReportListSucceed', payload: data });
      } catch (e) {
        console.error(e);
      }
    },
    * loanApplySearch({ payload }, { call, put }) {
      try {
        yield put({ type: 'loanApplySearchLoading' });
        const loanApplySearchList = yield call(fetchLoanApplySearch, payload);
        yield put({ type: 'loanApplySearchSucceed', payload: loanApplySearchList });
      } catch (e) {
        console.error(e);
        yield put({ type: 'loanApplySearchFailed' });
      }
    },
    * loanApplyExport({ payload }, { call, put }) {
      try {
        yield put({ type: 'loanApplyExportHold' });
        const loanApplyExportList = yield call(fetchLoanApplyExport, payload);
        yield put({ type: 'loanApplyExportSucceed', payload: loanApplyExportList });
      } catch (e) {
        console.error(e);
      }
    },
    * loanApplyExportDownloadList({ payload }, { call, put }) {
      try {
        const loanApplyExportDownloadList = yield call(fetchExportDownloadList, payload);
        yield put({ type: 'loanApplyExportDownloadListSucceed', payload: loanApplyExportDownloadList });
      } catch (e) {
        console.error(e);
      }
    },
    * loanApplyDelete({ payload }, { call, put }) {
      try {
        yield call(fetchExportDelete, payload);
        const loanApplyExportDownloadList = yield call(fetchExportDownloadList, payload);
        yield put({ type: 'loanApplyExportDownloadListSucceed', payload: loanApplyExportDownloadList });
      } catch (e) {
        console.error(e);
      }
    },
    * loanApplyDeleteAll({ payload }, { call, put }) {
      try {
        const loanApplyExportDownloadList = yield call(fetchDeleteAll);
        yield put({ type: 'loanApplyDeleteAllSucceed', payload: loanApplyExportDownloadList });
      } catch (e) {
        console.error(e);
      }
    },
    * getLoanType({ payload }, { call, put }) {
      try {
        const loanTypeList = yield call(fetchGetLoanType);
        yield put({ type: 'getLoanTypeSucceed', payload: loanTypeList });
      } catch (e) {
        console.error(e);
      }
    },
    * repaySearch({ payload }, { call, put }) {
      try {
        yield put({ type: 'repaySearchLoading' });
        const repaySearchList = yield call(fetchRepaymentSearch, payload);
        yield put({ type: 'repaySearchSucceed', payload: repaySearchList });
      } catch (e) {
        console.error(e);
        yield put({ type: 'repaySearchFailed' });
      }
    },
    * repaymentExport({ payload }, { call, put }) {
      try {
        yield put({ type: 'repaymentExportHold' });
        const repaymentExportList = yield call(fetchRepaymentExport, payload);
        yield put({ type: 'repaymentExportSucceed', payload: repaymentExportList });
      } catch (e) {
        console.error(e);
      }
    },
    * getRepaymentDownloadList({ payload }, { call, put }) {
      try {
        const repaymentDownloadList = yield call(fetchRepaymentDownloadList, payload);
        yield put({ type: 'repaymentDownloadListSucceed', payload: repaymentDownloadList });
      } catch (e) {
        console.error(e);
      }
    },
    * repaymentDelete({ payload }, { call, put }) {
      try {
        yield call(fetchRepaymentDelete, payload);
        const repaymentDownloadList = yield call(fetchRepaymentDownloadList, payload);
        yield put({ type: 'repaymentDownloadListSucceed', payload: repaymentDownloadList });
      } catch (e) {
        console.error(e);
      }
    },
    * repaymentDeleteAll({ payload }, { call, put }) {
      try {
        const repaymentExportDownloadList = yield call(fetchRepaymentDeleteAll);
        yield put({ type: 'repaymentDeleteAllSucceed', payload: repaymentExportDownloadList });
      } catch (e) {
        console.error(e);
      }
    },
  },

  reducers: {
    getEmployeeGroupIdSucceed(state, { payload }) {
      return {
        ...state,
        employeeGroupId: payload || [],
      };
    },
    getEmployeeIdSucceed(state, { payload }) {
      return { ...state, employeeId: payload || [] };
    },
    beforeTaskReportSubmit(state) {
      return {
        ...state,
        taskReportData: {
          ...state.taskReportData,
          loadingTaskReport: true,
        },
      };
    },
    taskReportSubmitSucceed(state, { payload }) {
      return {
        ...state,
        taskReportData: {
          ...payload,
          loadingTaskReport: false,
        },
      };
    },
    taskReportSubmitFaild(state) {
      return {
        ...state,
        taskReportData: {
          ...state.taskReportData,
          loadingTaskReport: false,
        },
      };
    },
    beforeExportReportList(state) {
      return {
        ...state,
        taskExportLoading: true,
      };
    },
    exportReportListSucceed(state) {
      return {
        ...state,
        taskExportLoading: false,
      };
    },
    exportReportListFaild(state) {
      return {
        ...state,
        taskExportLoading: false,
      };
    },
    beforeDownloadReportList(state) {
      return {
        ...state,
        taskVisible: true,
        taskFileList: {
          isFetching: true,
        },
      };
    },
    downloadReportListSucceed(state, { payload }) {
      return {
        ...state,
        taskFileList: {
          ...payload,
          isFetching: false,
        },
      };
    },
    downloadReportListFaild(state) {
      return {
        ...state,
        taskFileList: {
          ...state.taskFileList,
          isFetching: false,
        },
      };
    },
    closeModal(state) {
      return {
        ...state,
        taskVisible: false,
      };
    },
    clearTaskReportData(state) {
      return {
        ...state,
        taskReportData: {},
      };
    },
    closeLoanapplyModal(state) {
      return {
        ...state,
        loanApplyDownloadStatus: false,
      };
    },
    loanApplySearchLoading(state) {
      return { ...state, loanApplySearchLoading: true };
    },
    loanApplySearchSucceed(state, { payload }) {
      return { ...state, loanApplySearchList: payload || {}, loanApplySearchLoading: false };
    },
    loanApplySearchFailed(state) {
      return { ...state, loanApplySearchLoading: false };
    },
    loanApplyExportHold(state) {
      return { ...state, loanApplyExportStatus: true };
    },
    loanApplyExportSucceed(state) {
      return { ...state, loanApplyExportStatus: false };
    },
    loanApplyExportDownloadListSucceed(state, { payload }) {
      return { ...state, loanApplyDownloadList: payload || {}, loanApplyDownloadStatus: true };
    },
    loanApplyDeleteAllSucceed(state) {
      return { ...state, loanApplyDownloadList: {} };
    },
    loanApplyReset(state) {
      return { ...state, loanApplySearchList: {} };
    },
    repayResetSucceed(state) {
      return { ...state, repaySearchList: {} };
    },
    clearEmployeeId(state) {
      return { ...state, employeeId: [] };
    },
    getLoanTypeSucceed(state, { payload }) {
      return { ...state, loanTypeList: payload || [] };
    },
    repaySearchLoading(state) {
      return { ...state, repaySearchLoading: true };
    },
    repaySearchSucceed(state, { payload }) {
      return { ...state, repaySearchList: payload || {}, repaySearchLoading: false };
    },
    repaySearchFailed(state) {
      return { ...state, repaySearchLoading: false };
    },
    repaymentExportHold(state) {
      return { ...state, repaymentExportStatus: true };
    },
    repaymentExportSucceed(state) {
      return { ...state, repaymentExportStatus: false };
    },
    repaymentDownloadListSucceed(state, { payload }) {
      return { ...state, repaymentDownloadList: payload || {}, repaymentDownloadStatus: true };
    },
    repaymentDeleteAllSucceed(state) {
      return { ...state, repaymentDownloadList: {} };
    },
    repaymentReset(state) {
      return { ...state, repaySearchList: {} };
    },
    closeRepaymentModal(state) {
      return { ...state, repaymentDownloadStatus: false };
    },
  },
};
