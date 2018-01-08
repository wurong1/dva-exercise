import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Modal, Radio, message, Row, Col, Spin } from 'antd';

import RegisteredModal from './registeredUser';
import TrimInput from '../../components/input-trim';
import './createLoan.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const phoneRegExp = /^(1(3|4|5|7|8)[0-9]{9})$/;
const referCodeRegExp = /^[0-9]*$/;
const passwordRegExp = /^(?=[`~!@#\$%\^&*\(\)\-_=\+:;,.<>\/\?\d]*[a-zA-Z]+)(?=[a-zA-Z`~!@#\$%\^&*\(\)\-_=\+:;,.<>\/\?]*\d+)[`~!@#\$%\^&*\(\)\-_=\+:;,.<>\/\?\w]{8,20}$/;

message.config({
  top: 100,
  duration: 5,
});

class CreateUserPage extends Component {

  state = {
    company: false,
  };

  componentWillMount() {
    const { stepOneData } = this.props;
    if (stepOneData) {
      this.setState({ company: stepOneData.company || false });
    }
  }

  onOk = (e) => {
    e.preventDefault();
    const { chooseList, existedCreateLoan } = this.props;
    if (chooseList) {
      existedCreateLoan(chooseList);
    } else {
      message.info('请选择用户！');
    }
  };

  onCancel = (e) => {
    e.preventDefault();
    const { temporaryId, closeResgisterModal } = this.props;
    temporaryId(null);
    closeResgisterModal();
  };

  companyChange = (e) => {
    this.setState({ company: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { createActor, form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        createActor(values, this.state);
      }
    });
  };

  showModal = () => {
    const { openResgisterModal } = this.props;
    openResgisterModal();
  };

  render() {
    const { company } = this.state;
    const { stepOneData, stepOneLoading, isResgisterModalShow, existedCreateLoanLoading,
       form: { getFieldDecorator } } = this.props;
    const phone = (stepOneData && stepOneData.phone) || '';
    const ssn = (stepOneData && stepOneData.ssn) || '';
    const referCode = (stepOneData && stepOneData.referCode) || '';
    return (
      <Row type="flex" justify="center">
        <Col span="18">
          <Spin spinning={stepOneLoading}>
            <div className="createLoan-content">
              <div className="radio-tab">
                <RadioGroup className="width-100 text-center" onChange={this.companyChange} defaultValue={company} size="large">
                  <RadioButton value={false} className="width-50">个人用户</RadioButton>
                  <RadioButton value={true} className="width-50">企业用户</RadioButton>
                </RadioGroup>
              </div>
              <Form onSubmit={this.handleSubmit} className="padding-25p form-label-left">
                {
                  company ?
                    <div>
                      <FormItem label="企业证件号" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                        {getFieldDecorator('ssn', {
                          initialValue: ssn,
                          rules: [{ required: true, message: '请输入正确的企业证件号！' }],
                        })(
                          <TrimInput placeholder="请输入企业证件号" />,
                        )}
                      </FormItem>
                      <FormItem label="密码" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                        {getFieldDecorator('spassword', {
                          rules: [{ required: true, pattern: passwordRegExp, message: '请输入8-20位密码,需包括英文和数字！' }],
                        })(
                          <Input placeholder="请输入密码" type="password" />,
                        )}
                      </FormItem>
                      <FormItem label="销售推荐码" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                        {getFieldDecorator('sreferCode', {
                          initialValue: referCode,
                          rules: [{ required: true, pattern: referCodeRegExp, message: '请输入正确的销售推荐码！' }],
                        })(
                          <TrimInput placeholder="请输入推荐码" />,
                        )}
                      </FormItem>
                    </div>
                    :
                    <div>
                      <FormItem label="手机" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                        {getFieldDecorator('phone', {
                          initialValue: phone,
                          rules: [{ required: true, pattern: phoneRegExp, message: '请输入正确的手机号！' }],
                        })(
                          <TrimInput placeholder="请输入手机号" />,
                        )}
                      </FormItem>
                      <FormItem label="密码" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                        {getFieldDecorator('ppassword', {
                          rules: [{ required: true, pattern: passwordRegExp, message: '请输入8-20位密码,需包括英文和数字！' }],
                        })(
                          <Input placeholder="请输入密码" type="password" />,
                        )}
                      </FormItem>
                      <FormItem label="销售推荐码" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                        {getFieldDecorator('preferCode', {
                          initialValue: referCode,
                          rules: [{ required: true, pattern: referCodeRegExp, message: '请输入正确的销售推荐码！' }],
                        })(
                          <TrimInput placeholder="请输入推荐码" />,
                        )}
                      </FormItem>
                    </div>
              }
                <Row>
                  <Col offset="6" style={{ lineHeight: '35px' }}>
                    <Row>
                      <Col span="12">
                        <Button htmlType="submit" className="green-btn" >确认创建</Button>
                      </Col>
                      <Col span="12" className="text-right">
                        <a onClick={this.showModal}>已注册用户</a>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form>
              <Modal width={800} onOk={this.onOk} onCancel={this.onCancel} visible={isResgisterModalShow} confirmLoading={existedCreateLoanLoading} title="已注册用户选择" >
                <RegisteredModal />
              </Modal>
            </div>
          </Spin>
        </Col>
      </Row>
    );
  }
}

CreateUserPage.propTypes = {
};

export default connect(
  state => ({
    createActorList: state.createLoan.createActorList,
    chooseList: state.createLoan.chooseList,
    stepOneData: state.createLoan.stepOneData,
    stepOneLoading: state.createLoan.stepOneLoading,
    isResgisterModalShow: state.createLoan.isResgisterModalShow,
    existedCreateLoanLoading: state.createLoan.existedCreateLoanLoading,
  }),
  dispatch => ({
    existedCreateLoan: (chooseList) => {
      const resultList = chooseList;
      resultList.ssn = chooseList.idCard;
      resultList.actorId = chooseList.id;
      resultList.phone = chooseList.cellphone;
      resultList.referCode = chooseList.referrerId;
      dispatch({ type: 'createLoan/existedCreateLoan', payload: resultList });
    },
    temporaryId: (chooseList) => {
      dispatch({ type: 'createLoan/temporaryId', payload: chooseList });
    },
    createActor: (formData, state) => {
      const resultData = {};
      if (state.company) {
        resultData.ssn = formData.ssn;
        resultData.password = formData.spassword;
        resultData.referCode = formData.sreferCode;
      } else {
        resultData.phone = formData.phone;
        resultData.password = formData.ppassword;
        resultData.referCode = formData.preferCode;
      }
      resultData.company = state.company;
      dispatch({ type: 'createLoan/createActor', payload: resultData });
    },
    openResgisterModal: () => {
      dispatch({ type: 'createLoan/openResgisterModal' });
    },
    closeResgisterModal: () => {
      dispatch({ type: 'createLoan/closeResgisterModal' });
    },
  }),
)(Form.create()(CreateUserPage));

