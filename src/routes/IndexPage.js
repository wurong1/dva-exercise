import React, { Component } from 'react';
import { Layout, Spin } from 'antd';
import { connect } from 'dva';
import Menu from '../components/menu';
import HeaderTop from '../components/header';
import './IndexPage.less';

const { Header, Content } = Layout;

class IndexPage extends Component {

  componentWillMount() {
    this.props.getLoginInfo();
  }

  render() {
    const { children } = this.props;
    if (!this.props.loginState) {
      return (
        <div className="spin">
          <Spin size="large" />
          <div>加载中...</div>
        </div>
      );
    }
    return (
      <div className="dr-layout">
        <Layout>
          <Header className="dr-header">
            <div className="logo" />
            <HeaderTop />
            <Menu pathname={this.props.location.pathname} />
          </Header>
          <Content>
            <main className="dr-content">{children}</main>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default connect(
  state => ({
    loginState: state.user.loginState,
  }),
  dispatch => ({
    getLoginInfo: () => dispatch({ type: 'user/getLoginInfo' }),
  }),
)(IndexPage);
