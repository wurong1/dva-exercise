import React, { Component } from 'react';
import { Tabs, Button, Modal, message, Input } from 'antd';
import moment from 'moment';
import DynamicForm from './dynamic_form/dynamic-form';
import SupplymentDisplayBox from './supplyment_display_box/supplyment-display-box';
import SignDisplayBox from './sign_display_box/sign-display-box';
import PreAuthorizeTab from './pre_authorize_tab/pre-authorize-tab';
import RepayInfoTab from './repay_info_tab/repay-info-tab';
import IssueCard from './issue_card/issue_card';
import DeductCard from './deduct_card/deduct_card';
import { remote } from '../../utils/fetch';
import './borrow.less';

const { TextArea } = Input;

export default class LoanInfo extends Component {

  constructor() {
    super();
    this.state = {
      forms: [],
      formValue: {},
      supplyList: [],
      signInfo: {},
      fileInfo: {},
      activeKey: '0',
      fileGroup: '',
      supplymentComment: '',
      signComment: '',
      conditionValues: {},
      cascadeConfig: [],
      visible: false,
      reloanInfo: {},
      showIssueCard: false,
      type: null,
      originFormValue: {},
      desenseFormValue: {},
      desenseFlag: false,
      currentName: null,
      loadingTab: false,
    };
  }

  getChildContext() {
    const self = this;
    return {
      conditionValues: this.state.conditionValues,
      cascadeConfig: this.state.cascadeConfig,
      reloanInfo: this.state.reloanInfo,
      product: this.state.product,
      loanInfoData: this.props.loanInfoData,
      originalLoanAppId: this.state.originalLoanAppId,
      loadingTab: this.state.loadingTab,
      setConditionValues: (name, val) => {
        const formValues = self.state.conditionValues;
        formValues[name] = val;
        self.setState({ conditionValues: formValues });
      },
      setSignVideoValue: (val) => {
        self.setState({ signVideo: val });
      },
      getOriginFormValue: (applyName) => {
        remote({
          method: 'GET',
          url: `/borrower/load_form?aid=${self.props.loanInfoData.aid}&appId=${self.props.loanInfoData.loanId}&configCode=${self.props.loanInfoData.code}`,
        }).then((res) => {
          self.setState(() => ({
            originFormValue: (res && res.data) || {},
            currentName: applyName, // 当前脱敏字段
          }));
        }).catch(() => {

        });
      },
      setOriginFormValue: (val) => {
        self.setState({ originFormValue: val });
      },
      getDesenseFormValue: (applyName) => {
        remote({
          method: 'GET',
          url: `/borrower/loadFormInfo?aid=${self.props.loanInfoData.aid}&appId=${self.props.loanInfoData.loanId}&configCode=${self.props.loanInfoData.code}`,
        }).then((res) => {
          self.setState(() => ({
            desenseFormValue: (res && res.data) || {},
            currentName: applyName, // 当前脱敏字段
          }));
        }).catch(() => {

        });
      },
      getFileList() {
        remote({
          method: 'GET',
          url: `/borrower/loadProfileList?loanAppId=${self.props.loanInfoData.loanId}&aid=${self.props.loanInfoData.aid}`,
        }).then((data) => {
          if (data.code === 20000) {
            self.setState({ fileInfo: data });
          } else {
            message.error(data.message);
          }
          self.setState({ loadingTab: false });
        }).catch(() => {
          self.setState({ loadingTab: false });
        });
      },
      loadingFileList(flag) {
        self.setState({ loadingTab: flag });
      },
    };
  }

  componentWillMount() {
    //  1.获取配置信息
    const isPreAuthorize = this.props.loanInfoData.isPreAuthorize === true;
    const patt = /RELOAN/;
    const isReloan = patt.test(this.props.loanInfoData.loanType);
    if (isPreAuthorize) {
      remote({
        method: 'GET',
        url: `/borrower/findReloanCredit?aid=${this.props.loanInfoData.aid}`,
        // url: '/findReloanCredit?aid=11660266'
      }).then((data) => {
        this.setState({
          reloanInfo: data,
          product: data.product,
          originalLoanAppId: data.originalLoanAppId,
        });
        this.getConfigInfo(data.product);
      }).catch(() => {

      });
    } else {
      if (isReloan) {
        remote({
          method: 'GET',
          url: `/borrower/findReloanCredit?aid=${this.props.loanInfoData.aid}`,
        }).then((data) => {
          this.setState({ reloanInfo: data });
        }).catch(() => {

        });
      }
      this.getConfigInfo();
    }

    //  2.获取表单数据
    const editFlag = this.props.loanInfoData.detailType === 'AUDITFOLLOWUP' && this.props.loanInfoData.routingSystem === 'ICRC' && this.props.loanInfoData.loanStatus === 'HOLD' && !this.props.loanInfoData.isReadonly;
    const formInfoUrl = (this.props.loanInfoData.detailType === 'LOANAPPGUIDED' && !this.props.loanInfoData.isReadonly) || editFlag ?
      '/borrower/load_form' : '/borrower/loadFormInfo';
    if (!isPreAuthorize) {
      remote({
        method: 'GET',
        url: `${formInfoUrl}?aid=${this.props.loanInfoData.aid}&appId=${this.props.loanInfoData.loanId}&configCode=${this.props.loanInfoData.code}`,
      }).then((ret) => {
        const conditionValues = {};
        if (ret.code === 20000) {
          const values = ret.data;
          Object.keys(values).forEach((key) => {
            // 多表单数据不保存
            if (!Array.isArray(values[key])) {
              Object.keys(values[key]).forEach((fieldName) => {
                // 如果subform为多表单数据不保存
                if (!Array.isArray(values[key][fieldName])) {
                  if (values[key][fieldName] !== null
                    && typeof (values[key][fieldName]) === 'object'
                    && !(values[key][fieldName].hasOwnProperty('province'))) {
                    const singleSubFormValue = values[key][fieldName];
                    Object.keys(singleSubFormValue).forEach((p) => {
                      conditionValues[p] = singleSubFormValue[p];
                    });
                  } else {
                    conditionValues[fieldName] = values[key][fieldName];
                  }
                }
              });
            }
          });
          this.setState({ formValue: ret.data, conditionValues });
        } else {
          message.error(ret.message);
        }
      }).catch(() => {

      });

      // 获取未脱敏表单数据
      remote({
        method: 'GET',
        url: `/borrower/load_form?aid=${this.props.loanInfoData.aid}&appId=${this.props.loanInfoData.loanId}&configCode=${this.props.loanInfoData.code}`,
      }).then((res) => {
        this.setState(() => ({
          originFormValue: (res && res.data) || {},
        }));
      }).catch(() => {

      });
    }

    // 3.获取补件信息数据
    if (this.props.loanInfoData.detailType !== 'LOANAPPGUIDED') {
      remote({
        method: 'GET',
        url: `/borrower/getloanholdinfo?aId=${this.props.loanInfoData.aid}&loanId=${this.props.loanInfoData.loanId}&taskStatus=hold&routingSystem=${this.props.loanInfoData.routingSystem}`,
      }).then((data) => {
        this.setState({ supplyList: data.allList || [] });
      }).catch(() => {

      });
    }

    //  4.获取签约信息数据
    if (this.props.loanInfoData.detailType === 'SIGN' && this.props.loanInfoData.loanType !== 'SPEED_LOAN') {
      remote({
        method: 'GET',
        url: `/borrower/loansigninfo?aid=${this.props.loanInfoData.aid}&loanAppId=${this.props.loanInfoData.loanId}&count=1&taskStatus=${this.props.loanInfoData.taskStatus}&routingSystem=${this.props.loanInfoData.routingSystem}`,
      }).then((data) => {
        this.setState({ signInfo: data || {} });
      }).catch(() => {

      });
    }

    //  5.获取文件信息数据
    if (!isPreAuthorize) {
      remote({
        method: 'GET',
        url: `/borrower/loadProfileList?loanAppId=${this.props.loanInfoData.loanId}&aid=${this.props.loanInfoData.aid}`,
      }).then((data) => {
        if (data.code === 20000) {
          this.setState({ fileInfo: data });
        } else {
          message.error(data.message);
        }
      }).catch(() => {

      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setActiveKey(nextProps);
  }

  setActiveKey(nextProps) {
    const { fileGroup } = nextProps;
    const isPreAuthorize = this.props.loanInfoData.isPreAuthorize === true;
    const patt = /RELOAN/;
    const isReloan = patt.test(this.props.loanInfoData.loanType);
    let activeKey;
    if (fileGroup === 'FILL_SUBMIT') {
      activeKey = (isReloan || isPreAuthorize) ? '1' : '0';
    } else if (fileGroup === 'CUSTOMER_APPROVAL') {
      activeKey = `${((isReloan || isPreAuthorize) ? this.state.forms.length + 2 : this.state.forms.length + 1)}`;
    } else {
      return false;
    }
    this.setState({ activeKey });
  }

  getConfigInfo(productCode) {
    const isPreAuthorize = this.props.loanInfoData.isPreAuthorize === true;
    const url = isPreAuthorize ? `/borrower/loadpreauthorizeloanform?productCode=${productCode}` : `/borrower/loadProductConfig?productCode=${this.props.loanInfoData.newProductCode}&appId=${this.props.loanInfoData.loanId}&configCode=${this.props.loanInfoData.code}`;
    remote({
      method: 'GET',
      url,
    }).then((ret) => {
      if (ret.code === 20000) {
        const cascadeConfig = [];
        ret.data.forms.forEach((form) => {
          const fields = form.fields || [];
          const configObj = {};
          fields.forEach((field) => {
            if (field.constraintRule) {
              configObj.constraintName = field.name;
              configObj.dependentFields = field.constraintRule.dependentFields;
              cascadeConfig.push(configObj);
            }
          });
        });
        this.setState({ forms: ret.data.forms, cascadeConfig }, () => {
          this.setActiveKey(this.props);
        });
      } else {
        message.error(ret.message);
      }
    }).catch(() => {

    });
  }

  callback(activeKey) {
    this.setState({ activeKey });
  }

  editFileSubmit() {
    const comment = this.state.supplymentComment;
    const { taskDetail = {} } = this.props;
    const {
      customerInfor: {
        customerId,
        actorId,
      } = {},
      loanBaseInfor: {
        loanAppId,
        routingSystem,
      } = {},
      taskId,
      status,
    } = taskDetail;
    const params = {
      customerId,
      actorId,
      taskId,
      taskStatus: status,
      loanId: loanAppId,
      routingSystem,
      comment,
    };
    const formData = this.props.getFormvalue();
    delete formData.employee;
    delete formData.employeeGroup;
    this.handleSubmit({ ...params, ...formData });
  }

  signFileSubmit() {
    const {
      taskDetail: {
        taskId,
        status,
        createdDate,
        customerInfor: {
          customerId,
          actorId,
          offemployeeId,
          offemployeeName,
          offemployeeGroupId,
          offemployeeGroupName,
          city,
          actorName,
        },
        loanBaseInfor: {
          loanAppId,
          loanId,
          routingSystem,
          tenant,
        },
      },
    } = this.props;
    const { signVideo, signInfo: { allList = [] }, signComment } = this.state;
    const showVideo = routingSystem === 'ICRC' ? false : allList.some(item => item.type === 'SIGN_VIDEO');
    const videoParameters = showVideo ? `${this.props.loanInfoData.parameter};/${signVideo}` : '';
    const formData = this.props.getFormvalue();
    const param = {
      videoDocId: this.props.loanInfoData.videoDocId,
      hasSignVideo: this.props.loanInfoData.hasSignVideo,
      videoParameters,
      comment: signComment,
      customerId,
      taskId,
      actorId,
      taskStatus: status,
      loanId: loanAppId,
      realLoanId: loanId,
      workflowTaskId: this.props.loanInfoData.workflowTaskId,
      routingSystem,
      offemployeeId,
      offemployeeName,
      offemployeeGroupId,
      offemployeeGroupName,
      appDate: createdDate && moment(createdDate).format('YYYY-MM-DD HH:mm:ss'),
      city,
      customerName: actorName,
      tenant,
      ...formData,
    };
    delete param.employee;
    delete param.employeeGroup;
    const productCode = this.props.loanInfoData.configProductCode;
    const validate = ['MCA', 'MCA_SIMPLIFIED', 'ENTERPRISE_MORTGAGE'].includes(productCode);
    if (tenant === 'DLXD' || validate) {
      this.handleSubmit(param);
    } else {
      remote({
        method: 'get',
        url: `/borrower/validateBankCardBinding?aid=${actorId}`,
      }).then((data) => {
        if (data && !data.status) {
          message.error(data.message);
          return false;
        } else {
          this.handleSubmit(param);
        }
      }).catch(() => {
      });
    }
  }

  handleSubmit = (param) => {
    remote({
      method: 'POST',
      url: '/borrower/v1/task/intention',
      data: param,
    }).then((data) => {
      if (data && data.code !== 0) {
        message.error(data.message);
        return false;
      } else {
        message.success('保存成功！');
        location.reload();
      }
    }).catch(() => {
    });
  }

  popSupplyForm() {
    this.showModal();
  }

  bindIssueCard() {
    const productCode = this.props.loanInfoData.configProductCode;
    const showIssueCard = ['DOUBLE_FUND', 'PROPERTY_OWNER', 'LIFE_INSURANCE', 'OUTSTANDING', 'HIGH_SALARY', 'CAR_OWNER', 'MCA_GREENLANE_OFFLINE'].includes(productCode);
    const showOtherIssueCard = ['MCA', 'MCA_SIMPLIFIED'].includes(productCode);
    this.setState({ showIssueCard: showIssueCard || showOtherIssueCard, type: showOtherIssueCard ? 'other' : null });
  }

  coloseIssueModal() {
    this.setState({ showIssueCard: false });
  }

  showModal() {
    this.setState({
      visible: true,
    });
  }

  handleOk() {
    this.setState({
      visible: false,
    });
  }

  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { children } = this.props;
    const TabPane = Tabs.TabPane;
    const detailType = this.props.loanInfoData.detailType;
    const supplymentList = this.state.supplyList;
    const signInfo = this.state.signInfo || {};
    const signAllList = signInfo.allList || [];
    const patt = /RELOAN/;
    const isReloan = patt.test(this.props.loanInfoData.loanType);
    const isPreAuthorize = this.props.loanInfoData.isPreAuthorize === true;
    const isIcrcControl = this.props.loanInfoData.routingSystem === 'ICRC';
    return (
      <div className="borrow">
        {children}
        <Tabs defaultActiveKey="0" activeKey={this.state.activeKey} onChange={this.callback.bind(this)}>
          {(isReloan || isPreAuthorize) && <TabPane tab="预授信信息" key="0"><PreAuthorizeTab /></TabPane>}
          {(detailType === 'AUDITFOLLOWUP' || detailType === 'SIGN') &&
            <TabPane
              tab={
                <div>
                   补件信息
                </div>
              }
              key={(isReloan || isPreAuthorize) ? 1 : 0}
            >
              {supplymentList && supplymentList.length > 0 ?
                supplymentList.filter(item => !(this.props.loanInfoData.routingSystem === 'ICRC' && item.type === 'FIELD')).map((val, idx) => {
                  return (
                    <SupplymentDisplayBox
                      boxInfo={val}
                      key={idx}
                      fileGroup={this.props.fileGroup}
                      supplyList={this.state.supplyList}
                    />
                  );
                })
                :
                <div className="col-cell col-xs-6">
                  <div className="papers-box">
                    <i className="icon-borrow icon-borrow-error">{null}</i>
                    <div className="alert">无需补件</div>
                  </div>
                </div>
              }
              <div
                style={{ display: (this.props.fileGroup !== 'FILL_SUBMIT' || this.props.loanInfoData.loanStatus !== 'HOLD') ? 'none' : 'block' }}
              >
                <div>
                  <p className="cell-label">备注</p>
                  <TextArea
                    rows={4}
                    onChange={(e) => { this.setState({ supplymentComment: e.target.value }); }}
                    style={{ height: 'auto' }}
                  />
                </div>
                <Button
                  type="primary"
                  onClick={this.editFileSubmit.bind(this)}
                  style={{ marginLeft: '0px' }}
                >
                  补件上传
                </Button>
              </div>
            </TabPane>}
          {this.state.forms.map((val, idx) => {
            return (
              <TabPane
                tab={val.label}
                key={detailType === 'AUDITFOLLOWUP' || detailType === 'SIGN' ? ((isReloan || isPreAuthorize) ? idx + 2 : idx + 1) : ((isReloan || isPreAuthorize) ? idx + 1 : idx)}
              >
                <DynamicForm
                  key={idx}
                  formInfo={val}
                  detailType={detailType}
                  fileInfo={this.state.fileInfo}
                  formValue={this.state.formValue && this.state.formValue[val.name]}
                  originFormValue={this.state.originFormValue && this.state.originFormValue[val.name]}
                  desenseFormValue={this.state.desenseFormValue && this.state.desenseFormValue[val.name]}
                  currentName={this.state.currentName}
                  distUrl={`/borrower/createpreauthorizeloan?actorId=${this.props.loanInfoData.aid}&loanType=${this.state.product}&originalLoanAppId=${this.state.originalLoanAppId}`}
                />
              </TabPane>
            );
          })}
          {detailType === 'SIGN' && this.props.loanInfoData.loanType !== 'SPEED_LOAN' &&
            <TabPane
              tab="签约资料"
              key={
                (isReloan || isPreAuthorize) ?
                  this.state.forms.length + 2
                :
                  this.state.forms.length + 1
              }
            >
              {
                isIcrcControl &&
                  <Tabs className="sign-tab">
                    <TabPane tab="后台签约资料" key="1">
                      <div className="guarant-group">
                        {signInfo && signInfo.guarantorInfo && signInfo.guarantorInfo.length > 0 &&
                          signInfo.guarantorInfo.map((guarantor, idx) =>
                            <div key={idx}>
                              <span className="sign-label">{guarantor.name}</span>
                              <a
                                className="btn btn-normal-b active"
                                href={`/borrower/signPdfFile?type=${guarantor.type}&id=${guarantor.id}&routingSystem=${this.props.loanInfoData.routingSystem}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={`${guarantor.id}_${idx}`}
                              >
                                查看
                              </a>
                            </div>,
                          )
                        }
                      </div>
                      {
                        signAllList.length > 0 ?
                          signAllList.map((val, idx) => {
                            if (val.type === 'DEDUCT_CARD') { // 绑定代扣卡
                              return (
                                <div key={idx} style={{ marginBottom: '15px', clear: 'both' }}>
                                  <span className={`${val.required ? 'sign-required' : ''} sign-label`}>{val.name} {`${val.completed ? '(已完成)' : '(未完成)'}`}</span>
                                  {
                                    this.props.fileGroup === 'CUSTOMER_APPROVAL' && this.props.loanInfoData.loanStatus === 'APPROVED' &&
                                      <a onClick={this.popSupplyForm.bind(this)}>去绑定</a>
                                  }
                                  <Modal
                                    title={val.name}
                                    visible={this.state.visible}
                                    onOk={this.handleOk.bind(this)}
                                    onCancel={this.handleCancel.bind(this)}
                                    width={600}
                                    footer={null}
                                  >
                                    <DeductCard cardValue={val.conditionContent || {}} loanId={this.props.loanInfoData.loanId} docId={val.docId} />
                                  </Modal>
                                </div>
                              );
                            }
                            if (val.type === 'ISSUE_CARD') { // 绑定放款卡
                              return (
                                <div key={idx} style={{ marginBottom: '15px', clear: 'both' }}>
                                  <span className={`${val.required ? 'sign-required' : ''} sign-label`}>{val.name} {`${val.completed ? '(已完成)' : '(未完成)'}`}</span>
                                  {
                                    this.props.fileGroup === 'CUSTOMER_APPROVAL' && this.props.loanInfoData.loanStatus === 'APPROVED' &&
                                      <a onClick={this.bindIssueCard.bind(this)}>去绑定</a>
                                  }
                                  <Modal
                                    title={val.name}
                                    visible={this.state.showIssueCard}
                                    onCancel={this.coloseIssueModal.bind(this)}
                                    width={600}
                                    footer={null}
                                  >
                                    <IssueCard cardValue={val.conditionContent || {}} type={this.state.type} loanId={this.props.loanInfoData.loanId} docId={val.docId} />
                                  </Modal>
                                </div>
                              );
                            }
                            if (val.type === 'DOCUMENT') {
                              return (
                                <SignDisplayBox
                                  boxInfo={val}
                                  key={idx}
                                  fileGroup={this.props.fileGroup}
                                  signInfo={this.state.signInfo}
                                />
                              );
                            }
                            return null;
                          })
                        :
                          <div className="col-cell col-xs-6">
                            <div className="papers-box">
                              <i className="icon-borrow icon-borrow-error">{null}</i>
                              <div className="alert">无需补件</div>
                            </div>
                          </div>
                      }
                    </TabPane>
                    <TabPane tab="移动端签约资料" key="2">
                      {signAllList.map((val, idx) => {
                        if (val.type === 'LITE') {
                          return (
                            <SignDisplayBox
                              boxInfo={val}
                              key={idx}
                              fileGroup={this.props.fileGroup}
                              signInfo={this.state.signInfo}
                            />
                          );
                        }
                        if (val.type === 'LITE_SIGN') {
                          return <div key={idx}><span className={`${val.required ? 'sign-required' : ''} sign-label`}>{`${val.name} : ${val.completed ? '已上传' : '未完成'}`}</span></div>;
                        }
                        return null;
                      })}
                    </TabPane>
                  </Tabs>
              }
              {
                !isIcrcControl &&
                  <div className="guarant-group">
                    {signInfo && signInfo.guarantorInfo && signInfo.guarantorInfo.length > 0 &&
                      signInfo.guarantorInfo.map((guarantor, idx) =>
                        <div key={idx} style={{ marginLeft: '18px' }}>
                          {guarantor.name}
                          <a
                            className="btn btn-normal-b active"
                            href={`/borrower/signPdfFile?type=${guarantor.type}&id=${guarantor.id}&routingSystem=${this.props.loanInfoData.routingSystem}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={`${guarantor.id}_${idx}`}
                          >
                            查看
                          </a>
                        </div>,
                      )
                    }
                    {
                      signAllList.length > 0 ?
                        signAllList.map((val, idx) => {
                          return (
                            <SignDisplayBox
                              boxInfo={val}
                              key={idx}
                              fileGroup={this.props.fileGroup}
                              signInfo={this.state.signInfo}
                            />
                          );
                        })
                      :
                        <div className="col-cell col-xs-6" style={{ marginLeft: '18px' }}>
                          <div className="papers-box">
                            <i className="icon-borrow icon-borrow-error">{null}</i>
                            <div className="alert">无需补件</div>
                          </div>
                        </div>
                      }
                  </div>
              }
              <div
                style={{ display: (this.props.fileGroup !== 'CUSTOMER_APPROVAL' || this.props.loanInfoData.loanStatus !== 'APPROVED') ? 'none' : 'block' }}
              >
                <div style={{ marginLeft: '18px' }}>
                  <p className="cell-label">备注</p>
                  <TextArea
                    rows={4}
                    onChange={(e) => { this.setState({ signComment: e.target.value }); }}
                    style={{ height: 'auto' }}
                  />
                </div>
                <Button
                  type="primary"
                  onClick={this.signFileSubmit.bind(this)}
                  style={{ marginLeft: '18px' }}
                >
                  客户确认
                </Button>
              </div>
            </TabPane>
          }
          {detailType === 'SIGN' &&
            <TabPane
              tab="还款信息"
              key={
                (isReloan || isPreAuthorize) ?
                  this.state.forms.length + 3
                :
                  this.state.forms.length + 2
              }
            >
              <RepayInfoTab />
            </TabPane>
          }
        </Tabs>
      </div>
    );
  }
}

LoanInfo.childContextTypes = {
  conditionValues: React.PropTypes.object,
  reloanInfo: React.PropTypes.object,
  product: React.PropTypes.string,
  loadingTab: React.PropTypes.bool,
  originalLoanAppId: React.PropTypes.string,
  cascadeConfig: React.PropTypes.array,
  loanInfoData: React.PropTypes.object,
  setConditionValues: React.PropTypes.func,
  setSignVideoValue: React.PropTypes.func,
  getOriginFormValue: React.PropTypes.func,
  getDesenseFormValue: React.PropTypes.func,
  setOriginFormValue: React.PropTypes.func,
  getFileList: React.PropTypes.func,
  loadingFileList: React.PropTypes.func,
};

