import { message } from 'antd';
import { getArticleDetail, getColumnList, getProjectList, getGroups, addGroup, saveInfo, addArticle } from '../../services/cms';

export default {
  namespace: 'cmsDetail',

  state: {
    loading: false,
    loadingColumn: false,
    loadingProject: false,
    loadingGroups: false,
    loadingModal: false,
    articleDetail: {
      attachments: [],
    },
    columList: [],
    projectList: [],
    groupList: [],
  },

  effects: {
    * getArticleDetail({ payload }, { put, call }) {
      try {
        yield put({ type: 'startLoadingPage' });
        const data = yield call(getArticleDetail, payload);
        const categoryCode = data && data.categoryCode;
        const columList = yield call(getColumnList, categoryCode); // 获取类别下拉列表
        const columnId = data && data.columnId;
        const projectList = yield call(getProjectList, columnId); // 获取项目下拉列表
        yield put({ type: 'getColumnListSucceed', payload: columList || [] });
        yield put({ type: 'getProjectListSucceed', payload: projectList || [] });
        yield put({ type: 'getArticleDetailSucceed', payload: data });
      } catch (e) {
        yield put({ type: 'loadingPageEnd' });
        console.error(e);
      }
    },
    * getColumnList({ payload }, { put, call }) {
      try {
        yield put({ type: 'startLoadingColumn' });
        const columList = yield call(getColumnList, payload); // 获取类别下拉列表
        yield put({ type: 'getColumnListSucceed', payload: columList || [] });
      } catch (e) {
        yield put({ type: 'loadingColumnEnd' });
        console.error(e);
      }
    },
    * getProjectList({ payload }, { put, call }) {
      try {
        yield put({ type: 'startLoadingProject' });
        const projectList = yield call(getProjectList, payload); // 获取项目下拉列表
        yield put({ type: 'getProjectListSucceed', payload: projectList || [] });
      } catch (e) {
        yield put({ type: 'loadingProjectEnd' });
        console.error(e);
      }
    },
    * getGroups({ payload }, { put, call }) {
      try {
        yield put({ type: 'startLoadingGroups' });
        const groups = yield call(getGroups, payload); // 获取部门checkbox
        yield put({ type: 'getGroupsSucceed', payload: groups || [] });
      } catch (e) {
        yield put({ type: 'loadingGroupsEnd' });
        console.error(e);
      }
    },
    * addGroup({ payload }, { put, call }) {
      try {
        yield put({ type: 'startLoadingModal' });
        const groups = yield call(addGroup, payload);
        yield put({ type: 'addGroupsSucceed', payload: groups || [] });
      } catch (e) {
        yield put({ type: 'loadingModalEnd' });
        console.error(e);
      }
    },
    * saveInfo({ payload }, { put, call }) {
      try {
        yield put({ type: 'startLoadingPage' });
        yield call(saveInfo, payload);
        yield put({ type: 'saveInfoSucceed' });
      } catch (e) {
        yield put({ type: 'loadingPageEnd' });
        console.error(e);
      }
    },
    * addArticle({ payload }, { put, call }) {
      try {
        yield put({ type: 'startLoadingPage' });
        yield call(addArticle, payload);
        yield put({ type: 'addArticleSucceed' });
      } catch (e) {
        yield put({ type: 'loadingPageEnd' });
        console.error(e);
      }
    },
  },

  reducers: {
    startLoadingPage(state) {
      return {
        ...state,
        loading: true,
      };
    },
    loadingPageEnd(state) {
      return {
        ...state,
        loading: false,
      };
    },
    getArticleDetailSucceed(state, { payload }) {
      return {
        ...state,
        articleDetail: payload || {},
        loading: false,
      };
    },
    getColumnListSucceed(state, { payload }) {
      return {
        ...state,
        columList: payload,
        loadingColumn: false,
      };
    },
    getProjectListSucceed(state, { payload }) {
      return {
        ...state,
        projectList: payload,
        loadingProject: false,
      };
    },
    startLoadingColumn(state) {
      return {
        ...state,
        loadingColumn: true,
      };
    },
    loadingColumnEnd(state) {
      return {
        ...state,
        loadingColumn: false,
      };
    },
    startLoadingProject(state) {
      return {
        ...state,
        loadingProject: true,
      };
    },
    loadingProjectEnd(state) {
      return {
        ...state,
        loadingProject: false,
      };
    },
    startLoadingGroups(state) {
      return {
        ...state,
        loadingGroups: true,
      };
    },
    getGroupsSucceed(state, { payload }) {
      return {
        ...state,
        groupList: payload,
        loadingGroups: false,
      };
    },
    loadingGroupsEnd(state) {
      return {
        ...state,
        loadingGroups: false,
      };
    },
    startLoadingModal(state) {
      return {
        ...state,
        loadingModal: true,
      };
    },
    addGroupsSucceed(state, { payload }) {
      return {
        ...state,
        groupList: payload,
        loadingModal: false,
      };
    },
    loadingModalEnd(state) {
      return {
        ...state,
        loadingModal: false,
      };
    },
    saveInfoSucceed(state) {
      message.success('保存成功');
      return {
        ...state,
        loading: false,
      };
    },
    addArticleSucceed(state) {
      return {
        ...state,
        loading: false,
      };
    },
    uploadFiles(state, { payload }) {
      return {
        ...state,
        articleDetail: {
          ...state.articleDetail,
          attachments: [...state.articleDetail.attachments, ...payload],
        },
        loading: false,
      };
    },
    deletFile(state, { payload }) {
      return {
        ...state,
        articleDetail: {
          ...state.articleDetail,
          attachments: payload || [],
        },
      };
    },
    setLoadingState(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
  },
};
