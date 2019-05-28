import React from 'react';
import UpdatePrompt from '../UpdatePrompt';
import { shallow, mount, render } from 'enzyme';

describe('<UpdatePrompt/>', () => {
  it('renders consistently', () => {
    const fn = jest.fn();
    const wrapper = mount(<UpdatePrompt show={true} onClose={fn} />);
    expect(wrapper).toMatchSnapshot();
  });
});
