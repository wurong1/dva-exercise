import React, { Component } from 'react';
import { Table, Radio, Button, Form, Input, Row, Col, Tooltip } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import LoanInfo from '../../components/borrow';

const FormItem = Form.Item;
const { TextArea } = Input;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const columns = [
  {
    title: '批注时间',
    dataIndex: 'date',
  }, {
    title: '描述',
    dataIndex: 'descriptions',
    render: text => <Tooltip title={text && text.length > 50 ? text : ''}>
      <span>{text && text.length > 50 ? `${text.substring(0,49)}...` : text}</span>
    </Tooltip>,
  },
];
class AuditDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReviewPass: false,
      loanAppId: this.props.routingQuery.loanAppId,
      reviewId: this.props.routingQuery.reviewVersion,
      showOriginPhone: false,
    };
  }


  componentWillMount() {

  }


  getPaginationData(pageNo, pageSize) {
    const { getLoanAuditResult } = this.props;
    const formData = this.props.configList;
    getLoanAuditResult(formData, { pageNo, pageSize });
  }

  showPhoneNo = () => {
    const { actorBaseInfo: { actorId }, getOriginPhone, originPhoneNo } = this.props;
    const { showOriginPhone } = this.state;
    if (!showOriginPhone && !originPhoneNo) {
      getOriginPhone(actorId);
    }
    this.setState(prevState => ({
      showOriginPhone: !prevState.showOriginPhone,
    }));
  }

  handleSubmit = (e) => {
    const { auditResult } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        auditResult(values, this.state, this.props.configList);
      }
    });
  };

  radioChange(val) {
    if (val) {
      this.setState({ isReviewPass: val });
    }
  }

  render() {
    const { showOriginPhone } = this.state;
    const { originPhoneNo } = this.props;
    const { getFieldDecorator } = this.props.form;
    const actorBaseInfo = this.props.actorBaseInfo ? this.props.actorBaseInfo : {};
    const baseInfo = this.props.baseInfoList ? this.props.baseInfoList : {};
    const details = this.props.auditDetailsList ? this.props.auditDetailsList : {};
    const LoanAuditResultList = this.props.LoanAuditResultList.records ?
      this.props.LoanAuditResultList.records : [];
    const pagination = {
      total: this.props.LoanAuditResultList.totalRecords,
      defaultPageSize: this.props.LoanAuditResultList.pageSize ?
        this.props.LoanAuditResultList.pageSize : 10,
      onChange: (pageNo, pageSize) => this.getPaginationData(pageNo, pageSize),
    };
    const { configList } = this.props;
    const loanInfoData = {
      aid: configList.aid,
      code: configList.code,
      configCode: configList.configCode,
      configProductCode: configList.configProductCode,
      cusName: configList.cusName,
      detailType: 'AUDITFOLLOWUP',
      isNewLoanType: 'NO',
      isReadonly: true,
      loanAppStatusCode: configList.loanAppStatusCode,
      loanId: configList.loanId,
      loanStatus: configList.loanStatus,
      loanType: configList.loanType,
      ossDownloadMethod: configList.ossDownloadMethod,
      routingSystem: configList.routingSystem,
      taskStatus: configList.taskStatus,
      userPhone: configList.userPhone,
      isPreAuthorize: false,
      newProductCode: configList.newProductCode,
    };
    return (
      <div>
        <div className="audit-border" >
          <div className="inner-box" >
            <div className="inner-box-title" >
            <h5>贷款信息</h5>
            </div>
            <div className="inner-box-content" >
              <div className="info-readonly">
              <Row gutter={16} className="margin-bottom-top-5">
              <Col span={3}>
                <p><label>贷款申请状态</label></p>
                <span>{baseInfo.appStatus}</span>
              </Col>
              <Col span={3}>
                <p><label>审批进度</label></p>
                <span>{baseInfo.processStatus}</span>
              </Col>
              <Col span={3}>
                <p><label>贷款申请ID</label></p>
                <span>{baseInfo.loanAppId}</span>
              </Col>
              <Col span={3}>
                <p><label>贷款类型</label></p>
                <span>{baseInfo.productCode}</span>
              </Col>
              <Col span={3}>
                <p><label>贷款创建时间</label></p>
                <span>{baseInfo.appDate && moment(Number(baseInfo.appDate)).format('YYYY-MM-DD HH:mm:ss')}</span>
              </Col>
              <Col span={3}>
                <p><label>贷款ID</label></p>
                <span>{baseInfo.clientSource}</span>
              </Col>
              <Col span={3}>
                <p><label>复议申请人组别</label></p>
                <span>{details.applyEmployeeGroup}</span>
              </Col>
              <Col span={3}>
                <p><label>复议申请人</label></p>
                <span>{details.applyEmployee}</span>
              </Col>
            </Row>
            <Row className="margin-bottom-top-5">
              <Col span={3}>
                <p><label>贷款所属销售</label></p>
                <span>{baseInfo.loanEmployee}</span>
              </Col>
              <Col span={3}>
                <p><label>用户所属销售</label></p>
                <span>{baseInfo.actorEmployee}</span>
              </Col>
            </Row>
            </div>
          </div>
        </div>
        <div className="inner-box" >
            <div className="inner-box-title" >
            <h5>风控审核结果</h5>
            </div>
            <div className="inner-box-content" >
              <div className="info">
                <Table
                  size="small"
                  columns={columns}
                  loading={this.props.loading}
                  dataSource={LoanAuditResultList}
                  pagination={pagination}
                />
              </div>
            </div>
        </div>
        <div className="inner-box" >
            <div className="inner-box-title" >
            <h5>审核处理</h5>
            </div>
            <div className="inner-box-content" >
              <div className="info">
              <div className="h4-container"><p className="h4">复议申请原因:</p>{details.applyComment}</div>
                {
                  details && details.reviewResultCode === 0 ?
                    <Form onSubmit={this.handleSubmit}>
                      <FormItem label="审核结果" required>
                        {getFieldDecorator('reviewResult', {
                          onChange: value => this.radioChange(value.target.value),
                          rules: [{
                            required: true, message: '请选择审核结果后再提交!',
                          }],
                       })(
                          <RadioGroup
                            size="small"
                          >
                            <RadioButton value="1">审核通过</RadioButton>
                            <RadioButton value="2">审核拒绝</RadioButton>
                          </RadioGroup>,
                        )}
                      </FormItem>
                      {
                        this.state.isReviewPass === '2' ?
                          <FormItem>
                            {getFieldDecorator('comment', {
                              rules: [{
                                required: true, message: '审核拒绝需填写具体原因!',
                              }],
                            })(
                              <TextArea className="reason-textarea" placeholder="拒绝原因" />,
                            )}
                          </FormItem> : null
                      }
                      <Button type="primary" htmlType="submit">保存</Button>
                    </Form>
                    :
                    <div>
                      <div className="h4-container"><p className="h4">审核结果: </p>{details.reviewResultCode === 1 ? '审核通过' : details.reviewResultCode === 2 ? '审核拒绝' : ''}</div>
                    </div>
                }
              </div>
          </div>
        </div>
        </div>

        <div className="audit-border">
          {
            this.props.configList.aid ?
              <LoanInfo loanInfoData={loanInfoData} />
              : <p>加载中,请稍后...</p>
          }
        </div>
        <div className="audit-border">
        <div className="inner-box">
          <div className="inner-box-title" >
            <h5>客户信息</h5>
          </div>
          <div className="inner-box-content" >
            <div className="info-readonly">
            <Row gutter={16} className="margin-bottom-top-5">
            <Col span={3}>
              <p><label>借款人ID</label></p>
              <span>{actorBaseInfo.actorId}</span>
            </Col>
            <Col span={3}>
              <p><label>客户姓名</label></p>
              <span>{actorBaseInfo.customerName}</span>
            </Col>
            <Col span={3}>
              <p><label>用户姓名</label></p>
              <span>{actorBaseInfo.userName}</span>
            </Col>
            <Col span={3}>
              <p><label>手机号</label></p>
              <span>{showOriginPhone ? originPhoneNo : actorBaseInfo.cellPhone}</span>
              {
                actorBaseInfo.cellPhone &&
                <a>
                  <span
                    className={showOriginPhone ? 'icon-showpsw' : 'icon-closepsw'}
                    onClick={this.showPhoneNo}
                    style={{ marginLeft: '5px' }}
                  />
                </a>
              }
            </Col>
            <Col span={3}>
              <p><label>手机所属城市</label></p>
              <span>{actorBaseInfo.phoneCity}</span>
            </Col>
            <Col span={3}>
              <p><label>城市</label></p>
              <span>{actorBaseInfo.appCity}</span>
            </Col>
            <Col span={3}>
              <p><label>客户来源</label></p>
              <span>{actorBaseInfo.customerOrigin}</span>
            </Col>
            <Col span={3}>
              <p><label>渠道</label></p>
              <span>{actorBaseInfo.marketChannel}</span>
            </Col>
          </Row>
          <Row gutter={16} className="margin-bottom-top-5">
            <Col span={3}>
              <p><label>注册时间</label></p>
              <span>{actorBaseInfo.registDate ? moment(Number(actorBaseInfo.registDate)).format('YYYY-MM-DD') : ''}</span>
            </Col>
            <Col span={3}>
              <p><label>负责人组别</label></p>
              <span>{actorBaseInfo.ownerEmployeeGroup}</span>
            </Col>
            <Col span={3}>
              <p><label>负责人</label></p>
              <span>{actorBaseInfo.ownerEmployee}</span>
            </Col>
            <Col span={3}>
              <p><label>最后分配时间</label></p>
              <span>{actorBaseInfo.allocateDate ? moment(Number(actorBaseInfo.allocateDate)).format('YYYY-MM-DD') : ''}</span>
            </Col>
            <Col span={3}>
              <p><label>用户所属销售</label></p>
              <span>{actorBaseInfo.actorEmployee}</span>
            </Col>
            <Col span={3}>
              <p><label>意向用户来源</label></p>
              <span>{actorBaseInfo.intentionSourceType}</span>
            </Col>
            <Col span={3}>
              <p><label>首次推荐贷款产品</label></p>
              <span>{actorBaseInfo.firstRecommendProduct}</span>
            </Col>
            <Col span={3}>
              <p><label>线下信息渠道</label></p>
              <span>{actorBaseInfo.channelOfflineMessage}</span>
            </Col>
          </Row>
          <Row gutter={16} className="margin-bottom-top-5">
            <Col span={3}>
              <p><label>借款所属销售</label></p>
              <span>{actorBaseInfo.loanEmployee}</span>
            </Col>
            <Col span={3}>
              <p><label>借款所属销售组别</label></p>
              <span>{actorBaseInfo.loanEmployeeGroup}</span>
            </Col>
          </Row>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  }
}

AuditDetails.propTypes = {
};

export default connect(
  state => ({
    auditDetailsList: state.reAudit.auditDetailsList,
    actorBaseInfo: state.reAudit.actorBaseInfo || {},
    configList: state.reAudit.configList || {},
    baseInfoList: state.reAudit.baseInfoList,
    LoanAuditResultList: state.reAudit.LoanAuditResultList,
    routingQuery: state.routing.locationBeforeTransitions.query,
    loading: state.loading.models.reAudit,
    originPhoneNo: state.reAudit.originPhoneNo,
  }),
  dispatch => ({
    auditResult: (formData, parameter, configList) => {
      const resultData = formData;
      resultData.loanAppId = parameter.loanAppId;
      resultData.reviewVersion = parameter.reviewId;
      resultData.aid = configList.aid;
      resultData.loanId = configList.loanId;
      resultData.routingSystem = configList.routingSystem;
      resultData.taskStatus = configList.taskStatus;
      dispatch({ type: 'reAudit/auditResult', payload: resultData });
    },
    getLoanAuditResult: (formData, parameter) => {
      const resultData = formData;
      resultData.pageNo = parameter.pageNo;
      resultData.pageSize = parameter.pageSize;
      dispatch({ type: 'reAudit/getLoanAuditResult', payload: resultData });
    },
    getOriginPhone: params => dispatch({ type: 'reAudit/getOriginPhone', payload: params }),
  }),
)(Form.create()(AuditDetails));
