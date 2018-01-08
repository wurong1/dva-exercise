import React, { Component } from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';

import AuditDetails from './auditDetails';
import ReAuditRecord from './reAuditRecord';

const { TabPane } = Tabs;

class ReAuditDetailsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loanAppId: this.props.routingQuery.loanAppId,
      reviewId: this.props.routingQuery.reviewVersion,
    };
  }

  componentWillMount() {
    const { auditDetails, getBaseInfo, getConfig, getActorBaseInfo } = this.props;
    auditDetails(this.state);
    getBaseInfo(this.state);
    getConfig(this.state);
    getActorBaseInfo(this.state);
  }
  render() {
    return (
      <div className="audit">
        <h3 className="dr-section-font">复议详情</h3>
        <div>
          <Tabs defaultActiveKey="auditDetails" className="tabs">
            <TabPane tab="审核详情" key="auditDetails">
              <AuditDetails />
            </TabPane>
            <TabPane tab="复议记录" key="reAuditRecord">
              <ReAuditRecord />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    routingQuery: state.routing.locationBeforeTransitions.query,
  }),
  dispatch => ({
    auditDetails: (parameter) => {
      dispatch({ type: 'reAudit/auditDetails', payload: parameter });
    },
    getBaseInfo: (parameter) => {
      dispatch({ type: 'reAudit/getBaseInfo', payload: parameter });
    },
    getConfig: (parameter) => {
      dispatch({ type: 'reAudit/getConfig', payload: parameter });
    },
    getActorBaseInfo: (parameter) => {
      dispatch({ type: 'reAudit/getActorBaseInfo', payload: parameter });
    },
  }),
)(ReAuditDetailsPage);
