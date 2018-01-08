import React, { Component } from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';
import TeamNewTaskPage from './teamNewTask';
import TeamLoanTaskPage from './teamLoanTask';
import TeamHoldTaskPage from './teamHoldTask';
import TeamSignTaskPage from './teamSignTask';
import TeamAllTaskPage from './teamAllTask';

const { TabPane } = Tabs;

class TeamTasks extends Component {
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
        <h3 className="dr-section-font">团队任务</h3>
        <div className="task-container">
          <Tabs defaultActiveKey="new" onChange={this.tabChange}>
            <TabPane tab="新注册" key="new">
              <TeamNewTaskPage />
            </TabPane>
            <TabPane tab="引导进件" key="loan">
              <TeamLoanTaskPage />
            </TabPane>
            <TabPane tab="审核跟进" key="hold">
              <TeamHoldTaskPage />
            </TabPane>
            <TabPane tab="签约" key="sign">
              <TeamSignTaskPage />
            </TabPane>
            <TabPane tab="所有任务" key="all">
              <TeamAllTaskPage />
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
    clearTabListData: () => dispatch({ type: 'teamTasks/clearTabListData' }),
  }),
)(TeamTasks);
