import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Spin, Icon, message } from 'antd';
import moment from 'moment';
import request from '../../utils/request';
import './cms.less';

class ArticleDetail extends Component {
  componentDidMount() {
    const { id } = this.props;
    this.props.getArticleDetail(id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.articleDetail !== this.props.articleDetail) {
      this.content.innerHTML = `${nextProps.articleDetail.content}`;
    }
  }

  preview = (item, e) => {
    e.preventDefault();
    const match = item.title && item.title.match(/^.+\.([A-Za-z]+)$/);
    const { id } = item;
    if (match && match.length > 1) {
      const type = match[1];
      if (['zip', 'rar', 'eml'].indexOf(type) > -1) {
        message.error('文件格式不支持预览！');
      } else {
        // 浏览器会拦截异步请求弹窗，先打开空白页然后重定向到预览页面
        const newWin = window.open('/bcrm/preview.html');
        request(`/borrower/v1/borrow-cms/show-image?path=${item.path}&swfPath=${item.swfPath}`)
        .then((res) => {
          const { status, filePath } = res;
          if (status) {
            localStorage.setItem(`path_${id}`, filePath);
            newWin.location.href = `/bcrm/preview.html?id=${id}`;
          } else {
            message.error('该文件不支持预览！');
          }
        }).catch(() => {
        });
      }
    }
  }

  render() {
    const {
      articleDetail = {},
      columList,
      projectList,
      loading,
    } = this.props;
    const {
      title,
      columnId,
      projectId,
      attachments = [],
      updatedBy,
      updatedDate,
      createdBy,
      createdDate,
      clickVolume,
      collectTimes,
    } = articleDetail;
    const columnLabel = columList.find(item => item.id === columnId)
      && columList.find(item => item.id === columnId).label;
    const projectLabel = projectList.find(item => item.id === projectId)
      && projectList.find(item => item.id === projectId).label;
    return (
      <div className="cms">
        <Spin spinning={loading}>
          <h3>详情</h3>
          <div className="cms-content-detail">
            <h2 style={{ textAlign: 'center', marginBottom: '15px' }}>{title}</h2>
            <Row style={{ marginBottom: '30px' }}>
              <Col span={5}>类别：{columnLabel}</Col>
              <Col span={5}>项目：{projectLabel}</Col>
              <Col span={5}>查看次数：{clickVolume}</Col>
              <Col span={5}>收藏次数: {collectTimes}</Col>
            </Row>
            <Row style={{ marginBottom: '30px' }}>
              <Col span={5}>创建: {createdBy} {createdDate && moment(createdDate).format('YYYY-MM-DD HH:mm:ss')}</Col>
              <Col span={5}>修改: {updatedBy} {updatedDate && moment(updatedDate).format('YYYY-MM-DD HH:mm:ss')}</Col>
            </Row>
            <div ref={(html) => { this.content = html; }} />
            <div className="cms-file-section">
              <div className="cms-file-list">
                {
                  attachments.map((item, idx) => {
                    return (
                      <div key={idx} className="cms-file">
                        <p title={item.title}>{item.title && (item.title.length > 10 ? `${item.title.substr(0, 10)}...` : item.title)}</p>
                        <a href={`/borrower/v1/borrow-cms/load-file?path=${item.path}&title=${item.title}`}><Icon type="download" />下载</a>
                        <a onClick={this.preview.bind(this, item)}><Icon type="eye" />预览</a>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

export default connect(
  state => ({
    articleDetail: state.cmsDetail.articleDetail,
    id: state.routing.locationBeforeTransitions.query.id,
    columList: state.cmsDetail.columList || [],
    projectList: state.cmsDetail.projectList || [],
    loading: state.cmsDetail.loading,
  }),
  dispatch => ({
    getArticleDetail: params => dispatch({ type: 'cmsDetail/getArticleDetail', payload: params }),
  }),
)(ArticleDetail);

