import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Button, Row, Col, TreeSelect, Input, message, Modal, Upload, Icon } from 'antd';

import TrimInput from '../../components/input-trim';
import './customer.less';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
const phoneRegExp = /^(1(3|4|5|7|8)[0-9]{9})$/;
const moneyRegExp = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
const uploadParams = {
  name: 'customerTemplate',
  action: '/borrower/v1/actor/uploadcustomer',
  headers: {
    accept:'application/json;charset=utf-8, text/javascript, */*',
  },
  showUploadList: false,
  onChange(info) {
    if (info.file.status === 'done') {
      if(info.file.response.code === 0) {
        message.success(`${info.file.response.message}`);
      }else {
        message.error(`${info.file.response.message}`);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  },
}

class AddCustomerPage extends Component {
  state = {
    isReset: false,
    isShowModal: false,
  };

  componentWillMount() {
    const { getEmployeeGroupId, isPermission, userInfo } = this.props;
    //const customerId = userInfo && userInfo.id;
    //isPermission(customerId);
    getEmployeeGroupId();
  }

  getEmployeeId = (val) => {
    const { getEmployeeId, form:{ setFieldsValue } } = this.props;
    this.setState({ isReset: false });
    getEmployeeId(val);
    setFieldsValue({ employeeId: '' });
  };

  handleReset = () => {
    this.props.form.resetFields();
    this.setState({ isReset: true });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { addCustomer, form:{ validateFields, getFieldsValue } } = this.props;
    const formData = getFieldsValue();
    validateFields((err) => {
      if(!err) {
        if(formData.manageMoney) {
          if(formData.loanType) {
            addCustomer(formData);
          }else {
            message.info('填写贷款金额时，必须指定贷款类型!')
          }
        }else {
          addCustomer(formData);
        }
      }
    })  
  };
  
  getTermByType = (val) => {
    const { getLoanTerm } = this.props;
    val && getLoanTerm(val);
  }

  showModal = () => {
    this.setState({ isShowModal: true });
  }

  modalCancel = () => {
    this.setState({ isShowModal: false });
  }

  uploadFailedHistory = () => {
    window.location.href = '/bcrm/#/toUploadFialedList'
  }

  render() {
    const { isShowModal, isReset } = this.state;
    const { loanTermList, employeeId, form:{ getFieldDecorator } } = this.props;
    const employeeIdList = isReset ? [] : employeeId;
    return (
      <div>
        <h3 className="dr-section-font">新增客户</h3>
        <div style={{paddingBottom: '40px'}}>
          <Button style={{float: 'left'}} type="primary" onClick={this.uploadFailedHistory}>失败历史</Button>
          <Button style={{float: 'right'}} onClick={this.showModal}>批量上传</Button>
        </div>
        <div className="customer-border">
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col span={3}>
                <FormItem label="手机号码" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('phone', {
                    rules: [{ required: true, pattern: phoneRegExp, message: '请输入正确的手机号！' }],
                  })(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="客户姓名" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('customerName')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="城市" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('city')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="在现工作单位年限" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('workingYears')(
                    <Select>
                      <Option value="">全部</Option>
                      <Option value="0">0-6个月</Option>
                      <Option value="1">7-12个月</Option>
                      <Option value="2">1-3年</Option>
                      <Option value="3">3年以上</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="QQ" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('qq')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="微信" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('weixin')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="邮箱" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('mail')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="贷款类型" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('loanType',{
                    onChange: this.getTermByType,
                  })(
                    <Select>
                    <option value=""> 全部</option>
                    <option value="OUTSTANDING"> 新贵贷</option>
                    <option value="PROPERTY_OWNER"> 业主贷</option>
                    <option value="DOUBLE_FUND"> 双金贷</option>
                    <option value="LIFE_INSURANCE"> 寿险贷</option>
                    <option value="SPEED_LOAN"> SpeedLoan</option>
                    <option value="MCA"> MCA</option>
                    <option value="MCA_SIMPLIFIED"> MCA精简版</option>
                    <option value="MCA_GREENLANE_OFFLINE"> MCA绿色线下版</option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={3}>
                <FormItem label="贷款期限" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('loanCycle')(
                    <Select>
                      <Option value="">全部</Option>
                      {
                        loanTermList && loanTermList.map((val) => {
                          return <Option key={val.code} value={val.code}>{val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="申请金额" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('amount', {
                    rules: [{ pattern: moneyRegExp, message: '请输入正确的申请金额' }]
                  })(
                    <Input addonAfter="元" />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="线下信息渠道" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('channelOfflineMessage')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="负责人组别" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('employeeGroupId', {
                    rules: [{ required: true, message: '必填项不能为空！' }],
                  })(
                    <TreeSelect
                      treeData={this.props.employeeGroupId}
                      dropdownMatchSelectWidth={false}
                      dropdownStyle={{ width: 350, maxWidth: 400, maxHeight: 600, overflow: 'auto' }}
                      onChange={value => this.getEmployeeId(value)}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="负责人" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('employeeId', {
                    rules: [{ required: true, message: '必填项不能为空！' }],
                  })(
                    <Select>
                      <Option value="">全部</Option>
                      {
                        employeeIdList && employeeIdList.map((val) => {
                          return <Option key={val.id} value={val.id}>{val.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem label="备注" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('record')(
                    <TextArea/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Button type="primary" htmlType="submit">确定</Button>
              <a onClick={this.handleReset} className="btn-link">取消</a>
            </Row>
          </Form>
        </div>
        <Modal visible={isShowModal} onCancel={this.modalCancel} style={{top: 300, textAlign: 'center'}} title="批量导入" width={400} footer={null}>
        <Upload {...uploadParams}>
          <Button>
            <Icon type="upload" />   点击上传
          </Button>
        </Upload>
        <a href="/borrower/v1/actor/customerTemplate" style={{marginLeft: '30px'}}>下载模板</a>
        </Modal>
      </div>
    );
  }
}

AddCustomerPage.propTypes = {
};

export default connect(
  state => ({
    employeeGroupId: state.allCustomer.employeeGroupId,
    employeeId: state.allCustomer.employeeId,
    addCustomerList: state.addCustomer.addCustomerList,
    loanTermList: state.addCustomer.loanTermList,
    //userInfo: state.user.userInfo,
  }),
  dispatch => ({
    getEmployeeGroupId: () => {
      dispatch({ type: 'allCustomer/getEmployeeGroupId' });
    },
    getEmployeeId: (groupId) => {
      dispatch({ type: 'allCustomer/getEmployeeId', payload: groupId });
    },
    addCustomer: (formData) => {
      dispatch({ type: 'addCustomer/addCustomer', payload: formData });
    },
    getLoanTerm: (loanType) => {
      dispatch({type: 'addCustomer/getLoanTerm', payload: loanType})
    },
    // isPermission: (params) => {
    //   dispatch({type: 'addCustomer/isPermission', payload: params})
    // }
  }),
)(Form.create()(AddCustomerPage));
