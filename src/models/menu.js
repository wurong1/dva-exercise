import { getMenuList } from '../services/menu';

export default {
  namespace: 'menuList',

  state: [],

  effects: {
    * getMenuList({ payload }, { put, call }) {
      try {
        const list = yield call(getMenuList);
        yield put({ type: 'getMenuListSucceed', payload: list });
      } catch (e) {
        console.error(e);
      }
    },
  },

  reducers: {
    getMenuListSucceed(state, { payload }) {
      return payload;
    },
  },
};
