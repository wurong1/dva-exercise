import { fetchGetUploadFialedList, fetchFindUploadFailedList } from '../../services/customer';

export default {
  namespace: 'uploadFailed',

  state: {
    uploadFailedList: [],
  },

  effects: {
    * findUploadFailedList({ payload }, { call, put }) {
      try {
        const uploadFailedList = yield call(fetchFindUploadFailedList, payload);
        yield put({ type: 'findUploadFailedListSucceed', payload: uploadFailedList });
      } catch (e) {
        console.error(e);
      }
    },
    * getUploadFialedList({ payload }, { call, put }) {
      try {
        const uploadFailedList = yield call(fetchGetUploadFialedList, payload);
        yield put({ type: 'getUploadFialedListSucceed', payload: uploadFailedList });
      } catch (e) {
        console.error(e);
      }
    },
  },

  reducers: {
    findUploadFailedListSucceed(state, { payload }) {
      return { ...state, uploadFailedList: payload };
    },
    getUploadFialedListSucceed(state, { payload }) {
      return { ...state, uploadFailedList: payload };
    },
  },
};
