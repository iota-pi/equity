import React from 'react';
import NumberInput from '../NumberInput';
import { shallow, mount, render } from 'enzyme';

describe('<NumberInput/>', () => {
  it('renders consistently', () => {
    const wrapper = render(
      <NumberInput value={1} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('responds to input correctly', () => {
    const change = jest.fn();
    const wrapper = mount(
      <NumberInput value={1} onChange={change} />
    );

    expect(change).toHaveBeenCalledTimes(0);
    wrapper.find('input').first().simulate('change', {
      target: { value: 0 },
    });
    expect(change).toHaveBeenCalledTimes(0);
    wrapper.find('input').first().simulate('change', {
      target: { value: 5 },
    });
    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenLastCalledWith(5);
  });

  it('wont return values that are too high', () => {
    const change = jest.fn();
    const wrapper = mount(
      <NumberInput value={1} onChange={change} />
    );

    wrapper.find('input').first().simulate('change', {
      target: { value: 999999 },
    });
    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenLastCalledWith(1000);
  });

  it('wont return values above max', () => {
    const change = jest.fn();
    const wrapper = mount(
      <NumberInput value={1} max={100} onChange={change} />
    );

    wrapper.find('input').first().simulate('change', {
      target: { value: 999999 },
    });
    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenLastCalledWith(100);
  });

  it('bubbles enter press', () => {
    const enter = jest.fn();
    const wrapper = mount(
      <NumberInput onEnterPress={enter} />
    );

    expect(enter).toHaveBeenCalledTimes(0);
    wrapper.find('input').first().simulate('keypress', {
      key: 'Enter',
    });
    expect(enter).toHaveBeenCalledTimes(1);
    wrapper.find('input').first().simulate('keypress', {
      key: 'a',
    });
    expect(enter).toHaveBeenCalledTimes(1);
  });
});
