import React, { Component } from 'react';
import { Form, Row, Col, DatePicker, Table, Tooltip, Button } from 'antd';
import moment from 'moment';

moment.locale('zh-cn');

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

class RecordTemp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultDate: [moment().subtract(7, 'days'), moment().startOf('day')],
    };
  }

  submit = (e) => {
    const { searchRecords } = this.props;
    const pagination = {
      pageNo: 1,
      pageSize: 20,
    };
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const date = `${values.assignRuleDateRange && +values.assignRuleDateRange[0].startOf('day')}-${values.assignRuleDateRange && +values.assignRuleDateRange[1].startOf('day') + 86399999}`;
        searchRecords(pagination, date);
        this.setState({ date });
      }
    });
  }

  pageChange = (option) => {
    const { date } = this.state;
    const { searchRecords } = this.props;
    const pagination = {
      pageNo: option.current,
      pageSize: option.pageSize,
    };
    searchRecords(pagination, date);
  }

  clearData = () => {
    const { clearData } = this.props;
    const { resetFields } = this.props.form;
    resetFields();
    clearData();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { records, pagination, loading, type } = this.props;

    const columns = [{
      title: '操作时间',
      dataIndex: 'createDateForRender',
      key: 'createDateForRender',
    }, {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    }, {
      title: '操作人',
      dataIndex: 'employeeName',
      key: 'employeeName',
    }, {
      title: `${type === 'STATUS' ? '过滤贷款状态' : '过滤销售'}`,
      dataIndex: 'detail',
      key: 'detail',
      render: text =>
        <Tooltip title={text && text.length > 30 ? text : ''}>
          <span>{text && text.length > 30 ? `${text.substring(0, 29)}...` : text}</span>
        </Tooltip>,
    }, {
      title: '备注',
      dataIndex: 'comment',
      key: 'comment',
      render: text =>
        <Tooltip title={text && text.length > 30 ? text : ''}>
          <span>{text && text.length > 30 ? `${text.substring(0, 29)}...` : text}</span>
        </Tooltip>,
    }];

    return (
      <div>
        <Form
          layout="horizontal"
          onSubmit={this.submit}
        >
          <Row gutter={24}>
            <Col span={6}>
              <FormItem
                label="时间范围"
              >
                {getFieldDecorator('assignRuleDateRange', {
                  initialValue: this.state.defaultDate,
                  rules: [{ required: true, message: '请输入时间范围！' }],
                })(
                  <RangePicker
                    format={dateFormat}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              className="record-btn"
            >
                搜索
          </Button>
          </FormItem>
        </Form>
        <Button className="btn-clear record-btn" onClick={this.clearData} >
          清空
        </Button>
        <Table
          columns={columns}
          dataSource={records || []}
          pagination={pagination}
          onChange={this.pageChange}
          loading={loading}
          rowKey={(item, idx) => idx}
        />
      </div>
    );
  }
}

export default Form.create()(RecordTemp);
