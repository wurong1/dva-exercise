import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import moment from 'moment';
import { Link } from 'dva/router';
import './sms.less';

class SmsFaieldList extends Component {

  componentDidMount() {
    this.props.getFaieldList({ pageNo: 1, pageSize: 50 });
  }

  handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    const params = {
      pageNo: current,
      pageSize,
    };
    this.props.getFaieldList(params);
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
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: (text, record) => <Link to={`/sms-faield-detail?transactionNo=${record.transactionNo}`}>{text}</Link>,
      }, {
        title: '上传时间',
        dataIndex: 'createdDate',
        key: 'createdDate',
        render: text => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
      }, {
        title: '失败数',
        dataIndex: 'failedNo',
        key: 'failedNo',
      }, {
        title: '操作人',
        dataIndex: 'createdBy',
        key: 'createdBy',
      },
    ];

    return (
      <div className="sms">
        <h3 className="dr-section-font">失败历史</h3>
        <Link to="/sms-send">返回成功记录</Link>
        <Table
          columns={columns}
          dataSource={records || []}
          onChange={this.handleTableChange}
          pagination={pagination}
          loading={loading}
          rowKey={(record, idx) => idx}
          size="middle"
          className="sms-table"
          style={{ marginTop: '10px' }}
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    dataSource: state.smsSend.dataSource,
    loading: state.smsSend.loadingFaieldList,
  }),
  dispatch => ({
    getFaieldList: params => dispatch({ type: 'smsSend/getFaieldList', payload: params }),
  }),
)(SmsFaieldList);
