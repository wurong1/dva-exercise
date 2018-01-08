import React, { Component } from 'react';
import { Tabs } from 'antd';
import SalesUndistributedCustomerPage from './salesUndistributedCustomer';
import PhoneSalesUndistributedCustomerPage from './phoneSalesUndistributedCustomer';

const { TabPane } = Tabs;

class UndistributedCustomer extends Component {

  render() {
    return (
      <div className="customer">
        <h3 className="dr-section-font">未分配客户</h3>
        <div className="all-customer-container">
          <Tabs defaultActiveKey="phoneSales">
            <TabPane tab="电销" key="phoneSales">
              <PhoneSalesUndistributedCustomerPage />
            </TabPane>
            <TabPane tab="直客" key="sales">
              <SalesUndistributedCustomerPage />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default UndistributedCustomer;
