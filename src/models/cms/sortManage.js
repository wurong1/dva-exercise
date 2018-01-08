import { message } from 'antd';
import {
  fetchGetSortList,
  fetchDeleteSort,
  fetchEditSort,
  fetchAddSort,
 } from '../../services/cms';

message.config({
  top: 100,
});

export default {
  namespace: 'sortManage',

  state: {
    sortList: [],
    searchLoading: false,
    sortParams: {},
    isEditModalShow: false,
    isAddModalShow: false,
  },

  effects: {
    * getSortList({ payload }, { call, put }) {
      try {
        yield put({ type: 'getSortListStart' });
        const sortList = yield call(fetchGetSortList, payload);
        yield put({ type: 'getSortListSucceed', payload: sortList });
        yield put({ type: 'setSortParams', payload });
      } catch (e) {
        console.error(e);
        yield put({ type: 'getSortListFailed' });
      }
    },
    * editSort({ payload }, { call, put, select }) {
      try {
        const editSort = yield call(fetchEditSort, payload);
        yield put({ type: 'editSortSucceed', payload: editSort });
        yield put({ type: 'closeEditModal' });
        const sortParams = yield select(state => state.sortManage.sortParams);
        yield put({ type: 'getSortList', payload: sortParams });
      } catch (e) {
        console.error(e);
      }
    },
    * addSort({ payload }, { call, put, select }) {
      try {
        const addSort = yield call(fetchAddSort, payload);
        yield put({ type: 'addSortSucceed', payload: addSort });
        yield put({ type: 'closeAddModal' });
        const sortParams = yield select(state => state.sortManage.sortParams);
        yield put({ type: 'getSortList', payload: sortParams });
      } catch (e) {
        console.error(e);
      }
    },
    * deleteSort({ payload }, { call, put, select }) {
      try {
        const deleteSort = yield call(fetchDeleteSort, payload);
        yield put({ type: 'deleteSortSucceed', payload: deleteSort });
        const sortParams = yield select(state => state.sortManage.sortParams);
        yield put({ type: 'getSortList', payload: sortParams });
      } catch (e) {
        console.error(e);
      }
    },
  },

  reducers: {
    getSortListStart(state) {
      return { ...state, searchLoading: true };
    },
    getSortListSucceed(state, { payload }) {
      return { ...state, sortList: payload || [], searchLoading: false };
    },
    getSortListFailed(state) {
      return { ...state, searchLoading: false };
    },
    setSortParams(state, { payload }) {
      return { ...state, sortParams: payload || {} };
    },
    editSortSucceed(state) {
      return { ...state };
    },
    addSortSucceed(state) {
      return { ...state };
    },
    deleteSortSucceed(state) {
      return { ...state };
    },
    openEditModal(state) {
      return { ...state, isEditModalShow: true };
    },
    closeEditModal(state) {
      return { ...state, isEditModalShow: false };
    },
    openAddModal(state) {
      return { ...state, isAddModalShow: true };
    },
    closeAddModal(state) {
      return { ...state, isAddModalShow: false };
    },
  },
};
