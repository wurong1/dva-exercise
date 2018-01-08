import { fetchMyRecordSearch } from '../../services/tapeRecord';

export default {
  namespace: 'myTapeRecord',

  state: {
    tapeRecordList: {},
    searchLoading: false,
  },

  effects: {
    * searchTapeRecord({ payload }, { call, put }) {
      try {
        yield put({ type: 'searchTapeRecordStart' });
        const search = yield call(fetchMyRecordSearch, payload);
        yield put({ type: 'searchTapeRecordSuccessed', payload: search });
      } catch (e) {
        console.error(e);
        yield put({ type: 'searchTapeRecordFailed' });
      }
    },
  },

  reducers: {
    searchTapeRecordStart(state) {
      return { ...state, searchLoading: true };
    },
    searchTapeRecordSuccessed(state, { payload }) {
      return { ...state, tapeRecordList: payload || {}, searchLoading: false };
    },
    searchTapeRecordFailed(state) {
      return { ...state, searchLoading: false };
    },
    resetTapeRecord(state) {
      return {
        ...state,
        tapeRecordList: {},
      };
    },
  },
};
