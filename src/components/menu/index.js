import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Menu } from 'antd';
import './menu.less';

const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;

class TopMenu extends Component {
  componentWillMount() {
    this.props.getMenuList();
  }

  handleClick = (e) => {
    console.log(e);
  }

  renderLink = (link, label) => {
    const path = link.split('/')[2];
    const icsUrlObj = {
      myTicket: '/ics/ticket.html#/tickets/SINGLE?origin=1&platform=1',
      allTicket: '/ics/ticket.html#/tickets/ALL?origin=1&platform=1',
    };
    const newLinkArray = [
      'myCustomers',
      'allCustomers',
      'reAudit',
      'createLoan',
      'taskStatistics',
      'loan_application_report',
      'loan_repayment_report',
      'notification',
      'notifiySetting',
      'assignActorRuleConfig',
      'assignActorTaskStatusConfig',
      'borrowerLoanInfo',
      'unionPay',
      'toAddborrowcustomer',
      'toUploadFialedList',
      'myTasks',
      'teamTasks',
      'undistributed-customer',
      'no-sales-tasks',
      'notice',
      'knowledge',
      'collection',
      'sortManage',
      'records',
      'callrecords',
      'article-add',
      'call-record-report',
      'tellphone-statistics-report',
      'sms-my-record',
      'sms-all-record',
      'sms-template',
      'sms-send',
      'cms-group',
      'task-delay',
      'assign-report',
      'home',
      'home-config',
    ];
    const icsLinkArray = [
      'myTicket',
      'allTicket',
    ];
    const isNew = newLinkArray.includes(path);
    const isIcs = icsLinkArray.includes(path);
    return isNew ? <Link to={`/${path}`}>{label}</Link> : isIcs ? <a target="_blank" rel="noopener noreferrer" href={icsUrlObj[path]}>{label}</a> : <a href={link}>{label}</a>;
  }

  render() {
    const { menuList } = this.props;
    const pathname = `/borrower${this.props.pathname}`;
    return (
      <div className="menu">
        <Menu
          onClick={this.handleClick}
          selectedKeys={[pathname]}
          mode="horizontal"
        >
          {
            menuList.map((item) => {
              return item.children.length > 0 ?
                <SubMenu title={item.label.replace(/管理$/, '')} key={item.id}>
                  {
                    item.children.map((child) => {
                      const { children } = child;
                      let dom = null;
                      if (children.length > 0) {
                        dom = (
                          <SubMenu title={child.label} key={child.id} className="dr-submenu">
                            {
                              children.map((i) => {
                                return (
                                  <Menu.Item key={i.link}>
                                    {this.renderLink(i.link, i.label)}
                                  </Menu.Item>
                                );
                              })
                            }
                          </SubMenu>
                        );
                      } else {
                        dom = (
                          <Menu.Item key={child.link}>
                            {this.renderLink(child.link, child.label)}
                          </Menu.Item>
                        );
                      }
                      return dom;
                    })
                  }
                </SubMenu> :
                <Menu.Item key={item.link}>
                  {this.renderLink(item.link, item.label)}
                </Menu.Item>;
            },
            )
          }
        </Menu>
      </div>
    );
  }
}

export default connect(
  state => ({
    menuList: state.menuList,
  }),
  dispatch => ({
    getMenuList: () => dispatch({ type: 'menuList/getMenuList' }),
  }),
)(TopMenu);
