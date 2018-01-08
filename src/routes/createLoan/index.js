import React, { Component } from 'react';
import { connect } from 'dva';
import { Steps, Row, Col, Spin } from 'antd';
import CreateUserPage from './createUserPage';
import CertificationPage from './certificationPage';
import CreateLoanPage from './createLoanPage';

const Step = Steps.Step;

class CreteLoan extends Component {

  componentWillMount() {
    const { newRegistCreate, routingQuery: { newRegist, email, phone, ssn } } = this.props;
    const data = {
      ssn: (ssn === 'undefined' || ssn === 'null') ? '' : ssn,
      phone: (phone === 'undefined' || phone === 'null') ? '' : phone,
      email: (email === 'undefined' || email === 'null') ? '' : email,
    };
    if (newRegist) {
      newRegistCreate(data);
    }
  }

  render() {
    const { step, existedCreateLoanLoading } = this.props;
    return (
      <Row className="createLoan" type="flex" justify="center">
        <Col span={10} className="min-width-500p">
          <div className="createLoan-step">
            <Steps current={`${step}`}>
              <Step title="创建用户" />
              <Step title="实名认证" />
              <Step title="创建借款" />
            </Steps>
          </div>
          <Spin spinning={existedCreateLoanLoading}>
            <div className="createLoan-container">
              {
                step === 3 ? <CreateLoanPage /> : step === 2 ? <CertificationPage /> : <CreateUserPage />
              }
            </div>
          </Spin>
        </Col>
      </Row>
    );
  }
}

export default connect(
  state => ({
    step: state.createLoan.step,
    authActorList: state.createLoan.authActorList,
    existedCreateLoanLoading: state.createLoan.existedCreateLoanLoading,
    existedCreateLoanList: state.createLoan.existedCreateLoanList,
    routingQuery: state.routing.locationBeforeTransitions.query,
  }),
  dispatch => ({
    newRegistCreate: (payload) => {
      dispatch({ type: 'createLoan/newRegistCreate', payload });
    },
  }),
)(CreteLoan);
