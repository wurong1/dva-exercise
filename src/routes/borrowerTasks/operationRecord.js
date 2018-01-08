import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Radio, Table, Row, Col, Spin, Tooltip } from 'antd';
import moment from 'moment';

import './borrowerTasks.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const columns = [
  {
    title: '操作类型',
    dataIndex: 'operationType',
    key: 'operationType',
    width: 150,
  }, {
    title: '操作时间',
    dataIndex: 'operationDate',
    key: 'operationDate',
    // render: text => <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
  }, {
    title: '操作人',
    dataIndex: 'employeeName',
    key: 'employeeName',
    width: 150,
  }, {
    title: '操作内容',
    dataIndex: 'operationContent',
    key: 'operationContent',
    render: text => <Tooltip title={text && text.length > 30 ? text : ''}>
      <span>{text && text.length > 30 ? `${text.substring(0, 29)}...` : text}</span>
    </Tooltip>,
  },
];


class OperationRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operationType: '',
      taskId: this.props.taskId,
      taskStatus: 'ALL',
      pageNo: 1,
      pageSize: 10,
    };
  }

  componentWillMount() {
    const { searchOperationRecords } = this.props;
    searchOperationRecords(this.state);
  }

  getPaginationData(pageNo, pageSize) {
    const { searchOperationRecords } = this.props;
    this.setState({ pageNo, pageSize }, () => {
      searchOperationRecords(this.state);
    });
  }

  operationTypeChange = (val) => {
    const { searchOperationRecords } = this.props;
    this.setState({ operationType: val, pageNo: 1, pageSize: 10 }, () => {
      searchOperationRecords(this.state);
    });
  }

  taskStatusChange = (e) => {
    const { searchOperationRecords } = this.props;
    this.setState({ taskStatus: e.target.value, pageNo: 1, pageSize: 10 }, () => {
      searchOperationRecords(this.state);
    });
  }

  render() {
    const { operationRecordsLoading, operationRecordsList,
      form: { getFieldDecorator } } = this.props;
    const pagination = {
      total: operationRecordsList.totalRecords || 0,
      current: operationRecordsList.pageNo || 1,
      pageSize: operationRecordsList.pageSize || 10,
      onChange: (page, pageSize) => this.getPaginationData(page, pageSize),
    };
    return (
      <div>
        <Form>
          <Row className="border-box">
            <Col span={7}>
              <FormItem label="任务状态">
                {getFieldDecorator('taskStatus', {
                  initialValue: 'ALL',
                  onChange: this.taskStatusChange,
                })(
                  <RadioGroup>
                    <RadioButton key="ALL" value="ALL">全部</RadioButton>
                    <RadioButton key="NEWREGIST" value="NEWREGIST">新注册</RadioButton>
                    <RadioButton key="LOANAPPGUIDED" value="LOANAPPGUIDED">引导进件</RadioButton>
                    <RadioButton key="AUDITFOLLOWUP" value="AUDITFOLLOWUP">审核跟进</RadioButton>
                    <RadioButton key="SIGN" value="SIGN">签约</RadioButton>
                  </RadioGroup>,
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem label="操作类型" >
                {getFieldDecorator('operationType', {
                  initialValue: '',
                  onChange: this.operationTypeChange,
                })(
                  <Select>
                    <Option value="">全部</Option>
                    <Option value="0">备注</Option>
                    <Option value="1">来电</Option>
                    <Option value="10">结案状态更改</Option>
                    <Option value="11">微信</Option>
                    <Option value="2">去电</Option>
                    <Option value="3">短信</Option>
                    <Option value="6">任务记录</Option>
                    <Option value="7">任务调配</Option>
                    <Option value="9">标签变更</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Spin spinning={operationRecordsLoading}>
              <Table
                columns={columns}
                dataSource={operationRecordsList.records}
                rowKey={(record, idx) => idx}
                pagination={pagination}
              />
            </Spin>
          </Row>
        </Form>
      </div>
    );
  }
}

OperationRecord.propTypes = {
};

export default connect(
  state => ({
    operationRecordsList: state.taskDetails.operationRecordsList,
    operationRecordsLoading: state.taskDetails.operationRecordsLoading,
  }),
  dispatch => ({
    searchOperationRecords: (params) => {
      dispatch({ type: 'taskDetails/searchOperationRecords', payload: params });
    },
  }),
)(Form.create()(OperationRecord));

