import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Col, Icon, Input } from 'antd';

const FormItem = Form.Item;

let uuid = 0;

class AddInfoModal extends Component {

  remove = (k) => {
    const { addModal: { keys = [] }, setKeys } = this.props;
    const nextKeysry = keys.filter(key => key !== k);
    setKeys(nextKeysry);
  }

  add = () => {
    /* eslint no-plusplus: 0 */
    uuid++;
    const { addModal: { keys = [] }, setKeys } = this.props;
    const nextKeys = keys.concat(uuid);
    setKeys(nextKeys);
  }

  handleSubmit = (e) => {
    const { addPosInfo, posInfo: { cardNo }, addModal: { keys = [] } } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const result = keys.map((key) => {
          return { posNo: values[`posNo-${key}`], sellerNo: values[`sellerNo-${key}`] };
        });
        const params = {
          cardNo,
          posInfomationDetailRequests: result,
        };
        addPosInfo(params);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { addModal: { isFetching, keys = [] } } = this.props;
    const formItems = keys.map((k) => {
      return (
        <div key={k} className="modal">
          <Row gutter={24}>
            <Col span={11} >
              <FormItem>
                {getFieldDecorator(`sellerNo-${k}`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '不为空',
                    }, {
                      min: 12,
                      message: '至少12位字符',
                    },
                  ],
                })(<Input placeholder="商户编号" />)}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem required>
                {getFieldDecorator(`posNo-${k}`, {
                  validateTrigger: [
                    'onChange', 'onBlur',
                  ],
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '不为空',
                    },
                  ],
                })(<Input placeholder="终端编号" />)}
              </FormItem>
            </Col>
            <Col span={2} >
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={keys.length === 1}
                onClick={() => this.remove(k)}
              />
            </Col>
          </Row>
        </div>
      );
    });
    return (
      <Form onSubmit={this.handleSubmit} >
        {formItems}
        <Row>
          <Col span={12} >
            <FormItem >
              <Button
                type="dashed"
                onClick={this.add}
                style={{ width: '60%' }}
              >
                <Icon type="plus" />
                  新增信息
              </Button>
            </FormItem>
          </Col>
          <Col span={6} offset={6}>
            <FormItem >
              { keys.length > 0 &&
                <Button type="primary" htmlType="submit" loading={isFetching}>保存</Button>
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default connect(
  state => ({
    posInfo: state.task.unionPay.posInfo,
    addModal: state.task.unionPay.addModal,
  }),
  dispatch => ({
    addPosInfo: params => dispatch({ type: 'task/addPosInfo', payload: params }),
    setKeys: params => dispatch({ type: 'task/setKeys', payload: params }),
  }),
)(Form.create()(AddInfoModal));
