import React, { Component } from 'react';
import { Tabs } from 'antd';
import SalesAllCustomerPage from './salesAllCustomer';
import PhoneSalesAllCustomerPage from './phoneSalesAllCustomer';

const { TabPane } = Tabs;

class AllCustomer extends Component {

  render() {
    return (
      <div className="customer">
        <h3 className="dr-section-font">所有客户</h3>
        <div className="all-customer-container">
          <Tabs defaultActiveKey="phoneSales">
            <TabPane tab="电销" key="phoneSales">
              <PhoneSalesAllCustomerPage />
            </TabPane>
            <TabPane tab="直客" key="sales">
              <SalesAllCustomerPage />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default AllCustomer;
