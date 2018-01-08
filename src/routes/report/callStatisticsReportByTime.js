import React, { Component } from 'react';
import { connect } from 'dva';
import { hashHistory } from 'react-router';
import { DatePicker, Table, Form, Button, Select, TreeSelect } from 'antd';

import './report.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const columns = [
  {
    title: '时间',
    dataIndex: 'day',
    key: 'day',
  }, {
    title: '外呼任务总数',
    dataIndex: 'outCallTaskTimes',
    key: 'outCallTaskTimes',
  }, {
    title: '接通任务总数',
    dataIndex: 'connectTaskTimes',
    key: 'connectTaskTimes',
  }, {
    title: '任务接通率',
    dataIndex: 'connectTaskProbability',
    key: 'connectTaskProbability',
    render: text => `${text}%`,
  }, {
    title: '外呼总次数',
    dataIndex: 'outCallTimes',
    key: 'outCallTimes',
  }, {
    title: '接通总次数',
    dataIndex: 'connectTimes',
    key: 'connectTimes',
  }, {
    title: '外呼总时长',
    dataIndex: 'outCallTimeStr',
    key: 'outCallTimeStr',
  }, {
    title: '平均通话时长',
    dataIndex: 'averageOutCallTime',
    key: 'averageOutCallTime',
  },
];

class CallStatisticsReportByTime extends Component {

  state = {
    pageNo: 1,
    pageSize: 50,
  };

  componentDidMount() {
    const { getEmployeeGroup } = this.props;
    getEmployeeGroup();
  }

  getEmployeeList = (val) => {
    const { getEmployee, resetEmployeeId, form: { setFieldsValue } } = this.props;
    if (val) {
      getEmployee(val);
    } else {
      resetEmployeeId();
    }
    setFieldsValue({ employeeId: '' });
  }

  getPaginationData(pageNo, pageSize) {
    const { searchCallStatisticsByTime, form: { getFieldsValue } } = this.props;
    const formData = getFieldsValue();
    this.setState({ pageNo, pageSize }, () => {
      searchCallStatisticsByTime(dealData(formData, this.state));
    });
  }

  goTeamStatistics = () => {
    hashHistory.push('/tellphone-statistics-team');
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { searchCallStatisticsByTime, form: { getFieldsValue } } = this.props;
    this.setState({
      pageNo: 1,
      pageSize: 50,
    }, () => {
      const resultData = dealData(getFieldsValue(), this.state);
      searchCallStatisticsByTime(resultData);
    });
  };

  handleReset = () => {
    const { timeListReset, form: { resetFields } } = this.props;
    this.setState({
      pageNo: 1,
      pageSize: 50,
    }, () => {
      resetFields();
      timeListReset();
    });
  };

  render() {
    const { employeeGroupList, employeeList, timeSearchList, timeSearchLoading,
      form: { getFieldDecorator } } = this.props;
    const pagination = {
      total: timeSearchList.totalRecords || 0,
      current: timeSearchList.pageNo || 1,
      pageSize: timeSearchList.pageSize || 50,
      onChange: (page, pageSize) => this.getPaginationData(page, pageSize),
    };
    return (
      <div className="callout-report">
        <h3>电话统计报表</h3>
        <div className="button-container">
          <div>
            <div className="cursor-div focus-btn tab-default">时间维度</div>
            <div className="cursor-div tab-default" onClick={this.goTeamStatistics}>团队维度</div>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <Form onSubmit={this.handleSubmit} className="crm-filter-box ">
            <FormItem label="时间" className="input-2">
              {getFieldDecorator('callTimeRange')(
                <RangePicker />,
              )}
            </FormItem>
            <FormItem label="负责人组别" className="input-1">
              {getFieldDecorator('employeeGroupId')(
                <TreeSelect
                  treeData={employeeGroupList}
                  dropdownMatchSelectWidth={false}
                  treeDefaultExpandAll={false}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  allowClear
                  onChange={this.getEmployeeList.bind(this)}
                />,
              )}
            </FormItem>
            <FormItem label="负责人" className="input-1">
              {getFieldDecorator('employeeId', {
                initialValue: '',
              })(
                <Select disabled={employeeList && employeeList.length <= 0}>
                  <Option value="">全部</Option>
                  {
                    employeeList && employeeList.map((val) => {
                      return <Option key={val.id} value={val.id}>{val.name}</Option>;
                    })
                  }
                </Select>,
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
            dataSource={timeSearchList && timeSearchList.records}
            columns={columns}
            loading={timeSearchLoading}
            pagination={pagination}
          />
          {
            timeSearchList.totalRecords ?
              <span style={{ position: 'relative', top: '-40px' }}>{`总条数：${timeSearchList.totalRecords}`}</span>
            : null
          }
        </div>
      </div>
    );
  }
}

CallStatisticsReportByTime.propTypes = {
};

export default connect(
  state => ({
    employeeGroupList: state.callStatisticsReport.employeeGroupList,
    employeeList: state.callStatisticsReport.employeeList,
    timeSearchList: state.callStatisticsReport.timeSearchList,
    timeSearchLoading: state.callStatisticsReport.timeSearchLoading,
  }),
  dispatch => ({
    getEmployeeGroup: () => {
      dispatch({ type: 'callStatisticsReport/getEmployeeGroup' });
    },
    getEmployee: (params) => {
      dispatch({ type: 'callStatisticsReport/getEmployee', payload: params });
    },
    searchCallStatisticsByTime: (params) => {
      dispatch({ type: 'callStatisticsReport/searchCallStatisticsByTime', payload: params });
    },
    timeListReset: () => {
      dispatch({ type: 'callStatisticsReport/timeListReset' });
    },
    resetEmployeeId: () => {
      dispatch({ type: 'callStatisticsReport/resetEmployeeId' });
    },
  }),
)(Form.create()(CallStatisticsReportByTime));

function dealData(formData, pageData) {
  const resultData = formData;
  for (const x in resultData) {
    if (['callTimeRange'].indexOf(x) > -1 && resultData[x]) {
      if (resultData[x].length > 0) {
        const start = +resultData[x][0].startOf('day');
        const end = +resultData[x][1].startOf('day') + 86399999;
        resultData[x] = `${start}-${end}`;
      } else {
        delete resultData[x];
      }
    }
  }
  resultData.dimension = 'TIME';
  resultData.pageNo = pageData.pageNo;
  resultData.pageSize = pageData.pageSize;
  return resultData;
}
