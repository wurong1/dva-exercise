import React, { Component } from 'react';
import { Tabs } from 'antd';
import FilterTab from './filterTab';
import StatusTab from './statusTab';

const TabPane = Tabs.TabPane;

class AssignRuleConfig extends Component {
  render() {
    return (
      <div className="assign">
        <h3 className="dr-section-font">过滤配置</h3>
        <div className="crm-tab">
          <Tabs className="tabs">
            <TabPane tab="销售过滤" key="WEALTH" >
              <FilterTab />
            </TabPane>
            <TabPane tab="申请状态过滤" key="STATUS" >
              <StatusTab />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default AssignRuleConfig;

