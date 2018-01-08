import React, { Component } from 'react';
import { Select, Spin } from 'antd';
import request from '../../utils/request';

const Option = Select.Option;

class SelectCascade extends Component {

  constructor(props) {
    super(props);
    this.state = {
      options: [],
      cacheOptions: {},
      value: this.props.value || '',
      loading: false,
    };
  }

  componentWillMount() {
    const { parentType, parentName, remote } = this.props;
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
    const { parentValue } = this.props;
    const { parentName, parentType, remote } = nextProps;
    const cacheOption = {};
    const cachePropsName = nextProps.parentValue && parentType !== 'multiple' ? `${parentName}-${nextProps.parentValue}` : `${parentName}`;
    const optionCached = this.state.cacheOptions[cachePropsName];
    const requestOption = {};
    let param = '';
    let url = '';
    let valueChange = false;
    if (parentType === 'multiple') {
      if (typeof parentValue !== typeof nextProps.parentValue) {
        valueChange = true;
      } else if (Array.isArray(parentValue) && Array.isArray(nextProps.parentValue)) {
        valueChange = parentValue.join('') !== nextProps.parentValue.join('');
      }
    } else {
      valueChange = parentValue !== nextProps.parentValue;
    }
    if (parentValue === undefined) {
      if (nextProps.parentValue === '') {
        valueChange = false;
      }
      if (Array.isArray(nextProps.parentValue) && nextProps.parentValue.length < 1) {
        valueChange = false;
      }
    }
    if (valueChange) {
      this.handleChange('');
      if (optionCached && parentType !== 'multiple') {
        this.setState({ options: optionCached });
        return;
      }
      if (nextProps.parentValue === undefined) {
        this.setState({ options: [] });
      }
      if (parentName && nextProps.parentValue !== undefined && !optionCached) {
        this.setState({ loading: true });
        if (parentType === 'multiple') {
          param = Array.isArray(nextProps.parentValue) ? nextProps.parentValue : [];
          requestOption.method = 'post';
          requestOption.body = JSON.stringify(param);
          url = remote.split('?')[0];
        } else {
          url = remote.replace('{:val}', nextProps.parentValue);
        }
        request(url, requestOption)
          .then((options) => {
            if (parentType !== 'multiple') {
              cacheOption[cachePropsName] = options || [];
            }
            this.setState(prevState => ({
              loading: false,
              options: options || [],
              cacheOptions: { ...prevState.cacheOptions, ...cacheOption } }),
            );
          }).catch(() => {
            this.setState({ loading: false });
          });
      }
    }
    if ('value' in nextProps) {
      this.setState({ value: nextProps.value });
    }
  }

  handleChange = (value) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(value);
    }
    this.setState({ value });
  }

  render() {
    const { name, val, dropdownMatchSelectWidth } = this.props;
    const { options = [], loading } = this.state;
    return (
      <Spin spinning={loading}>
        <Select
          value={this.state.value}
          onChange={this.handleChange.bind(this)}
          disabled={options.length < 1}
          dropdownMatchSelectWidth={dropdownMatchSelectWidth}
        >
          <Option value="" key="all">全部</Option>
          {
              this.state.options.map(option => <Option value={`${option[val || 'id']}`} key={option[val || 'id']}>{option[name || 'name']}</Option>)
            }
        </Select>
      </Spin>
    );
  }
}

export default SelectCascade;
