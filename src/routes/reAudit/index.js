import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';

import WaitAuditPage from './waitAudit';
import EndAuditPage from './endAudit';

const { TabPane } = Tabs;

class ReAuditPage extends Component {

  componentWillMount() {
    const { getEmployeeGroupId } = this.props;
    getEmployeeGroupId();
  }

  render() {
    return (
      <div className="audit">
        <h3 className="dr-section-font">复议审核</h3>
        <div>
          <Tabs defaultActiveKey="waitReAudit" className="tabs">
            <TabPane tab="待审核" key="waitReAudit">
              <WaitAuditPage />
            </TabPane>
            <TabPane tab="已完成" key="endReAudit">
              <EndAuditPage />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    employeeGroupId: state.reAudit.employeeGroupId,
  }),
  dispatch => ({
    getEmployeeGroupId: () => {
      dispatch({ type: 'reAudit/getEmployeeGroupId' });
    },
  }),
)(ReAuditPage);
