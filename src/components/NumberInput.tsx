import React, { Component, ChangeEvent, KeyboardEvent } from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import People from "@material-ui/icons/People";

export interface Props {
  value?: number,
  onChange?: (arg: number) => void,
  onEnterPress?: () => void,
  label?: string,
  variant?: "filled" | "outlined" | "standard",
  min?: number,
  max?: number,
  step?: number,
  icon?: Component,
  fullWidth?: boolean,
  autoFocus?: boolean,
}

class TextInput extends Component<Props> {
  state = {
    value: 1
  };

  render() {
    return (
      <TextField
        autoFocus={this.props.autoFocus}
        label={this.props.label}
        type="number"
        {...this.variantProps()}
        fullWidth={this.props.fullWidth}
        onChange={this.handleChange}
        onKeyPress={this.handleKeyPress}
        value={this.state.value.toString()}
        InputProps={{
          inputProps: {
            min: this.props.min || 1,
            max: this.props.max,
            step: this.props.step || 1,
          },
          startAdornment: (
            <InputAdornment position="start">
              {this.props.icon || <People />}
            </InputAdornment>
          )
        }}
      />
    );
  }

  private handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    this.setState({ value: newValue });
    if (this.props.onChange) {
      this.props.onChange(newValue);
    }
  };

  private handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (this.props.onEnterPress) {
        this.props.onEnterPress();
      }
    }
  }

  componentDidUpdate (prevProps: Props) {
    // Update value in state if prop has changed (and prop value doesn't already match state value)
    const { value } = this.props;
    if (value !== undefined && prevProps.value !== value && value !== this.state.value) {
      this.setState({ value })
    }
  }

  private variantProps () {
    if (this.props.variant === 'filled') {
      return {variant: 'filled' as 'filled'}
    }
    if (this.props.variant === 'outlined') {
      return {variant: 'outlined' as 'outlined'}
    }
    return {variant: 'standard' as 'standard'}
  }
}

export default TextInput;
