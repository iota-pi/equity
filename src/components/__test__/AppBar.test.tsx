import React from 'react';
import AppBar from '../AppBar';
import { shallow, mount, render } from 'enzyme';

describe('<AppBar/>', () => {
  it('renders consistently', () => {
    const fn = jest.fn();
    const wrapper1 = mount(<AppBar canUndo={true} onClear={fn} onUndo={fn} />);
    const wrapper2 = mount(<AppBar canUndo={false} onClear={fn} onUndo={fn} />);
    expect(wrapper1).toMatchSnapshot();
    expect(wrapper2).toMatchSnapshot();
  });

  it('contains app name', () => {
    const fn = jest.fn();
    const wrapper = mount(<AppBar canUndo={true} onClear={fn} onUndo={fn} />);
    expect(wrapper.contains('Equity')).toBe(true);
  });

  it('has right number of buttons', () => {
    const fn = jest.fn();
    const wrapper = mount(<AppBar canUndo={true} onClear={fn} onUndo={fn} />);
    expect(wrapper.find('button').length).toBe(2);
  });

  it('triggers callbacks', () => {
    const clear = jest.fn();
    const undo = jest.fn();
    const wrapper = mount(<AppBar canUndo={true} onClear={clear} onUndo={undo} />);
    expect(clear).toHaveBeenCalledTimes(0);
    expect(undo).toHaveBeenCalledTimes(0);
    wrapper.find('button').first().simulate('click');
    expect(clear).toHaveBeenCalledTimes(1);
    expect(undo).toHaveBeenCalledTimes(0);
    wrapper.find('button').last().simulate('click');
    expect(clear).toHaveBeenCalledTimes(1);
    expect(undo).toHaveBeenCalledTimes(1);
  });
});
