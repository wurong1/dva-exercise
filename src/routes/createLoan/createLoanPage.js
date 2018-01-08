import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, TreeSelect, Select, Modal, message, Row, Col, Spin } from 'antd';
import { hashHistory } from 'react-router';
import RegisteredModal from './registeredUser';
import TrimInput from '../../components/input-trim';
import './createLoan.less';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

class CreateLoanPage extends Component {

  state = {
    employeeGroup: null,
    mcaBusiness: null,
  };

  componentWillMount() {
    const { findLoanList, stepThreeData, getEmployeeGroupId } = this.props;
    getEmployeeGroupId();
    findLoanList(stepThreeData);
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

  getEmployeeId = (value, label, extra) => {
    const { getEmployeeId, form: { setFieldsValue } } = this.props;
    const data = extra.triggerNode.props;
    const employeeGroup = `${data.value}-${data.title}-${data.type}`;
    this.setState({ employeeGroup });
    setFieldsValue({ employee: '' });
    getEmployeeId(value);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { createLoan, form: { validateFields }, stepThreeData } = this.props;
    validateFields((err, values) => {
      if (!err) {
        createLoan(values, stepThreeData, this.state);
      }
    });
  };

  loanTypeChange = (value) => {
    const { loanList } = this.props;
    let flag = null;
    let arrNum = null;
    loanList.forEach((val, idx) => {
      if (val.productCode === value && val.ext.loan_mcaBusiness) {
        flag = true;
        arrNum = idx;
      }
    });
    if (flag) {
      const mcaBusiness = loanList[arrNum].ext.loan_mcaBusiness.options;
      this.setState({ mcaBusiness });
    } else {
      this.setState({ mcaBusiness: null });
    }
  };

  showModal = () => {
    const { openResgisterModal } = this.props;
    openResgisterModal();
  };

  success = (loanAppId) => {
    Modal.success({
      title: '创建成功',
      content: `借款已创建成功，贷款申请ID为${loanAppId}`,
      onOk: () => {
        hashHistory.push('/createLoan');
        location.reload([true]);
      },
    });
  };

  render() {
    const { mcaBusiness } = this.state;
    const { form: { getFieldDecorator }, createLoanList, stepThreeLoading, employeeGroup, employee,
      loanList, isResgisterModalShow, existedCreateLoanLoading,
      stepThreeData: { actorId, company, phone, email, ssn, referCode } } = this.props;
    const accountNumber = company ? ssn : phone || email;
    const createSuccess = !!createLoanList;
    return (
      <Row type="flex" justify="center">
        <Col span="20">
          <Spin spinning={stepThreeLoading}>
            <div className="createLoan-content">
              <Form onSubmit={this.handleSubmit} className="form-label-left">
                <div className="padding-25p" style={{ 'border-bottom': '1px solid #DFDFDF' }}>
                  <div className="form-legend margin-bottom-10p">账号信息</div>
                  <Row>
                    <Col span="6" className="text-left margin-bottom-10p margin-bottom-10p">借款人ID:</Col>
                    <Col span="18">{actorId}</Col>
                  </Row>
                  <Row>
                    <Col span="6" className="text-left">账号：</Col>
                    <Col span="18">{accountNumber}</Col>
                  </Row>
                </div>
                <div className="padding-25p" style={{ 'border-bottom': '1px solid #DFDFDF' }}>
                  <div className="form-legend">贷款信息</div>
                  <FormItem label="贷款类型" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                    {getFieldDecorator('loanType', {
                      rules: [{ required: true, message: '此项为必填项！' }],
                    })(
                      <Select
                        onChange={this.loanTypeChange}
                      >
                        {
                          loanList && loanList.map((val) => {
                            return <Option key={val.productCode} value={val.productCode}>{val.name}</Option>;
                          })
                        }
                      </Select>,
                    )}
                  </FormItem>
                  {
                  mcaBusiness ?
                    <FormItem label="二级类型" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                      {getFieldDecorator('mcaBusiness', {
                        rules: [{ required: true, message: '此项为必填项！' }],
                      })(
                        <Select>
                          {
                            mcaBusiness && mcaBusiness.map((val) => {
                              return <Option key={val.value} value={val.value}>{val.name}</Option>;
                            })
                          }
                        </Select>,
                      )}
                    </FormItem>
                    : null
                  }
                </div>
                <div className="padding-25p">
                  <div className="form-legend">所属人信息</div>
                  <FormItem label="销售推荐码" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                    {getFieldDecorator('referCode', {
                      initialValue: referCode,
                      rules: [{ required: true, message: '请输入正确的销售推荐码！' }],
                    })(
                      <TrimInput placeholder="请输入推荐码" />,
                    )}
                  </FormItem>
                  <FormItem label="任务负责人组别" {...formItemLayout} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                    {getFieldDecorator('employeeGroup', {
                      rules: [{ required: true, message: '此项为必填项！' }],
                    })(
                      <TreeSelect
                        treeData={employeeGroup}
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 350, maxWidth: 350, maxHeight: 600, overflow: 'auto' }}
                        onChange={this.getEmployeeId}
                      />,
                    )}
                  </FormItem>
                  <FormItem label="任务负责人" {...formItemLayout} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                    {getFieldDecorator('employee', {
                      rules: [{ required: true, message: '此项为必填项！' }],
                    })(
                      <Select>
                        <Option value="">全部</Option>
                        {
                          employee && employee.map((val) => {
                            return <Option key={val.id} value={`${val.id}-${val.name}`}>{val.name}</Option>;
                          })
                      }
                      </Select>,
                    )}
                  </FormItem>
                  <Row>
                    <Col offset="6" style={{ 'line-height': '35px' }}>
                      <Row>
                        <Col span="12">
                          <Button htmlType="submit" className="green-btn" >创建借款</Button>
                        </Col>
                        <Col span="12" className="text-right">
                          <a onClick={this.showModal}>已注册用户</a>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              </Form>
              <Modal width={800} onOk={this.onOk} onCancel={this.onCancel} visible={isResgisterModalShow} confirmLoading={existedCreateLoanLoading} title="已注册用户选择" >
                <RegisteredModal />,
              </Modal>
              {
                createSuccess ? this.success(createLoanList.loanAppId) : null
              }
            </div>
          </Spin>
        </Col>
      </Row>
    );
  }
}

CreateLoanPage.propTypes = {
};

export default connect(
  state => ({
    stepThreeLoading: state.createLoan.stepThreeLoading,
    employeeGroup: state.createLoan.employeeGroupId,
    employee: state.createLoan.employeeId,
    stepThreeData: state.createLoan.stepThreeData,
    loanList: state.createLoan.loanList,
    createLoanList: state.createLoan.createLoanList,
    chooseList: state.createLoan.chooseList,
    isResgisterModalShow: state.createLoan.isResgisterModalShow,
    existedCreateLoanLoading: state.createLoan.existedCreateLoanLoading,
  }),
  dispatch => ({
    createLoan: (formData, stepThreeData, state) => {
      const resultData = formData;
      resultData.actorId = stepThreeData.actorId;
      if (stepThreeData.company) {
        resultData.actorId = stepThreeData.actorId;
      } else if (stepThreeData.phone) {
        resultData.phone = stepThreeData.phone;
      } else {
        resultData.email = stepThreeData.email;
      }
      resultData.employeeGroup = state.employeeGroup;
      resultData.userName = stepThreeData.userName;
      resultData.ssn = stepThreeData.ssn;
      resultData.enterpriseForm = stepThreeData.enterpriseForm;
      dispatch({ type: 'createLoan/createLoan', payload: resultData });
    },
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
    findLoanList: (authActorList) => {
      dispatch({ type: 'createLoan/findLoanList', payload: authActorList });
    },
    getEmployeeGroupId: () => {
      dispatch({ type: 'createLoan/getEmployeeGroupId' });
    },
    getEmployeeId: (groupId) => {
      dispatch({ type: 'createLoan/getEmployeeId', payload: groupId });
    },
    openResgisterModal: () => {
      dispatch({ type: 'createLoan/openResgisterModal' });
    },
    closeResgisterModal: () => {
      dispatch({ type: 'createLoan/closeResgisterModal' });
    },
  }),
)(Form.create()(CreateLoanPage));
