import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Table } from 'antd';

const monthColum = [{
  title: '月份',
  dataIndex: 'index',
  key: 'index',
  render: (text) => {
    return `最近${12 - text}个月`;
  },
}, {
  title: '交易金额',
  dataIndex: 'amount',
  key: 'amount',
  render: text => `${text}元`,
}, {
  title: '交易笔数',
  dataIndex: 'number',
  key: 'number',
  render: text => `${text}笔`,
}];

const columns = [{
  title: '商户编号',
  dataIndex: 'mid',
  key: 'mid',
}, {
  title: '终端号',
  dataIndex: 'deviceID',
  key: 'deviceID',
  render: (text) => {
    return text && text.join(',');
  },
}, {
  title: '商户名称',
  dataIndex: 'companyName',
  key: 'companyName',
}, {
  title: '首次交易日期',
  dataIndex: 'beginDate',
  key: 'beginDate',
  render: (text) => {
    return text && text.split('T')[0];
  },
}, {
  title: '最新交易日期',
  dataIndex: 'endDate',
  key: 'endDate',
  render: (text) => {
    return text && text.split('T')[0];
  },
}, {
  title: '交易数量',
  dataIndex: 'count',
  key: 'count',
}];

class UnionPayDetail extends Component {
  componentWillMount() {
    const { getPosDetail, posId } = this.props;
    getPosDetail(posId);
  }
  render() {
    const { posDetail } = this.props;
    return (
      <div className="task">
        <h3 className="dr-section-font">银联pos详情</h3>
        <p className="">近12个月日交易额分析</p>
        <Row gutter={24}>
          <Col span={12}>
            <div className="row">
              <label className="row-label" htmlFor="dailyAmountAbove10Percent">日低交易额10% </label>
              <div>
                { posDetail.target > 0 ? posDetail.dailyAmountAbove10Percent : '' }
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="row">
              <label className="row-label" htmlFor="dailyAmountAbove25Percent">日低交易额25% </label>
              <div>
                { posDetail.target > 0 ? posDetail.dailyAmountAbove25Percent : '' }
              </div>
            </div>
          </Col>
        </Row>
        <p className="">近12个月核心经营指标</p>
        <Row gutter={24}>
          <Col span={12}>
            <div className="row">
              <label className="row-label" htmlFor="sumAmount">交易总金额</label>
              <div>
                { posDetail.target > 0 ? posDetail.sumAmount : '' }元
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="row">
              <label className="row-label" htmlFor="sumNumber">交易笔数</label>
              <div>
                { posDetail.target > 0 ? posDetail.sumNumber : '' }笔
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="row">
              <label className="row-label" htmlFor="normalOperatingDays">正常经营天数</label>
              <div>
                { posDetail.target > 0 ? posDetail.normalOperatingDays : '' }天
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="row">
              <label className="row-label" htmlFor="normalOperatingMonths">正常经营月数</label>
              <div>
                { posDetail.target > 0 ? posDetail.normalOperatingMonths : '' }月
              </div>
            </div>
          </Col>
        </Row>
        <p className="">近12个月每个月经营指标</p>
        <Table
          dataSource={posDetail.monthly || []}
          columns={monthColum}
        />
        <p className="">近12个月按商户编号汇总</p>
        <Table
          dataSource={posDetail.midInfos || []}
          columns={columns}
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    posDetail: state.task.unionPay.posDetail,
    posId: state.routing.locationBeforeTransitions.query.posId,
  }),
  dispatch => ({
    getPosDetail: params => dispatch({ type: 'task/getPosDetail', payload: params }),
  }),
)(UnionPayDetail);

