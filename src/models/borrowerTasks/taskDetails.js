import { message, Modal } from 'antd';
import { fetchGetTaskDetails,
  fetchGetLoanDate,
  fetchGetResultOption,
  fetchSaveIntention,
  fetchGetLoanType,
  fetchGetReviewList,
  fetchDeploy,
  fetchOperationRecords,
  fetchGetGroupList,
  fetchGetPersonalList,
  fetchGetContractGroupList,
  fetchGetPreloanInfo,
  fetchGetEnvyInfo,
  getReplyInfo,
  getContactList,
  addContract,
  getSmsInfo,
  getContent,
  sendMsg,
  schedule,
  getPhoneNo, // 电话号列表码脱敏
  getDetailPhoneNo, // 详情页电话号码脱敏
  getDetailSsn, // 详情页身份证脱敏
  fetchAssign,
 } from '../../services/taskDetails';

export default {
  namespace: 'taskDetails',

  state: {
    taskDetailsList: {
      loanBaseInfor: {},
      customerInfor: {},
      operationResults: [],
      isClosedList: [],
    },
    getTaskDetailsHold: false,
    getTaskDetailSucceed: false,
    reload: false,
    loanTypeList: [],
    loanDateList: [],
    resultOptionList: [],
    reviewList: [],
    operationRecordsLoading: false,
    dealFormLoading: false,
    operationRecordsList: [],
    everyModalShow: false,
    groupList: [],
    personalList: [],
    contractGroupList: [],
    deployStatus: false,
    preloanInfoList: {},
    envyInfoList: {},
    scheduleList: {},
    replyInfo: { // 批复信息
      loading: false,
    },
    smsModal: {
      smsInfo: {},
      visible: false,
      loading: false,
      content: '',
      templeteId: null,
    },
    addContractModal: {
      visible: false,
      loading: false,
    },
    contract: {
      mailList: [],
      phoneList: [],
      weixinList: [],
      qqList: [],
      success: false,
      currentPhoneId: null,
      currentPhoneNo: null,
      currentOrginPhoneNo: null,
      addCurrentPhoneNo: null, // 设置新增联系方式号码
      isBusyNo: false, // 判断电话列表当前号码是否为常用
      isBusyNoOfAdd: false, // 判断新增联系方式中当前号码是否为常用
      defaultMail: null,
      defaultQq: null,
      defaultWeixin: null,
      customerId: null,
    },
  },
  effects: {
    * getTaskDetails({ payload }, { call, put }) {
      try {
        yield put({ type: 'getTaskDetailsHold' });
        const taskDetails = yield call(fetchGetTaskDetails, payload);
        // 获取批复信息
        const status = taskDetails && taskDetails.status;
        const routingSystem =
          taskDetails && taskDetails.loanBaseInfor && taskDetails.loanBaseInfor.routingSystem;
        const actorId =
          taskDetails && taskDetails.customerInfor && taskDetails.customerInfor.actorId;
        const loanAppId =
          taskDetails && taskDetails.loanBaseInfor && taskDetails.loanBaseInfor.loanAppId;
        const loanId =
          taskDetails && taskDetails.loanBaseInfor && taskDetails.loanBaseInfor.loanId;
        if (status === 'SIGN') {
          yield put({ type: 'geReplyInfo', payload: { routingSystem, actorId, loanAppId, loanId } });
        }
        yield put({ type: 'getTaskDetailsSucceed', payload: taskDetails || {} });
        yield put({ type: 'getContactList' });
      } catch (e) {
        yield put({ type: 'getTaskDetailsFailed' });
        console.error(e);
      }
    },
    * getPreloanInfo({ payload }, { call, put }) {
      try {
        const preloanInfo = yield call(fetchGetPreloanInfo, payload);
        yield put({ type: 'getPreloanInfoSucceed', payload: preloanInfo });
      } catch (e) {
        console.error(e);
      }
    },
    * getEnvyInfo({ payload }, { call, put }) {
      try {
        const envyInfo = yield call(fetchGetEnvyInfo, payload);
        yield put({ type: 'getEnvyInfoSucceed', payload: envyInfo });
      } catch (e) {
        console.error(e);
      }
    },
    * getLoanDate({ payload }, { call, put }) {
      try {
        const loanDate = yield call(fetchGetLoanDate, payload);
        yield put({ type: 'getLoanDateSucceed', payload: loanDate });
      } catch (e) {
        console.error(e);
      }
    },
    * getResultOption({ payload }, { call, put }) {
      try {
        const resultOption = yield call(fetchGetResultOption, payload);
        yield put({ type: 'getResultOptionSucceed', payload: resultOption });
      } catch (e) {
        console.error(e);
      }
    },
    * saveIntention({ payload }, { call, put }) {
      try {
        yield put({ type: 'saveIntentionStart' });
        const saveIntention = yield call(fetchSaveIntention, payload);
        yield put({ type: 'saveIntentionSucceed', payload: saveIntention });
        if (payload && (payload.operationResult === 'REVIEW_APPLICATION' || payload.operationResult === 'CUSTOMER_CANCEL' || payload.operationResult === 'DERATE')) {
          Modal.success({
            title: '保存成功',
            onOk: () => {
              location.reload([true]);
            },
            onCancel: () => {
              location.reload([true]);
            },
          });
        } else {
          message.success('保存成功！', 1);
        }
      } catch (e) {
        yield put({ type: 'saveIntentionFailed' });
        console.error(e);
      }
    },
    * deploySaveIntention({ payload }, { call, put }) {
      try {
        yield put({ type: 'deploySaveIntentionStart' });
        const saveIntention = yield call(fetchSaveIntention, payload);
        yield put({ type: 'deploySaveIntentionSucceed', payload: saveIntention });
      } catch (e) {
        yield put({ type: 'deploySaveIntentionFailed' });
        console.error(e);
      }
    },
    * getLoanType({ payload }, { call, put }) {
      try {
        const loanType = yield call(fetchGetLoanType);
        yield put({ type: 'getLoanTypeSucceed', payload: loanType });
      } catch (e) {
        console.error(e);
      }
    },
    * getReviewList({ payload }, { call, put }) {
      try {
        const reviewList = yield call(fetchGetReviewList, payload);
        yield put({ type: 'getReviewListSucceed', payload: reviewList });
      } catch (e) {
        console.error(e);
      }
    },
    * deploy({ payload }, { call, put }) {
      try {
        const { isAssign } = payload;
        const values = { ...payload };
        delete values.isAssign;
        let reviewList;
        if (isAssign) {
          reviewList = yield call(fetchAssign, values); // 分配签约人
        } else {
          reviewList = yield call(fetchDeploy, values);
        }
        yield put({ type: 'deploySucceed', payload: reviewList });
      } catch (e) {
        console.error(e);
      }
    },
    * searchOperationRecords({ payload }, { call, put }) {
      try {
        yield put({ type: 'searchOperationRecordsStart' });
        const operationRecords = yield call(fetchOperationRecords, payload);
        yield put({ type: 'searchOperationRecordsSucceed', payload: operationRecords });
      } catch (e) {
        yield put({ type: 'searchOperationRecordsFailed' });
        console.error(e);
      }
    },
    * getGroupList({ payload }, { call, put }) {
      try {
        const groupList = yield call(fetchGetGroupList, payload);
        yield put({ type: 'getGroupListSucceed', payload: groupList });
      } catch (e) {
        console.error(e);
      }
    },
    * getPersonalList({ payload }, { call, put }) {
      try {
        const personalList = yield call(fetchGetPersonalList, payload);
        yield put({ type: 'getPersonalListSucceed', payload: personalList });
      } catch (e) {
        console.error(e);
      }
    },
    * getContractGroupList({ payload }, { call, put }) {
      try {
        const groupList = yield call(fetchGetContractGroupList, payload);
        yield put({ type: 'getContractGroupListSucceed', payload: groupList });
      } catch (e) {
        console.error(e);
      }
    },
    * getContactList({ payload }, { call, put, select }) {
      try {
        const taskDetailsList = yield select(state => state.taskDetails.taskDetailsList);
        const customerId = taskDetailsList.customerInfor.customerId;
        const contactList = yield call(getContactList, customerId);
        const phone = contactList && contactList.phones && contactList.phones.find(item => item.enableBusy === 'Y');
        let defaultPhoneId;
        if (phone && phone.id) {
          defaultPhoneId = phone.id;
        } else {
          defaultPhoneId = ((contactList && contactList.phones && contactList.phones.length) > 0 ? contactList.phones[0].id : '');
        }
        const orginPhoneNo = defaultPhoneId && (yield call(getPhoneNo, defaultPhoneId));
        yield put({ type: 'getContactListSucceed', payload: { orginPhoneNo, contactList: contactList || {} } });
      } catch (e) {
        console.error(e);
      }
    },
    * getContractList({ payload }, { call, put }) {
      try {
        const personalList = yield call(fetchGetPersonalList, payload);
        yield put({ type: 'getContractListSucceed', payload: personalList });
      } catch (e) {
        console.error(e);
      }
    },
    * geReplyInfo({ payload }, { call, put }) {
      try {
        yield put({ type: 'beforeGetReplyInfo', payload: info || {} });
        const info = yield call(getReplyInfo, payload);
        yield put({ type: 'getReplyInfoSucceed', payload: info || {} });
      } catch (e) {
        yield put({ type: 'getReplyInfoFaild' });
        console.error(e);
      }
    },
    * addContract({ payload }, { call, put }) {
      try {
        yield put({ type: 'beforeAddContract' });
        yield call(addContract, payload);
        yield put({ type: 'addContractSuccess' });
        yield put({ type: 'getContactList' });
      } catch (e) {
        console.error(e);
        yield put({ type: 'addContractFaild' });
      }
    },
    * getSmsInfo({ payload }, { call, put }) {
      try {
        yield put({ type: 'showSmsModal', payload: true });
        yield put({ type: 'smsModalLoading' });
        const info = yield call(getSmsInfo, payload);
        yield put({ type: 'getSmsInfoSuccess', payload: info || {} });
      } catch (e) {
        console.error(e);
        yield put({ type: 'smsModalLoadingFaild' });
      }
    },
    * getContent({ payload }, { call, put }) {
      try {
        yield put({ type: 'smsModalLoading' });
        const data = yield call(getContent, payload);
        yield put({ type: 'getContentSuccess', payload: { data, templeteId: payload.template } || {} });
      } catch (e) {
        console.error(e);
        yield put({ type: 'smsModalLoadingFaild' });
      }
    },
    * sendMsg({ payload }, { call, put }) {
      try {
        yield put({ type: 'smsModalLoading' });
        yield call(sendMsg, payload);
        yield put({ type: 'sendMsgSuccess' });
      } catch (e) {
        console.error(e);
        yield put({ type: 'smsModalLoadingFaild' });
      }
    },
    * getSchedule({ payload }, { call, put }) {
      try {
        const scheduleList = yield call(schedule, payload);
        yield put({ type: 'getScheduleSucceed', payload: scheduleList });
      } catch (e) {
        console.error(e);
      }
    },
    * getPhoneNo({ payload }, { call, put, select }) {
      try {
        let phoneNo;
        const phoneList = yield select(state => state.taskDetails.contract.phoneList);
        const phone = phoneList.filter(item => item.id === payload).length > 0 ?
          phoneList.filter(item => item.id === payload)[0] : {};
        if (phone.originNo) {
          phoneNo = phone.originNo;
        } else {
          phoneNo = yield call(getPhoneNo, payload);
        }
        yield put({ type: 'getPhoneNoSucceed', payload: { phoneNo, id: payload } });
      } catch (e) {
        console.error(e);
      }
    },
    * showPhoneNo({ payload }, { call, put, select }) {
      try {
        let phoneNo;
        const phoneList = yield select(state => state.taskDetails.contract.phoneList);
        const phone = phoneList.filter(item => item.id === payload).length > 0 ?
          phoneList.filter(item => item.id === payload)[0] : {};
        if (phone.originNo) {
          phoneNo = phone.originNo;
        } else {
          phoneNo = yield call(getPhoneNo, payload);
        }
        yield put({ type: 'setPhoneNo', payload: { phoneNo, id: payload } });
      } catch (e) {
        console.error(e);
      }
    },
    * getPhoneOfAdd({ payload }, { call, put, select }) {
      try {
        let phoneNo;
        const phoneList = yield select(state => state.taskDetails.contract.phoneListOfAdd);
        const phone = phoneList.filter(item => item.id === payload).length > 0 ?
          phoneList.filter(item => item.id === payload)[0] : {};
        if (phone.originNo) {
          phoneNo = phone.originNo;
        } else {
          phoneNo = yield call(getPhoneNo, payload);
        }
        yield put({ type: 'getPhoneOfAddSucceed', payload: { phoneNo, id: payload } });
      } catch (e) {
        console.error(e);
      }
    },
    * showPhoneOfAdd({ payload }, { call, put, select }) {
      try {
        let phoneNo;
        const phoneList = yield select(state => state.taskDetails.contract.phoneListOfAdd);
        const phone = phoneList.filter(item => item.id === payload).length > 0 ?
          phoneList.filter(item => item.id === payload)[0] : {};
        if (phone.originNo) {
          phoneNo = phone.originNo;
        } else {
          phoneNo = yield call(getPhoneNo, payload);
        }
        yield put({ type: 'setPhoneOfAdd', payload: { phoneNo, id: payload } });
      } catch (e) {
        console.error(e);
      }
    },
    * getDetailPhoneNo({ payload }, { call, put, select }) {
      try {
        const originPhoneNo = yield select(state => state.taskDetails.originPhoneNo);
        let phoneNo;
        if (originPhoneNo) {
          phoneNo = originPhoneNo;
        } else {
          phoneNo = yield call(getDetailPhoneNo, payload);
        }
        yield put({ type: 'getDetailPhoneSucceed', payload: phoneNo });
      } catch (e) {
        console.error(e);
      }
    },
    * getDetailSsn({ payload }, { call, put, select }) {
      try {
        const originSsn = yield select(state => state.taskDetails.originSsn);
        let ssn;
        if (originSsn) {
          ssn = originSsn;
        } else {
          ssn = yield call(getDetailSsn, payload);
        }
        yield put({ type: 'getDetailSsnSucceed', payload: ssn });
      } catch (e) {
        console.error(e);
      }
    },
  },

  reducers: {
    getTaskDetailsHold(state) {
      return { ...state, getTaskDetailsHold: true };
    },
    getTaskDetailsSucceed(state, { payload }) {
      return {
        ...state,
        taskDetailsList: {
          ...payload,
          loanBaseInfor: payload.loanBaseInfor || {},
          customerInfor: payload.customerInfor || {},
          operationResults: payload.operationResults || [],
          isClosedList: payload.isClosedList || [],
        },
        getTaskDetailsHold: false,
        getTaskDetailSucceed: true,
        reload: !state.reload,
      };
    },
    getTaskDetailsFailed(state) {
      return {
        ...state,
        getTaskDetailsHold: false,
      };
    },
    getLoanDateSucceed(state, { payload }) {
      return { ...state, loanDateList: payload || [] };
    },
    getLoanTypeSucceed(state, { payload }) {
      return { ...state, loanTypeList: payload || [] };
    },
    getResultOptionSucceed(state, { payload }) {
      return { ...state, resultOptionList: payload || [] };
    },
    saveIntentionStart(state) {
      return { ...state, dealFormLoading: true };
    },
    saveIntentionSucceed(state) {
      return { ...state, dealFormLoading: false };
    },
    saveIntentionFailed(state) {
      return { ...state, dealFormLoading: false };
    },
    deploySaveIntentionStart(state) {
      return { ...state, dealFormLoading: true };
    },
    deploySaveIntentionSucceed(state) {
      message.success('保存成功！');
      return { ...state, everyModalShow: true, dealFormLoading: false };
    },
    deploySaveIntentionFailed(state) {
      return { ...state, dealFormLoading: false };
    },
    getReviewListSucceed(state, { payload }) {
      return { ...state, reviewList: payload || [] };
    },
    deploySucceed(state, { payload }) {
      message.success('调配成功！');
      return { ...state, deployStatus: payload, everyModalShow: false };
    },
    searchOperationRecordsStart(state) {
      return { ...state, operationRecordsLoading: true };
    },
    searchOperationRecordsSucceed(state, { payload }) {
      return { ...state, operationRecordsList: payload || [], operationRecordsLoading: false };
    },
    searchOperationRecordsFailed(state) {
      return { ...state, operationRecordsLoading: false };
    },
    getGroupListSucceed(state, { payload }) {
      return { ...state, groupList: payload || [] };
    },
    getPersonalListSucceed(state, { payload }) {
      return { ...state, personalList: payload || [] };
    },
    getContractGroupListSucceed(state, { payload }) {
      return { ...state, contractGroupList: payload || [] };
    },
    getContractListSucceed(state, { payload }) {
      return { ...state, contractList: payload };
    },
    getPreloanInfoSucceed(state, { payload }) {
      return { ...state, preloanInfoList: payload || {} };
    },
    getEnvyInfoSucceed(state, { payload }) {
      return { ...state, envyInfoList: payload || {} };
    },
    closeEveryModal(state) {
      return { ...state, everyModalShow: false };
    },
    beforeGetReplyInfo(state) {
      return {
        ...state,
        replyInfo: {
          ...state.replyInfo,
          loading: true,
        },
      };
    },
    showSmsModal(state, { payload }) {
      return {
        ...state,
        smsModal: {
          ...state.smsModal,
          visible: payload,
        },
      };
    },
    showAddcontractModal(state, { payload }) {
      return {
        ...state,
        addContractModal: {
          ...state.addContractModal,
          visible: payload,
        },
      };
    },
    getContactListSucceed(state, { payload }) {
      const phone = payload.contactList.phones && payload.contactList.phones.find(item => item.enableBusy === 'Y');
      const QQ = payload.contactList.qq && payload.contactList.qq.find(item => item.enableFriendship === 'Y');
      const email = payload.contactList.mail && payload.contactList.mail.find(item => item.enableBusy === 'Y');
      const weiXin = payload.contactList.weixin && payload.contactList.weixin.find(item => item.enableFriendship === 'Y');
      const defaultPhoneId = (phone && phone.id) ? phone.id : ((payload.contactList.phones && payload.contactList.phones.length) > 0 ? payload.contactList.phones[0].id : '');
      const defaultPhoneNo = (phone && phone.contactNo) ? phone.contactNo : ((payload.contactList.phones && payload.contactList.phones.length) > 0 ? payload.contactList.phones[0].contactNo : '');
      const defaultQq = QQ && QQ.id;
      const defaultMail = email && email.id;
      const defaultWeixin = weiXin && weiXin.id;
      const customerId = phone && phone.customerId;
      return {
        ...state,
        contract: {
          ...state.contract,
          mailList: payload.contactList.mail || [],
          phoneList: payload.contactList.phones || [],
          phoneListOfAdd: payload.contactList.phones || [],
          weixinList: payload.contactList.weixin || [],
          qqList: payload.contactList.qq || [],
          success: true,
          currentPhoneId: defaultPhoneId,
          currentPhoneNo: defaultPhoneNo,
          isBusyNo: !!phone,
          isBusyNoOfAdd: !!phone,
          currentOrginPhoneNo: payload.orginPhoneNo,
          addCurrentPhoneNo: defaultPhoneNo,
          defaultQq,
          defaultMail,
          defaultWeixin,
          customerId,
        },
      };
    },
    beforeAddContract(state) {
      return {
        ...state,
        addContractModal: {
          ...state.addContractModal,
          loading: true,
        },
      };
    },
    addContractSuccess(state) {
      return {
        ...state,
        addContractModal: {
          ...state.addContractModal,
          loading: false,
        },
      };
    },
    addContractFaild(state) {
      return {
        ...state,
        addContractModal: {
          ...state.addContractModal,
          loading: false,
        },
      };
    },
    getSmsInfoSuccess(state, { payload }) {
      return {
        ...state,
        smsModal: {
          ...state.smsModal,
          smsInfo: payload,
          loading: false,
        },
      };
    },
    smsModalLoading(state) {
      return {
        ...state,
        smsModal: {
          ...state.smsModal,
          loading: true,
        },
      };
    },
    getReplyInfoSucceed(state, { payload }) {
      return {
        ...state,
        replyInfo: {
          ...state.replyInfo,
          ...payload,
          loading: false,
        },
      };
    },
    smsModalLoadingFaild(state) {
      return {
        ...state,
        smsModal: {
          ...state.smsModal,
          loading: false,
        },
      };
    },
    getContentSuccess(state, { payload }) {
      return {
        ...state,
        smsModal: {
          ...state.smsModal,
          templeteId: payload.templeteId,
          content: payload.data && payload.data.content,
          loading: false,
        },
      };
    },
    getReplyInfoFaild(state) {
      return {
        ...state,
        replyInfo: {
          ...state.replyInfo,
        },
      };
    },
    sendMsgSuccess(state) {
      message.success('发动成功！');
      return {
        ...state,
        smsModal: {
          ...state.smsModal,
          loading: false,
        },
      };
    },
    getScheduleSucceed(state, { payload }) {
      return { ...state, scheduleList: payload || {} };
    },
    getPhoneNoSucceed(state, { payload }) {
      let currentPhoneNo;
      let showOriginPhone;
      let isBusyNo = false;
      const newPhoneList = state.contract.phoneList.map((item) => {
        if (`${item.id}` === `${payload.id}`) {
          currentPhoneNo = item.contactNo;
          isBusyNo = item.enableBusy === 'Y';
          showOriginPhone = item.showOriginPhone;
          return { ...item, originNo: payload.phoneNo, showOriginPhone };
        }
        return item;
      });
      return {
        ...state,
        contract: {
          ...state.contract,
          phoneList: newPhoneList,
          currentOrginPhoneNo: payload.phoneNo,
          currentPhoneId: payload.id,
          currentPhoneNo: showOriginPhone ? payload.phoneNo : currentPhoneNo,
          isBusyNo,
        },
      };
    },
    setPhoneNo(state, { payload }) {
      let currentPhoneNo;
      let showOriginPhone;
      let isBusyNo = false;
      const newPhoneList = state.contract.phoneList.map((item) => {
        if (`${item.id}` === `${payload.id}`) {
          currentPhoneNo = item.contactNo;
          isBusyNo = item.enableBusy === 'Y';
          showOriginPhone = !item.showOriginPhone;
          return { ...item, originNo: payload.phoneNo, showOriginPhone };
        }
        return item;
      });
      return {
        ...state,
        contract: {
          ...state.contract,
          phoneList: newPhoneList,
          currentOrginPhoneNo: payload.phoneNo,
          currentPhoneId: payload.id,
          currentPhoneNo: showOriginPhone ? payload.phoneNo : currentPhoneNo,
          isBusyNo,
        },
      };
    },
    getPhoneOfAddSucceed(state, { payload }) {
      let currentPhoneNo;
      let showOriginPhone;
      let isBusyNo = false;
      const newPhoneList = state.contract.phoneListOfAdd.map((item) => {
        if (`${item.id}` === `${payload.id}`) {
          currentPhoneNo = item.contactNo;
          isBusyNo = item.enableBusy === 'Y';
          showOriginPhone = item.showOriginPhone;
          return { ...item, originNo: payload.phoneNo, showOriginPhone };
        }
        return item;
      });
      return {
        ...state,
        contract: {
          ...state.contract,
          phoneListOfAdd: newPhoneList,
          addCurrentPhoneNo: showOriginPhone ? payload.phoneNo : currentPhoneNo,
          isBusyNoOfAdd: isBusyNo,
        },
      };
    },
    setPhoneOfAdd(state, { payload }) {
      let currentPhoneNo;
      let showOriginPhone;
      let isBusyNo = false;
      const newPhoneList = state.contract.phoneListOfAdd.map((item) => {
        if (`${item.id}` === `${payload.id}`) {
          currentPhoneNo = item.contactNo;
          isBusyNo = item.enableBusy === 'Y';
          showOriginPhone = !item.showOriginPhone;
          return { ...item, originNo: payload.phoneNo, showOriginPhone };
        }
        return item;
      });
      return {
        ...state,
        contract: {
          ...state.contract,
          phoneListOfAdd: newPhoneList,
          addCurrentPhoneNo: showOriginPhone ? payload.phoneNo : currentPhoneNo,
          isBusyNoOfAdd: isBusyNo,
        },
      };
    },
    getDetailPhoneSucceed(state, { payload }) {
      return {
        ...state,
        originPhoneNo: payload,
      };
    },
    getDetailSsnSucceed(state, { payload }) {
      return {
        ...state,
        originSsn: payload,
      };
    },
    loanRiverOpenModal(state) {
      return {
        ...state,
        everyModalShow: true,
      };
    },
  },
};
