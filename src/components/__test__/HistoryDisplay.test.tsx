import React from 'react';
import HistoryDisplay from '../HistoryDisplay';
import { shallow, mount, render } from 'enzyme';
import { PlayerHistory } from '../../History';

describe('<HistoryDisplay/>', () => {
  it('renders base state consistently', () => {
    const h = new PlayerHistory(4);
    const wrapper = render(
      <HistoryDisplay
        history={h}
        names={['', '', '', '']}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders basic history consistently', () => {
    const h = new PlayerHistory(4);
    h.add(1);
    h.add(2);
    h.newGroup();
    h.add(0);
    h.add(0);
    h.newGroup();
    h.add(3);
    const wrapper = render(
      <HistoryDisplay
        history={h}
        names={['', '', '', '']}
      />
    );
    expect(wrapper).toMatchSnapshot();
  })
});
