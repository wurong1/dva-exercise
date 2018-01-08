import { message } from 'antd';
import {
  fetchGetProjectList,
  fetchDeleteProject,
  fetchEditProject,
  fetchAddProject,
  fetchGetProjectType,
 } from '../../services/cms';

message.config({
  top: 100,
});

export default {
  namespace: 'projectManage',

  state: {
    projectList: [],
    searchLoading: false,
    projectParams: {},
    isEditModalShow: false,
    isAddModalShow: false,
    getProjectType: [],
  },

  effects: {
    * getProjectList({ payload }, { call, put }) {
      try {
        yield put({ type: 'getProjectListStart' });
        const projectList = yield call(fetchGetProjectList, payload);
        yield put({ type: 'getProjectListSucceed', payload: projectList });
        yield put({ type: 'setProjectParams', payload });
      } catch (e) {
        console.error(e);
        yield put({ type: 'getProjectListFailed' });
      }
    },
    * getProjectType({ payload }, { call, put }) {
      try {
        const projectType = yield call(fetchGetProjectType, payload);
        yield put({ type: 'getProjectTypeSucceed', payload: projectType });
      } catch (e) {
        console.error(e);
      }
    },
    * editProject({ payload }, { call, put, select }) {
      try {
        const editProject = yield call(fetchEditProject, payload);
        yield put({ type: 'editProjectSucceed', payload: editProject });
        yield put({ type: 'closeEditModal' });
        const projectParams = yield select(state => state.projectManage.projectParams);
        yield put({ type: 'getProjectList', payload: projectParams });
      } catch (e) {
        console.error(e);
      }
    },
    * addProject({ payload }, { call, put, select }) {
      try {
        const addProject = yield call(fetchAddProject, payload);
        yield put({ type: 'addProjectSucceed', payload: addProject });
        yield put({ type: 'closeAddModal' });
        const projectParams = yield select(state => state.projectManage.projectParams);
        yield put({ type: 'getProjectList', payload: projectParams });
      } catch (e) {
        console.error(e);
      }
    },
    * deleteProject({ payload }, { call, put, select }) {
      try {
        const deleteProject = yield call(fetchDeleteProject, payload);
        yield put({ type: 'deleteProjectSucceed', payload: deleteProject });
        const projectParams = yield select(state => state.projectManage.projectParams);
        yield put({ type: 'getProjectList', payload: projectParams });
      } catch (e) {
        console.error(e);
      }
    },
  },

  reducers: {
    getProjectListStart(state) {
      return { ...state, searchLoading: true };
    },
    getProjectListSucceed(state, { payload }) {
      return { ...state, projectList: payload || [], searchLoading: false };
    },
    getProjectListFailed(state) {
      return { ...state, searchLoading: false };
    },
    setProjectParams(state, { payload }) {
      return { ...state, projectParams: payload || {} };
    },
    editProjectSucceed(state) {
      return { ...state };
    },
    addProjectSucceed(state) {
      return { ...state };
    },
    deleteProjectSucceed(state) {
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
    getProjectTypeSucceed(state, { payload }) {
      return { ...state, projectType: payload || [] };
    },
    resetProjectType(state) {
      return { ...state, projectType: [] };
    },
  },
};
