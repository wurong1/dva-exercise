import React, { Component } from 'react';
import { Tabs } from 'antd';

import SalesMyCustomerPage from './salesMyCustomerPage';
import PhoneSalesMyCustomerPage from './phoneSalesMyCustomer';

const { TabPane } = Tabs;

class MyCustomer extends Component {

  render() {
    return (
      <div className="customer">
        <h3 className="dr-section-font">我的客户</h3>
        <div className="my-customer-container">
          <Tabs defaultActiveKey="phoneSales">
            <TabPane tab="电销" key="phoneSales">
              <PhoneSalesMyCustomerPage />
            </TabPane>
            <TabPane tab="直客" key="sales">
              <SalesMyCustomerPage />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default MyCustomer;
