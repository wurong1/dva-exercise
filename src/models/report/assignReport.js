
import {
  getEmployeeGroupId,
  getAssignRecords,
  exportAssignReportList,
  downloadAssignReportList,
  deleteAll,
  deleteFile,
} from '../../services/report';

export default {
  namespace: 'assignReport',

  state: {
    employeeGroups: [],
    formData: {},
    dataSource: {},
    loadingGroups: false,
    loading: false,
    btnLoading: false,
    modalLading: false,
    visible: false,
    fileList: {},
  },

  effects: {
    * getEmployeeGroupId({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeGetEmployeeGroupId' });
        const groupId = yield call(getEmployeeGroupId);
        yield put({ type: 'getEmployeeGroupIdSucceed', payload: groupId });
      } catch (e) {
        yield put({ type: 'getEmployeeGroupIdFaield' });
        console.error(e);
      }
    },
    * getRecords({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeGetRecords' });
        const data = yield call(getAssignRecords, payload);
        yield put({ type: 'getRecordsSucceed', payload: data });
        yield put({ type: 'setFormData', payload });
      } catch (e) {
        yield put({ type: 'getRecordsFaield' });
        console.error(e);
      }
    },
    * exportReportList({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeExportReportList' });
        yield call(exportAssignReportList, payload);
        yield put({ type: 'exportReportListSucceed' });
      } catch (e) {
        yield put({ type: 'exportReportListFaield' });
        console.error(e);
      }
    },
    * downloadReportList({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeDownloadReportList' });
        const data = yield call(downloadAssignReportList);
        yield put({ type: 'downloadReportListSucceed', payload: data || {} });
      } catch (e) {
        yield put({ type: 'downloadReportListFaild' });
        console.error(e);
      }
    },
    * deleteFile({ payload }, { put, call }) {
      try {
        yield call(deleteFile, payload);
        yield put({ type: 'downloadReportList' });
      } catch (e) {
        console.error(e);
      }
    },
    * deleteAll({ payload }, { put, call }) {
      try {
        yield call(deleteAll);
        yield put({ type: 'downloadReportList' });
      } catch (e) {
        console.error(e);
      }
    },
  },

  reducers: {
    beforeGetEmployeeGroupId(state) {
      return {
        ...state,
        loadingGroups: true,
      };
    },
    getEmployeeGroupIdSucceed(state, { payload }) {
      return {
        ...state,
        employeeGroups: payload || [],
        loadingGroups: false,
      };
    },
    getEmployeeGroupIdFaield(state) {
      return {
        ...state,
        loadingGroups: false,
      };
    },
    beforeGetRecords(state) {
      return {
        ...state,
        loading: true,
      };
    },
    getRecordsSucceed(state, { payload }) {
      return {
        ...state,
        dataSource: payload,
        loading: false,
      };
    },
    getRecordsFaield(state) {
      return {
        ...state,
        loading: false,
      };
    },
    setFormData(state, { payload }) {
      return {
        ...state,
        formData: payload,
      };
    },
    clearRecord(state) {
      return {
        ...state,
        formData: {},
        dataSource: {},
      };
    },
    beforeExportReportList(state) {
      return {
        ...state,
        btnLoading: true,
      };
    },
    exportReportListSucceed(state) {
      return {
        ...state,
        btnLoading: false,
      };
    },
    exportReportListFaield(state) {
      return {
        ...state,
        btnLoading: false,
      };
    },
    beforeDownloadReportList(state) {
      return {
        ...state,
        visible: true,
        modalLading: true,
      };
    },
    downloadReportListSucceed(state, { payload }) {
      return {
        ...state,
        modalLading: false,
        fileList: {
          ...payload,
        },
      };
    },
    downloadReportListFaild(state) {
      return {
        ...state,
        modalLading: false,
      };
    },
    closeModal(state) {
      return {
        ...state,
        visible: false,
      };
    },
  },
};
