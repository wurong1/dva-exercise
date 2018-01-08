import React, { Component } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';

import HomePagePlate from './homePage';
import './homePage.less';

class HomePage extends Component {

  componentWillMount() {
    const { getHomeConfig } = this.props;
    getHomeConfig();
  }

  render() {
    const { configList, configListLoading } = this.props;
    return (
      <Spin spinning={configListLoading}>
        {
          configListLoading ? null : <HomePagePlate configList={configList} />
        }
      </Spin>
    );
  }
}

export default connect(
  state => ({
    configList: state.homePage.configList,
    configListLoading: state.homePage.configListLoading,
  }),
  dispatch => ({
    getHomeConfig: () => dispatch({ type: 'homePage/getHomeConfig' }),
  }),
)(HomePage);
