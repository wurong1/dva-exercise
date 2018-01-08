import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Button, Select, Input, Form, Row, Col, Checkbox, Dropdown, Menu, Icon } from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;

class AddContract extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNo: null,
      weixinNo: null,
      qqNo: null,
      mailNo: null,
      phoneStatus: null,
      qqStatus: null,
      weixinStatus: null,
      mailStatus: null,
    };
  }

  setPhoneStatus = (e) => {
    this.setState({ phoneStatus: e.target.checked ? 'Y' : null });
  }

  setQqStatus = (e) => {
    this.setState({ qqStatus: e.target.checked ? 'Y' : null });
  }

  setWeixinStatus = (e) => {
    this.setState({ weixinStatus: e.target.checked ? 'Y' : null });
  }
  setMailStatus = (e) => {
    this.setState({ mailStatus: e.target.checked ? 'Y' : null });
  }

  handlePhoneChange = (e) => {
    this.setState({ phoneNo: e.target.value });
  }

  handleWeixinChange = (e) => {
    this.setState({ weixinNo: e.target.value });
  }

  handleQQChange = (e) => {
    this.setState({ qqNo: e.target.value });
  }

  handleMailChange = (e) => {
    this.setState({ mailNo: e.target.value });
  }

  addContract = (type) => {
    let flag = true;
    if (type === 'PHONE') {
      this.props.form.validateFields(['phoneNo'], (err) => {
        if (err) {
          flag = false;
        }
      });
    } else if (type === 'MAIL') {
      this.props.form.validateFields(['mailNo'], (err) => {
        if (err) {
          flag = false;
        }
      });
    } else if (type === 'QQ') {
      this.props.form.validateFields(['qqNo'], (err) => {
        if (err) {
          flag = false;
        }
      });
    } else if (type === 'WEIXIN') {
      this.props.form.validateFields(['weixinNo'], (err) => {
        if (err) {
          flag = false;
        }
      });
    }
    if (!flag) return false;
    const {
      phoneNo,
      weixinNo,
      qqNo,
      mailNo,
      phoneStatus,
      weixinStatus,
      qqStatus,
      mailStatus,
    } = this.state;
    const { taskDetail: { customerInfor: { customerId } } } = this.props;
    let contactNo;
    let enableBusy;
    switch (type) {
      case 'PHONE' : contactNo = phoneNo; enableBusy = phoneStatus; break;
      case 'WEIXIN' : contactNo = weixinNo; enableBusy = weixinStatus; break;
      case 'QQ' : contactNo = qqNo; enableBusy = qqStatus; break;
      case 'MAIL' : contactNo = mailNo; enableBusy = mailStatus; break;
      default: contactNo = null;
    }
    if (type === 'PHONE' || type === 'MAIL') {
      this.props.addContract({
        contactNo,
        customerId,
        typeCode: type,
        enableBusy: enableBusy ? [enableBusy] : [],
      });
    } else {
      this.props.addContract({
        contactNo,
        customerId,
        typeCode: type,
        enableFriendship: enableBusy ? [enableBusy] : [],
      });
    }
  }

  checkPhone = (rule, value, callback) => {
    const patten = /^([0-9]{2,4}-?)?([0-9]{3,4}-?[0-9]{4})(-[0-9]{1,4})?$/;
    if (value && patten.test(value)) {
      callback();
    } else {
      callback('请输入正确的手机号！');
    }
  }

  checkEmail = (rule, value, callback) => {
    const patten = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
    if (value && patten.test(value)) {
      callback();
    } else {
      callback('请输入正确的邮箱！');
    }
  }

  handleMenuClick = (e) => { // 新增联系方式-电话列表脱敏
    this.props.getPhoneOfAdd(e.key);
  }

  showPhoneNo = (id, e) => {
    e.stopPropagation();
    this.props.showPhoneOfAdd(id);
  }

  handleVisibleChange = (flag) => {
    this.setState({ visible: flag });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      contract: {
        mailList,
        weixinList,
        qqList,
        isBusyNoOfAdd,
        addCurrentPhoneNo,
        defaultMail,
        defaultQq,
        defaultWeixin,
        phoneListOfAdd,
      },
      addContractModal: {
       loading,
      },
    } = this.props;
    const dqq = defaultQq || (qqList.length > 0 ? qqList[0].id : '');
    const dweixin = defaultWeixin || (weixinList.length > 0 ? weixinList[0].id : '');
    const dmail = defaultMail || (mailList.length > 0 ? mailList[0].id : '');
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        {
          phoneListOfAdd.map((item) => {
            return (
              <Menu.Item key={item.id}>
                {`${item.showOriginPhone ? item.originNo : item.contactNo}${item.enableBusy === 'Y' ? '(常用)' : ''}`}
                <span
                  className={item.showOriginPhone ? 'icon-showpsw' : 'icon-closepsw'}
                  style={{ marginLeft: '5px' }}
                  onClick={this.showPhoneNo.bind(this, item.id)}
                />
              </Menu.Item>
            );
          })
        }
      </Menu>
    );
    return (
      <div>
        <Spin spinning={loading}>
          <Form>
            <Row>
              <Col span={4}>
                联系电话
              </Col>
              <Col span={16}>
                <Dropdown
                  overlay={menu}
                  trigger={['click']}
                  onVisibleChange={this.handleVisibleChange}
                  visible={this.state.visible}
                >
                  <Button style={{ width: '100%', textAlign: 'left' }}>
                    {isBusyNoOfAdd ? `${addCurrentPhoneNo}(常用)` : addCurrentPhoneNo}
                    <Icon type="down" style={{ float: 'right' }} />
                  </Button>
                </Dropdown>
                <Row style={{ marginTop: '15px' }}>
                  <Col span={12}>
                    <FormItem
                      label={null}
                    >
                      {getFieldDecorator('phoneNo', {
                        rules: [{
                          validator: this.checkPhone,
                        }],
                      })(
                        <Input
                          placeholder="输入客户手机号"
                          onChange={this.handlePhoneChange}
                        />,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                    <Checkbox onChange={this.setPhoneStatus}>是否常用号码</Checkbox>
                  </Col>
                </Row>
              </Col>
              <Col span={3} offset={1}>
                <Button type="primary" onClick={this.addContract.bind(this, 'PHONE')}>保存</Button>
              </Col>
            </Row>
            <Row>
              <Col span={4}>
                QQ
              </Col>
              <Col span={16}>
                <Select
                  style={{ width: '100%' }}
                  defaultValue={`${dqq}`}
                >
                  {
                    qqList.map((item, idx) => {
                      return <Option value={`${item.id}`} key={idx}>{`${item.contactNo}${item.enableFriendship === 'Y' ? '(已添加)' : ''}`}</Option>;
                    })
                  }
                </Select>
                <Row style={{ marginTop: '15px' }}>
                  <Col span={12}>
                    <FormItem
                      label={null}
                    >
                      {getFieldDecorator('qqNo', {
                        rules: [{
                          required: true, message: '不能为空',
                        }],
                      })(
                        <Input
                          placeholder="输入客户QQ"
                          onChange={this.handleQQChange}
                        />,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                    <Checkbox onChange={this.setQqStatus}>是否已添加</Checkbox>
                  </Col>
                </Row>
              </Col>
              <Col span={3} offset={1}>
                <Button type="primary" onClick={this.addContract.bind(this, 'QQ')}>保存</Button>
              </Col>
            </Row>
            <Row>
              <Col span={4}>
                微信
              </Col>
              <Col span={16}>
                <Select
                  style={{ width: '100%' }}
                  defaultValue={`${dweixin}`}
                >
                  {
                    weixinList.map((item, idx) => {
                      return <Option value={`${item.id}`} key={idx}>{`${item.contactNo}${item.enableFriendship === 'Y' ? '(已添加)' : ''}`}</Option>;
                    })
                  }
                </Select>
                <Row style={{ marginTop: '15px' }}>
                  <Col span={12}>
                    <FormItem
                      label={null}
                    >
                      {getFieldDecorator('weixinNo', {
                        rules: [{
                          required: true, messag: '不能为空',
                        }],
                      })(
                        <Input
                          placeholder="输入客户微信号"
                          onChange={this.handleWeixinChange}
                        />,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                    <Checkbox onChange={this.setWeixinStatus}>是否已添加</Checkbox>
                  </Col>
                </Row>
              </Col>
              <Col span={3} offset={1}>
                <Button type="primary" onClick={this.addContract.bind(this, 'WEIXIN')}>保存</Button>
              </Col>
            </Row>
            <Row>
              <Col span={4}>
                邮箱
              </Col>
              <Col span={16}>
                <Select
                  style={{ width: '100%' }}
                  defaultValue={`${dmail}`}
                >
                  {
                    mailList.map((item, idx) => {
                      return <Option value={`${item.id}`} key={idx}>{`${item.contactNo}${item.enableBusy === 'Y' ? '(常用)' : ''}`}</Option>;
                    })
                  }
                </Select>
                <Row style={{ marginTop: '15px' }}>
                  <Col span={12}>
                    <FormItem
                      label={null}
                    >
                      {getFieldDecorator('mailNo', {
                        rules: [{
                          validator: this.checkEmail,
                        }],
                      })(
                        <Input placeholder="输入客户邮箱" onChange={this.handleMailChange} />,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                    <Checkbox onChange={this.setMailStatus}>是否常用邮箱</Checkbox>
                  </Col>
                </Row>
              </Col>
              <Col span={3} offset={1}>
                <Button type="primary" onClick={this.addContract.bind(this, 'MAIL')}>保存</Button>
              </Col>
            </Row>
          </Form>
        </Spin>
      </div>
    );
  }
}

export default connect(
  state => ({
    contract: state.taskDetails.contract,
    addContractModal: state.taskDetails.addContractModal,
    taskDetail: state.taskDetails.taskDetailsList || {},
  }),
  dispatch => ({
    addContract: params => dispatch({ type: 'taskDetails/addContract', payload: params }),
    getPhoneOfAdd: params => dispatch({ type: 'taskDetails/getPhoneOfAdd', payload: params }),
    showPhoneOfAdd: params => dispatch({ type: 'taskDetails/showPhoneOfAdd', payload: params }),
  }),
)(Form.create()(AddContract));

