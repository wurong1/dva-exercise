import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Icon, Button, message, Spin, Radio, TreeSelect, Select } from 'antd';
import RecordTemp from './recordTemp';
import './assign.less';

const { TextArea } = Input;
const RadioGroup = Radio.Group;
const { Option } = Select;

class Fund51Config extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      remarks: '',
      salesAllocateWay: '',
      shakeGroup: '',
      salesId: { key: '', label: '-请选择-' },
      shakeUser: '',
    };
  }

  componentDidMount() {
    this.props.getRuleDetail('DOUBLE_FUND_ONLINE');
    this.props.getGroups();
  }

  componentDidUpdate() {
    const { fund51Config } = this.props;
    if (fund51Config.shakeEmployeeId) {
      setTimeout(() => {
        this.props.setFund51ShakeId('');
      }, 1000);
    }
  }

  searchRecords = (pagination, date) => {
    const params = {
      assignRuleDateRange: date,
      type: 'DOUBLE_FUND_ONLINE',
    };
    this.props.getFundRecordList({ ...params, ...pagination });
  }

  showRecordList = (falg, e) => {
    e.preventDefault();
    this.props.showFundRecordList(falg);
  }

  clearData = () => {
    this.props.clearFundData();
  }

  filterEmployee = () => {
    const { email } = this.state;
    const emailValue = email && email.trim();
    if (!emailValue) {
      message.error('邮箱不能为空');
      return false;
    }
    this.props.filterEmployee({ email: emailValue, assignType: 'DOUBLE_FUND_ONLINE' });
  }

  addWhiteGroups = (value, label) => {
    const { fund51Config: { specificValue = {} } } = this.props;
    const whitelist = specificValue.groupWhiteList;
    const exist = whitelist.find(item => `${item.id}` === `${value}`);
    this.setState({ salesId: { key: '', label: '-请选择-' } });
    if (!value) {
      this.props.clearUserList();
      return false;
    } else {
      this.props.getUserList(value);
    }
    if (exist) {
      message.warning('您添加的组别已存在');
      this.setState({ shakeGroup: `${value}` });
      setTimeout(() => {
        this.setState({ shakeGroup: '' });
      }, 1000);
      return false;
    }
    this.props.addWhiteGroups({ id: value, name: label && label[0] });
  }

  filterSales = (value) => {
    const { fund51Config: { specificValue = {} } } = this.props;
    this.setState({ salesId: value });
    const memberlist = specificValue.memberBlackList;
    const exist = memberlist.find(item => `${item.id}` === `${value.key}`);
    if (!value.key) return false;
    if (exist) {
      message.warning('您添加的组员已存在');
      this.setState({ shakeUser: `${value.key}` });
      setTimeout(() => {
        this.setState({ shakeUser: '' });
      }, 1000);
      return false;
    }
    this.props.addUser({ id: `${value.key}`, name: value.label });
  }

  deleteSales = (item, e) => {
    e.preventDefault();
    this.props.deleteSales(item);
  }

  deleteWhiteGroups = (item, e) => {
    e.preventDefault();
    this.props.deleteWhiteGroups(item);
  }

  deleteWhiteUser = (item, e) => {
    e.preventDefault();
    this.props.deleteWhiteUser(item);
  }

  submit = () => {
    const { remarks } = this.state;
    const {
      fund51Config: {
        specificValue,
        allocateValue,
        salesAllocateWay,
      },
    } = this.props;
    const remarksValue = remarks && remarks.trim();
    let params;
    if (!remarksValue) {
      message.error('备注不能为空');
      return false;
    }
    if (salesAllocateWay === 'SPECIFIC_SALES' && specificValue.groupWhiteList.length < 1) {
      message.error('销售白名单组不能为空！');
      return false;
    }
    if (salesAllocateWay === 'SPECIFIC_SALES') {
      params = {
        assignType: 'DOUBLE_FUND_ONLINE',
        remarks,
        memberBlackList: specificValue.memberBlackList,
        groupWhiteList: specificValue.groupWhiteList,
        salesAllocateWay,
      };
    } else {
      params = {
        assignType: 'DOUBLE_FUND_ONLINE',
        remarks,
        memberBlackList: allocateValue.memberBlackList,
        salesAllocateWay,
      };
      this.setState({ salesId: { key: '', label: '-请选择-' } });
    }
    this.props.saveAssignRlues(params);
  }

  render() {
    const { shakeGroup, salesId, shakeUser } = this.state;
    const {
      fund51Config: {
        specificValue,
        allocateValue,
        groupUserList,
        isFetching,
        shakeEmployeeId,
        loadingUser,
        showRecord,
        record,
        salesAllocateWay,
      },
      groups,
      setWay,
    } = this.props;
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
      type: 'DOUBLE_FUND_ONLINE',
    };
    return (
      <div className="tab-content">
        <Spin spinning={isFetching}>
          <div style={{ display: showRecord ? 'none' : 'block' }}>
            <a className="link-right" onClick={this.showRecordList.bind(this, true)}> 操作历史 </a>
            <div className="content-row">
              <label htmlFor="salesAllocateWay" style={{ width: '110px' }}>销售分配规则</label>
              <RadioGroup onChange={e => setWay(e.target.value)} value={salesAllocateWay}>
                <Radio value="NOT_ALLOCATE_SALES">不分配销售</Radio>
                <Radio value="SPECIFIC_SALES">指定销售分配</Radio>
              </RadioGroup>
            </div>
            {
              salesAllocateWay === 'NOT_ALLOCATE_SALES' &&
              <div>
                <div className="content-row">
                  <label htmlFor="email" style={{ width: '110px' }}>销售筛选</label>
                  <Input onChange={e => this.setState({ email: e.target.value })} />
                  <Button className="btn-add" onClick={this.filterEmployee}><Icon type="plus" /></Button>
                </div>
                <div className="content-row item-row" style={{ marginLeft: '110px' }}>
                  {
                    allocateValue.memberBlackList.map((item, idx) =>
                      <span
                        className={`shake ${item && `${item.id}` === shakeEmployeeId ? 'shake-constant' : ''}`}
                        key={idx}
                      >
                        {item.name}
                        <a
                          className="item-move"
                          onClick={this.deleteSales.bind(this, item)}
                        >
                          <Icon type="close-circle-o" />
                        </a>
                      </span>,
                    )
                  }
                </div>
              </div>
            }
            {
              salesAllocateWay === 'SPECIFIC_SALES' &&
              <div>
                <div className="content-row">
                  <label htmlFor="groupId" style={{ width: '110px' }} className="require">销售白名单组</label>
                  <TreeSelect
                    onChange={this.addWhiteGroups}
                    treeData={groups}
                    placeholder="-请选择-"
                    style={{ width: 300 }}
                    allowClear
                    showSearch
                    filterTreeNode={(value, node) => {
                      return node.props.title && node.props.title.search(value) > -1;
                    }}
                  />
                </div>
                <div className="content-row item-row" style={{ marginLeft: '110px' }}>
                  {
                    specificValue.groupWhiteList.map(item =>
                      <span
                        className={`shake ${item && `${item.id}` === shakeGroup ? 'shake-constant' : ''}`}
                        key={item.id}
                      >
                        {item.name}
                        <a
                          className="item-move"
                          onClick={this.deleteWhiteGroups.bind(this, item)}
                        >
                          <Icon type="close-circle-o" />
                        </a>
                      </span>,
                    )
                  }
                </div>
                <div className="content-row">
                  <label htmlFor="salesId" style={{ width: '110px' }}>组员过滤</label>
                  <Spin spinning={loadingUser}>
                    <Select
                      onChange={this.filterSales}
                      labelInValue
                      value={salesId}
                      showSearch
                      optionFilterProp="children"
                    >
                      <Option value="">-请选择-</Option>
                      {
                        groupUserList.map((item, idx) => <Option key={idx} value={`${item.id}`}>{item.name}</Option>)
                      }
                    </Select>
                  </Spin>
                </div>
                <div className="content-row item-row" style={{ marginLeft: '110px' }}>
                  {
                    specificValue.memberBlackList.map(item =>
                      <span
                        className={`shake ${item && `${item.id}` === shakeUser ? 'shake-constant' : ''}`}
                        key={item.id}
                      >
                        {item.name}
                        <a
                          className="item-move"
                          onClick={this.deleteWhiteUser.bind(this, item)}
                        >
                          <Icon type="close-circle-o" />
                        </a>
                      </span>,
                    )
                  }
                </div>
              </div>
            }
            <div className="content-row">
              <label htmlFor="remarks" className="require" style={{ width: '110px' }}>备注</label>
              <TextArea onChange={e => this.setState({ remarks: e.target.value })} />
            </div>
            <div className="content-row">
              <Button onClick={this.submit} className="btn-save" type="primary" style={{ marginLeft: '110px' }}>保存</Button>
            </div>
          </div>
          <div className="record" style={{ display: showRecord ? 'block' : 'none' }}>
            <a className="link-right" onClick={this.showRecordList.bind(this, false)}>返回</a>
            <p className="record-title">历史记录</p>
            <RecordTemp {...options} />
          </div>
        </Spin>
      </div>
    );
  }
}

export default connect(
  state => ({
    fund51Config: state.fund51.fund51Config,
    groups: state.fund51.groups,
    salesAllocateWay: state.fund51.fund51Config.salesAllocateWay,
  }),
  dispatch => ({
    getRuleDetail: params => dispatch({ type: 'fund51/getRuleDetail', payload: params }),
    getGroups: params => dispatch({ type: 'fund51/getGroups', payload: params }),
    addWhiteGroups: params => dispatch({ type: 'fund51/addWhiteGroups', payload: params }),
    deleteWhiteGroups: params => dispatch({ type: 'fund51/deleteWhiteGroups', payload: params }),
    deleteWhiteUser: params => dispatch({ type: 'fund51/deleteWhiteUser', payload: params }),
    clearUserList: params => dispatch({ type: 'fund51/clearUserList', payload: params }),
    getUserList: params => dispatch({ type: 'fund51/getUserList', payload: params }),
    addUser: params => dispatch({ type: 'fund51/addUser', payload: params }),
    filterEmployee: params => dispatch({ type: 'fund51/filterEmployee', payload: params }),
    deleteSales: params => dispatch({ type: 'fund51/deleteSales', payload: params }),
    saveAssignRlues: params => dispatch({ type: 'fund51/saveAssignRlues', payload: params }),
    setFund51ShakeId: params => dispatch({ type: 'fund51/setFund51ShakeId', payload: params }),
    setLoanRiverShakeId: params => dispatch({ type: 'fund51/setLoanRiverShakeId', payload: params }),
    getFundRecordList: params => dispatch({ type: 'fund51/getFundRecordList', payload: params }),
    showFundRecordList: params => dispatch({ type: 'fund51/showFundRecordList', payload: params }),
    clearFundData: () => dispatch({ type: 'fund51/clearFundData' }),
    setWay: params => dispatch({ type: 'fund51/setWay', payload: params }),
  }),
)(Fund51Config);
