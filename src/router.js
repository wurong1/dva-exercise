import React from 'react';
import { Router, IndexRoute, Route } from 'dva/router';
import IndexPage from './routes/IndexPage';
import AllCustomer from './routes/customer/allCustomer';
import MyCustomer from './routes/customer/myCustomer';
import UndistributedCustomer from './routes/customer/UndistributedCustomer';
import CustomerDetails from './routes/customer/customerDetails';
import AddCustomerPage from './routes/customer/addCustomer';
import UploadFailedPage from './routes/customer/uploadFailedHistory';
import ReAuditPage from './routes/reAudit';
import ReAuditDetailsPage from './routes/reAudit/reAuditDetails';
import CreteLoan from './routes/createLoan';
import TaskReport from './routes/report/taskReportSale';
import LoanApplicationReport from './routes/report/loanApplicationReport';
import RepaymentReport from './routes/report/repaymentReport';
import CalloutReport from './routes/report/calloutReport';
import CallStatisticsReportByTime from './routes/report/callStatisticsReportByTime';
import CallStatisticsReportByTeam from './routes/report/callStatisticsReportByTeam';
import Notification from './routes/notify';
import NotifiySetting from './routes/notify/notifySetting';
import AssignRuleConfig from './routes/assign/filterTab';
import AssignStatusConfig from './routes/assign/statusTab';
import BorrowerLoanInfo from './routes/task/borrowerLoanInfo';
import RepayInfoDetails from './routes/task/repayInfoDetails';
import UnionPay from './routes/task/unionPay';
import UnionPayDetail from './routes/task/unionPayDetail';
import TeamTasks from './routes/borrowerTasks/teamTasks';
import MyTasks from './routes/borrowerTasks/myTasks';
import ContractorPage from './routes/borrowerTasks/teamContractorTask';
import MyContractorPage from './routes/borrowerTasks/myContractorTask';
import TaskDetails from './routes/borrowerTasks/taskDetails';
import NoSalesTask from './routes/borrowerTasks/nosalesTask';
import PreloanInfo from './routes/borrowerTasks/preloanInfo';
import ArticleEdit from './routes/cms/articleEdit';
import NoticePage from './routes/cms/notice';
import KnowledgePage from './routes/cms/knowledge';
import CollectionPage from './routes/cms/collection';
import SortManagePage from './routes/cms/sortManage';
import ProjectManagePage from './routes/cms/projectManage';
import cmsGroup from './routes/cms/group';
import TapeRecordPage from './routes/converse/tapeRecord';
import MyTapeRecordPage from './routes/converse/myTapeRecord';
import ArticleDetail from './routes/cms/articleDetail';
import ArticleAdd from './routes/cms/articleAdd';
import MySmsRecord from './routes/sms/mySmsRecord';
import AllSmsRecord from './routes/sms/allSmsRecord';
import SmsTemplate from './routes/sms/smsTemplate';
import TemplateDetail from './routes/sms/templateDetail';
import SmsConstants from './routes/sms/smsConstants';
import SmsSend from './routes/sms/smsSend';
import SmsFaieldList from './routes/sms/smsFaieldList';
import SmsFaieldDetail from './routes/sms/smsFaieldDetail';
import Calculator from './routes/calculator';
import TaskDelay from './routes/task/taskDelay';
import AssignReport from './routes/report/assignReport';
import HomePage from './routes/homePage';
import HomeConfigPage from './routes/config/homeConfig';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={IndexPage}>
        <IndexRoute component={HomePage} />
        <Route path="myCustomers" component={MyCustomer} />
        <Route path="allCustomers" component={AllCustomer} />
        <Route path="undistributed-customer" component={UndistributedCustomer} />
        <Route path="customerDetails" component={CustomerDetails} />
        <Route path="toAddborrowcustomer" component={AddCustomerPage} />
        <Route path="toUploadFialedList" component={UploadFailedPage} />
        <Route path="reAudit" component={ReAuditPage} />
        <Route path="reAuditDetails" component={ReAuditDetailsPage} />
        <Route path="createLoan" component={CreteLoan} />
        <Route path="taskStatistics" component={TaskReport} />
        <Route path="loan_application_report" component={LoanApplicationReport} />
        <Route path="loan_repayment_report" component={RepaymentReport} />
        <Route path="call-record-report" component={CalloutReport} />
        <Route path="tellphone-statistics-report" component={CallStatisticsReportByTime} />
        <Route path="assign-report" component={AssignReport} />
        <Route path="tellphone-statistics-team" component={CallStatisticsReportByTeam} />
        <Route path="notification" component={Notification} />
        <Route path="notifiySetting" component={NotifiySetting} />
        <Route path="assignActorRuleConfig" component={AssignRuleConfig} />
        <Route path="assignActorTaskStatusConfig" component={AssignStatusConfig} />
        <Route path="borrowerLoanInfo" component={BorrowerLoanInfo} />
        <Route path="repayInfoDetails" component={RepayInfoDetails} />
        <Route path="unionPay" component={UnionPay} />
        <Route path="unionPayDetail" component={UnionPayDetail} />
        <Route path="teamTasks" component={TeamTasks} />
        <Route path="myTasks" component={MyTasks} />
        <Route path="teamContractor" component={ContractorPage} />
        <Route path="myContractor" component={MyContractorPage} />
        <Route path="taskDetails" component={TaskDetails} />
        <Route path="preloanInfo" component={PreloanInfo} />
        <Route path="no-sales-tasks" component={NoSalesTask} />
        <Route path="articleEdit" component={ArticleEdit} />
        <Route path="notice" component={NoticePage} />
        <Route path="knowledge" component={KnowledgePage} />
        <Route path="collection" component={CollectionPage} />
        <Route path="sortManage" component={SortManagePage} />
        <Route path="projectManage" component={ProjectManagePage} />
        <Route path="records" component={TapeRecordPage} />
        <Route path="callrecords" component={MyTapeRecordPage} />
        <Route path="articleDetail" component={ArticleDetail} />
        <Route path="article-add" component={ArticleAdd} />
        <Route path="tapeRecord" component={TapeRecordPage} />
        <Route path="myTapeRecord" component={MyTapeRecordPage} />
        <Route path="sms-my-record" component={MySmsRecord} />
        <Route path="sms-all-record" component={AllSmsRecord} />
        <Route path="sms-template" component={SmsTemplate} />
        <Route path="templateDetail" component={TemplateDetail} />
        <Route path="sms-constants" component={SmsConstants} />
        <Route path="sms-send" component={SmsSend} />
        <Route path="sms-faield-list" component={SmsFaieldList} />
        <Route path="sms-faield-detail" component={SmsFaieldDetail} />
        <Route path="cms-group" component={cmsGroup} />
        <Route path="calculator" component={Calculator} />
        <Route path="task-delay" component={TaskDelay} />
        <Route path="home" component={HomePage} />
        <Route path="home-config" component={HomeConfigPage} />
      </Route>
    </Router>
  );
}

export default RouterConfig;
