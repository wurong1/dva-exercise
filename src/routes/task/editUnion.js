import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Col, Icon, Input, Spin } from 'antd';

const FormItem = Form.Item;


class EditInfoModal extends Component {

  remove = (k) => {
    const { editModal: { keys = [] }, setEditKeys } = this.props;
    const nextKeys = keys.filter(key => key !== k);
    setEditKeys(nextKeys);
  }

  add = () => {
    const { addEditData } = this.props;
    addEditData();
  }

  handleSubmit = (e) => {
    const { editPosInfo, editModal: { keys, data = {} } } = this.props;
    const { cardNo, id } = data;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const result = keys.map((key) => {
          return { posNo: values[`posNo-${key}`], sellerNo: values[`sellerNo-${key}`], id };
        });
        const params = {
          cardNo,
          id,
          posInfomationDetailRequests: result,
        };
        editPosInfo(params);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { editModal: { isFetching, keys = [], data } } = this.props;
    const list = data.posInfomationDetailResponses || [];
    const formItems = keys.map((k) => {
      return (
        <div key={k} className="modal">
          <Row gutter={24}>
            <Col span={11} >
              <FormItem>
                {getFieldDecorator(`sellerNo-${k}`, {
                  initialValue: list[k - 1] && list[k - 1].sellerNo,
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
                  initialValue: list[k - 1] && list[k - 1].posNo,
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
        <Spin spinning={isFetching}>
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
                <Button type="primary" htmlType="submit" loading={isFetching}>保存</Button>
              </FormItem>
            </Col>
          </Row>
        </Spin>
      </Form>
    );
  }
}

export default connect(
  state => ({
    editModal: state.task.unionPay.editModal,
  }),
  dispatch => ({
    editPosInfo: params => dispatch({ type: 'task/editPosInfo', payload: params }),
    setEditKeys: params => dispatch({ type: 'task/setEditKeys', payload: params }),
    addEditData: () => dispatch({ type: 'task/addEditData' }),
  }),
)(Form.create()(EditInfoModal));
