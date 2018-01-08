import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import WealthConfig from './wealthConfig';
import LoanRiverConfig from './loanRiverConfig';
import Fund51Config from './fund51Config';
import McaGreenOnlineConfig from './mcaGreenOnlineConfig';

import './assign.less';

const TabPane = Tabs.TabPane;
class FilterTab extends Component {
  componentDidMount() {
    this.props.getButtonConfig();
  }

  renderTab = (code) => {
    let tab = null;
    switch (code) {
      case 'BUTTON_SPEED_LOAN':
        tab = <WealthConfig />; break;
      case 'BUTTON_LOAN_RIVER':
        tab = <LoanRiverConfig />; break;
      case 'BUTTON_DOUBLE_FUND_ONLINE':
        tab = <Fund51Config />; break;
      case 'BUTTON_MCA_GREENLANE_ONLINE':
        tab = <McaGreenOnlineConfig />; break;
      default:
        tab = null;
    }
    return tab;
  }

  render() {
    const { btnConfig } = this.props;
    const buttonChildren = btnConfig.buttonChildren || [];
    const { falg } = btnConfig;
    return (
      <div className="assign">
        <h3 className="dr-section-font">销售过滤</h3>
        <div className="crm-tab">
          {
            falg === 'loading' &&
            <div>加载中，请稍后...</div>
          }
          {
            falg === 'success' &&
            <Tabs className="tabs">
              {
                buttonChildren.map((item) => {
                  return (
                    <TabPane tab={item.label} key={item.code} >
                      {this.renderTab(item.code)}
                    </TabPane>
                  );
                })
              }
            </Tabs>
          }
          {
            falg === 'faild' &&
            <div>加载失败！</div>
          }
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    btnConfig: state.assign.btnConfig,
  }),
  dispatch => ({
    getButtonConfig: () => dispatch({ type: 'assign/getButtonConfig' }),
  }),
)(FilterTab);
