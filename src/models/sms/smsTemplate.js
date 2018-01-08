import {
  getTemplateList,
  getSteps,
  getScopes,
  getEnablestatus,
  getPrivilege,
  getTemplateFields, // 获取模板中的表单域
  getLiteralList, // 得到全部模板常量字面量列表
  createTemplate,
  getDetail, // 获取模板详细
  editTemplate,
} from '../../services/sms';

export default {
  namespace: 'smsTemplate',
  state: {
    loading: false,
    dataSource: {},
    formData: {},
    stepList: [],
    scopeList: [],
    statusList: [],
    loadingSteps: false,
    loadingScopes: false,
    loadingStatus: false,
    hasPrivilege: false,
    templateFields: {
      loading: false,
      visible: false,
      editVisible: false,
      editLoading: false,
      channels: [],
      enableStatus: [],
      scopes: [],
      steps: [],
      literalList: [],
      detail: {
        scopes: [],
        steps: [],
      },
    },
    templateDetail: { // 模板详情页面
      scopes: [],
      steps: [],
      loading: false,
    },
  },

  effects: {
    * getTemplateList({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingTemplate' });
        const data = yield call(getTemplateList, payload);
        yield put({ type: 'getTemplateListSuccess', payload: data || {} });
        yield put({ type: 'setFormData', payload });
      } catch (e) {
        yield put({ type: 'getTemplateListFaild' });
        console.error(e);
      }
    },
    * getSteps({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingSteps' });
        const list = yield call(getSteps);
        yield put({ type: 'getStepsSuccess', payload: list });
      } catch (e) {
        yield put({ type: 'getStepsFaild' });
        console.error(e);
      }
    },
    * getScopes({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingScopes' });
        const list = yield call(getScopes);
        yield put({ type: 'getScopesSuccess', payload: list });
      } catch (e) {
        yield put({ type: 'getScopesFaild' });
        console.error(e);
      }
    },
    * getEnablestatus({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingStatus' });
        const list = yield call(getEnablestatus);
        yield put({ type: 'getStatusSuccess', payload: list });
      } catch (e) {
        yield put({ type: 'getStatusFaild' });
        console.error(e);
      }
    },
    * getPrivilege({ payload }, { put, call }) {
      try {
        const data = yield call(getPrivilege);
        yield put({ type: 'getPrivilegeSuccess', payload: data });
      } catch (e) {
        console.error(e);
      }
    },
    * getTemplateFields({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingModal' });
        const data = yield call(getTemplateFields);
        const literalList = yield call(getLiteralList);
        yield put({ type: 'getFieldListSuccess', payload: { data, literalList } });
      } catch (e) {
        yield put({ type: 'loadingModalFaild' });
        console.error(e);
      }
    },
    * createTemplate({ payload }, { put, call, select }) {
      try {
        yield put({ type: 'loadingModal' });
        yield call(createTemplate, payload);
        yield put({ type: 'createTemplatetSuccess' });
        const formData = yield select(state => state.smsTemplate.formData);
        yield put({ type: 'getTemplateList', payload: { ...formData, pageNo: 1, pageSize: 50 } });
      } catch (e) {
        yield put({ type: 'loadingModalFaild' });
        console.error(e);
      }
    },
    * editTemplate({ payload }, { put, call, select }) {
      try {
        yield put({ type: 'loadingEditModal' });
        yield call(editTemplate, payload);
        yield put({ type: 'editTemplateSuccess' });
        const formData = yield select(state => state.smsTemplate.formData);
        yield put({ type: 'getTemplateList', payload: formData });
      } catch (e) {
        yield put({ type: 'loadingEditModalFaild' });
        console.error(e);
      }
    },
    * getEditFields({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingEditModal' });
        const data = yield call(getTemplateFields);
        const literalList = yield call(getLiteralList);
        yield put({ type: 'getEditListSuccess', payload: { data, literalList } });
        const detail = yield call(getDetail, payload);
        yield put({ type: 'getEditDetailSuccess', payload: detail });
      } catch (e) {
        yield put({ type: 'loadingEditModalFaild' });
        console.error(e);
      }
    },
    * getTemplateDetail({ payload }, { put, call }) {
      try {
        yield put({ type: 'loadingTempDetail' });
        const detail = yield call(getDetail, payload);
        yield put({ type: 'getTemplateDetailSuccess', payload: detail });
      } catch (e) {
        yield put({ type: 'loadingTempDetailFaild' });
        console.error(e);
      }
    },
  },

  reducers: {
    loadingTemplate(state) {
      return {
        ...state,
        loading: true,
      };
    },
    getTemplateListSuccess(state, { payload }) {
      return {
        ...state,
        loading: false,
        dataSource: payload,
      };
    },
    getTemplateListFaild(state) {
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
    loadingSteps(state) {
      return {
        ...state,
        loadingSteps: true,
      };
    },
    getStepsSuccess(state, { payload }) {
      return {
        ...state,
        stepList: payload || [],
        loadingSteps: false,
      };
    },
    getStepsFaild(state) {
      return {
        ...state,
        loadingSteps: false,
      };
    },
    loadingScopes(state) {
      return {
        ...state,
        loadingScopes: true,
      };
    },
    getScopesSuccess(state, { payload }) {
      return {
        ...state,
        scopeList: payload || [],
        loadingScopes: false,
      };
    },
    getScopesFaild(state) {
      return {
        ...state,
        loadingScopes: false,
      };
    },
    loadingStatus(state) {
      return {
        ...state,
        loadingStatus: true,
      };
    },
    getStatusSuccess(state, { payload }) {
      return {
        ...state,
        statusList: payload || [],
        loadingStatus: false,
      };
    },
    getStatusFaild(state) {
      return {
        ...state,
        loadingStatus: false,
      };
    },
    clearRecord(state) {
      return {
        ...state,
        dataSource: {},
        formData: {},
      };
    },
    getPrivilegeSuccess(state, { payload }) {
      return {
        ...state,
        hasPrivilege: payload,
      };
    },
    loadingModal(state) {
      return {
        ...state,
        templateFields: {
          ...state.templateFields,
          loading: true,
          visible: true,
        },
      };
    },
    loadingEditModal(state) {
      return {
        ...state,
        templateFields: {
          ...state.templateFields,
          editLoading: true,
          editVisible: true,
        },
      };
    },
    getFieldListSuccess(state, { payload }) {
      return {
        ...state,
        templateFields: {
          ...state.templateFields,
          channels: payload.data.channels || [],
          enableStatus: payload.data.enableStatus || [],
          scopes: payload.data.scopes || [],
          steps: payload.data.steps || [],
          literalList: payload.literalList,
          loading: false,
        },
      };
    },
    getEditListSuccess(state, { payload }) {
      return {
        ...state,
        templateFields: {
          ...state.templateFields,
          channels: payload.data.channels || [],
          enableStatus: payload.data.enableStatus || [],
          scopes: payload.data.scopes || [],
          steps: payload.data.steps || [],
          literalList: payload.literalList,
        },
      };
    },
    getEditDetailSuccess(state, { payload }) {
      return {
        ...state,
        templateFields: {
          ...state.templateFields,
          detail: {
            ...payload,
            scopes: payload.scopes || [],
            steps: payload.steps || [],
          },
          editLoading: false,
          editVisible: true,
        },
      };
    },
    loadingModalFaild(state) {
      return {
        ...state,
        templateFields: {
          ...state.templateFields,
          loading: false,
        },
      };
    },
    loadingEditModalFaild(state) {
      return {
        ...state,
        templateFields: {
          ...state.templateFields,
          editLoading: false,
        },
      };
    },
    createTemplatetSuccess(state) {
      return {
        ...state,
        templateFields: {
          ...state.templateFields,
          loading: false,
          visible: false,
        },
      };
    },
    editTemplateSuccess(state) {
      return {
        ...state,
        templateFields: {
          ...state.templateFields,
          editLoading: false,
          editVisible: false,
          detail: {
            scopes: [],
            steps: [],
          },
        },
      };
    },
    onCancel(state) {
      return {
        ...state,
        templateFields: {
          ...state.templateFields,
          loading: false,
          visible: false,
        },
      };
    },
    cancelEdit(state) {
      return {
        ...state,
        templateFields: {
          ...state.templateFields,
          editLoading: false,
          editVisible: false,
          detail: {
            scopes: [],
            steps: [],
          },
        },
      };
    },
    loadingTempDetail(state) {
      return {
        ...state,
        templateDetail: {
          ...state.templateDetail,
          loading: true,
        },
      };
    },
    getTemplateDetailSuccess(state, { payload }) {
      return {
        ...state,
        templateDetail: {
          ...state.templateDetail,
          ...payload,
          scopes: payload.scopes || [],
          steps: payload.steps || [],
          loading: false,
        },
      };
    },
    loadingTempDetailFaild(state) {
      return {
        ...state,
        templateDetail: {
          ...state.templateDetail,
          loading: false,
        },
      };
    },
  },
};

