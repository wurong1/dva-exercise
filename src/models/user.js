import $ from 'jquery';
import { getUserInfo, getAgentConf, getAgentInfo, setExtNo, unBindAgent, createAgent } from '../services/user';

export default {
  namespace: 'user',

  state: {
    loginState: false,
    userInfo: {
      isfetching: true,
    },
    visible: false,
    callVendor: {},
    agentInfo: {
      isfetching: true,
    },
  },

  effects: {
    * getLoginInfo({ payload }, { put, call }) {
      try {
        const userInfo = yield call(getUserInfo);
        yield put({ type: 'getLoginInfoSucceed', payload: userInfo });
      } catch (e) {
        yield put({ type: 'getLoginInfoFaild' });
        console.error(e);
      }
    },
    * getAgentConf({ payload }, { put, call }) {
      try {
        const callVendor = yield call(getAgentConf);
        yield put({ type: 'getAgentConfSucceed', payload: callVendor });
      } catch (e) {
        console.error(e);
      }
    },
    * getAgentInfo({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforGetAgentInfo' });
        const agentInfo = yield call(getAgentInfo, payload);
        yield put({ type: 'getAgentInfoSucceed', payload: agentInfo });
      } catch (e) {
        yield put({ type: 'getAgentInfoFaild' });
        console.error(e);
      }
    },
    * setExtNo({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeSetExtNo' });
        const agentInfo = yield call(setExtNo, payload);
        const { vendorType, ipUrl, extensionNo } = agentInfo;
        if (vendorType === 'COCC') {
          $.getJSON(`${ipUrl}/setevent/setdeviceCJI?callback=?`, {
            orgidentity: agentInfo.orgidentity,
            exten: agentInfo.extensionNo || '未绑定',
            user: agentInfo.agentId,
            pwdtype: 'md5',
            password: agentInfo.agentPwdMd5 },
            () => {
            });
        }
        yield put({ type: 'setExtNoSucceed', payload: extensionNo });
      } catch (e) {
        yield put({ type: 'setExtNoFaild' });
        console.error(e);
      }
    },
    * unBindAgent({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforeUnBindAgent' });
        yield call(unBindAgent, payload);
        yield put({ type: 'unBindAgentSucceed' });
      } catch (e) {
        yield put({ type: 'unBindAgentFaild' });
        console.error(e);
      }
    },
    * createAgent({ payload }, { put, call }) {
      try {
        yield put({ type: 'beforCreateAgent' });
        const agentInfo = yield call(createAgent, payload);
        const { vendorType, ipUrl, extensionNo } = agentInfo;
        if (vendorType === 'COCC') {
          $.getJSON(`${ipUrl}/setevent/setdeviceCJI?callback=?`, {
            orgidentity: agentInfo.orgidentity,
            exten: agentInfo.extensionNo || '未绑定',
            user: agentInfo.agentId,
            pwdtype: 'md5',
            password: agentInfo.agentPwdMd5 },
            () => {
            });
        }
        yield put({ type: 'createAgentSucceed', payload: extensionNo });
      } catch (e) {
        yield put({ type: 'createAgentFaild' });
        console.error(e);
      }
    },
  },

  reducers: {
    getLoginInfoSucceed(state, { payload }) {
      return {
        ...state,
        loginState: !!payload,
        userInfo: {
          isfetching: false,
          ...payload,
        },
      };
    },
    getLoginInfoFaild(state) {
      return {
        ...state,
        loginState: true,
        userInfo: {
          isfetching: false,
        },
      };
    },
    getAgentConfSucceed(state, { payload }) {
      return {
        ...state,
        callVendor: payload,
      };
    },
    beforGetAgentInfo(state) {
      return {
        ...state,
        agentInfo: {
          isfetching: true,
        },
        visible: true,
      };
    },
    getAgentInfoSucceed(state, { payload }) {
      return {
        ...state,
        agentInfo: {
          ...payload,
          isfetching: false,
        },
      };
    },
    getAgentInfoFaild(state) {
      return {
        ...state,
        agentInfo: {
          isfetching: false,
        },
      };
    },
    beforeSetExtNo(state) {
      return {
        ...state,
        agentInfo: {
          ...state.agentInfo,
          isfetching: true,
        },
      };
    },
    setExtNoSucceed(state, { payload }) {
      return {
        ...state,
        agentInfo: {
          ...state.agentInfo,
          isfetching: false,
        },
        callVendor: {
          ...state.callVendor,
          extNo: payload,
        },
        visible: false,
      };
    },
    setExtNoFaild(state) {
      return {
        ...state,
        agentInfo: {
          ...state.agentInfo,
          isfetching: false,
        },
      };
    },
    beforeUnBindAgent(state) {
      return {
        ...state,
        agentInfo: {
          ...state.agentInfo,
          isfetching: true,
        },
      };
    },
    unBindAgentSucceed(state) {
      return {
        ...state,
        agentInfo: {
          ...state.agentInfo,
          isfetching: false,
        },
        callVendor: {
          ...state.callVendor,
          extNo: null,
        },
        visible: false,
      };
    },
    unBindAgentFaild(state) {
      return {
        ...state,
        agentInfo: {
          ...state.agentInfo,
          isfetching: false,
        },
      };
    },
    beforCreateAgent(state) {
      return {
        ...state,
        agentInfo: {
          ...state.agentInfo,
          isfetching: true,
        },
      };
    },
    createAgentSucceed(state, { payload }) {
      return {
        ...state,
        agentInfo: {
          ...state.agentInfo,
          isfetching: false,
        },
        callVendor: {
          ...state.callVendor,
          extNo: payload,
        },
        visible: false,
      };
    },
    createAgentFaild(state) {
      return {
        ...state,
        agentInfo: {
          ...state.agentInfo,
          isfetching: false,
        },
      };
    },
    onModalCancel(state) {
      return {
        ...state,
        visible: false,
      };
    },
  },
};
