import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, message, Row, Col, Select, Spin } from 'antd';

import RegisteredModal from './registeredUser';
import TrimInput from '../../components/input-trim';
import './createLoan.less';

const FormItem = Form.Item;
const Option = Select.Option;
const idCardRegExp = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

class CertificationPage extends Component {

  state = {
    isPersonal: true,
  };

  componentWillMount() {

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

  handleSubmit = (e) => {
    e.preventDefault();
    const { authActor, stepTwoData, form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        authActor(values, stepTwoData);
      }
    });
  };

  showModal = () => {
    const { openResgisterModal } = this.props;
    openResgisterModal();
  }

  render() {
    const { form: { getFieldDecorator }, stepTwoLoading, isResgisterModalShow, existedCreateLoanLoading,
    stepTwoData: { company, actorId, phone, email, ssn, userName, enterpriseForm },
    } = this.props;
    const isDisabled = !!ssn;
    return (
      <Row type="flex" justify="center">
        <Col span="18">
          <Spin spinning={stepTwoLoading}>
            <div className="createLoan-content">
              {
                !company ?
                  <div>
                    <div className="padding-25p" style={{ borderBottom: '1px solid #DFDFDF' }}>
                      <div className="form-legend-text margin-bottom-10p">账号信息</div>
                      <Row>
                        <Col span="6" className="text-left margin-bottom-10p">借款人ID:</Col>
                        <Col span="18">{actorId}</Col>
                      </Row>
                      <Row>
                        <Col span="6" className="text-left">账号：</Col>
                        <Col span="18">{phone || email}</Col>
                      </Row>
                    </div>
                    <Form onSubmit={this.handleSubmit} className="form-label-left  padding-25p">
                      <FormItem label="姓名" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                        {getFieldDecorator('userName', {
                          initialValue: userName || '',
                          rules: [{ required: true, message: '请输入正确的中文名！' }],
                        })(
                          <TrimInput placeholder="请输入姓名" />,
                        )}
                      </FormItem>
                      <FormItem label="身份证" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                        {getFieldDecorator('ssn', {
                          initialValue: ssn || '',
                          rules: [{ required: true, pattern: idCardRegExp, message: '请输入正确的证件号码！' }],
                        })(
                          <TrimInput placeholder="请输入身份证号" disabled={isDisabled} />,
                        )}
                      </FormItem>
                      <Row>
                        <Col offset="6" style={{ lineHeight: '35px' }}>
                          <Row>
                            <Col span="12">
                              <Button htmlType="submit" className="green-btn" >提交认证</Button>
                            </Col>
                            <Col span="12" className="text-right">
                              <a onClick={this.showModal}>已注册用户</a>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                  :
                  <div>
                    <div className="padding-25p" style={{ 'border-bottom': '1px solid #DFDFDF' }}>
                      <div className="form-legend-text margin-bottom-10p">账号信息</div>
                      <Row>
                        <Col span="6" className="text-left margin-bottom-10p">借款人ID:</Col>
                        <Col span="18">{actorId}</Col>
                      </Row>
                    </div>
                    <Form onSubmit={this.handleSubmit} className="form-label-left  padding-25p">
                      <FormItem label="企业名称" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                        {getFieldDecorator('userName', {
                          initialValue: userName || '',
                          rules: [{ required: true, message: '请输入正确的企业名！' }],
                        })(
                          <TrimInput placeholder="请输入企业名称" />,
                        )}
                      </FormItem>
                      <FormItem label="企业证件号" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                        {getFieldDecorator('ssn', {
                          initialValue: ssn || '',
                          rules: [{ required: true, message: '请输入正确的证件号码！' }],
                        })(
                          <TrimInput placeholder="请输入企业证件号" disabled />,
                        )}
                      </FormItem>
                      <FormItem label="企业类型" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                        {getFieldDecorator('enterpriseForm', {
                          initialValue: (enterpriseForm && enterpriseForm.toString()) || '',
                          rules: [{ required: true, message: '必填项不能为空！' }],
                        })(
                          <Select>
                            <Option value="">请选择</Option>
                            <Option value="1">个体工商户</Option>
                            <Option value="2">个人独资企业</Option>
                            <Option value="3">合伙企业</Option>
                            <Option value="4">有限责任公司</Option>
                            <Option value="5">股份制责任公司</Option>
                            <Option value="6">外商投资企业</Option>
                            <Option value="7">外商独资企业</Option>
                          </Select>,
                        )}
                      </FormItem>
                      <Row>
                        <Col offset="6" style={{ lineHeight: '35px' }}>
                          <Row>
                            <Col span="12">
                              <Button htmlType="submit" className="green-btn" >提交认证</Button>
                            </Col>
                            <Col span="12" className="text-right">
                              <a onClick={this.showModal}>已注册用户</a>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Form>
                  </div>
              }
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

CertificationPage.propTypes = {
};

export default connect(
  state => ({
    stepTwoData: state.createLoan.stepTwoData,
    chooseList: state.createLoan.chooseList,
    stepTwoLoading: state.createLoan.stepTwoLoading,
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
    authActor: (formData, stepTwoData) => {
      const resultData = formData;
      if (!stepTwoData.company) {
        if (stepTwoData.phone) {
          resultData.phone = stepTwoData.phone;
        } else {
          resultData.email = stepTwoData.email;
        }
      } else {
        resultData.ssn = stepTwoData.ssn;
      }
      resultData.actorId = stepTwoData.actorId;
      resultData.company = stepTwoData.company;
      resultData.referCode = stepTwoData.referCode;
      dispatch({ type: 'createLoan/authActor', payload: resultData });
    },
    openResgisterModal: () => {
      dispatch({ type: 'createLoan/openResgisterModal' });
    },
    closeResgisterModal: () => {
      dispatch({ type: 'createLoan/closeResgisterModal' });
    },
  }),
)(Form.create()(CertificationPage));

