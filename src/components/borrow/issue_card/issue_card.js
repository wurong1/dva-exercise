import React, { Component } from 'react';
import { Form, Select, Button, Spin, message } from 'antd';
import province from '../../../constants/province';
import city from '../../../constants/city';
import bankList from '../../../constants/bank';
import { remote } from '../../../utils/fetch';
import TrimInput from '../../input-trim';

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

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    },
  },
};

class IssueCard extends Component {

  constructor(props) {
    super(props);
    const { cardValue: { ownerType, accountType } } = this.props;
    this.state = {
      cascadeCitys: this.getCities() || [],
      isRequired: accountType === 'PERSONAL' || ownerType === 'TRUSTEE',
      loading: false,
      showNameField: ownerType === 'TRUSTEE',
      accountTypeList: ownerType === 'TRUSTEE' ? [{ name: '个人', value: 'PERSONAL' }] : [{ name: '个人', value: 'PERSONAL' }, { name: '企业', value: 'BUSINESS' }],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { cardValue: { ownerType, accountType } } = this.props;
    if (nextProps.cardValue.ownerType !== ownerType && nextProps.cardValue.ownerType === 'TRUSTEE') {
      this.setState({ accountTypeList: [{ name: '个人', value: 'PERSONAL' }], isRequired: true, showNameField: true });
    }
    if (nextProps.cardValue.accountType !== accountType && nextProps.cardValue.accountType === 'PERSONAL') {
      this.setState({ isRequired: true });
    }
  }

  getCities = () => {
    const { bankProvince } = this.props.cardValue;
    let cascadeCitys = [];
    if (bankProvince) {
      const cities = city.find(item => item.label === bankProvince);
      cascadeCitys = cities && cities.children;
    }
    return cascadeCitys;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { loanId, docId } = this.props;
    this.props.form.validateFields((err, values) => {
      // 账户持有人类型为受托人时需要先调用接口对填写的用户进行创建帐号、实名、开户操作
      if (!err) {
        const { ownerType } = values;
        this.setState({ loading: true });
        const data = {
          cellPhone: values.bankPhone,
          name: values.accountName,
          ssn: values.bankIdCard,
        };
        if (ownerType === 'TRUSTEE') {
          remote({
            method: 'POST',
            url: '/borrower/v1/customer/account/consignee',
            data,
          }).then((res) => {
            if (res.code === 0) {
              const actorId = res && res.data && res.data.actorId;
              const formData = { ...values, ownerAid: actorId };
              remote({
                method: 'POST',
                url: `/borrower/${loanId}/card/${docId}`,
                data: formData,
              }).then(() => {
                message.success('保存成功!');
                this.setState({ loading: false });
              }).catch(() => {
                this.setState({ loading: false });
              });
            } else {
              message.error(res.message);
            }
          }).catch(() => {
            this.setState({ loading: false });
          });
        } else {
          remote({
            method: 'POST',
            url: `/borrower/${loanId}/card/${docId}`,
            data: values,
          }).then(() => {
            message.success('保存成功!');
            this.setState({ loading: false });
          }).catch(() => {
            this.setState({ loading: false });
          });
        }
      }
    });
  }

  handleProvinceChange = (value) => {
    const { setFieldsValue } = this.props.form;
    const cities = city.find(item => item.label === value);
    this.setState({ cascadeCitys: (cities && cities.children) || [] });
    setFieldsValue({ bankCity: '' });
  }

  hadleAccountTypeChange = (value) => {
    const accountType = value;
    const isRequired = accountType === 'PERSONAL';
    this.setState({ isRequired }, () => {
      this.props.form.validateFields(['bankIdCard'], { force: true });
    });
  }

  handleOwerTypeChange = (value) => {
    const { getFieldValue } = this.props.form;
    const ownerType = value;
    const accountType = getFieldValue('accountType');
    const isRequired = ownerType === 'TRUSTEE' || accountType === 'PERSONAL';
    const accountTypeList = ownerType === 'TRUSTEE' ? [{ name: '个人', value: 'PERSONAL' }] : [{ name: '个人', value: 'PERSONAL' }, { name: '企业', value: 'BUSINESS' }];
    this.setState({ isRequired, showNameField: ownerType === 'TRUSTEE', accountTypeList }, () => {
      this.props.form.validateFields(['bankIdCard'], { force: true });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { cascadeCitys, isRequired, loading, accountTypeList } = this.state;
    const {
      cardValue: {
        accountName,
        bank,
        accountNum,
        bankPhone,
        bankProvince,
        bankCity,
        accountType,
        bankBranch,
        bankIdCard,
        ownerType,
      },
      type,
    } = this.props;
    const bankArray = bankList.filter(item => item.value === bank);
    const initBank = bankArray.length > 0 ? bankArray[0].value : '';
    return (
      <div>
        <Spin spinning={loading}>
          <Form onSubmit={this.handleSubmit}>
            {
              type === 'other' &&
                <FormItem
                  {...formItemLayout}
                  label="账户持有人类型"
                >
                  {getFieldDecorator('ownerType', {
                    initialValue: ownerType || '',
                    rules: [{
                      required: true, message: '不能为空！',
                    }],
                  })(
                    <Select
                      onChange={this.handleOwerTypeChange}
                    >
                      <Option value="">-请选择-</Option>
                      <Option value="BORROWER">借款人</Option>
                      <Option value="TRUSTEE">受托人</Option>
                    </Select>,
                  )}
                </FormItem>
            }
            {
              type === 'other' ?
                <FormItem
                  {...formItemLayout}
                  label="收款帐户类型"
                >
                  {getFieldDecorator('accountType', {
                    initialValue: accountType || '',
                    rules: [{
                      required: true, message: '不能为空！',
                    }],
                  })(
                    <Select onChange={this.hadleAccountTypeChange}>
                      <Option value="">-请选择-</Option>
                      {
                        accountTypeList.map((item, idx) =>
                          <Option value={item.value} key={idx}>{item.name}</Option>,
                        )
                      }
                    </Select>,
                  )}
                </FormItem>
              :
                <FormItem
                  {...formItemLayout}
                  label="收款帐户类型"
                >
                  {getFieldDecorator('accountType', {
                    initialValue: accountType || '',
                    rules: [{
                      required: true, message: '不能为空！',
                    }],
                  })(
                    <Select>
                      <Option value="">-请选择-</Option>
                      <Option value="PERSONAL">个人</Option>
                    </Select>,
                  )}
                </FormItem>
            }
            <FormItem
              {...formItemLayout}
              label={`${type === 'other' ? '账户名称' : '姓名'}`}
            >
              {getFieldDecorator('accountName', {
                initialValue: accountName,
                rules: [{
                  required: true, message: '不能为空！',
                }],
              })(
                <TrimInput />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="银行账号"
            >
              {getFieldDecorator('accountNum', {
                initialValue: accountNum,
                rules: [{
                  required: true, message: '不能为空！',
                }],
              })(
                <TrimInput />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="开户行"
            >
              {getFieldDecorator('bank', {
                initialValue: initBank || '',
                rules: [{
                  required: true, message: '不能为空！',
                }],
              })(
                <Select showSearch>
                  <Option value="">-请选择-</Option>
                  {bankList && bankList.map((val, idx) => {
                    return <Option key={idx} value={val.value}>{val.value}</Option>;
                  })}
                </Select>,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="开户所在省"
            >
              {getFieldDecorator('bankProvince', {
                initialValue: bankProvince || '',
                rules: [{
                  required: true, message: '不能为空！',
                }],
              })(
                <Select showSearch onChange={this.handleProvinceChange}>
                  <Option value="">-请选择-</Option>
                  {province && province.map((val, idx) => {
                    return <Option key={idx} value={val.value}>{val.value}</Option>;
                  })}
                </Select>,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="开户所在市"
            >
              {getFieldDecorator('bankCity', {
                initialValue: bankCity || '',
                rules: [{
                  required: true, message: '不能为空！',
                }],
              })(
                <Select showSearch>
                  <Option value="">-请选择-</Option>
                  {
                    cascadeCitys && cascadeCitys.map((val, idx) => {
                      return <Option key={idx} value={val.value}>{val.value}</Option>;
                    })
                }
                </Select>,
              )}
            </FormItem>
            {
              type === 'other' &&
                <FormItem
                  {...formItemLayout}
                  label="支行名称"
                >
                  {getFieldDecorator('bankBranch', {
                    initialValue: bankBranch,
                    rules: [{
                      required: true, message: '不能为空！',
                    }],
                  })(
                    <TrimInput />,
                  )}
                </FormItem>
            }
            {
              type === 'other' &&
                <FormItem
                  {...formItemLayout}
                  label="银行预留身份证号"
                >
                  {getFieldDecorator('bankIdCard', {
                    initialValue: bankIdCard,
                    rules: [{
                      required: isRequired, message: '不能为空！',
                    }],
                  })(
                    <TrimInput />,
                  )}
                </FormItem>
            }
            <FormItem
              {...formItemLayout}
              label="银行预留手机号"
            >
              {getFieldDecorator('bankPhone', {
                initialValue: bankPhone,
                rules: [{
                  required: true, message: '不能为空！',
                }],
              })(
                <TrimInput />,
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">提交</Button>
            </FormItem>
          </Form>
        </Spin>
      </div>
    );
  }
}

export default Form.create()(IssueCard);
