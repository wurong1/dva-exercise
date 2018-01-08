import dva from 'dva';
import createLogger from 'dva-logger';
import createLoading from 'dva-loading';
import 'antd/dist/antd.less';
import './index.css';
import './global.less';
import './assets/icomoon/style.css';

require('./plugs/call/idb/idb-shim.js');
require('./plugs/call/idb/idb.js');
require('./plugs/call/api/call-api.js');

// 1. Initialize
const app = dva();

// 2. Plugins
if (process.env.NODE_ENV !== 'production') {
  app.use(createLogger());
}
app.use(createLoading());

// 3. Model

app.model(require('./models/user'));
app.model(require('./models/menu'));
app.model(require('./models/customer/myCustomer'));
app.model(require('./models/customer/allCustomer'));
app.model(require('./models/customer/undistributedCustomer'));
app.model(require('./models/customer/customerDeploy'));
app.model(require('./models/customer/customerDetails'));
app.model(require('./models/customer/addCustomer'));
app.model(require('./models/customer/uploadFailed'));
app.model(require('./models/reAduit'));
app.model(require('./models/createLoan'));
app.model(require('./models/report'));
app.model(require('./models/report/calloutReport'));
app.model(require('./models/report/callStatisticsReport'));
app.model(require('./models/report/assignReport'));
app.model(require('./models/notify'));
app.model(require('./models/assign/assign'));
app.model(require('./models/assign/loanriver'));
app.model(require('./models/assign/fund51'));
app.model(require('./models/assign/wealth'));
app.model(require('./models/task'));
app.model(require('./models/borrowerTasks/teamTasks'));
app.model(require('./models/borrowerTasks/myTasks'));
app.model(require('./models/borrowerTasks/taskDetails'));
app.model(require('./models/borrowerTasks/loanDetail'));
app.model(require('./models/borrowerTasks/preloanInfo'));
app.model(require('./models/borrowerTasks/loanRiver'));
app.model(require('./models/cms/notice'));
app.model(require('./models/cms/knowledge'));
app.model(require('./models/cms/myCollection'));
app.model(require('./models/cms/sortManage'));
app.model(require('./models/cms/pjtManage'));
app.model(require('./models/cms/group'));
app.model(require('./models/converse/tapeRecord'));
app.model(require('./models/converse/myTapeRecord'));
app.model(require('./models/cms/cmsDetail'));
app.model(require('./models/cms/cmsAdd'));
app.model(require('./models/sms/smsRecord'));
app.model(require('./models/sms/smsTemplate'));
app.model(require('./models/sms/smsConstants'));
app.model(require('./models/sms/smsSend'));
app.model(require('./models/calculator'));
app.model(require('./models/assign/mcaGreenOnline'));
app.model(require('./models/homePage'));
app.model(require('./models/config/homeConfig'));
// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
