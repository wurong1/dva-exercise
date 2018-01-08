import React, { Component } from 'react';
import { Link } from 'dva/router';
import { connect } from 'dva';
import { Form, Button, Row, Col, Table, message, Tooltip } from 'antd';
import moment from 'moment';
import TrimInput from '../../components/input-trim';
import './task.less';

const FormItem = Form.Item;

const columns = [{
  title: '贷款ID',
  dataIndex: 'loanId',
  width: 100,
  fixed: 'left',
  key: 'loanId',
  render: text => <Link to={`/repayInfoDetails?loanId=${text}`}>{text}</Link>,
}, {
  title: '借款人ID',
  dataIndex: 'actorId',
  width: 100,
  fixed: 'left',
  key: 'actorId',
}, {
  title: '姓名',
  dataIndex: 'realName',
  width: 100,
  key: 'realName',
}, {
  title: '证件号',
  dataIndex: 'ssn',
  width: 100,
  key: 'ssn',
}, {
  title: '手机号码',
  dataIndex: 'phone',
  width: 100,
  key: 'phone',
}, {
  title: '贷款类型',
  dataIndex: 'loanType',
  width: 100,
  key: 'loanType',
}, {
  title: '贷款创建时间',
  dataIndex: 'appDate',
  width: 150,
  key: 'appDate',
  render: (text) => { return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''; },
}, {
  title: '贷款申请状态',
  dataIndex: 'status',
  width: 150,
  key: 'status',
}, {
  title: '贷款状态',
  dataIndex: 'applyStatus',
  width: 100,
  key: 'applyStatus',
}, {
  title: '贷款申请金额',
  dataIndex: 'appAmount',
  width: 150,
  key: 'appAmount',
}, {
  title: '贷款批复金额',
  dataIndex: 'baseAmount',
  width: 150,
  key: 'baseAmount',
}, {
  title: '所在城市',
  dataIndex: 'appCity',
  width: 100,
  key: 'appCity',
}, {
  title: '期限类型',
  dataIndex: 'maturityType',
  width: 100,
  key: 'maturityType',
}, {
  title: '期限',
  dataIndex: 'maturity',
  width: 100,
  key: 'maturity',
}, {
  title: '拒绝原因',
  dataIndex: 'extraMessage',
  key: 'extraMessage',
  width: 100,
  render: text => <div>
    <Tooltip title={text}>
      {text && `${text.substr(0, 4)}...`}
    </Tooltip>
  </div>,
}, {
  title: '用户所属销售',
  dataIndex: 'employee',
  width: 150,
  key: 'employee',
}, {
  title: '用户所属销售组别',
  dataIndex: 'employeeGroup',
  width: 150,
  key: 'employeeGroup',
}, {
  title: '贷款所属销售',
  dataIndex: 'loanEmployee',
  width: 150,
  key: 'loanEmployee',
}, {
  title: '贷款所属销售组别',
  dataIndex: 'loanEmployeeGroup',
  width: 150,
  key: 'loanEmployeeGroup',
}, {
  title: '任务负责人组别',
  dataIndex: 'taskEmployeeGroupName',
  width: 100,
  key: 'taskEmployeeGroupName',
}, {
  title: '任务负责人',
  dataIndex: 'taskEmployeeName',
  width: 100,
  key: 'taskEmployeeName',
}];

class BorrowerLoanInfo extends Component {

  onPageChange = (pagination) => {
    const params = this.getFormData(pagination);
    if (!params.hasOneParam) {
      message.error('至少输入一个查询条件');
      return;
    }
    this.props.submitForm(params.params);
  }

  getFormData = (pagination) => {
    const { current = 1, pageSize = 50 } = pagination;
    let result = {};
    let hasOneParam = false;
    this.props.form.validateFields((err, values) => {
      hasOneParam = values && Object.keys(values).some((props) => {
        return !!values[props];
      });
      const params = {
        ...values,
        pageNo: current,
        pageSize,
      };
      result = params;
    });
    return {
      params: result,
      hasOneParam,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const pagination = {
      current: 1,
      pageSize: 50,
    };
    const params = this.getFormData(pagination);
    if (!params.hasOneParam) {
      message.error('至少输入一个查询条件');
      return;
    }
    this.props.submitForm(params.params);
  }

  clearData =() => {
    const { resetFields } = this.props.form;
    resetFields();
    this.props.clearData();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { historyList = {} } = this.props;
    const { pageNo = 1, pageSize = 50, totalRecords = 0, records = [], isFetching } = historyList;
    const pagination = {
      current: pageNo,
      total: totalRecords,
      showSizeChanger: true,
      pageSizeOptions: ['50', '80', '100'],
      pageSize,
    };

    return (
      <div className="dr-layout task">
        <h3 style={{'margin-bottom': '15px'}}>借款信息查询</h3>
        <Form
          layout="horizontal"
          onSubmit={this.handleSubmit}
        >
          <div className="crm-filter-box">
            <Row gutter={24}>
              <Col span={4}>
                <FormItem
                  label="贷款ID"
                >
                  {getFieldDecorator('loanId')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="贷款申请ID"
                >
                  {getFieldDecorator('loanAppId')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="借款人ID"
                >
                  {getFieldDecorator('actorId')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="姓名"
                >
                  {getFieldDecorator('customerName')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="证件号"
                >
                  {getFieldDecorator('idNo')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="手机号"
                >
                  {getFieldDecorator('phone')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <FormItem
                  label="公司单位名称"
                >
                  {getFieldDecorator('companyName')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  label="申贷企业名称"
                >
                  {getFieldDecorator('enterpriseName')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
            >
              搜索
            </Button>
          </FormItem>
        </Form>
        <Button className="btn-clear" onClick={this.clearData.bind(this)}>
          清空
        </Button>
        <Table
          columns={columns}
          dataSource={records}
          pagination={pagination}
          onChange={this.onPageChange.bind(this)}
          scroll={{ x: 2400, y: 650 }}
          size="middle"
          loading={isFetching}
          rowKey={(record, idx) => idx}
        />
        {
          totalRecords > 0 ?
            <div className="total-num">
              <div>总条数： <span>{ totalRecords }</span></div>
            </div>
            : ''
        }
      </div>
    );
  }
}

export default connect(
  state => ({
    historyList: state.task.historyList,
  }),
  dispatch => ({
    submitForm: params => dispatch({ type: 'task/getHistotyList', payload: params }),
    clearData: () => dispatch({ type: 'task/clearHistoryData' }),
  }),
)(Form.create()(BorrowerLoanInfo));

