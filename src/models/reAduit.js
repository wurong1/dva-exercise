import { message } from 'antd';
import {
  fetchAuditSearch,
  fetchAuditResult,
  fetchAuditDetails,
  fetchConfig,
  fetchBaseInfo,
  fetchLoanAuditResult,
  fetchGetEmployeeGroupId,
  fetchGetEmployeeId,
  fetchGetActorBaseInfo,
  getOriginPhone,
 } from '../services/reAudit';

message.config({
  top: 100,
});

export default {
  namespace: 'reAudit',

  state: {
    waitAuditList: {},
    endAuditList: {},
    auditDetailsList: {},
    configList: {},
    baseInfoList: {},
    LoanAuditResultList: {},
    employeeGroupId: [],
    actorBaseInfo: null,
    originPhoneNo: '',
  },

  effects: {
    * auditResult({ payload }, { call, put }) {
      try {
        yield call(fetchAuditResult, payload);
        const auditDetailsList = yield call(fetchAuditDetails, payload);
        yield put({ type: 'auditDetailsSucceed', payload: auditDetailsList });
        const LoanAuditResultList = yield call(fetchLoanAuditResult, payload);
        yield put({ type: 'getLoanAuditResultSucceed', payload: LoanAuditResultList });
        message.success('操作成功', 2);
      } catch (e) {
        console.error(e);
      }
    },
    * auditDetails({ payload }, { call, put }) {
      try {
        const auditDetailsList = yield call(fetchAuditDetails, payload);
        yield put({ type: 'auditDetailsSucceed', payload: auditDetailsList });
      } catch (e) {
        console.error(e);
      }
    },
    * getEmployeeGroupId({ payload }, { call, put }) {
      try {
        const employeeGroupId = yield call(fetchGetEmployeeGroupId);
        yield put({ type: 'getEmployeeGroupIdSucceed', payload: employeeGroupId });
      } catch (e) {
        console.error(e);
      }
    },
    * getActorBaseInfo({ payload }, { call, put }) {
      try {
        const actorBaseInfo = yield call(fetchGetActorBaseInfo, payload);
        yield put({ type: 'getActorBaseInfoSucceed', payload: actorBaseInfo });
      } catch (e) {
        console.error(e);
      }
    },
    * getConfig({ payload }, { call, put }) {
      try {
        const configList = yield call(fetchConfig, payload);
        yield put({ type: 'getConfigSucceed', payload: configList || {} });
        const LoanAuditResultList = yield call(fetchLoanAuditResult, configList);
        yield put({ type: 'getLoanAuditResultSucceed', payload: LoanAuditResultList });
      } catch (e) {
        console.error(e);
      }
    },
    * getLoanAuditResult({ payload }, { call, put }) {
      try {
        const LoanAuditResultList = yield call(fetchLoanAuditResult, payload);
        yield put({ type: 'getLoanAuditResultSucceed', payload: LoanAuditResultList });
      } catch (e) {
        console.error(e);
      }
    },
    * getBaseInfo({ payload }, { call, put }) {
      try {
        const baseInfoList = yield call(fetchBaseInfo, payload);
        yield put({ type: 'getBaseInfoSucceed', payload: baseInfoList });
      } catch (e) {
        console.error(e);
      }
    },
    * searchWaitAuditList({ payload }, { call, put }) {
      try {
        const waitAuditList = yield call(fetchAuditSearch, payload);
        yield put({ type: 'searchWaitAuditListSucceed', payload: waitAuditList });
      } catch (e) {
        console.error(e);
      }
    },
    * searchEndAuditList({ payload }, { call, put }) {
      try {
        const endAuditList = yield call(fetchAuditSearch, payload);
        yield put({ type: 'searchEndAuditListSucceed', payload: endAuditList });
      } catch (e) {
        console.error(e);
      }
    },
    * getOriginPhone({ payload }, { call, put }) {
      try {
        const data = yield call(getOriginPhone, payload);
        yield put({ type: 'getOriginPhoneSucceed', payload: data });
      } catch (e) {
        console.error(e);
      }
    },
  },

  reducers: {
    auditDetailsSucceed(state, { payload }) {
      return { ...state, auditDetailsList: payload || {} };
    },
    getActorBaseInfoSucceed(state, { payload }) {
      return { ...state, actorBaseInfo: payload || {} };
    },
    getEmployeeGroupIdSucceed(state, { payload }) {
      return { ...state, employeeGroupId: payload || [] };
    },
    getConfigSucceed(state, { payload }) {
      return { ...state, configList: payload };
    },
    getBaseInfoSucceed(state, { payload }) {
      return { ...state, baseInfoList: payload || {} };
    },
    getLoanAuditResultSucceed(state, { payload }) {
      return { ...state, LoanAuditResultList: payload || {} };
    },
    searchWaitAuditListSucceed(state, { payload }) {
      return { ...state, waitAuditList: payload || {} };
    },
    searchEndAuditListSucceed(state, { payload }) {
      return { ...state, endAuditList: payload || {} };
    },
    getOriginPhoneSucceed(state, { payload }) {
      return { ...state, originPhoneNo: payload || '' };
    },
  },
};
