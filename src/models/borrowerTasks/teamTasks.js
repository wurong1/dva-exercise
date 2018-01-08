import {
  fetchGetEmployeeGroupId,
  fetchSearch,
  fetchGetIntentionsource,
  fetchGetFirstRecommend,
  fetchGetProductcode,
  taskAllsubmit,
  getButtonConfig,
  getGroup,
  getEmployeeUser,
  modalSubmit,
  assignSubmit,
   } from '../../services/borrowerTasks';

export default {
  namespace: 'teamTasks',

  state: {
    employeeGroupList: [], // 公用组别
    intentionsourceList: [], // 意向用户来源
    firstRecommendList: [], // 首次推荐贷款产品类型

    newTaskList: {}, // 新注册查询结果列表
    newTaskLoading: false, // 新注册查询状态

    loanTaskList: {}, // 引导进件查询结果列表
    loanTaskLoading: false, // 引导进件查询状态
    loanProductcodeList: [], // 引导进件贷款类型列表

    holdTaskList: {}, // 审核跟进查询结果列表
    holdTaskLoading: false, // 审核跟进查询状态
    holdProductcodeList: [], // 审核跟进贷款类型列表

    signTaskList: {}, // 签约查询结果列表
    signTaskLoading: false, // 签约查询状态
    signProductcodeList: [], // 签约贷款类型列表

    employeeList: [],
    modal: {
      groupList: [],
      employeeList: [],
      checkedList: [],
      isFetching: false,
      allDeployVisible: false,
      allTransferVisible: false,
      allSignVisible: false,
      newDeployVisible: false,
      newTransferVisible: false,
      newSignVisible: false,
      loanDeployVisible: false,
      loanTransferVisible: false,
      loanSignVisible: false,
      holdDeployVisible: false,
      holdTransferVisible: false,
      holdSignVisible: false,
      signDeployVisible: false,
      signTransferVisible: false,
      signSignVisible: false,
      contractDeployVisible: false,
      contractTransferVisible: false,
      contractSignVisible: false,
      nosalesDeployVisible: false,
      nosalesTransferVisible: false,
      loading: false,
    },
    taskNew: {
      buttonConfig: [],
      selectedRows: [],
      formData: {},
      reload: false, // 重新加载分页组件
    },
    taskLoan: {
      buttonConfig: [],
      selectedRows: [],
      formData: {},
      reload: false, // 重新加载分页组件
    },
    taskHold: {
      buttonConfig: [],
      selectedRows: [],
      formData: {},
      reload: false, // 重新加载分页组件
    },
    taskSign: {
      buttonConfig: [],
      selectedRows: [],
      formData: {},
      reload: false, // 重新加载分页组件
    },
    taskAll: {
      isFetching: false,
      formData: {},
      reload: false, // 重新加载分页组件
      buttonConfig: [],
      selectedRows: [],
    },
    taskContract: {
      isFetching: false,
      formData: {},
      reload: false, // 重新加载分页组件
      buttonConfig: [],
      selectedRows: [],
    },
    taskNoSales: {
      isFetching: false,
      formData: {},
      reload: false, // 重新加载分页组件
      selectedRows: [],
    },
    contractorList: [], // 分配签约人查询结果列表
    contractorLoading: false, // 分配签约人查询状态
  },

  effects: {
    * getEmployeeGroup({ payload }, { call, put }) {
      try {
        const employeeGroup = yield call(fetchGetEmployeeGroupId);
        yield put({ type: 'getEmployeeGroupSucceed', payload: employeeGroup });
      } catch (e) {
        console.error(e);
      }
    },
    * getIntentionsource({ payload }, { call, put }) {
      try {
        const intentionsource = yield call(fetchGetIntentionsource);
        yield put({ type: 'getIntentionsourceSucceed', payload: intentionsource });
      } catch (e) {
        console.error(e);
      }
    },
    * getFirstRecommend({ payload }, { call, put }) {
      try {
        const firstRecommend = yield call(fetchGetFirstRecommend);
        yield put({ type: 'getFirstRecommendSucceed', payload: firstRecommend });
      } catch (e) {
        console.error(e);
      }
    },
    * getLoanProductcode({ payload }, { call, put }) {
      try {
        const productcode = yield call(fetchGetProductcode, payload);
        yield put({ type: 'getLoanProductcodeSucceed', payload: productcode });
      } catch (e) {
        console.error(e);
      }
    },
    * getHoldProductcode({ payload }, { call, put }) {
      try {
        const productcode = yield call(fetchGetProductcode, payload);
        yield put({ type: 'getHoldProductcodeSucceed', payload: productcode });
      } catch (e) {
        console.error(e);
      }
    },
    * getSignProductcode({ payload }, { call, put }) {
      try {
        const productcode = yield call(fetchGetProductcode, payload);
        yield put({ type: 'getSignProductcodeSucceed', payload: productcode });
      } catch (e) {
        console.error(e);
      }
    },

    * newTaskSearch({ payload }, { call, put }) {
      try {
        yield put({ type: 'newTaskSearchLoading' });
        const newTask = yield call(fetchSearch, payload);
        const params = {
          data: newTask || {},
          formData: payload || {},
        };
        yield put({ type: 'newTaskSearchSucceed', payload: params });
      } catch (e) {
        yield put({ type: 'newTaskSearchfailed' });
        console.error(e);
      }
    },

    * loanTaskSearch({ payload }, { call, put }) {
      try {
        yield put({ type: 'loanTaskSearchLoading' });
        const loanTask = yield call(fetchSearch, payload);
        const params = {
          data: loanTask || {},
          formData: payload || {},
        };
        yield put({ type: 'loanTaskSearchSucceed', payload: params });
      } catch (e) {
        yield put({ type: 'loanTaskSearchfailed' });
        console.error(e);
      }
    },

    * holdTaskSearch({ payload }, { call, put }) {
      try {
        yield put({ type: 'holdTaskSearchLoading' });
        const holdTask = yield call(fetchSearch, payload);
        const params = {
          data: holdTask || {},
          formData: payload || {},
        };
        yield put({ type: 'holdTaskSearchSucceed', payload: params });
      } catch (e) {
        yield put({ type: 'holdTaskSearchfailed' });
        console.error(e);
      }
    },

    * signTaskSearch({ payload }, { call, put }) {
      try {
        yield put({ type: 'signTaskSearchLoading' });
        const signTask = yield call(fetchSearch, payload);
        const params = {
          data: signTask || {},
          formData: payload || {},
        };
        yield put({ type: 'signTaskSearchSucceed', payload: params });
      } catch (e) {
        yield put({ type: 'signTaskSearchfailed' });
      }
    },

    * taskAllsubmit({ payload }, { call, put }) {
      try {
        yield put({ type: 'beforeTaskAllsubmit' });
        const data = yield call(taskAllsubmit, payload);
        const params = {
          data: data || {},
          formData: payload || {},
        };
        yield put({ type: 'taskAllsubmitSucceed', payload: params });
      } catch (e) {
        yield put({ type: 'taskAllsubmitFailed' });
        console.error(e);
      }
    },
    * taskNoSalesSubmit({ payload }, { call, put }) {
      try {
        yield put({ type: 'beforeTaskNoSalesSubmit' });
        const data = yield call(fetchSearch, payload);
        const params = {
          data: data || {},
          formData: payload || {},
        };
        yield put({ type: 'taskNoSalesSubmitSucceed', payload: params });
      } catch (e) {
        yield put({ type: 'taskNoSalesSubmitFailed' });
        console.error(e);
      }
    },
    * taskNoSalesPageChange({ payload }, { call, put }) {
      try {
        yield put({ type: 'beforeTaskNoSalesSubmit' });
        const data = yield call(fetchSearch, payload);
        yield put({ type: 'taskNoSalesPageChangeSucceed', payload: data || {} });
      } catch (e) {
        yield put({ type: 'taskNoSalesSubmitFailed' });
        console.error(e);
      }
    },
    * taskAllPageChange({ payload }, { call, put }) {
      try {
        yield put({ type: 'beforeTaskAllsubmit' });
        const data = yield call(taskAllsubmit, payload);
        yield put({ type: 'taskAllPageChangeSucceed', payload: data || {} });
      } catch (e) {
        yield put({ type: 'taskAllsubmitFailed' });
        console.error(e);
      }
    },
    * taskNewPageChange({ payload }, { call, put }) {
      try {
        yield put({ type: 'newTaskSearchLoading' });
        const data = yield call(fetchSearch, payload);
        yield put({ type: 'taskNewPageChangeSucceed', payload: data || {} });
      } catch (e) {
        yield put({ type: 'newTaskSearchfailed' });
        console.error(e);
      }
    },
    * taskLoanPageChange({ payload }, { call, put }) {
      try {
        yield put({ type: 'loanTaskSearchLoading' });
        const data = yield call(fetchSearch, payload);
        yield put({ type: 'taskLoanPageChangeSucceed', payload: data || {} });
      } catch (e) {
        yield put({ type: 'loanTaskSearchfailed' });
        console.error(e);
      }
    },
    * taskHoldPageChange({ payload }, { call, put }) {
      try {
        yield put({ type: 'holdTaskSearchLoading' });
        const data = yield call(fetchSearch, payload);
        yield put({ type: 'taskHoldPageChangeSucceed', payload: data || {} });
      } catch (e) {
        yield put({ type: 'holdTaskSearchfailed' });
        console.error(e);
      }
    },
    * taskSignPageChange({ payload }, { call, put }) {
      try {
        yield put({ type: 'signTaskSearchLoading' });
        const data = yield call(fetchSearch, payload);
        yield put({ type: 'taskSignPageChangeSucceed', payload: data || {} });
      } catch (e) {
        yield put({ type: 'signTaskSearchfailed' });
        console.error(e);
      }
    },
    * taskContractPageChange({ payload }, { call, put }) {
      try {
        yield put({ type: 'contractorSearchLoading' });
        const data = yield call(fetchSearch, payload);
        yield put({ type: 'taskContractPageChangeSucceed', payload: data || {} });
      } catch (e) {
        yield put({ type: 'contractorSearchfailed' });
        console.error(e);
      }
    },
    * getButtonConfig({ payload }, { call, put }) {
      try {
        const taskOptions = payload === 'CONTRACT' ? 'SIGN' : payload;
        const data = yield call(getButtonConfig, taskOptions);
        const params = {
          data: data || [],
          taskOptions: payload,
        };
        yield put({ type: 'getButtonConfigSucceed', payload: params });
      } catch (e) {
        console.error(e);
      }
    },
    * getGroup({ payload }, { call, put }) {
      try {
        yield yield put({ type: 'modalLoding' });
        const data = yield call(getGroup, payload);
        yield put({ type: 'getGroupSucceed', payload: data || [] });
      } catch (e) {
        yield yield put({ type: 'modalLodingFaild' });
        console.error(e);
      }
    },
    * getEmployeeUser({ payload }, { call, put }) {
      try {
        yield yield put({ type: 'beforeGetEmployeeUser' });
        const data = yield call(getEmployeeUser, payload);
        yield put({ type: 'getEmployeeUserSucceed', payload: data || [] });
      } catch (e) {
        yield yield put({ type: 'getEmployeeUserFaild' });
        console.error(e);
      }
    },
    * modalSubmit({ payload }, { call, put, select }) {
      try {
        const taskOptions = payload.taskOptions;
        const isAssign = payload.isAssign; // 分配签约人则调用/v1/task/assignment接口
        let formData;
        yield put({ type: 'modalLoding' });
        if (isAssign) {
          yield call(assignSubmit, payload.values);
        } else {
          yield call(modalSubmit, payload.values);
        }
        yield put({ type: 'modalSubmitSucceed', payload: taskOptions });
        if (taskOptions === 'NEWREGIST') {
          formData = yield select(state => state.teamTasks.taskNew.formData);
          yield put({ type: 'newTaskSearch', payload: { ...formData, pageNo: 1 } });
        }
        if (taskOptions === 'LOANAPPGUIDED') {
          formData = yield select(state => state.teamTasks.taskLoan.formData);
          yield put({ type: 'loanTaskSearch', payload: { ...formData, pageNo: 1 } });
        }
        if (taskOptions === 'AUDITFOLLOWUP') {
          formData = yield select(state => state.teamTasks.taskHold.formData);
          yield put({ type: 'holdTaskSearch', payload: { ...formData, pageNo: 1 } });
        }
        if (taskOptions === 'SIGN') {
          formData = yield select(state => state.teamTasks.taskSign.formData);
          yield put({ type: 'signTaskSearch', payload: { ...formData, pageNo: 1 } });
        }
        if (taskOptions === 'CONTRACT') {
          formData = yield select(state => state.teamTasks.taskContract.formData);
          yield put({ type: 'contractorSearch', payload: { ...formData, pageNo: 1 } });
        }
        if (taskOptions === 'ALL') {
          formData = yield select(state => state.teamTasks.taskAll.formData);
          yield put({ type: 'taskAllsubmit', payload: { ...formData, pageNo: 1 } });
        }
        if (taskOptions === 'NO_SALES') {
          formData = yield select(state => state.teamTasks.taskNoSales.formData);
          yield put({ type: 'taskNoSalesSubmit', payload: { ...formData, pageNo: 1 } });
        }
      } catch (e) {
        yield yield put({ type: 'modalLodingFaild' });
        console.error(e);
      }
    },

    * contractorSearch({ payload }, { call, put }) {
      try {
        yield put({ type: 'contractorSearchLoading' });
        const contractor = yield call(fetchSearch, payload);
        const params = {
          data: contractor || {},
          formData: payload || {},
        };
        yield put({ type: 'contractorSearchSucceed', payload: params });
      } catch (e) {
        yield put({ type: 'contractorSearchfailed' });
        console.error(e);
      }
    },
  },

  reducers: {
    getEmployeeGroupSucceed(state, { payload }) {
      return {
        ...state,
        employeeGroupList: payload || [],
      };
    },
    getIntentionsourceSucceed(state, { payload }) {
      return { ...state, intentionsourceList: payload || [] };
    },
    getFirstRecommendSucceed(state, { payload }) {
      return { ...state, firstRecommendList: payload || [] };
    },
    newTaskSearchLoading(state) {
      return { ...state, newTaskLoading: true };
    },
    newTaskSearchSucceed(state, { payload }) {
      return {
        ...state,
        newTaskList: payload.data || {},
        newTaskLoading: false,
        taskNew: {
          ...state.taskNew,
          formData: payload.formData || {},
          reload: !state.taskNew.reload,
          selectedRows: [],
        },
      };
    },
    newTaskSearchfailed(state) {
      return { ...state, newTaskLoading: false };
    },
    newSearchListReset(state) {
      return {
        ...state,
        newTaskList: {},
        taskNew: {
          formData: {},
          reload: !state.taskNew.reload,
          buttonConfig: state.taskNew.buttonConfig || [],
          selectedRows: [],
        },
      };
    },

    loanTaskSearchLoading(state) {
      return { ...state, loanTaskLoading: true };
    },
    loanTaskSearchSucceed(state, { payload }) {
      return {
        ...state,
        loanTaskList: payload.data || {},
        loanTaskLoading: false,
        taskLoan: {
          ...state.taskLoan,
          formData: payload.formData || {},
          reload: !state.taskLoan.reload,
          selectedRows: [],
        },
      };
    },
    loanTaskSearchfailed(state) {
      return { ...state, loanTaskLoading: false };
    },
    getLoanProductcodeSucceed(state, { payload }) {
      return { ...state, loanProductcodeList: payload || [] };
    },
    loanSearchListReset(state) {
      return {
        ...state,
        loanTaskList: {},
        taskLoan: {
          formData: {},
          reload: !state.taskLoan.reload,
          buttonConfig: state.taskLoan.buttonConfig || [],
          selectedRows: [],
        },
      };
    },
    holdTaskSearchLoading(state) {
      return { ...state, holdTaskLoading: true };
    },
    holdTaskSearchSucceed(state, { payload }) {
      return {
        ...state,
        holdTaskList: payload.data || {},
        holdTaskLoading: false,
        taskHold: {
          ...state.taskHold,
          formData: payload.formData || {},
          reload: !state.taskHold.reload,
          selectedRows: [],
        },
      };
    },
    holdTaskSearchfailed(state) {
      return { ...state, holdTaskLoading: false };
    },
    getHoldProductcodeSucceed(state, { payload }) {
      return { ...state, holdProductcodeList: payload || [] };
    },
    holdSearchListReset(state) {
      return {
        ...state,
        holdTaskList: {},
        taskHold: {
          formData: {},
          reload: !state.taskHold.reload,
          buttonConfig: state.taskHold.buttonConfig || [],
          selectedRows: [],
        },
      };
    },

    signTaskSearchLoading(state) {
      return { ...state, signTaskLoading: true };
    },
    signTaskSearchSucceed(state, { payload }) {
      return {
        ...state,
        signTaskList: payload.data || {},
        signTaskLoading: false,
        taskSign: {
          ...state.taskSign,
          formData: payload.formData || {},
          reload: !state.taskSign.reload,
          selectedRows: [],
        },
      };
    },
    signTaskSearchfailed(state) {
      return { ...state, signTaskLoading: false };
    },
    getSignProductcodeSucceed(state, { payload }) {
      return { ...state, signProductcodeList: payload || [] };
    },
    signSearchListReset(state) {
      return {
        ...state,
        signTaskList: {},
        taskSign: {
          formData: {},
          reload: !state.taskSign.reload,
          buttonConfig: state.taskSign.buttonConfig || [],
          selectedRows: [],
        },
      };
    },
    beforeTaskAllsubmit(state) {
      return {
        ...state,
        taskAll: {
          ...state.taskAll,
          isFetching: true,
        },
      };
    },
    taskAllsubmitSucceed(state, { payload }) {
      return {
        ...state,
        taskAll: {
          ...state.taskAll,
          ...payload.data,
          formData: payload.formData || {},
          isFetching: false,
          reload: !state.taskAll.reload,
          selectedRows: [],
        },
      };
    },
    beforeTaskNoSalesSubmit(state) {
      return {
        ...state,
        taskNoSales: {
          ...state.taskNoSales,
          isFetching: true,
        },
      };
    },
    taskNoSalesSubmitSucceed(state, { payload }) {
      return {
        ...state,
        taskNoSales: {
          ...state.taskNoSales,
          ...payload.data,
          formData: payload.formData || {},
          isFetching: false,
          reload: !state.taskNoSales.reload,
          selectedRows: [],
        },
      };
    },
    taskNoSalesPageChangeSucceed(state, { payload }) {
      return {
        ...state,
        taskNoSales: {
          ...state.taskNoSales,
          ...payload,
          isFetching: false,
          selectedRows: [],
        },
      };
    },
    taskAllPageChangeSucceed(state, { payload }) {
      return {
        ...state,
        taskAll: {
          ...state.taskAll,
          ...payload,
          isFetching: false,
          selectedRows: [],
        },
      };
    },
    taskNewPageChangeSucceed(state, { payload }) {
      return {
        ...state,
        newTaskList: payload || {},
        newTaskLoading: false,
        taskNew: {
          ...state.taskNew,
          selectedRows: [],
        },
      };
    },
    taskLoanPageChangeSucceed(state, { payload }) {
      return {
        ...state,
        loanTaskList: payload || {},
        loanTaskLoading: false,
        taskLoan: {
          ...state.taskLoan,
          selectedRows: [],
        },
      };
    },
    taskHoldPageChangeSucceed(state, { payload }) {
      return {
        ...state,
        holdTaskList: payload || {},
        holdTaskLoading: false,
        taskHold: {
          ...state.taskHold,
          selectedRows: [],
        },
      };
    },
    taskSignPageChangeSucceed(state, { payload }) {
      return {
        ...state,
        signTaskList: payload || {},
        signTaskLoading: false,
        taskSign: {
          ...state.taskSign,
          selectedRows: [],
        },
      };
    },
    taskContractPageChangeSucceed(state, { payload }) {
      return {
        ...state,
        contractorList: payload || [],
        contractorLoading: false,
        taskContract: {
          ...state.taskContract,
          selectedRows: [],
        },
      };
    },
    taskAllsubmitFailed(state) {
      return {
        ...state,
        taskAll: {
          ...state.taskAll,
          isFetching: false,
        },
      };
    },
    taskNoSalesSubmitFailed(state) {
      return {
        ...state,
        taskNoSales: {
          ...state.taskNoSales,
          isFetching: false,
        },
      };
    },
    taskNewsetRows(state, { payload }) {
      return {
        ...state,
        taskNew: {
          ...state.taskNew,
          selectedRows: payload || [],
        },
      };
    },
    taskLoansetRows(state, { payload }) {
      return {
        ...state,
        taskLoan: {
          ...state.taskLoan,
          selectedRows: payload || [],
        },
      };
    },
    taskHoldsetRows(state, { payload }) {
      return {
        ...state,
        taskHold: {
          ...state.taskHold,
          selectedRows: payload || [],
        },
      };
    },
    taskSignsetRows(state, { payload }) {
      return {
        ...state,
        taskSign: {
          ...state.taskSign,
          selectedRows: payload || [],
        },
      };
    },
    taskContractsetRows(state, { payload }) {
      return {
        ...state,
        taskContract: {
          ...state.taskContract,
          selectedRows: payload || [],
        },
      };
    },
    taskAllsetRows(state, { payload }) {
      return {
        ...state,
        taskAll: {
          ...state.taskAll,
          selectedRows: payload || [],
        },
      };
    },
    taskNoSalesSetRows(state, { payload }) {
      return {
        ...state,
        taskNoSales: {
          ...state.taskNoSales,
          selectedRows: payload || [],
        },
      };
    },
    getButtonConfigSucceed(state, { payload }) {
      const { taskOptions } = payload;
      return {
        ...state,
        taskAll: {
          ...state.taskAll,
          buttonConfig: taskOptions === 'ALL' ? payload.data || [] : state.taskAll.buttonConfig || [],
        },
        taskNew: {
          ...state.taskNew,
          buttonConfig: taskOptions === 'NEWREGIST' ? payload.data || [] : state.taskNew.buttonConfig || [],
        },
        taskLoan: {
          ...state.taskLoan,
          buttonConfig: taskOptions === 'LOANAPPGUIDED' ? payload.data || [] : state.taskLoan.buttonConfig || [],
        },
        taskHold: {
          ...state.taskHold,
          buttonConfig: taskOptions === 'AUDITFOLLOWUP' ? payload.data || [] : state.taskHold.buttonConfig || [],
        },
        taskSign: {
          ...state.taskSign,
          buttonConfig: taskOptions === 'SIGN' ? payload.data || [] : state.taskSign.buttonConfig || [],
        },
        taskContract: {
          ...state.taskContract,
          buttonConfig: taskOptions === 'CONTRACT' ? payload.data || [] : state.taskContract.buttonConfig || [],
        },
      };
    },
    showNoSalesDeployModal(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          nosalesDeployVisible: payload,
          checkedList: [],
        },
      };
    },
    showAllDeployModal(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          allDeployVisible: payload,
          checkedList: [],
        },
      };
    },
    showNewDeployModal(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          newDeployVisible: payload,
          checkedList: [],
        },
      };
    },
    showLoanDeployModal(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          loanDeployVisible: payload,
          checkedList: [],
        },
      };
    },
    showHoldDeployModal(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          holdDeployVisible: payload,
          checkedList: [],
        },
      };
    },
    showSignDeployModal(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          signDeployVisible: payload,
          checkedList: [],
        },
      };
    },
    showContractDeployModal(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          contractDeployVisible: payload,
          checkedList: [],
        },
      };
    },
    showNoSalesTransferModal(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          nosalesTransferVisible: payload,
          checkedList: [],
        },
      };
    },
    showAllTransferModal(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          allTransferVisible: payload,
          checkedList: [],
        },
      };
    },
    showNewTransferModal(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          newTransferVisible: payload,
          checkedList: [],
        },
      };
    },
    showLoanTransferModal(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          loanTransferVisible: payload,
          checkedList: [],
        },
      };
    },
    showHoldTransferModal(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          holdTransferVisible: payload,
          checkedList: [],
        },
      };
    },
    showSignTransferModal(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          signTransferVisible: payload,
          checkedList: [],
        },
      };
    },
    showContractTransferModal(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          contractTransferVisible: payload,
          checkedList: [],
        },
      };
    },
    showAllSignModal(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          allSignVisible: payload,
          checkedList: [],
        },
      };
    },
    showNewSignModal(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          newSignVisible: payload,
          checkedList: [],
        },
      };
    },
    showLoanSignModal(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          loanSignVisible: payload,
          checkedList: [],
        },
      };
    },
    showHoldSignModal(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          holdSignVisible: payload,
          checkedList: [],
        },
      };
    },
    showSignSignModal(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          signSignVisible: payload,
          checkedList: [],
        },
      };
    },
    showContractSignModal(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          contractSignVisible: payload,
          checkedList: [],
        },
      };
    },
    getGroupSucceed(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          groupList: payload || [],
          loading: false,
        },
      };
    },
    beforeGetEmployeeUser(state) {
      return {
        ...state,
        modal: {
          ...state.modal,
          isFetching: true,
        },
      };
    },
    getEmployeeUserSucceed(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          employeeList: payload || [],
          isFetching: false,
        },
      };
    },
    getEmployeeUserFaild(state) {
      return {
        ...state,
        modal: {
          ...state.modal,
          isFetching: false,
        },
      };
    },
    setCheckedList(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          checkedList: payload || [],
        },
      };
    },
    modalLoding(state) {
      return {
        ...state,
        modal: {
          ...state.modal,
          loading: true,
        },
      };
    },
    modalSubmitSucceed(state, { payload }) {
      return {
        ...state,
        modal: {
          groupList: [],
          employeeList: [],
          checkedList: [],
          isFetching: false,
          allDeployVisible: false,
          allTransferVisible: false,
          allSignVisible: false,
          newDeployVisible: false,
          newTransferVisible: false,
          newSignVisible: false,
          loanDeployVisible: false,
          loanTransferVisible: false,
          loanSignVisible: false,
          holdDeployVisible: false,
          holdTransferVisible: false,
          holdSignVisible: false,
          signDeployVisible: false,
          signTransferVisible: false,
          signSignVisible: false,
          contractDeployVisible: false,
          contractTransferVisible: false,
          contractSignVisible: false,
          loading: false,
        },
        taskAll: {
          ...state.taskAll,
          selectedRows: payload === 'ALL' ? [] : state.taskAll.selectedRows || [],
        },
        taskNew: {
          ...state.taskNew,
          selectedRows: payload === 'NEWREGIST' ? [] : state.taskNew.selectedRows || [],
        },
        taskLoan: {
          ...state.taskLoan,
          selectedRows: payload === 'LOANAPPGUIDED' ? [] : state.taskLoan.selectedRows || [],
        },
        taskHold: {
          ...state.taskHold,
          selectedRows: payload === 'AUDITFOLLOWUP' ? [] : state.taskHold.selectedRows || [],
        },
        taskSign: {
          ...state.taskSign,
          selectedRows: payload === 'SIGN' ? [] : state.taskSign.selectedRows || [],
        },
        taskContract: {
          ...state.taskContract,
          selectedRows: payload === 'CONTRACT' ? [] : state.taskContract.selectedRows || [],
        },
      };
    },
    modalLodingFaild(state) {
      return {
        ...state,
        modal: {
          ...state.modal,
          loading: false,
        },
      };
    },
    clearTakNoSales(state) {
      return {
        ...state,
        taskNoSales: {
          isFetching: false,
          formData: {},
          reload: !state.taskNoSales.reload,  //  重新加载分页组件
          selectedRows: [],
        },
      };
    },
    clearTakAll(state) {
      return {
        ...state,
        taskAll: {
          isFetching: false,
          formData: {},
          reload: !state.taskAll.reload,  //  重新加载分页组件
          buttonConfig: state.taskAll.buttonConfig || [],
          selectedRows: [],
        },
      };
    },
    // 切换tab时清除页面保存的数据
    clearTabListData(state) {
      return { ...state,
        newTaskList: {},
        loanTaskList: {},
        holdTaskList: {},
        signTaskList: {},
        taskAll: {
          isFetching: false,
          formData: {},
          reload: false, // 重新加载分页组件
          buttonConfig: state.taskAll.buttonConfig || [],
          selectedRows: [],
        },
        taskNew: {
          buttonConfig: state.taskNew.buttonConfig || [],
          selectedRows: [],
          formData: {},
          reload: false, // 重新加载分页组件
        },
        taskLoan: {
          buttonConfig: state.taskLoan.buttonConfig || [],
          selectedRows: [],
          formData: {},
          reload: false, // 重新加载分页组件
        },
        taskHold: {
          buttonConfig: state.taskHold.buttonConfig || [],
          selectedRows: [],
          formData: {},
          reload: false, // 重新加载分页组件
        },
        taskSign: {
          buttonConfig: state.taskSign.buttonConfig || [],
          selectedRows: [],
          formData: {},
          reload: false, // 重新加载分页组件
        },
        taskContract: {
          buttonConfig: state.taskContract.buttonConfig || [],
          selectedRows: [],
          formData: {},
          reload: false, // 重新加载分页组件
        },
      };
    },
    contractorSearchLoading(state) {
      return { ...state, contractorLoading: true };
    },
    contractorSearchSucceed(state, { payload }) {
      return {
        ...state,
        contractorList: payload.data || [],
        contractorLoading: false,
        taskContract: {
          ...state.taskContract,
          formData: payload.formData || {},
          reload: !state.taskContract.reload,
          selectedRows: [],
        },
      };
    },
    contractorSearchfailed(state) {
      return { ...state, contractorLoading: false };
    },
    contractorSearchListReset(state) {
      return {
        ...state,
        contractorList: [],
        taskContract: {
          formData: {},
          reload: !state.taskContract.reload,
          buttonConfig: state.taskContract.buttonConfig || [],
          selectedRows: [],
        },
      };
    },
  },
};
