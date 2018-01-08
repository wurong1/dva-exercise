import React, { Component } from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';
import MyNewTaskPage from './myNewTask';
import MyLoanTaskPage from './myLoanTask';
import MyHoldTaskPage from './myHoldTask';
import MySignTaskPage from './mySignTask';
import MyAllTaskPage from './myAllTask';

const { TabPane } = Tabs;

class MyTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flage: false,
    };
  }

  tabChange = () => {
    const { clearTabListData } = this.props;
    clearTabListData();
  }

  render() {
    return (
      <div className="task">
        <h3 className="dr-section-font">我的任务</h3>
        <div className="task-container">
          <Tabs defaultActiveKey="new" onChange={this.tabChange}>
            <TabPane tab="新注册" key="new">
              <MyNewTaskPage />
            </TabPane>
            <TabPane tab="引导进件" key="loan">
              <MyLoanTaskPage />
            </TabPane>
            <TabPane tab="审核跟进" key="hold">
              <MyHoldTaskPage />
            </TabPane>
            <TabPane tab="签约" key="sign">
              <MySignTaskPage />
            </TabPane>
            <TabPane tab="所有任务" key="all">
              <MyAllTaskPage />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  dispatch => ({
    clearTabListData: () => dispatch({ type: 'myTasks/clearTabListData' }),
  }),
)(MyTasks);
