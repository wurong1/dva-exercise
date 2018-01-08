import React, { Component } from 'react';
import { Tabs } from 'antd';
import PosInfo from './posInfo';
import Commercial from './commercialInfo';

const TabPane = Tabs.TabPane;

class UnionPay extends Component {
  render() {
    return (
      <div className="task">
        <h3 className="dr-section-font">银联pos查询</h3>
        <div className="task-content">
          <Tabs>
            <TabPane tab="银联pos信息查询" key="1" >
              <PosInfo />
            </TabPane>
            <TabPane tab="商户编号查询" key="2" >
              <Commercial />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default UnionPay;

