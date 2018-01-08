import request from '../utils/request';

// 获取详情页数据
export function fetchGetTaskDetails(params) {
  return request(`/borrower/v1/task/detail?taskId=${params}`);
}

export function getEmployeeGroup() {
  return request('/borrower/v1/task/GROUP_TASK/operation/TO_BRANCH/group');
}

export function getEmployeeList(params) {
  return request(`/borrower/getUserByGroupId?groupId=${params}`);
}

export function getLoanTypeList(params) {
  return request(`/borrower/v1/task/loan-type?productCode=${params.productCode}&loanAppSource=${params.loanAppSource}`);
}

export function saveInfo(params) {
  return request('/borrower/v1/task/intention', { method: 'POST', body: JSON.stringify(params) });
}

export function taskDeploy(params) {
  return request('/borrower/v1/task/deployment', { method: 'POST', body: JSON.stringify(params) });
}

export function updateclose(params) {
  return request('/borrower/v1/task/closed-status', { method: 'POST', body: JSON.stringify(params) });
}


export function saveProductCode(params) {
  return request('/borrower/v1/task/change-loan-type', { method: 'POST', body: JSON.stringify(params) });
}

export function getDetailTypeList(params) {
  return request(`/borrower/v1/task/deal-result?type=${params}`);
}

// 新注册详情页，获取客户预申请信息
export function fetchGetPreloanInfo(params) {
  return request(`/borrower/v1/task/preloan?actorId=${params}`);
}
// 新注册详情页，获取点融信使信息
export function fetchGetEnvyInfo(params) {
  return request(`/borrower/v1/task/envy?envyId=${params}`);
}
// 新注册获取贷款类型列表
export function fetchGetLoanType() {
  return request('/borrower/v1/task/intention-loan-type');
}
// 新注册贷款类型，贷款期限联动
export function fetchGetLoanDate(params) {
  return request(`/borrower/v1/task/intention-loan-type-cycle?loanType=${params}`);
}
// 新注册处理结果联动下拉框数据获取
export function fetchGetResultOption(params) {
  return request(`/borrower/v1/task/deal-result?type=${params}`);
}
// 新注册详情页操作保存
export function fetchSaveIntention(params) {
  return request('/borrower/v1/task/intention', { method: 'post', body: JSON.stringify(params) });
}
// 风控审核结果列表获取
export function fetchGetReviewList(params) {
  return request(`/borrower/v1/loan/risk/result?aid=${params.actorId}&loanAppId=${params.loanAppId}&topic=${params.topic}&routingSystem=${params.routingSystem}&taskStatus=${params.taskStatus}`, { method: 'post' });
}
// 转给分公司组别获取
export function fetchGetGroupList() {
  return request('/borrower/v1/task/GROUP_TASK/operation/TO_BRANCH/group');
}
// 分配签约人组别获取
export function fetchGetContractGroupList() {
  return request('/borrower/v1/task/GROUP_TASK/operation/TO_CONTRACT/group');
}
// 转给分公司组别联动
export function fetchGetPersonalList(params) {
  return request(`/borrower/getUserByGroupId?groupId=${params}`);
}
// 转给分公司
export function fetchDeploy(params) {
  return request('/borrower/v1/task/deployment', { method: 'post', body: JSON.stringify(params) });
}
// 操作记录查询
export function fetchOperationRecords(params) {
  return request('/borrower/v1/task/operation-records', { method: 'post', body: JSON.stringify(params) });
}
// 获取批复信息

export function getReplyInfo(params) {
  return request(`/borrower/v1/task/reply?routingSystem=${params.routingSystem}&actorId=${params.actorId}&loanAppId=${params.loanAppId}&loanId=${params.loanId}`);
}

// 获取联系列表
export function getContactList(params) {
  return request(`/borrower/customer/contacts?customerId=${params}`);
}

// 新增联系人
export function addContract(params) {
  return request('/borrower/customer/contact-list', { method: 'post', body: JSON.stringify(params) });
}

// 获取短信模板
export function getSmsInfo(params) {
  return request(`/borrower/v1/sms/find-sms?customerId=${params.customerId}&id=${params.id}&taskId=${params.taskId}&step=${params.step}`);
}

// 获或短信模板内
export function getContent(params) {
  return request(`/borrower/v1/sms/templatecontent?customerId=${params.customerId}&template=${params.template}`);
}

// 发送短信
export function sendMsg(params) {
  return request('/borrower/v1/sms/send-sms', { method: 'POST', body: JSON.stringify(params) });
}
// 审核跟进新增第二维度审批进度获取接口
export function schedule(params) {
  return request(`/borrower/v1/loan/${params}/schedule`);
}
// 电话号码列表脱敏
export function getPhoneNo(params) {
  return request(`/borrower/v1/customer/cellphone?id=${params}`);
}

// 详情页电话号码表脱敏
export function getDetailPhoneNo(params) {
  return request(`/borrower/v1/customer/phone?actorId=${params}`);
}

// 详情页身份证脱敏
export function getDetailSsn(params) {
  return request(`/borrower/v1/customer/ssn?actorId=${params}`);
}

// 分配签约人
export function fetchAssign(params) {
  return request('/borrower/v1/task/assignment', { method: 'post', body: JSON.stringify(params) });
}
