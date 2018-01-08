import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { DatePicker, Table, Form, Button, Select, Modal, message } from 'antd';

import TrimInput from '../../components/input-trim';
import './convers.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class MyTapeRecordPage extends Component {

  state = {
    column: '',
    sorter: '',
    pageNo: 1,
    pageSize: 50,
    targetUrl: '',
    isModalShow: false,
  };

  componentDidMount() {

  }

  componentDidUpdate() {
    const { callVendor } = this.props;
    window.cocc_ip = callVendor.endpoint.replace('https://', '');
    window.cocc_is_ssl = true;
    require('../../plugs/call/api/cocc_CJI.js');
  }

  onCancel = () => {
    this.setState({ targetUrl: '', isModalShow: false });
  }

  callback = (res) => {
    const { callVendor } = this.props;
    if (res.code === 1) {
      this.setState({ targetUrl: `${callVendor.endpoint}/${res.message}`, isModalShow: true });
    } else {
      message.error('目标文件不存在');
    }
  }

  openModal = (records) => {
    const { vendorType } = records;
    const callDate = moment(records.dialTime).format('YYYY-MM-DD');
    const resultData = {
      sessionid: records.sessionId,
      callDate,
      cb: this.callback,
    };
    if (!vendorType) {
      message.error('未知供应商录音');
    } else {
      window.getCallLog(vendorType, resultData);
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { searchTapeRecord, form: { getFieldsValue } } = this.props;
    this.setState({
      column: '',
      order: '',
      pageNo: 1,
      pageSize: 50,
    }, () => {
      const resultData = dealData(getFieldsValue(), this.state);
      searchTapeRecord(resultData);
    });
  };

  handleReset = () => {
    const { resetTapeRecord, form: { resetFields } } = this.props;
    this.setState({
      column: '',
      order: '',
      pageNo: 1,
      pageSize: 50,
    }, () => {
      resetFields();
      resetTapeRecord();
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { searchTapeRecord, searchList: { records }, form: { getFieldsValue } } = this.props;
    let column = '';
    let order = '';
    if (records && records.length > 0) {
      if (sorter.order) {
        column = sorter.column && sorter.column.sorterKey;
        order = sorter.order === 'ascend' ? 'ASC' : 'DESC';
      }
      const pageNo = pagination.current || 1;
      const pageSize = pagination.pageSize || 50;
      this.setState({ column, order, pageNo, pageSize }, () => {
        const resultData = dealData(getFieldsValue(), this.state);
        searchTapeRecord(resultData);
      });
    }
  }

  render() {
    const { targetUrl, isModalShow } = this.state;
    const { searchList, searchLoading, form: { getFieldDecorator } } = this.props;
    const pagination = {
      total: searchList.totalRecords || 0,
      current: searchList.pageNo || 1,
      pageSize: searchList.pageSize || 50,
    };
    const columns = [
      {
        title: '借款人ID',
        dataIndex: 'actorId',
        sorter: true,
        sorterKey: 'ACTOR_ID',
        render: (text) => {
          return text ?
            <Link target="_blank" to={`/taskDetails?actorId=${text}`}>{text}</Link>
          :
            '';
        },
      }, {
        title: '客户姓名',
        dataIndex: 'customerName',
      }, {
        title: '通话时长',
        dataIndex: 'callTimeLength',
        sorter: true,
        sorterKey: 'TIMELENGTH',
      }, {
        title: '通话时间',
        dataIndex: 'dialTime',
        sorter: true,
        sorterKey: 'DIALTIME',
        render: text => <p>{text ? moment(Number(text)).format('YYYY-MM-DD HH:mm:ss') : ''}</p>,
      }, {
        title: '通化方向',
        dataIndex: 'callDirect',
      }, {
        title: '电话号码',
        dataIndex: 'phoneNumber',
      }, {
        title: '备注',
        dataIndex: 'remark',
      }, {
        title: '操作',
        render: (text, records) => <span>
          <Button onClick={() => this.openModal(records)} icon="play-circle" />
        </span>,
      },
    ];
    return (
      <div className="tape">
        <h3>我的通话记录</h3>
        <div style={{ marginTop: '20px' }}>
          <Form onSubmit={this.handleSubmit} className="crm-filter-box ">
            <FormItem label="通话时间" className="input-2">
              {getFieldDecorator('dialTime')(
                <RangePicker />,
              )}
            </FormItem>
            <FormItem className="input-1" label="通话方向">
              {getFieldDecorator('callDirect')(
                <Select>
                  <Option value="">全部</Option>
                  <Option value="IN">来电</Option>
                  <Option value="OUT">去电</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="借款人ID" className="input-1">
              {getFieldDecorator('actorId')(
                <TrimInput />,
              )}
            </FormItem>
            <FormItem label="客户姓名" className="input-1">
              {getFieldDecorator('customerName')(
                <TrimInput />,
              )}
            </FormItem>
            <FormItem label="电话号码" className="input-1">
              {getFieldDecorator('phoneNumber')(
                <TrimInput />,
              )}
            </FormItem>
            <div style={{ margin: '20px 0px 20px 12px' }}>
              <Button type="primary" htmlType="submit">查询</Button>
              <a onClick={this.handleReset} className="btn-link">清空</a>
            </div>
          </Form>
        </div>
        <div>
          <Table
            className="crm-table"
            dataSource={searchList && searchList.records}
            columns={columns}
            loading={searchLoading}
            pagination={pagination}
            onChange={this.handleTableChange}
          />
          {
            searchList.totalRecords ?
              <span style={{ position: 'relative', top: '-40px' }}>{`总条数：${searchList.totalRecords}`}</span>
            : null
          }
        </div>
        {
          isModalShow ?
            <Modal
              title="播放录音"
              visible={isModalShow}
              onOk={this.onCancel}
              onCancel={this.onCancel}
            >
              <audio style={{ width: '100%' }} src={targetUrl} controls="controls" />
            </Modal>
          : null
        }
      </div>
    );
  }
}

MyTapeRecordPage.propTypes = {
};

export default connect(
  state => ({
    searchList: state.myTapeRecord.tapeRecordList,
    searchLoading: state.myTapeRecord.searchLoading,
    callVendor: state.user.callVendor,
  }),
  dispatch => ({
    searchTapeRecord: (params) => {
      dispatch({ type: 'myTapeRecord/searchTapeRecord', payload: params });
    },
    resetTapeRecord: () => {
      dispatch({ type: 'myTapeRecord/resetTapeRecord' });
    },
  }),
)(Form.create()(MyTapeRecordPage));

function dealData(formData, pageData) {
  const resultData = formData;
  for (const x in resultData) {
    if (['dialTime'].indexOf(x) > -1 && resultData[x]) {
      if (resultData[x].length > 0) {
        resultData.dialTimeBegin = +resultData[x][0].startOf('day');
        resultData.dialTimeEnd = +resultData[x][1].startOf('day') + 86399999;
        delete resultData[x];
      } else {
        delete resultData[x];
      }
    }
  }
  resultData.column = pageData.column;
  resultData.order = pageData.order;
  resultData.pageNo = pageData.pageNo;
  resultData.pageSize = pageData.pageSize;
  return resultData;
}

