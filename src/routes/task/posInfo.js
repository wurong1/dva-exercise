import React, { Component } from 'react';
import { Link } from 'dva/router';
import { connect } from 'dva';
import { Form, Button, Row, Col, Table, Modal } from 'antd';
import AddInfoModal from './addUnion';
import EditInfoModal from './editUnion';
import TrimInput from '../../components/input-trim';
import './task.less';

const FormItem = Form.Item;

class PosInfo extends Component {

  edit = (record, e) => {
    const { getEditData } = this.props;
    e.preventDefault();
    getEditData(record.id);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return false;
      }
      this.props.submitForm(values);
    });
  }

  clearData = () => {
    const { resetFields } = this.props.form;
    resetFields();
    this.props.clearData();
  }

  showAddModal = () => {
    this.props.showAddModal(true);
  }

  handleOk = () => {
    this.props.showAddModal(false);
  }

  handleEditOk = () => {
    this.props.closeEditModal();
  }

  handleCancel = () => {
    this.props.showAddModal(false);
  }

  handleEditCancel = () => {
    this.props.closeEditModal();
  }

  ssnValidate =(rule, value, callback) => {
    const regx = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    if (!regx.exec(value)) {
      callback('请输入正确的身份证号');
    } else {
      callback();
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { posInfo: { isFetching, list = [] }, visiable, showBtn, editModal = {} } = this.props;

    const columns = [{
      title: '身份证号',
      dataIndex: 'cardNo',
      key: 'cardNo',
    }, {
      title: '商户编号',
      render: (text, record) => {
        const detailList = record.posInfomationDetailResponses || [];
        const array = detailList.map(item => item.sellerNo);
        return array.join(',');
      },
    }, {
      title: '终端编号',
      render: (text, record) => {
        const detailList = record.posInfomationDetailResponses || [];
        const array = detailList.map(item => item.posNo);
        return array.join(',');
      },
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <div>
            <Link to={`/unionPayDetail?posId=${record.id}`}>银联数据查询</Link>
            <a className="link-right" onClick={this.edit.bind(this, record)}>修改</a>
          </div>
        );
      },
    }];

    return (
      <div className="dr-layout task">
        <Form
          layout="horizontal"
          onSubmit={this.handleSubmit}
        >
          <div className="crm-filter-box">
            <Row gutter={24}>
              <Col span={4}>
                <FormItem
                  label="身份证"
                >
                  {getFieldDecorator('cardNo', {
                    rules: [{
                      required: true,
                      validator: this.ssnValidate,
                    }],
                  })(
                    <TrimInput />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
            >
              搜索
            </Button>
          </FormItem>
        </Form>
        <Button className="btn-clear" onClick={this.clearData.bind(this)}>
          清空
        </Button>
        <div className="btn-group">
          {
            showBtn &&
              <Button className="" onClick={this.showAddModal.bind(this)}>
                新增信息
              </Button>
          }
        </div>
        <Table
          columns={columns}
          dataSource={list}
          size="middle"
          loading={isFetching}
          rowKey={(record, idx) => idx}
        />
        <Modal
          title="新增信息"
          visible={visiable}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <AddInfoModal />
        </Modal>
        <Modal
          title="编辑信息"
          visible={editModal.visiable}
          onOk={this.handleEditOk}
          onCancel={this.handleEditCancel}
          footer={null}
        >
          <EditInfoModal />
        </Modal>
      </div>
    );
  }
}

export default connect(
  state => ({
    posInfo: state.task.unionPay.posInfo,
    visiable: state.task.unionPay.addModal.visiable,
    showBtn: state.task.unionPay.posInfo.showBtn,
    editModal: state.task.unionPay.editModal,
  }),
  dispatch => ({
    submitForm: params => dispatch({ type: 'task/getPosInfo', payload: params }),
    clearData: () => dispatch({ type: 'task/clearPosInfo' }),
    showAddModal: params => dispatch({ type: 'task/showAddModal', payload: params }),
    getEditData: params => dispatch({ type: 'task/getEditData', payload: params }),
    closeEditModal: () => dispatch({ type: 'task/closeEditModal' }),
  }),
)(Form.create()(PosInfo));
