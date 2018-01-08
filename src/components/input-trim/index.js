import React, { Component } from 'react';
import { Input } from 'antd';

class TrimInput extends Component {
  state = {

  };

  componentWillMount() {

  }

  trim = (e) => {
    const value = e.target.value;
    const { onChange } = this.props;
    if (onChange) {
      onChange(value && value.trim());
    }
  }

  render() {
    const { disabled, value, placeholder } = this.props;
    const showValue = value && value.toString().trim();
    return (
      <Input type="text" value={showValue} onChange={this.trim} placeholder={placeholder} disabled={disabled}/>
    );
  }
}

export default TrimInput;
