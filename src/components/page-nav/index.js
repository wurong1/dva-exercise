import React, { Component } from 'react';
import { Spin, Pagination } from 'antd';
import request from '../../utils/request';
import './page.less';

class PageNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFlage: false,
      data: {},
      loading: false,
    };
  }

  onChange = (page) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(page);
    }
  }

  handleClick = (e) => {
    e.preventDefault();
    const { values } = this.props;
    this.setState({ loading: true });
    request('/borrower/v1/task/count', { method: 'post', body: JSON.stringify(values) })
      .then((data) => {
        this.setState({ data, showFlage: true, loading: false });
      })
        .catch(() => {
          this.setState({ showFlage: false, loading: false });
        });
  }

  render() {
    const { currentCount, pageSize, pageNo, showPageNav } = this.props;
    const { showFlage, data, loading } = this.state;
    return (
      <div style={{ display: `${showPageNav ? 'block' : 'none'}` }} className="page">
        <Spin spinning={loading} >
          {
            currentCount < pageSize && !showFlage ?
              <div className="page-more">总条数{ currentCount }</div>
            :
            !showFlage && <div className="page-more"><a onClick={this.handleClick}>查看更多</a></div>
          }
          {
            showFlage &&
              <div className="page-nav">
                <span className="total">总条数{ data.count }</span>
                <Pagination
                  onChange={this.onChange}
                  current={pageNo}
                  total={data.count}
                  pageSize={data.pageSize}
                />
              </div>
          }
        </Spin>
      </div>
    );
  }
}
export default PageNav;
