import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Icon, Button, message, Spin, Form, Select, Tabs, Radio } from 'antd';
import RecordTemp from './recordTemp';
import './assign.less';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const TabPane = Tabs.TabPane;

class StatusTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shakeItem: {},
      loanCode: 'SPEEDLOAN',
    };
  }

  componentDidMount() {
    this.props.getExistResultList('SPEEDLOAN');
  }

  onStatusChange = (value) => {
    const { setFieldsValue, getFieldValue } = this.props.form;
    const loanCode = getFieldValue('loanCode');
    const params = {
      loanCode,
      taskStatus: value,
    };
    this.props.getOperationResultList(params);
    setFieldsValue({ operationResult: '' });
  }

  addResult = (value) => {
    if (!value) return false;
    const { statusTab: { resultList = [], operationResult: { list = [] } } } = this.props;
    const checkedItem = list.find(item => item.code === value);
    const exist = resultList.find(item =>
      item.code === checkedItem.code && item.status === checkedItem.status,
    );
    if (exist) {
      message.warning('请勿重复添加');
      this.setState({ shakeItem: checkedItem });
      setTimeout(() => {
        this.setState({ shakeItem: {} });
      }, 1000);
      return false;
    }
    this.props.addResult([...resultList, list.find(item => item.code === value)]);
  }

  deleteResult = (item, e) => {
    e.preventDefault();
    this.props.deleteResult(item);
  }

  showRecordList = (falg, e) => {
    e.preventDefault();
    const { showStatusRecordList } = this.props;
    showStatusRecordList(falg);
  }

  submit = (e) => {
    e.preventDefault();
    const { statusTab: { resultList = [] } } = this.props;
    this.props.form.validateFields((err, values) => {
      if (err) return false;
      const params = {
        comment: values.comment,
        processResults: resultList,
        loanCode: values.loanCode,
      };
      this.props.updateStatusConfig(params);
    });
  }

  searchRecords = (pagination, date) => {
    const { getFieldValue } = this.props.form;
    const params = {
      assignRuleDateRange: date,
      type: getFieldValue('loanCode'),
    };
    this.props.getStatusRecordList({ ...params, ...pagination });
  }

  clearData = () => {
    this.props.clearStatusData();
  }

  handleLoantypeChange = (e) => {
    const { setFieldsValue } = this.props.form;
    const loanCode = e.target.value;
    this.props.getExistResultList(loanCode);
    setFieldsValue({ taskStatus: '', operationResult: '', comment: '' });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { shakeItem, loanCode } = this.state;
    const {
      statusTab: {
        operationResult = {},
        resultList = [],
        isFetching,
        showRecord,
        record,
      },
    } = this.props;
    const { list = [] } = operationResult;
    const { records = [], pageNo = 1, pageSize = 20, totalRecords = 0 } = record;
    const pagination = {
      current: pageNo,
      total: totalRecords,
      pageSize,
      showSizeChanger: true,
      pageSizeOptions: ['20', '50', '80'],
    };
    const options = {
      records,
      pagination,
      loading: record.isFetching,
      searchRecords: this.searchRecords,
      clearData: this.clearData,
      type: 'STATUS',
    };
    return (
      <div className="assign">
        <h3 className="dr-section-font">任务状态过滤</h3>
        <div className="crm-tab">
          <Tabs className="tabs">
            <TabPane tab="任务状态过滤" key="SPPDLOAN" >
              <div className="tab-content">
                <Spin spinning={isFetching}>
                  <div style={{ display: `${showRecord ? 'none' : 'block'}` }}>
                    <a className="link-right" onClick={this.showRecordList.bind(this, true)}> 操作历史 </a>
                    <div className="content-row">
                      <Form
                        onSubmit={this.submit}
                      >
                        <FormItem
                          label="任务类型"
                          style={{ display: 'inline-block' }}
                        >
                          {getFieldDecorator('loanCode', {
                            initialValue: loanCode,
                          })(
                            <Radio.Group onChange={this.handleLoantypeChange}>
                              <Radio.Button value="SPEEDLOAN">SPEEDLOAN</Radio.Button>
                            </Radio.Group>,
                        )}
                        </FormItem>
                        <FormItem
                          label="任务状态"
                        >
                          {getFieldDecorator('taskStatus', {
                            initialValue: '',
                          })(
                            <Select onChange={this.onStatusChange}>
                              <Option value="">全部</Option>
                              <Option value="LOANAPPGUIDED">引导进件</Option>
                              <Option value="AUDITFOLLOWUP">审核跟进</Option>
                              <Option value="SIGN">签约</Option>
                            </Select>,
                          )}
                        </FormItem>
                        <Spin spinning={operationResult.isFetching}>
                          <FormItem
                            label="贷款申请状态"
                          >
                            {getFieldDecorator('operationResult', {
                              initialValue: '',
                            })(
                              <Select
                                onChange={this.addResult}
                                disabled={list.length < 1}
                              >
                                <Option value="">全部</Option>
                                {
                                  list.map((item, idx) =>
                                    <Option value={item.code} key={idx}>{item.description}</Option>,
                                  )
                                }
                              </Select>,
                            )}
                          </FormItem>
                        </Spin>
                        <div className="content-row item-row" style={{ marginTop: '10px' }}>
                          {
                            resultList.map((item, idx) =>
                              <span
                                className={`shake ${item && item.code === shakeItem.code && item.status === shakeItem.status ? 'shake-constant' : ''}`}
                                key={idx}
                              >
                                {item && item.description}
                                <a
                                  className="item-move"
                                  onClick={this.deleteResult.bind(this, item)}
                                >
                                  <Icon type="close-circle-o" />
                                </a>
                              </span>,
                            )
                          }
                        </div>
                        <div className="content-row">
                          <FormItem
                            label="备注"
                          >
                            {getFieldDecorator('comment', {
                              initValue: '',
                              rules: [{
                                required: true, message: '不能为空！',
                              }],
                            })(
                              <TextArea />,
                            )}
                          </FormItem>
                        </div>
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
                    </div>
                  </div>
                  <div className="record" style={{ display: `${showRecord ? 'block' : 'none'}` }}>
                    <a className="link-right" onClick={this.showRecordList.bind(this, false)}> 返回 </a>
                    <p className="record-title">历史记录</p>
                    <RecordTemp {...options} />
                  </div>
                </Spin>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    statusTab: state.assign.statusTab,
  }),
  dispatch => ({
    getOperationResultList: params => dispatch({ type: 'assign/getOperationResultList', payload: params }),
    getExistResultList: params => dispatch({ type: 'assign/getExistResultList', payload: params }),
    addResult: params => dispatch({ type: 'assign/addResult', payload: params }),
    updateStatusConfig: params => dispatch({ type: 'assign/updateStatusConfig', payload: params }),
    deleteResult: params => dispatch({ type: 'assign/deleteResult', payload: params }),
    showStatusRecordList: params => dispatch({ type: 'assign/showStatusRecordList', payload: params }),
    getStatusRecordList: params => dispatch({ type: 'assign/getStatusRecordList', payload: params }),
    clearStatusData: () => dispatch({ type: 'assign/clearStatusData' }),
  }),
)(Form.create()(StatusTab));
