import React, { PureComponent, Component, ChangeEvent, KeyboardEvent } from "react";
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
export interface State {
  value: string,
}

class TextInput extends PureComponent<Props, State> {
  state = {
    value: '1',
  } as State;

  constructor (props: Props) {
    super(props);
    this.state.value = (props.value || 1).toString();
  }

  render() {
    return (
      <TextField
        autoFocus={this.props.autoFocus}
        label={this.props.label}
        type="number"
        {...this.variantProps()}
        fullWidth={this.props.fullWidth}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
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
    this.setState({ value: event.target.value });
    const maxValue = this.props.max || 1000;
    const intValue = parseInt(event.target.value);
    if (intValue) {
      if (this.props.onChange) {
        this.props.onChange(Math.min(intValue, maxValue));
      }
    }
  };

  private handleBlur = () => {
    this.setState({ value: (this.props.value || 1).toString() });
  }

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
    if (value !== undefined && prevProps.value !== value && value.toString() !== this.state.value) {
      this.setState({ value: value.toString() })
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
