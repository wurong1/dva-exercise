import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';
import { DatePicker, Table, Form, Button, Row, Col, TreeSelect, Tooltip, Select } from 'antd';

import TrimInput from '../../components/input-trim';
import CascadeSelect from '../../components/select-cascade';
import './reAudit.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
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
const columns = [
  {
    title: '借款人Id',
    dataIndex: 'actorId',
    render: (text, record) => <Link to={`/reAuditDetails?loanAppId=${record.loanAppId}&reviewVersion=${record.reviewVersion}`}>{text}</Link>,
  }, {
    title: '贷款申请ID',
    dataIndex: 'loanAppId',
  }, {
    title: '贷款ID',
    dataIndex: 'loanId',
  }, {
    title: '用户姓名',
    dataIndex: 'customerName',
  }, {
    title: '贷款类型',
    dataIndex: 'productCode',
  }, {
    title: '贷款创建时间',
    dataIndex: 'applyDate',
    render: text => <p>{text ? moment(Number(text)).format('YYYY-MM-DD HH:mm:ss') : ''}</p>,
  }, {
    title: '贷款申请状态',
    dataIndex: 'applyStatus',
  }, {
    title: '复议发起人组别',
    dataIndex: 'applyEmployeeGroup',
  }, {
    title: '复议发起人',
    dataIndex: 'applyEmployee',
  }, {
    title: '所属销售',
    dataIndex: 'loanEmployee',
  }, {
    title: '复议原因',
    dataIndex: 'applyComment',
    render: text => <Tooltip title={text && text.length > 15 ? text : ''}>
      <span>{text && text.length > 15 ? `${text.substring(0,14)}...` : text}</span>
    </Tooltip>,
  }, {
    title: '审核结果',
    dataIndex: 'reviewResult',
  }, {
    title: '审批时间',
    dataIndex: 'reviewDate',
    render: text => <p>{text ? moment(Number(text)).format('YYYY-MM-DD HH:mm:ss') : ''}</p>,
  },
];

class EndAuditPage extends Component {
  state = {

  };

  componentWillMount() {

  }

  getPaginationData(pageNo, pageSize) {
    const { searchEndAuditList } = this.props;
    const formData = this.props.form.getFieldsValue();
    searchEndAuditList(formData, { pageNo, pageSize });
  }

  handleChange = () => {
    this.setState(preState => ({ chageFlag: !preState.chageFlag }));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { searchEndAuditList } = this.props;
    const formData = this.props.form.getFieldsValue();
    searchEndAuditList(formData, { pageNo: 1, pageSize: 50 });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const loanEmployeeIdOptions = {
      remote: '/borrower/getUserByGroupId?groupId={:val}',
      parentName: 'loanEmployeeGroupId',
      parentValue: getFieldValue('loanEmployeeGroupId'),
    };
    const pagination = {
      total: this.props.endAuditList.totalRecords,
      defaultPageSize: this.props.endAuditList.pageSize ? this.props.endAuditList.pageSize : 50,
      onChange: (pageNo, pageSize) => this.getPaginationData(pageNo, pageSize),
    };
    return (
      <div>
        <div className="audit-border">
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col span={3}>
                <FormItem label="借款人ID" {...formItemLayout} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('actorId')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="贷款申请ID" {...formItemLayout} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('loanAppId')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem label="复议发起时间" {...formItemLayout} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('applyDate')(
                    <RangePicker />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="审批结果" {...formItemLayout} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('reviewResult')(
                    <Select>
                      <Option value="1">通过</Option>
                      <Option value="2">拒绝</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="贷款销售组别" {...formItemLayout} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('loanEmployeeGroupId')(
                    <TreeSelect
                      treeData={this.props.employeeGroupId}
                      dropdownMatchSelectWidth={false}
                      dropdownStyle={{ maxWidth: 350, maxHeight: 600, overflow: 'auto' }}
                      onChange={this.handleChange.bind(this)}
                      allowClear
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="贷款销售" {...formItemLayout} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('loanEmployeeId')(
                    <CascadeSelect {...loanEmployeeIdOptions} />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <FormItem>
              <Button type="primary" htmlType="submit">查询</Button>
              <a onClick={this.handleReset} className="btn-link">清空</a>
            </FormItem>
          </Form>
        </div>
        <div>
          <Table
            className="crm-table"
            dataSource={this.props.endAuditList.records}
            columns={columns}
            loading={this.props.loading}
            pagination={pagination}
          />
        </div>
      </div>
    );
  }
}

EndAuditPage.propTypes = {
};

export default connect(
  state => ({
    endAuditList: state.reAudit.endAuditList,
    employeeGroupId: state.reAudit.employeeGroupId,
    loading: state.loading.models.reAudit,
  }),
  dispatch => ({
    searchEndAuditList: (formData, pageData) => {
      const resultData = formData;
      for (const x in resultData) {
        if (['applyDate'].indexOf(x) > -1 && resultData[x]) {
          const startDay = resultData[x][0].startOf('day').unix(1318781876.721) * 1000;
          const endDay = (resultData[x][1].startOf('day').unix(1318781876.721) * 1000) + 86400000;
          resultData[x] = `${startDay}-${endDay}`;
        }
      }
      resultData.type = 1;
      resultData.pageNo = pageData.pageNo;
      resultData.pageSize = pageData.pageSize;
      dispatch({ type: 'reAudit/searchEndAuditList', payload: formData });
    },
  }),
)(Form.create()(EndAuditPage));

