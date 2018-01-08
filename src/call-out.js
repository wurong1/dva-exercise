import dva from 'dva';
import createLogger from 'dva-logger';
import createLoading from 'dva-loading';
import 'antd/dist/antd.less';
import Callout from './routes/call/callOut';
import './assets/icomoon/style.css';
import './index.css';
import './global.less';

require('./plugs/call/idb/idb-shim.js');
require('./plugs/call/idb/idb.js');
require('./plugs/call/api/call-api.js');

// 1. Initialize
const app = dva();

// 2. Plugins
app.use(createLogger());
app.use(createLoading());

// 3. Model

app.model(require('./models/call'));
app.model(require('./models/user'));

// 4. Router
app.router(() => <Callout />);

// 5. Start
app.start('#root');
