import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Icon, Dropdown, Menu } from 'antd';
import SettingExt from './setting-ext';
import './header.less';

class Header extends Component {
  componentWillMount() {
    this.props.getAgentConf();
  }
  render() {
    const { userInfo, callVendor, unReceivedCount = {}, isFetching } = this.props;
    const totalCount = (unReceivedCount.hold || 0) + (unReceivedCount.approved || 0);
    const menu = (
      <Menu>
        <Menu.Item>
          <span className="header-dropdown">工号: &nbsp;{callVendor.agentNo} </span>
        </Menu.Item>
        <Menu.Item>
          <span className="header-dropdown"><a href="/logout/cas">安全退出</a></span>
        </Menu.Item>
      </Menu>
    )
    return (
      <div className="header-info">
        <Spin spinning={userInfo.isfetching || isFetching}>
          <Link to='/notification'>
            <div style={{'float': 'left'}}>
              <span>消息</span>
              {totalCount > 0 ? <div className="msg-num">{totalCount}</div> : ''}
            </div>
          </Link>
          <SettingExt />
          <Dropdown overlay={menu} placement="bottomRight">
            <span title={userInfo.name}>
              {userInfo.name && userInfo.name.length > 5 ? `${userInfo.name.substr(0, 5)}...` : userInfo.name} 
              <Icon type="down" />
            </span>
          </Dropdown>
        </Spin>
      </div>
    );
  }
}

export default connect(
  state => ({
    callVendor: state.user.callVendor,
    userInfo: state.user.userInfo,
    unReceivedCount: state.notify.unReceivedCount,
    isFetching: state.notify.isFetching,
  }),
  dispatch => ({
    getAgentConf: () => dispatch({ type: 'user/getAgentConf' }),
    initSocket: () => dispatch({type: 'notify/initSocket'}),
  }),
)(Header);
