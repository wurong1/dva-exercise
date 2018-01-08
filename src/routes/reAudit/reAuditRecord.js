import React, { Component } from 'react';
import { Table, Tooltip } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const columns = [
  {
    title: '操作人',
    dataIndex: 'operationEmployee',
  }, {
    title: '操作时间',
    dataIndex: 'operationDate',
    render: text => <p>{text ? moment(Number(text)).format('YYYY-MM-DD HH:mm:ss') : ''}</p>,
  }, {
    title: '操作类型',
    dataIndex: 'operationType',
  }, {
    title: '备注',
    dataIndex: 'comment',
    render: text => <Tooltip title={text && text.length > 100 ? text : ''}>
      <span>{text && text.length > 100 ? `${text.substring(0,99)}...` : text}</span>
    </Tooltip>,
  },
];
class ReAuditRecord extends Component {
  state = {

  };

  componentWillMount() {}

  render() {
    const reviewRecord = this.props.reviewRecord;
    console.log(reviewRecord);
    return (
      <div className="audit-border">
        <Table
          dataSource={reviewRecord}
          columns={columns}
        />
      </div>
    );
  }
}

ReAuditRecord.propTypes = {
};

export default connect(
  state => ({
    reviewRecord: state.reAudit.auditDetailsList.reviewRecord,
    routingQuery: state.routing.locationBeforeTransitions.query,
  }),
)(ReAuditRecord);
