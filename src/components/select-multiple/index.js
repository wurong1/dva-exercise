import React, { Component } from 'react';
import { Dropdown, Button, Icon, Menu, Spin } from 'antd';
import request from '../../utils/request';
import './select-multiple.less';

const { Item } = Menu;

class MultipleSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      options: this.props.options || [],
      visible: false,
      checkStatus: [],
      selectAll: false,
      text: '全部',
      value: this.props.value || '',
      loading: false,
    };
  }

  componentWillMount() {
    const { parentType, remote, parentName } = this.props;
    const requestOption = {};
    let param = '';
    let url = '';
    if (parentName && remote) {
      if (parentType === 'multiple') {
        param = [];
        requestOption.method = 'post';
        requestOption.body = JSON.stringify(param);
        url = remote.split('?')[0];
      } else {
        url = remote.replace('{:val}', '');
      }
      this.setState({ loading: true });
      request(url, requestOption)
      .then((options) => {
        this.setState({
          loading: false,
          options });
      }).catch(() => {
        this.setState({ loading: false });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value, options, onChange, parentName, parentValue, parentType, remote } = nextProps;
    const preOptions = this.props.options;
    const preParentValue = this.props.parentValue;
    let checkStatus = [];
    let selectAll = false;
    let text = '全部';
    let reload = false;
    let param = '';
    const requestOption = {};
    let url = '';
    let valueChange = false;
    let newOptions = [];
    if (nextProps !== undefined) {
      // 1. 从父组件传入options
      if (preOptions !== options && Array.isArray(options)) {
        reload = true;
        this.setState({ value: [], checkStatus, text, selectAll, options });
        if (onChange) {
          onChange([]);
        }
      }
    }

    // 2. 多选为二级
    if (parentType === 'multiple') {
      if (typeof preParentValue !== typeof parentValue) {
        valueChange = true;
      } else if (Array.isArray(preParentValue) && Array.isArray(parentValue)) {
        valueChange = preParentValue.join('') !== parentValue.join('');
      }
    } else {
      valueChange = preParentValue !== parentValue;
    }
    if (preParentValue === undefined) {
      if (parentValue === '') {
        valueChange = false;
      }
      if (Array.isArray(parentValue) && parentValue.length < 1) {
        valueChange = false;
      }
    }
    if (parentName && valueChange) {
      reload = true;
      if (parentValue === undefined) {
        this.setState({
          value: [],
          checkStatus: [],
          text: '全部',
          selectAll: false,
          options: [],
          loading: false,
        });
        if (onChange) {
          onChange([]);
        }
        return;
      }
      this.setState({ loading: true });
      if (parentType === 'multiple') {
        param = Array.isArray(parentValue) ? parentValue : [];
        requestOption.method = 'post';
        requestOption.body = JSON.stringify(param);
        url = remote.split('?')[0];
      } else {
        url = remote.replace('{:val}', parentValue);
      }
      request(url, requestOption)
        .then((res) => {
          this.setState({
            value: [],
            checkStatus: [],
            text: '全部',
            selectAll: false,
            options: res || [],
            loading: false,
          });
          if (onChange) {
            onChange([]);
          }
        }).catch(() => {
          this.setState({ loading: false });
        });
    }
    if (parentName) {
      newOptions = this.state.options;
    } else {
      newOptions = options;
    }
    // 多选组件vlaue改变的时候触发
    if (!reload && nextProps && ('value' in nextProps)) {
      if (!Array.isArray(value)) return;
      if (value.length > 0) {
        checkStatus = newOptions && newOptions.map((option) => {
          const item = {};
          item.id = option.id;
          if (value.indexOf(option.id) > -1) {
            item.checked = true;
          } else {
            item.checked = false;
          }
          return item;
        });
        text = `已选中${value.length}项`;
        if (value.length === newOptions.length) {
          selectAll = true;
        }
      }
      this.setState({ value, checkStatus, text, selectAll, options: newOptions || [] });
    }
  }

  onVisibleChange = (visible) => {
    this.setState({ visible });
  }

  getOptions = () => {
    const { selectAll, checkStatus, options } = this.state;
    const selectAllColor = selectAll ? '#40BF89' : 'white';
    let selectColor = '';
    return (
      <Menu onClick={this.handleMenuClick.bind(this)}>
        <Item key="all"><span className="icon-border"><Icon type="check-square" style={{ color: selectAllColor }} /></span>全部</Item>
        {options.map((option, idx) => {
          selectColor = checkStatus[idx] && checkStatus[idx].checked ? '#40BF89' : 'white';
          return <Item key={option.id}><span className="icon-border"><Icon type="check-square" style={{ color: selectColor }} /></span>{option.name}</Item>;
        })}
      </Menu>
    );
  }

  handleMenuClick = (e) => {
    const { options } = this.state;
    const { onChange } = this.props;
    const key = e.key;
    let checkStatus = [...this.state.checkStatus];
    let selectedArray = [];
    let selectAll = false;
    const tempItem = {};
    const checkeditem = checkStatus.filter((item) => {
      return item.id === key;
    })[0];
    const index = options.findIndex(option => option.id === key);
    const isFirstCheked = !checkeditem;
    let result = [];
    let text = '';
    // 不是全选
    if (key !== 'all') {
      if (isFirstCheked) {
        tempItem.id = key;
        tempItem.checked = true;
        checkStatus.splice(index, 0, tempItem);
      } else {
        checkStatus = this.state.checkStatus.map((item) => {
          return {
            id: item.id,
            checked: item.id === key ? !item.checked : item.checked,
          };
        });
      }
      selectedArray = checkStatus.filter(item => item.checked).map(item => item.id);
      if (selectedArray.length === options.length) {
        selectAll = true;
      }
      result = selectedArray;
    } else {
      selectAll = !this.state.selectAll;
      if (selectAll) {
        checkStatus = options.map((option) => {
          return { id: option.id, checked: true };
        });
        selectedArray = options.map(item => item.id);
        result = selectedArray;
      } else {
        checkStatus = [];
      }
    }
    text = result.length > 0 ? `已选中${result.length}项` : '全部';
    if (onChange) {
      onChange(result);
    }
    this.setState({ checkStatus, selectAll, text, visible: true, value: result });
  }

  render() {
    const { loading, text } = this.state;
    const str = text && text.length > 5 ? `${text.substr(0, 5)}...` : text;
    return (
      <Spin spinning={loading}>
        <Dropdown
          overlay={this.getOptions()}
          trigger={['click']}
          onVisibleChange={this.onVisibleChange}
          visible={this.state.visible}
          value={this.state.value}
          disabled={this.state.options.length < 1}
        >
          <Button style={{'position':'relative'}} title={text}>
            {str}
            <Icon type={this.state.visible ? 'up' : 'down'} style={{'position':'absolute', 'right': '5px'}}/>
          </Button>
        </Dropdown>
      </Spin>
    );
  }
}

export default MultipleSelect;
