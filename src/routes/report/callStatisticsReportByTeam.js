import React, { Component } from 'react';
import { connect } from 'dva';
import { hashHistory } from 'react-router';
import moment from 'moment';
import { DatePicker, Table, Form, Button, Select, TreeSelect, Checkbox } from 'antd';

import './report.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const columns = [
  {
    title: '团队',
    dataIndex: 'employeeGroupName',
    key: 'employeeGroupName',
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
const showEmployeeColumns = [
  {
    title: '分部名称',
    dataIndex: 'parentEmployeeGroupName',
    key: 'parentEmployeeGroupName',
  }, {
    title: '任务负责人组别',
    dataIndex: 'employeeGroupName',
    key: 'employeeGroupName',
  }, {
    title: '任务负责人',
    dataIndex: 'employeeName',
    key: 'employeeName',
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

class CallStatisticsReportByTeam extends Component {

  state = {
    pageNo: 1,
    pageSize: 50,
    showEmployee: false,
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
    const { searchCallStatisticsByTeam, form: { getFieldsValue } } = this.props;
    const formData = getFieldsValue();
    this.setState({ pageNo, pageSize }, () => {
      searchCallStatisticsByTeam(dealData(formData, this.state));
    });
  }

  goTeamStatistics = () => {
    hashHistory.push('/tellphone-statistics-report');
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { searchCallStatisticsByTeam, form: { getFieldsValue } } = this.props;
    this.setState({
      pageNo: 1,
      pageSize: 50,
    }, () => {
      const resultData = dealData(getFieldsValue(), this.state);
      searchCallStatisticsByTeam(resultData);
    });
  };

  handleReset = () => {
    const { teamListReset, form: { resetFields } } = this.props;
    this.setState({
      pageNo: 1,
      pageSize: 50,
    }, () => {
      resetFields();
      teamListReset();
    });
  };

  render() {
    const { employeeGroupList, employeeList, teamSearchList, teamSearchLoading, showEmployee,
      form: { getFieldDecorator } } = this.props;
    const pagination = {
      total: teamSearchList.totalRecords || 0,
      current: teamSearchList.pageNo || 1,
      pageSize: teamSearchList.pageSize || 50,
      onChange: (page, pageSize) => this.getPaginationData(page, pageSize),
    };
    return (
      <div className="callout-report">
        <h3>电话统计报表</h3>
        <div className="button-container">
          <div>
            <div className="cursor-div tab-default" onClick={this.goTeamStatistics}>时间维度</div>
            <div className="cursor-div focus-btn tab-default">团队维度</div>
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
            <Checkbox onChange={e => this.setState({ showEmployee: e.target.checked })}>显示员工明细</Checkbox>
            <div style={{ margin: '20px 0px 20px 12px' }}>
              <Button type="primary" htmlType="submit">查询</Button>
              <a onClick={this.handleReset} className="btn-link">清空</a>
            </div>
          </Form>
        </div>
        <div>
          <Table
            className="crm-table"
            dataSource={teamSearchList && teamSearchList.records}
            columns={showEmployee ? showEmployeeColumns : columns}
            loading={teamSearchLoading}
            pagination={pagination}
          />
          {
            teamSearchList.totalRecords ?
              <span style={{ position: 'relative', top: '-40px' }}>{`总条数：${teamSearchList.totalRecords}`}</span>
            : null
          }
        </div>
      </div>
    );
  }
}

CallStatisticsReportByTeam.propTypes = {
};

export default connect(
  state => ({
    employeeGroupList: state.callStatisticsReport.employeeGroupList,
    employeeList: state.callStatisticsReport.employeeList,
    teamSearchList: state.callStatisticsReport.teamSearchList,
    teamSearchLoading: state.callStatisticsReport.teamSearchLoading,
    showEmployee: state.callStatisticsReport.showEmployee,
  }),
  dispatch => ({
    getEmployeeGroup: () => {
      dispatch({ type: 'callStatisticsReport/getEmployeeGroup' });
    },
    getEmployee: (params) => {
      dispatch({ type: 'callStatisticsReport/getEmployee', payload: params });
    },
    searchCallStatisticsByTeam: (params) => {
      dispatch({ type: 'callStatisticsReport/searchCallStatisticsByTeam', payload: params });
    },
    teamListReset: () => {
      dispatch({ type: 'callStatisticsReport/teamListReset' });
    },
    resetEmployeeId: () => {
      dispatch({ type: 'callStatisticsReport/resetEmployeeId' });
    },
  }),
)(Form.create()(CallStatisticsReportByTeam));

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

  resultData.dimension = 'TEAM';
  resultData.pageNo = pageData.pageNo;
  resultData.pageSize = pageData.pageSize;
  resultData.showEmployee = pageData.showEmployee;
  return resultData;
}
