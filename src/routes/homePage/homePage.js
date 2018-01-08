import * as echarts from 'echarts';
import React, { Component } from 'react';
import moment from 'moment';
import { Spin } from 'antd';
import { connect } from 'dva';

import './homePage.less';

class HomePagePlate extends Component {

  componentDidMount() {
    const { getTaskTotal,
      getCallAverageTime,
      getTask,
      getLoan,
      getConversation,
      getKnowledge,
      getNotice,
    } = this.props;
    getTaskTotal();
    getCallAverageTime();
    getTask();
    getLoan();
    getConversation();
    getKnowledge({ pageNo: 1, pageSize: 10 });
    getNotice({ pageNo: 1, pageSize: 10 });
  }

  createHtml = (data, targetUrl) => {
    let resultHtml = null;
    if (data && data.length === 0) {
      resultHtml = <p>暂无数据</p>;
    } else {
      resultHtml = data.map((val, idx) => {
        if (idx < 7) {
          return (
            <tr key={val.id} className="list-container">
              <td><span className={val.top ? 'top' : 'not-top'}>{val.top ? '置顶' : ' '}</span></td>
              <td><a target="_blank" rel="noopener noreferrer" href={`${targetUrl}${val.id}`}>
                {val.title}
              </a></td>
              <td>{moment(val && val.createdDate).format('YYYY-MM-DD HH:MM')}</td>
            </tr>
          );
        } else {
          return null;
        }
      });
    }
    return resultHtml;
  }

  showTask = (data) => {
    if (data && data.content && typeof data.content === 'object') {
      if (Object.keys(data.content).length > 0) {
        const taskDataArr = [data.content.newRegister, data.content.loanAppGuided, data.content.auditFollowUp, data.content.sign];
        echarts.init(document.getElementById('task')).setOption({
          color: ['#40BF89'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: ['新注册', '引导进件', '审核跟进', '签约'],
            axisTick: {
              alignWithLabel: true,
            },
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              name: '任务处理数',
              type: 'bar',
              barWidth: '40%',
              data: taskDataArr,
            },
          ],
        });
      }
    } else {
      echarts.init(document.getElementById('task')).setOption({
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: ['新注册', '引导进件', '审核跟进', '签约'],
          axisTick: {
            alignWithLabel: true,
          },
        },
        yAxis: {
          type: 'category',
          data: ['600', '1200', '1800', '2400'],
          axisTick: {
            alignWithLabel: true,
          },
        },
      });
    }
  };

  showConversation = (data) => {
    if (data && data.content && data.content.length > 0) {
      const xAxisArr = [];
      const valueArr = [];
      data.content.forEach((val, idx) => {
        xAxisArr[idx] = val && val.horizontal && moment(val.horizontal).format('MM/DD');
        valueArr[idx] = val && val.vertical;
      });
      echarts.init(document.getElementById('conversation')).setOption({
        color: ['#40BF89'],
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxisArr,
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}m',
          },
        },
        series: [
          {
            name: '平均通话时长(分钟)',
            type: 'line',
            data: valueArr,
            markLine: {
              data: [
                { type: 'average', name: '平均值' },
              ],
            },
          },
        ],
      });
    } else {
      const defaultXArr = [];
      for (let i = 6; i >= 0; i--) {
        defaultXArr[i] = moment().subtract(7 - i, 'days').format('MM/DD');
      }
      echarts.init(document.getElementById('conversation')).setOption({
        xAxis: {
          type: 'category',
          data: defaultXArr,
          axisTick: {
            alignWithLabel: true,
          },
        },
        yAxis: {
          type: 'category',
          data: ['5m', '10m', '15m', '20m'],
          axisTick: {
            alignWithLabel: true,
          },
        },
      });
    }
  }

  render() {
    const {
      taskTotal,
      taskTotalLoading,
      callAverageTime,
      callAverageTimeLoading,
      task,
      taskLoading,
      loan,
      loanLoading,
      conversation,
      conversationLoading,
      knowledge,
      knowledgeLoading,
      notice,
      noticeLoading,
      userInfo,
      configList,
     } = this.props;
    if (!taskLoading) {
      this.showTask(task);
    }
    if (!conversationLoading) {
      this.showConversation(conversation);
    }
    const knowledgeHtml = this.createHtml(knowledge, '/bcrm/#/articleDetail?id=');
    const noticeHtml = this.createHtml(notice, '/bcrm/#/articleDetail?id=');
    const holdConfig = configList.find(val => val.configCode === 'HOMEPAGE_LOAN_HOLD_UNTREATED_DAY');
    const signConfig = configList.find(val => val.configCode === 'HOMEPAGE_LOAN_SIGN_UNTREATED_DAY');
    const conversationConfig = configList.find(val => val.configCode === 'HOMEPAGE_NEAREST_CALL_DAY');
    return (
      <div className="home-container">
        <Spin spinning={taskTotalLoading && callAverageTimeLoading}>
          <div className="home-item">
            <div className="ant-row">
              <div className="user-header-left">
                <img alt="点融CRM" src={require('../../assets/defaultUser.png')} />
              </div>
              <div className="user-header-right">
                <div className="user-info">
                  <span className="info-name">{userInfo.name}</span>
                  <span className="info-job">{userInfo.roleName}</span>
                </div>
                <p>{userInfo.email}</p>
              </div>
            </div>
            <div className="ant-row">
              <div className="user-task-item">
                <p className="task-name">任务总数</p>
                <p className="task-num">{taskTotal.content}</p>
              </div>
              <div className="user-task-item">
                <p className="task-name">平均通话时长</p>
                <p className="task-num">{callAverageTime.content}</p>
              </div>
            </div>
          </div>
        </Spin>
        <Spin spinning={taskLoading}>
          <div className="home-item">
            <div><p className="item-header">任务分布</p><span className="header-time">更新时间{task && task.updateDate ? moment(task.updateDate).format('HH:MM') : ''}</span></div>
            <div id="task" className="canvas-contanier" />
          </div>
        </Spin>
        <Spin spinning={loanLoading}>
          <div className="home-item" >
            <div><p className="item-header">贷款处理</p><span className="header-time">更新时间{loan && loan.updateDate ? moment(loan.updateDate).format('HH:MM') : ''}</span></div>
            <div className="item-box">
              <p className="box-title">待补件</p>
              <p>总数：{loan.content && loan.content.hold}</p>
              <p>超过{holdConfig && holdConfig.configRule}天未处理：{loan.content && loan.content.holdDelay}</p>
            </div>
            <div className="item-box">
              <p className="box-title">待签约</p>
              <p>总数：{loan.content && loan.content.sign}</p>
              <p>超过{signConfig && signConfig.configRule}天未处理：{loan.content && loan.content.signDelay}</p>
            </div>
          </div>
        </Spin>
        <Spin spinning={conversationLoading}>
          <div className="home-item">
            <div><p className="item-header">近{(conversationConfig && conversationConfig.configRule) || ''}日通话时长</p><span className="header-time">更新时间{conversation && conversation.updateDate ? moment(conversation.updateDate).format('HH:MM') : ''}</span></div>
            <div id="conversation" className="canvas-contanier" />
          </div>
        </Spin>
        <Spin spinning={knowledgeLoading}>
          <div className="home-item">
            <p className="item-header" style={{ marginBottom: '10px' }}>知识库</p>
            <table>
              <tbody>{knowledgeHtml}</tbody>
            </table>
            {
              knowledge && knowledge.length > 7 ?
                <a target="_blank" rel="noopener noreferrer" style={{ float: 'right', marginRight: '10px' }} href="/bcrm/#/knowledge">更多...</a>
              : null
            }
          </div>
        </Spin>
        <Spin spinning={noticeLoading}>
          <div className="home-item">
            <p className="item-header" style={{ marginBottom: '10px' }}>公告</p>
            <table>
              <tbody>{noticeHtml}</tbody>
            </table>
            {
              notice && notice.length > 7 ?
                <a target="_blank" rel="noopener noreferrer" style={{ float: 'right', marginRight: '10px' }} href="/bcrm/#/notice">更多...</a>
              : null
            }
          </div>
        </Spin>
      </div>
    );
  }
}

export default connect(
  state => ({
    taskTotal: state.homePage.taskTotal,
    taskTotalLoading: state.homePage.taskTotalLoading,
    callAverageTime: state.homePage.callAverageTime,
    callAverageTimeLoading: state.homePage.callAverageTimeLoading,
    task: state.homePage.task,
    taskLoading: state.homePage.taskLoading,
    loan: state.homePage.loan,
    loanLoading: state.homePage.loanLoading,
    conversation: state.homePage.conversation,
    conversationLoading: state.homePage.conversationLoading,
    knowledge: state.homePage.knowledge,
    knowledgeLoading: state.homePage.knowledgeLoading,
    notice: state.homePage.notice,
    noticeLoading: state.homePage.noticeLoading,
    userInfo: state.user.userInfo,
  }),
  dispatch => ({
    getTaskTotal: () => dispatch({ type: 'homePage/getTaskTotal' }),
    getCallAverageTime: () => dispatch({ type: 'homePage/getCallAverageTime' }),
    getTask: () => dispatch({ type: 'homePage/getTask' }),
    getLoan: () => dispatch({ type: 'homePage/getLoan' }),
    getConversation: () => dispatch({ type: 'homePage/getConversation' }),
    getKnowledge: params => dispatch({ type: 'homePage/getKnowledge', payload: params }),
    getNotice: params => dispatch({ type: 'homePage/getNotice', payload: params }),
  }),
)(HomePagePlate);
