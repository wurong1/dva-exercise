import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, DatePicker, Select, Button, Table, Spin, TreeSelect, Tooltip } from 'antd';
import moment from 'moment';
import TrimInput from '../../components/input-trim';
import CascadeSelect from '../../components/select-cascade';
import './sms.less';

const FormItem = Form.Item;
const Option = Select.Option;

class AllSmsRecord extends Component {

  componentDidMount() {
    const {
      templates,
      sendModes,
      steps,
     } = this.props;
    if (templates.length < 1) {
      this.props.getTemplates();// 获取消息类型列表
    }
    if (sendModes.length < 1) {
      this.props.getSendModes();// 获取发送方式列表
    }
    if (steps.length < 1) {
      this.props.getSteps();// 获取任务阶段列表
    }
    this.props.getEmployeeGroups();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          ...values,
          startDate: values.startDate && +values.startDate.startOf('day'),
          endDate: values.endDate && +values.endDate.endOf('day'),
          pageNo: 1,
          pageSize: 50,
        };
        this.props.getAllRecords(params);
      }
    });
  }

  disabledStartDate = (startValue) => {
    const { getFieldValue } = this.props.form;
    const endValue = getFieldValue('endDate');
    if (!startValue) {
      return false;
    }
    if (!endValue) {
      return startValue.valueOf() > moment().endOf('day').valueOf();
    }
    return startValue.valueOf() > moment().endOf('day').valueOf() || startValue.valueOf() > endValue.endOf('day').valueOf();
  }

  disabledEndDate = (endValue) => {
    const { getFieldValue } = this.props.form;
    const startValue = getFieldValue('startDate');
    if (!endValue) {
      return false;
    }
    if (!startValue) {
      return endValue.valueOf() > moment().endOf('day').valueOf();
    }
    return endValue.valueOf() > moment().endOf('day').valueOf() || endValue.valueOf() < startValue.startOf('day').valueOf();
  }

  handleTableChange = (pagination) => {
    const { allRecord: { formData } } = this.props;
    const { current, pageSize } = pagination;
    const params = {
      ...formData,
      pageNo: current,
      pageSize,
    };
    this.props.getAllRecords(params);
  }

  clearAllRecord = () => {
    const { resetFields } = this.props.form;
    resetFields();
    this.props.clearAllRecord();
  }

   // 触发二级select框接收新的props
  handleChange = () => {
    this.setState(preState => ({ chageFlag: !preState.chageFlag }));
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const saleIdOptions = {
      remote: '/borrower/getUserByGroupId?groupId={:val}',
      parentName: 'groupId',
      parentValue: getFieldValue('groupId'),
    };

    const {
      allRecord: {
        pageNo = 1,
        pageSize = 50,
        records = [],
        totalRecords = 0,
        loading,
      },
      templates,
      sendModes,
      steps,
      employeeGroups,
      loadingTemplate,
      loadingSendMode,
      loadingStep,
      loadingEmployeeGroups,
     } = this.props;

    const pagination = {
      current: pageNo,
      total: totalRecords,
      showSizeChanger: true,
      pageSizeOptions: ['50', '80', '100'],
      pageSize,
      showTotal: total => `总条数：${total}`,
    };

    const columns = [
      {
        title: '消息ID',
        dataIndex: 'recordId',
        key: 'recordId',
      }, {
        title: '借款人ID',
        dataIndex: 'actorId',
        key: 'actorId',
      }, {
        title: '发送时间',
        dataIndex: 'sendDate',
        key: 'sendDate',
        render: text => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
      }, {
        title: '发送方式',
        dataIndex: 'modeName',
        key: 'modeName',
      }, {
        title: '消息类型',
        dataIndex: 'templateName',
        key: 'templateName',
        render: (text) => {
          return (
            <Tooltip title={text}>
              <span>{text && (text.length > 20 ? `${text.substr(0, 20)}...` : text) }</span>
            </Tooltip>
          );
        },
      }, {
        title: '发送状态',
        dataIndex: 'status',
        key: 'status',
      }, {
        title: '任务使用阶段',
        dataIndex: 'step',
        key: 'step',
      }, {
        title: '所属组别',
        dataIndex: 'employeeGroupName',
        key: 'employeeGroupName ',
      }, {
        title: '所属销售',
        dataIndex: 'employeeName',
        key: 'employeeName',
      },
    ];

    return (
      <div className="sms">
        <h3 className="dr-section-font">所有记录</h3>
        <Form
          layout="horizontal"
          onSubmit={this.handleSubmit}
        >
          <div className="crm-filter-box">
            <Row gutter={24}>
              <Col span={3}>
                <FormItem
                  label="发送开始时间"
                >
                  {getFieldDecorator('startDate', {
                    initialValue: moment().subtract(7, 'days'),
                  })(
                    <DatePicker disabledDate={this.disabledStartDate} />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem
                  label="发送结束时间"
                >
                  {getFieldDecorator('endDate', {
                    initialValue: moment(),
                  })(
                    <DatePicker disabledDate={this.disabledEndDate} />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <Spin spinning={loadingTemplate}>
                  <FormItem
                    label="消息类型"
                  >
                    {getFieldDecorator('templateId', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">全部</Option>
                        {
                          templates.map((item, idx) => {
                            return <Option value={`${item.id}`} key={idx}>{item.name}</Option>;
                          })
                        }
                      </Select>,
                    )}
                  </FormItem>
                </Spin>
              </Col>
              <Col span={3}>
                <Spin spinning={loadingSendMode}>
                  <FormItem
                    label="发送方式"
                  >
                    {getFieldDecorator('messageRule', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">全部</Option>
                        {
                          sendModes.map((item, idx) => {
                            return <Option value={item.code} key={idx}>{item.name}</Option>;
                          })
                        }
                      </Select>,
                    )}
                  </FormItem>
                </Spin>
              </Col>
              <Col span={3}>
                <FormItem
                  label="发送状态"
                >
                  {getFieldDecorator('status', {
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">全部</Option>
                      <Option value="SUCCESS">成功</Option>
                      <Option value="SENDING">发送中</Option>
                      <Option value="FAILED">失败</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem
                  label="借贷人ID"
                >
                  {getFieldDecorator('actorId')(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <Spin spinning={loadingStep}>
                  <FormItem
                    label="任务使用阶段"
                  >
                    {getFieldDecorator('step', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">全部</Option>
                        {
                          steps.map((item, idx) => {
                            return <Option value={item.code} key={idx}>{item.name}</Option>;
                          })
                        }
                      </Select>,
                    )}
                  </FormItem>
                </Spin>
              </Col>
              <Col span={3}>
                <Spin spinning={loadingEmployeeGroups}>
                  <FormItem
                    label="所属组别"
                  >
                    {getFieldDecorator('groupId', {
                      initialValue: '',
                    })(
                      <TreeSelect
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={employeeGroups}
                        treeDefaultExpandAll={false}
                        onChange={this.handleChange.bind(this)}
                        allowClear
                      />,
                      )}
                  </FormItem>
                </Spin>
              </Col>
              <Col span={3}>
                <FormItem
                  label="所属销售"
                >
                  {getFieldDecorator('employeeId', {
                    initialValue: '',
                  })(
                    <CascadeSelect {...saleIdOptions} />,
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
            <Button style={{ marginLeft: '30px' }} onClick={this.clearAllRecord}>
              清空
            </Button>
          </FormItem>
        </Form>
        <div className="sms-table">
          <Table
            columns={columns}
            dataSource={records || []}
            onChange={this.handleTableChange}
            pagination={pagination}
            loading={loading}
            size="middle"
          />
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    allRecord: state.smsRecord.allRecord,
    templates: state.smsRecord.templates,
    sendModes: state.smsRecord.sendModes,
    steps: state.smsRecord.steps,
    loadingTemplate: state.smsRecord.loadingTemplate,
    loadingSendMode: state.smsRecord.loadingSendMode,
    loadingStep: state.smsRecord.loadingStep,
    employeeGroups: state.smsRecord.employeeGroups,
    loadingEmployeeGroups: state.smsRecord.loadingEmployeeGroups,
  }),
  dispatch => ({
    getAllRecords: params => dispatch({ type: 'smsRecord/getAllRecords', payload: params }),
    clearAllRecord: () => dispatch({ type: 'smsRecord/clearAllRecord' }),
    getTemplates: () => dispatch({ type: 'smsRecord/getTemplates' }),
    getSendModes: () => dispatch({ type: 'smsRecord/getSendModes' }),
    getSteps: () => dispatch({ type: 'smsRecord/getSteps' }),
    getEmployeeGroups: () => dispatch({ type: 'smsRecord/getEmployeeGroups' }),
  }),
)(Form.create()(AllSmsRecord));

