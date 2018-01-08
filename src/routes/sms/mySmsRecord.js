import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, DatePicker, Select, Button, Table, Spin, Tooltip } from 'antd';
import moment from 'moment';
import TrimInput from '../../components/input-trim';
import './sms.less';

const FormItem = Form.Item;
const Option = Select.Option;

class MySmsRecord extends Component {

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
        this.props.getMyRecords(params);
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
    const { myRecord: { formData } } = this.props;
    const { current, pageSize } = pagination;
    const params = {
      ...formData,
      pageNo: current,
      pageSize,
    };
    this.props.getMyRecords(params);
  }

  clearMyRecord = () => {
    const { resetFields } = this.props.form;
    resetFields();
    this.props.clearMyRecord();
  }

  reSend = (record) => {
    this.props.resend(record);
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const {
      myRecord: {
        pageNo = 1,
        pageSize = 50,
        records = [],
        totalRecords = 0,
        loading,
      },
      templates,
      sendModes,
      steps,
      loadingTemplate,
      loadingSendMode,
      loadingStep,
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
        title: '操作',
        render: (text, record) => {
          return record.statusCode === 'FAILED' ? <Button loading={record.showLoading} onClick={this.reSend.bind(this, record)}>重发</Button> : null;
        },
      },
    ];

    return (
      <div className="sms">
        <h3 className="dr-section-font">我的记录</h3>
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
            </Row>
          </div>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
            >
              搜索
            </Button>
            <Button style={{ marginLeft: '30px' }} onClick={this.clearMyRecord}>
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
    myRecord: state.smsRecord.myRecord,
    templates: state.smsRecord.templates,
    sendModes: state.smsRecord.sendModes,
    steps: state.smsRecord.steps,
    loadingTemplate: state.smsRecord.loadingTemplate,
    loadingSendMode: state.smsRecord.loadingSendMode,
    loadingStep: state.smsRecord.loadingStep,
  }),
  dispatch => ({
    getMyRecords: params => dispatch({ type: 'smsRecord/getMyRecords', payload: params }),
    clearMyRecord: () => dispatch({ type: 'smsRecord/clearMyRecord' }),
    resend: params => dispatch({ type: 'smsRecord/resend', payload: params }),
    getTemplates: () => dispatch({ type: 'smsRecord/getTemplates' }),
    getSendModes: () => dispatch({ type: 'smsRecord/getSendModes' }),
    getSteps: () => dispatch({ type: 'smsRecord/getSteps' }),
  }),
)(Form.create()(MySmsRecord));

