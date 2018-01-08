import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { DatePicker, Table, Form, Row, Col, Button } from 'antd';

import './customer.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const columns = [
  {
    title: '手机号',
    dataIndex: 'phone',
  }, {
    title: '姓名',
    dataIndex: 'userName',
  }, {
    title: '城市',
    dataIndex: 'city',
  }, {
    title: '线下信息渠道',
    dataIndex: 'channelOffline',
  }, {
    title: '导入时间',
    dataIndex: 'createDate',
  }, {
    title: '失败原因',
    dataIndex: 'failedReason',
  },
];

class UploadFailedePage extends Component {
  state = {
    
  };

  componentWillMount() {
    
  }

  getPaginationData(pageNo, pageSize) {
    const { getUploadFialedList } = this.props;
    getUploadFialedList({pageNo, pageSize});
  }

  handleReset = () => {
    this.props.form.resetFields();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { findUploadFailedList } = this.props;
    const formData = this.props.form.getFieldsValue();
    findUploadFailedList(formData, { pageNo: 1, pageSize: 50 });
  };

  render() {
    const { uploadFailedList, loading, form:{ getFieldDecorator } } = this.props;
    const records = uploadFailedList.records || [];
    const pagination = {
      total: uploadFailedList.totalRecords || 0,
      defaultPageSize: uploadFailedList.pageSize || 50,
      onChange: (page, pageSize) => this.getPaginationData(page, pageSize),
    };
    return (
      <div>
        <h3 className="dr-section-font">失败历史</h3>
        <div className="customer-border">
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col span={6}>
                <FormItem label="创建时间" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('createDateStartRange')(
                    <RangePicker />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Button type="primary" htmlType="submit">查询</Button>
              <a onClick={this.handleReset} className="btn-link">清空</a>
            </Row>
          </Form>
        </div>
        <div>
          <Table
            className="crm-table"
            dataSource={records}
            columns={columns}
            loading={loading}
            pagination={pagination}
          />
        </div>
      </div>
    );
  }
}

UploadFailedePage.propTypes = {
};

export default connect(
  state => ({
    loading: state.loading.models.uploadFailed,
    uploadFailedList: state.uploadFailed.uploadFailedList,
  }),
  dispatch => ({
    findUploadFailedList: (formData) => {
      const resultData = formData;
      if(formData.createDateStartRange && formData.createDateStartRange.length >0) {
        const startTime = + formData.createDateStartRange[0].startOf('day');
        const endTime = + formData.createDateStartRange[1].startOf('day') + 86400000;
        resultData.createDateStartRange = `${startTime}-${endTime}`
      }
      resultData.pageNo = 1;
      resultData.pageSize = 50;
      dispatch({ type: 'uploadFailed/findUploadFailedList', payload: resultData });
    },
    getUploadFialedList: (pageData) => {
      dispatch({ type: 'uploadFailed/getUploadFialedList', payload: pageData });
    },
  }),
)(Form.create()(UploadFailedePage));
