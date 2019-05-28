import React from 'react';
import TopDrawer from '../TopDrawer';
import { PlayerHistory } from '../../History';
import { shallow, mount, render } from 'enzyme';

describe('<TopDrawer/>', () => {
  const fn = jest.fn();
  const h = new PlayerHistory(4);
  const props = {
    open: true,
    showNames: true,
    showCounts: false,
    updateSW: false,
    players: 3,
    history: h,
    names: ['13508', 'alkjgd', ''],
    dontConfirmClear: 0,
    drawer: true,
    dialog: false,
    onClose: fn,
    onClear: fn,
    onClearNames: fn,
    onNameChange: fn,
    onCallClick: fn,
  }

  it('renders consistently', () => {
    const wrapper = mount(
      <TopDrawer {...props}/>
    );
    expect(wrapper).toMatchSnapshot();
    const wrapper2 = mount(
      <TopDrawer {...props} showNames={false} />
    );
    expect(wrapper2).toMatchSnapshot();
  });
});
