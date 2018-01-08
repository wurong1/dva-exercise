import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Row, Col } from 'antd';
import moment from 'moment';
import './sms.less';

class SmsFaieldDetail extends Component {

  componentDidMount() {
    const { transactionNo, getFaieldUserList, getUploadFaieldDetail } = this.props;
    getFaieldUserList({ pageNo: 1, pageSize: 50, transactionNo });
    getUploadFaieldDetail(transactionNo);
  }

  handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    const params = {
      pageNo: current,
      pageSize,
      transactionNo: this.props.transactionNo,
    };
    this.props.getFaieldUserList(params);
  }

  render() {
    const {
      dataSource: {
        pageNo = 1,
        pageSize = 50,
        records = [],
        totalRecords = 0,
      },
      loading,
      uploadFaieldDetail: {
        createdBy,
        createdDate,
      },
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
        title: '借款人ID',
        dataIndex: 'actorId',
        key: 'actorId',
      }, {
        title: '名字',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
      },
    ];

    return (
      <div className="sms">
        <h3 className="dr-section-font">上传失败历史</h3>
        <div style={{ marginBottom: '15px' }}>
          <Row>
            <Col span={10}>
              <span className="sms-section-label">上传时间：{createdDate && moment(createdDate).format('YYYY-MM-DD HH:mm:ss')}</span>
            </Col>
            <Col span={8}>
              <span>操作人：{createdBy}</span>
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <a href={`/borrower/v1/sms/batch/download-upload-failure/${this.props.transactionNo}`}>导出</a>
            </Col>
          </Row>
        </div>
        <Table
          columns={columns}
          dataSource={records || []}
          onChange={this.handleTableChange}
          pagination={pagination}
          loading={loading}
          rowKey={(record, idx) => idx}
          size="middle"
          className="sms-table"
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    dataSource: state.smsSend.faieldUserList,
    loading: state.smsSend.loadingUserList,
    uploadFaieldDetail: state.smsSend.uploadFaieldDetail,
    transactionNo: state.routing.locationBeforeTransitions.query.transactionNo,
  }),
  dispatch => ({
    getFaieldUserList: params => dispatch({ type: 'smsSend/getFaieldUserList', payload: params }),
    getUploadFaieldDetail: params => dispatch({ type: 'smsSend/getUploadFaieldDetail', payload: params }),
  }),
)(SmsFaieldDetail);
