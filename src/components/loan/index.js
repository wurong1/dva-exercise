import React, {Component} from 'react';
import {Tabs, Button, Modal,Input} from 'antd';
import DynamicForm from './dynamic_form/dynamic-form';
import SupplymentDisplayBox from './supplyment_display_box/supplyment-display-box';
import SignDisplayBox from './sign_display_box/sign-display-box';
import PreAuthorizeTab from './pre_authorize_tab/pre-authorize-tab';
import RepayInfoTab from './repay_info_tab/repay-info-tab';
// import loanInfoData from '../../constants/loan-info-data';
import $ from 'jquery';
import { remote } from '../../utils/fetch';
import './loan.less';

export default class LoanInfo extends Component {

  constructor(props) {
    super(props);
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
      reloanInfo: {}
    };
  }

  getChildContext() {
    return {
      conditionValues: this.state.conditionValues,
      cascadeConfig: this.state.cascadeConfig,
      reloanInfo: this.state.reloanInfo,
      product: this.state.product,
      loanInfoData: this.props.loanInfoData,
      originalLoanAppId: this.state.originalLoanAppId,
      setConditionValues: (name, val)=> {
        const formValues = this.state.conditionValues;
        formValues[name] = val;
        this.setState({conditionValues: formValues});
      }
    };
  }

  componentWillMount() {
    console.log(this.props.loanInfoData);
    //  1.获取配置信息
    const isPreAuthorize = this.props.loanInfoData.isPreAuthorize === 'true';
    const patt = /RELOAN/;
    const isReloan = patt.test(this.props.loanInfoData.loanType);
    if(isPreAuthorize) {
      remote({
        method: 'GET',
        url: '/borrower/findReloanCredit?aid=' + this.props.loanInfoData.aid
        // url: '/findReloanCredit?aid=11660266'
      }).then((data) => {
        this.setState({reloanInfo: data, product: data.product, originalLoanAppId: data.originalLoanAppId});
        this.getConfigInfo(data.product);
      }).catch(() => {

      });
    }else {
      if(isReloan) {
        remote({
          method: 'GET',
          url: '/borrower/findReloanCredit?aid=' + this.props.loanInfoData.aid
        }).then((data) => {
          this.setState({reloanInfo: data});
        }).catch(() => {

        });
      }
      this.getConfigInfo();
    }

    //  2.获取表单数据
    if(!isPreAuthorize) {
      remote({
        method: 'GET',
        url: '/borrower/loadFormInfo?aid=' + this.props.loanInfoData.aid + '&appId=' + this.props.loanInfoData.loanId + '&configCode=' + this.props.loanInfoData.code
      }).then((ret) => {
        const conditionValues = {};
        if (ret.code === 20000) {
          const values = ret.data;
          Object.keys(values).forEach(key => {
            // 多表单数据不保存
            if (!Array.isArray(values[key])) {
              Object.keys(values[key]).forEach(fieldName => {
                // 如果subform为多表单数据不保存
                if (!Array.isArray(values[key][fieldName])) {
                  if (values[key][fieldName] !== null
                    && typeof (values[key][fieldName]) === 'object'
                    && !(values[key][fieldName].hasOwnProperty('province'))) {
                    const singleSubFormValue = values[key][fieldName];
                    Object.keys(singleSubFormValue).forEach(p => {
                      conditionValues[p] = singleSubFormValue[p];
                    });
                  } else {
                    conditionValues[fieldName] = values[key][fieldName];
                  }
                }
              });
            }
          });
          this.setState({formValue: ret.data, conditionValues});
        } else {
          msgBoxShow(ret.message, 'faild', null, 3);
        }
      }).catch(() => {

      });
    }

    // 3.获取补件信息数据
    if(this.props.loanInfoData.detailType !== 'LOANAPPGUIDE') {
      remote({
        method: 'GET',
        url: '/borrower/getloanholdinfo?aId=' + this.props.loanInfoData.aid + '&loanId=' + this.props.loanInfoData.loanId + '&taskStatus=hold' + '&routingSystem=' + this.props.loanInfoData.routingSystem
      }).then((data) => {
        this.setState({supplyList: data.allList});
      }).catch(() => {

      });
    }

    //  4.获取签约信息数据
    if(this.props.loanInfoData.detailType === 'SIGN' && this.props.loanInfoData.loanType !== 'SPEED_LOAN') {
      remote({
        method: 'GET',
        url: '/borrower/loansigninfo?aid=' + this.props.loanInfoData.aid + '&loanAppId=' + this.props.loanInfoData.loanId + '&count=1' + '&taskStatus=' + this.props.loanInfoData.taskStatus + '&routingSystem=' + this.props.loanInfoData.routingSystem
      }).then((data) => {
        this.setState({signInfo: data});
      }).catch(() => {

      });
    }

    //  5.获取文件信息数据
    if(!isPreAuthorize) {
      remote({
        method: 'GET',
        url: '/borrower/loadProfileList?loanAppId=' + this.props.loanInfoData.loanId + '&aid=' + this.props.loanInfoData.aid
      }).then((data) => {
        if (data.code === 20000) {
          this.setState({fileInfo: data});
        } else {
          msgBoxShow(data.message, 'faild', null, 3);
        }
      }).catch(() => {

      });
    }
    let self = this;
    const fileGroup = document.getElementById('operationResult') ? document.getElementById('operationResult').value : '';
    self.setState({fileGroup});
    if(document.getElementById('btnsDealReview')) {
      document.getElementById('btnsDealReview').onclick = () => {
        const fileGroup1 = document.getElementById('operationResult') ? document.getElementById('operationResult').value : '';
        self.setState({fileGroup: fileGroup1});
        if(fileGroup1 === 'FILL_SUBMIT') {
          const activeKey = (isReloan || isPreAuthorize) ? '1' : '0';
          self.refs.tooltip.className = 'tooltip fade top in';
          self.setState({activeKey});
          setTimeout(() => {
            self.refs.tooltip.className = 'tooltip fade top';
          }, 3000);
        }else if(fileGroup1 === 'CUSTOMER_APPROVAL') {
          self.refs.signtooltip.className = 'tooltip fade top in';
          const activeKey = ((isReloan || isPreAuthorize) ? self.state.forms.length + 2 : self.state.forms.length + 1) + '';
          self.setState({activeKey});
          setTimeout(() => {
            self.refs.signtooltip.className = 'tooltip fade top';
          }, 3000);
        }
      };
    }
  }

  getConfigInfo(productCode) {
    const isPreAuthorize = this.props.loanInfoData.isPreAuthorize === 'true';
    const url = isPreAuthorize ? '/borrower/loadpreauthorizeloanform?productCode=' + productCode : '/borrower/loadProductConfig?productCode=' + this.props.loanInfoData.newProductCode + '&appId=' + this.props.loanInfoData.loanId + '&configCode=' + this.props.loanInfoData.code;
    // const url = isPreAuthorize ? '/loadpreauthorizeloanform?productCode=PAYROLL_RELOAN' : '/loadProductConfig?productCode=' + this.props.loanInfoData.configProductCode + '&appId=' + this.props.loanInfoData.loanId + '&configCode=' + this.props.loanInfoData.code;
    remote({
      method: 'GET',
      url: url
    }).then((ret) => {
      if(ret.code === 20000) {
        const cascadeConfig = [];
        ret.data.forms.forEach(form => {
          const fields = form.fields || [];
          const configObj = {};
          fields.forEach(field => {
            if(field.constraintRule) {
              configObj.constraintName = field.name;
              configObj.dependentFields = field.constraintRule.dependentFields;
              cascadeConfig.push(configObj);
            }
          });
        });
        this.setState({forms: ret.data.forms, cascadeConfig});
      }else {
        msgBoxShow(ret.message, 'faild', null, 3);
      }
    }).catch(() => {

    });
  }

  callback(activeKey) {
    this.setState({activeKey});
  }

  editFileSubmit() {
    const comment = $('#supplymentComment').val();
    const $dataForm = $('#btnsDealReview').closest('form');
    const dataForm = $dataForm.formParams(false);
    const data = $.extend(dataForm, {comment: comment});
    const $selfForm = $('#supplymentForm');
    $selfForm.ajaxBind({
      data: data,
      type: 'post',
      url: $dataForm.attr('action')
    }, {
      type: 'auto',
      onSuccess: () => {
        window.location.href = refreshUrl();
      }});
  }

  signFileSubmit() {
    if($('#signVideo').length) {
      const valFirst = $('#videoPara').val();
      const valSecond = $('#signVideo').val();
      const varAll = valFirst + ';/' + valSecond;
      $('#videoParameters').val(varAll);
    }
    const dataForm = $('#signForm').formParams(false);
    const comment = $('#signComment').val();
    const otherForm = $('#btnsDealReview').closest('form').formParams(false);
    const dataAll = $.extend(dataForm, otherForm, {comment: comment});
    const otherData = {
      aid: dataAll.actorId
    };
    const $form = $('#signForm');
    $form.ajaxBind({
      type: 'get',
      url: '/borrower/validateBankCardBinding?aid=' + otherData.aid
    }, {
      type: 'auto',
      successMsg: null,
      onSuccess: (data) => {
        if(!data.status) {
          msgBoxShow(data.message, 'faild', null, 3);
        }else {
          $form.ajaxBind({
            data: dataAll,
            type: 'post',
            url: $('#btnsDealReview').closest('form').attr('action')
          }, {
            type: 'auto',
            onSuccess: () => {
              window.location.href = refreshUrl();
            }});
        }
      }
    });
  }

  popSupplyForm() {
    this.showModal();
  }

  showModal() {
    this.setState({
      visible: true
    });
  }

  handleOk() {
    this.setState({
      visible: false
    });
  }

  handleCancel() {
    this.setState({
      visible: false
    });
  }

  render() {
    let {children} = this.props;
    const TabPane = Tabs.TabPane;
    const { TextArea } = Input;
    const detailType = this.props.loanInfoData.detailType;
    const supplymentList = this.state.supplyList;
    const signInfo = this.state.signInfo;
    const patt = /RELOAN/;
    const isReloan = patt.test(this.props.loanInfoData.loanType);
    const isPreAuthorize = this.props.loanInfoData.isPreAuthorize === 'true';
    return (
      <div className="loan">
        {children}
        <Tabs defaultActiveKey="0" activeKey={this.state.activeKey} onChange={this.callback.bind(this)}>
          {(isReloan || isPreAuthorize) && <TabPane tab="预授信信息" key="0"><PreAuthorizeTab/></TabPane>}
          {(detailType === 'AUTOFLLOWUP' || detailType === 'SIGN') &&
            <TabPane
              tab={<div>
                   补件信息
                   {/*<div className="tooltip fade top" ref="tooltip" style={{top: '-2px', left: '10px'}}>
                     <div className="tooltip-arrow" style={{left: '50%'}}>{null}</div>
                     <div className="tooltip-inner">在这里补件</div>
                   </div>*/}
                 </div>
              } key={(isReloan || isPreAuthorize) ? 1 : 0} >
              {supplymentList && supplymentList.length > 0 ?
                supplymentList.map((val, idx)=>{
                  return <SupplymentDisplayBox boxInfo={val} key={idx} fileGroup={this.state.fileGroup} supplyList={this.state.supplyList}/>;
                })
                :
                  <div className="col-cell col-xs-6">
                    <div className="papers-box">
                      <i className="icon-borrow icon-borrow-error">{null}</i>
                      <div className="alert">无需补件</div>
                    </div>
                  </div>
              }
              <div id="editFilesGroup"
                className={(this.state.fileGroup !== 'FILL_SUBMIT' || this.props.loanInfoData.loanStatus !== 'HOLD') && 'hide'}
                style={{clear: 'both'}}>
              </div>
            </TabPane>}
          {this.state.forms.map((val, idx)=>{
            return (
              <TabPane tab={val.label}
                       key={detailType === 'AUTOFLLOWUP' || detailType === 'SIGN' ? ((isReloan || isPreAuthorize) ? idx + 2 : idx + 1) : ((isReloan || isPreAuthorize) ? idx + 1 : idx)}>
                <DynamicForm key={idx} formInfo={val} detailType={detailType} fileInfo={this.state.fileInfo}
                           formValue={this.state.formValue && this.state.formValue[val.name]}
                           distUrl={'/borrower/createpreauthorizeloan?actorId=' + this.props.loanInfoData.aid + '&loanType=' + this.state.product + '&originalLoanAppId=' + this.state.originalLoanAppId }/>
              </TabPane>);
          })}
          {detailType === 'SIGN' && this.props.loanInfoData.loanType !== 'SPEED_LOAN' &&
            <TabPane
              tab={<div>签约资料
                     {/*<div className="tooltip fade top" ref="signtooltip" style={{top: '-2px', left: '10px'}}>
                       <div className="tooltip-arrow" style={{left: '50%'}}>{null}</div>
                       <div className="tooltip-inner">在这里签约</div>
                     </div>*/}
                   </div>}
              key={(isReloan || isPreAuthorize) ? this.state.forms.length + 2 : this.state.forms.length + 1}>
              <div className="guarant-group">
                {signInfo && signInfo.guarantorInfo && signInfo.guarantorInfo.length > 0 &&
                  signInfo.guarantorInfo.map((guarantor, idx) =>
                   <a className="btn btn-normal-b active"
                      href={'/borrower/signPdfFile?type=' + guarantor.type + '&id=' + guarantor.id + '&routingSystem=' + this.props.loanInfoData.routingSystem}
                      target="_blank"
                      key={guarantor.id + '_' + idx}>
                     {guarantor.name}
                   </a>)
                }
              </div>
              {signInfo && signInfo.allList && signInfo.allList.length > 0 ?
                signInfo.allList.map((val, idx)=>{
                  if(val.type === 'DEDUCT_CARD') {
                    const signPopConfig = {
                      readOnly: false,
                      minCount: 0,
                      multiple: false,
                      fields: [{
                        name: 'accountName_sign',
                        inputType: 'TEXT',
                        label: '账户名',
                        inputOption: 'REQUIRED'
                      }, {
                        name: 'accountNum_sign',
                        inputType: 'TEXT',
                        label: '账号',
                        inputOption: 'REQUIRED',
                        validation: {'regex': '^[0-9]\\d{7,29}$'},
                        description: '请输入正确的银行账号'
                      }, {
                        name: 'bank_sign',
                        inputType: 'BANK',
                        label: '开户行',
                        inputOption: 'REQUIRED'
                      }, {
                        name: 'bankBranch_sign',
                        inputType: 'BANK_BRANCH',
                        label: '开户支行',
                        inputOption: 'OPTIONAL'
                      }, {
                        name: 'bankPhone_sign',
                        inputType: 'TEXT',
                        label: '手机号码',
                        inputOption: 'OPTIONAL',
                        validation: {'regex': '^1[34578][0-9]{9}$'},
                        description: '请填写正确的手机号码'
                      }, {
                        name: 'bankProvince_sign',
                        inputType: 'PROVINCE',
                        label: '开户所在省',
                        inputOption: 'REQUIRED'
                      }, {
                        name: 'bankCity_sign',
                        inputType: 'CITY',
                        label: '开户所在市',
                        inputOption: 'REQUIRED'}]};
                    return (
                      <div  key={idx}>
                        <Button onClick = {this.popSupplyForm.bind(this)}>{val.name}</Button>
                        <Modal title={val.name} visible={this.state.visible}
                               onOk={this.handleOk.bind(this)}
                               onCancel={this.handleCancel.bind(this)}
                               width={600} footer={null}>
                          <div>
                            <DynamicForm formInfo={signPopConfig} detailType={detailType} isCommonField distUrl={'/borrower/deductcard/' + this.props.loanInfoData.loanId + '/' + val.docId}/>
                          </div>
                        </Modal>
                      </div>
                    );
                  }
                  return <SignDisplayBox boxInfo={val} key={idx} fileGroup={this.state.fileGroup} signInfo={this.state.signInfo}/>;
                })
                  :
                    <div className="col-cell col-xs-6">
                      <div className="papers-box">
                        <i className="icon-borrow icon-borrow-error">{null}</i>
                        <div className="alert">无需补件</div>
                      </div>
                    </div>
              }
              <div id="contractFilesGroup"
                   className={(this.state.fileGroup !== 'CUSTOMER_APPROVAL' || this.props.loanInfoData.loanStatus !== 'APPROVED') && 'hide'}
                   style={{clear: 'both'}}>
                <form>
                  <div className="col-cell-group col-cell">
                    <p className="cell-label">备注</p>
                    <TextArea name="comment"
                              onChange={e=>this.setState({signComment: e.target.value})}
                              id="signComment"
                              className="la-textarea"
                              row={4} />
                  </div>
                  <div className="task-inner-box-content">
                    <Button type="button"
                            id="contractFileSubmit" className="btn btn-default btn-h-lg"
                            onClick={this.signFileSubmit.bind(this)}>客户确认</Button>
                  </div>
                </form>
              </div>
            </TabPane>
          }
          {detailType === 'SIGN' &&
            <TabPane tab="还款信息" key={(isReloan || isPreAuthorize) ? this.state.forms.length + 3 : this.state.forms.length + 2}>
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
  originalLoanAppId: React.PropTypes.string,
  cascadeConfig: React.PropTypes.array,
  setConditionValues: React.PropTypes.func,
  loanInfoData: React.PropTypes.object
};
