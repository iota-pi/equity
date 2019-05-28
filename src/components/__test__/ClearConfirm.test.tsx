import React from 'react';
import ClearConfirm from '../ClearConfirm';
import { shallow, mount, render, configure } from 'enzyme';

describe('<ClearConfirm/>', () => {
  it('renders consistently', () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ClearConfirm
        show={true}
        onClear={fn}
        onClose={fn}
        onChangeConfirmClear={fn}
        dontConfirmClear={false}
      />
    );
    expect(wrapper).toMatchSnapshot();
    const wrapper2 = mount(
      <ClearConfirm
        show={false}
        onClear={fn}
        onClose={fn}
        onChangeConfirmClear={fn}
        dontConfirmClear={false}
      />
    );
    expect(wrapper2).toMatchSnapshot();
    const wrapper3 = mount(
      <ClearConfirm
        show={true}
        onClear={fn}
        onClose={fn}
        onChangeConfirmClear={fn}
        dontConfirmClear={true}
      />
    );
    expect(wrapper3).toMatchSnapshot();
  });

  it('triggers callbacks', () => {
    const clear = jest.fn();
    const close = jest.fn();
    const change = jest.fn();
    const wrapper = mount(
      <ClearConfirm
        show={true}
        onClear={clear}
        onClose={close}
        onChangeConfirmClear={change}
        dontConfirmClear={false}
      />
    );
    expect(close).toHaveBeenCalledTimes(0);
    wrapper.find('button').first().simulate('click');
    expect(close).toHaveBeenCalledTimes(1);
    expect(clear).toHaveBeenCalledTimes(0);
    wrapper.find('button').last().simulate('click');
    expect(close).toHaveBeenCalledTimes(1);
    expect(clear).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenCalledTimes(0);

    const checkbox = wrapper.find('input').first();
    checkbox.simulate('change', {
      target: checkbox.getDOMNode()
    });
    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenLastCalledWith(true);
    wrapper.setProps({ dontConfirmClear: true });
    checkbox.simulate('change', {
      target: checkbox.getDOMNode()
    });
    expect(change).toHaveBeenCalledTimes(2);
    expect(change).toHaveBeenLastCalledWith(false);
  });
});
