import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Radio, Input, Checkbox, Button, DatePicker, Form, Spin } from 'antd';
import moment from 'moment';
import MakeCall from './makeCall';
import './call.less';

const RadioGroup = Radio.Group;
const { TextArea } = Input;
const FormItem = Form.Item;

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
  marginBottom: '10px',
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

class CallOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFeedBack: false,
      showOriginPhone: false,
    };
  }
  
  componentDidMount() {
    const match = location.href.match(/taskId=(\d+)&phoneId=(\d+)/);
    if (match && match.length > 1) {
      this.props.getTaskDetail({ taskId: match[1], id: match[2] });
      this.props.setDialTime(moment().format('YYYY-MM-DD HH:mm:ss'));
    }
  }

  getTimeStr = (counter) => {
    const h = Math.floor(counter / 3600);
    const m = Math.floor(counter / 60) % 60;
    const s = counter % 60;
    const array = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
    const timeStr = `${array[h] || h}:${array[m] || m}:${array[s] || s}`;
    return timeStr;
  }

  showPhoneNo = () => {
    const { originPhoneNo } = this.props;
    const match = location.href.match(/phoneId=(\d+)/);
    if (match && match.length > 1 && !originPhoneNo) {
      this.props.getOriginPhoneNo(match[1]);
    }
    this.setState(prevState => ({
      showOriginPhone: !prevState.showOriginPhone,
    }));
  }

  showFeedBack = (e) => {
    this.setState({ showFeedBack: e.target.checked });
  }

  handleRadioChange = (e) => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const reson = e.target.value;
    const remark = getFieldValue('remark') && getFieldValue('remark').trim();
    const result = remark ? (remark.match(/^拒接|关机|停机|无人接听/) ? remark.replace(/^拒接|关机|停机|无人接听/, reson) : `${reson}${remark}`) : reson;
    setFieldsValue({ remark: result });
  }

  handleSubmit = (e) => {
    const {
      call: {
        callTime,
        counter,
        endTime,
        dialTime,
        sessionid,
        taskDetail: {
          taskId,
          status,
          customerInfor: {
            customerId,
          },
        },
        callInfo: {
          callResponse: {
            employeeId,
            phoneNo,
            employeeName,
            employeeGroupId,
            employeeGroupName,
          },
        },
      },
      callVendor: {
        vendorType,
      },
    } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          vendorType,
          callTimeLength: this.getTimeStr(counter),
          dialTime,
          callTime,
          endTime,
          sessionid,
          taskId,
          taskStatus: status,
          customerId,
          phoneNo,
          employeeId,
          employeeName,
          employeeGroupId,
          employeeGroupName,
          ...values,
          feedBackTime: values.feedBackTime && moment(values.feedBackTime).format('YYYY-MM-DD HH:mm:ss'),
          feedBack: [values.feedBack ? 'Y' : 'N'],
        };
        this.props.saveInfo(params);
      }
    });
  }

  hangupCall = () => {
    const { callVendor: { vendorType } } = this.props;
    window.hangup(
      vendorType || 'COCC',
      {
        uuid: window.genUuid,
        cb: ()=>{
          // 挂断成功后回调
        }
      }
    );
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    // const match = location.href.match(/phoneNo=(\d+)/);
    // const phoneNo = (match && match.length > 1) ? match[1] : null;
    const {
      taskDetail: {
        customerInfor: {
          customerId,
          actorName,
        },
        employeeName,
      },
      call: {
        callInfo: {
          callResponse: {
            phoneNo,
          },
        },
      },
      loading,
      counter,
      dialTime,
      endFlag,
      initSuccess,
      originPhoneNo,
    } = this.props;
    const { showFeedBack, showOriginPhone } = this.state;
    const timeStr = this.getTimeStr(counter);
    return (
      <Spin spinning={loading}>
        <div className="call">
          {
            phoneNo && <MakeCall />
          }
          <h3 className="dr-section-font">外呼界面</h3>
          <div className="crm-section" >
            <Form onSubmit={this.handleSubmit} className="call-form">
              <Row>
                <Col span={8}>
                  <p>客户ID</p>
                  <span>{customerId}</span>
                </Col>
                <Col span={8}>
                  <p>客户姓名</p>
                  <span>{actorName}</span>
                </Col>
                <Col span={8}>
                  <p>拨出号码</p>
                  <span>{ showOriginPhone ? originPhoneNo : (phoneNo && phoneNo.replace(/([0-9]){4}(?=[0-9]{4}$)/, '****')) } </span>
                  {
                    phoneNo &&
                    <a>
                      <span
                        className={showOriginPhone ? 'icon-showpsw' : 'icon-closepsw'}
                        onClick={this.showPhoneNo}
                        style={{ marginLeft: '5px' }}
                      />
                    </a>
                  }
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <p>拨出时间</p>
                  <span>{dialTime && dialTime.split(' ')[1]}</span>
                </Col>
                <Col span={8}>
                  <p>通话时长</p>
                  <span>{timeStr}</span>
                </Col>
                <Col span={8}>
                  <p>所属销售</p>
                  <span>{employeeName}</span>
                </Col>
              </Row>
              <Row className="call-row">
                <Col span={7} className="call-span">
                  <p>通话记录常用模板</p>
                </Col>
                <Col span={17} className="call-span">
                  <p>通话备注</p>
                </Col>
              </Row>
              <Row className="call-row">
                <Col span={6} offset={1} className="call-span" style={{ textAlign: 'left' }} >
                  <FormItem>
                    {getFieldDecorator('type')(
                      <RadioGroup onChange={this.handleRadioChange}>
                        <Radio style={radioStyle} value="拒接">拒接</Radio>
                        <Radio style={radioStyle} value="关机">关机</Radio>
                        <Radio style={radioStyle} value="停机">停机</Radio>
                        <Radio style={radioStyle} value="无人接听">无人接听</Radio>
                      </RadioGroup>,
                    )}
                  </FormItem>
                </Col>
                <Col span={16} offset={1} className="call-span">
                  <FormItem style={{ marginTop: '10px' }}>
                    {getFieldDecorator('remark', {
                      initialValue: '',
                    })(
                      <TextArea placeholder="" autosize={{ minRows: 4, maxRows: 6 }} />,
                    )}
                  </FormItem>
                  <Row>
                    <Col span={6}>
                      <FormItem>
                        {getFieldDecorator('feedBack')(
                          <Checkbox onChange={this.showFeedBack}>预约回访</Checkbox>,
                        )}
                      </FormItem>
                    </Col>
                    {
                      showFeedBack &&
                        <Col span={18}>
                          <FormItem
                            label="预约回访时间"
                            {...formItemLayout}
                          >
                            {getFieldDecorator('feedBackTime', {
                              rules: [{
                                required: true, message: '不能为空',
                              }],
                            })(
                              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
                            )}
                          </FormItem>
                        </Col>
                    }
                  </Row>
                </Col>
              </Row>
              <Row className="call-row btn-group">
                <Button onClick={this.hangupCall} disabled={endFlag}>挂断</Button>
                <Button type="primary" htmlType="submit" disabled={!endFlag || !initSuccess}>保存退出</Button>
              </Row>
            </Form>
          </div>
        </div>
      </Spin>
    );
  }
}

export default connect(
  state => ({
    taskDetail: state.call.taskDetail,
    counter: state.call.counter,
    loading: state.call.loading,
    dialTime: state.call.dialTime,
    endFlag: state.call.endFlag,
    initSuccess: state.call.initSuccess,
    call: state.call,
    callVendor: state.user.callVendor || {},
    originPhoneNo: state.call.originPhoneNo,
  }),
  dispatch => ({
    getTaskDetail: params => dispatch({ type: 'call/getTaskDetail', payload: params }),
    setDialTime: params => dispatch({ type: 'call/setDialTime', payload: params }),
    saveInfo: params => dispatch({ type: 'call/saveInfo', payload: params }),
    getOriginPhoneNo: params => dispatch({ type: 'call/getOriginPhoneNo', payload: params }),
  }),
)(Form.create()(CallOut));
