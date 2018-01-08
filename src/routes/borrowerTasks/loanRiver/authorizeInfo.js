import React, { Component } from 'react';
import { Row, Col } from 'antd';
import '../borrowerTasks.less';

class AuthorizeInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  render() {
    const { pageData } = this.props;
    return (
      <div className="border-bottom">
        <div className="loanriver-form-field redonly-info">
          <Row>
            <Col span={8}>
              <p>身份证实名</p>
              <span>{pageData.ssnVerified ? '已授权' : '未授权'}</span>
            </Col>
            <Col offset={2} span={8}>
              <p>手机运营商</p>
              <span>{pageData.mobileCarrierVerified ? '已授权' : '未授权'}</span>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <p>芝麻信用</p>
              <span>{pageData.zhimaVerified ? '已授权' : '未授权'}</span>
            </Col>
            <Col offset={2} span={8}>
              <p>人脸认证</p>
              <span>{pageData.faceRecognitionVerified ? '已授权' : '未授权'}</span>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <p>联系人</p>
              <span>{pageData.contactsVerified ? '已授权' : '未授权'}</span>
            </Col>
            <Col offset={2} span={8}>
              <p>信用卡</p>
              <span>{pageData.creditCardVerified ? '已授权' : '未授权'}</span>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <p>淘宝认证</p>
              <span>{pageData.taobaoVerified ? '已授权' : '未授权'}</span>
            </Col>
            <Col offset={2} span={8}>
              <p>京东认证</p>
              <span>{pageData.jingdongVerified ? '已授权' : '未授权'}</span>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <p>微博认证</p>
              <span>{pageData.weiboVerified ? '已授权' : '未授权'}</span>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

AuthorizeInfo.propTypes = {
};

export default AuthorizeInfo;

