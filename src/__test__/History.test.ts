import { PlayerHistory, MAX_GROUPING_TIME } from '../History';

it('can be instantiated', () => {
  new PlayerHistory(0);
  new PlayerHistory(1);
  const h = new PlayerHistory(10);

  expect(h.numberOfPlayers).toBe(10);
  expect(h.numberOfGroups).toBe(1);
  expect(h.numberOfCalls).toBe(0);
  expect(h.allCalls).toEqual([]);
})

it('can load existing data', () => {
  const h = new PlayerHistory(5);
  h.load([[4, 1], [2, 3], [0, 1]]);
  expect(h.numberOfPlayers).toBe(5);
  expect(h.numberOfGroups).toBe(3);
  expect(h.numberOfCalls).toBe(6);
  expect(h.allCalls).toEqual([4, 1, 2, 3, 0, 1]);
})

it('can add items', () => {
  const h = new PlayerHistory(5);
  h.add(3);
  h.add(5);
  h.add(1);
  expect(h.allCalls).toEqual([3, 0, 1]);
  expect(h.callCounts.get(0)).toBe(1);
  expect(h.callCounts.get(1)).toBe(1);
  expect(h.callCounts.get(2)).toBe(0);
  expect(h.callCounts.get(3)).toBe(1);
  expect(h.callCounts.get(4)).toBe(0);

  const x = h.add();
  expect(h.numberOfCalls).toBe(4);
  expect(h.allCalls).toEqual([3, 0, 1, x]);
})

it('can add groups', () => {
  const h = new PlayerHistory(10);
  expect(h.numberOfGroups).toBe(1);
  h.newGroup();
  h.newGroup();
  expect(h.numberOfGroups).toBe(1);
  h.add();
  h.newGroup();
  expect(h.numberOfGroups).toBe(2);
  h.newGroup();
  expect(h.numberOfGroups).toBe(2);
})

it('will automatically add groups based on time', (done) => {
  const h = new PlayerHistory(10);
  h.add();
  expect(h.numberOfGroups).toBe(1);
  setTimeout(() => {
    h.add();
    expect(h.numberOfGroups).toBe(2);
    setTimeout(() => {
      h.add();
      expect(h.numberOfGroups).toBe(2);
      done();
    }, 100);
  }, MAX_GROUPING_TIME + 100);
})

it('can format correctly', () => {
  const h = new PlayerHistory(5);
  h.add(2);
  h.add(3);
  h.newGroup();
  h.add(1);
  h.add(0);
  expect(h.formatted()).toEqual([[2, 3], [0, 1]]);
  expect(h.numberOfGroups).toBe(2);
  expect(h.numberOfCalls).toBe(4);

  expect(h.callCounts.get(0)).toBe(1);
  expect(h.callCounts.get(1)).toBe(1);
  expect(h.callCounts.get(2)).toBe(1);
  expect(h.callCounts.get(3)).toBe(1);
  expect(h.callCounts.get(4)).toBe(0);
})

it('will create new group on duplicate values', () => {
  const h = new PlayerHistory(5);
  h.add(1);
  expect(h.numberOfGroups).toBe(1);
  h.add(1);
  expect(h.numberOfGroups).toBe(2);
  expect(h.numberOfCalls).toBe(2);

  expect(h.callCounts.get(1)).toBe(2);
})

it('will distribute evenly', () => {
  const h = new PlayerHistory(10);
  for (let i = 0; i < 10; ++i) {
    h.add();
  }
  expect(h.numberOfGroups).toBe(1);
  expect(h.numberOfCalls).toBe(10);
  expect(h.allCalls.slice().sort()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
})

it('will distribute evenly into multiple groups', () => {
  const n = 5;
  const repeats = 10;
  const h = new PlayerHistory(n);
  for (let i = 0; i < n*repeats; ++i) {
    h.add();
  }
  expect(h.numberOfGroups).toBe(repeats);
  expect(h.numberOfCalls).toBe(n*repeats);

  for (let i = 0; i < n; ++i) {
    expect(h.callCounts.get(i)).toBe(repeats);
  }

  const eachGroup = [];
  const allCalls = [];
  for (let i = 0; i < n; ++i) {
    eachGroup.push(i);
    for (let j = 0; j < repeats; ++j) {
      allCalls.push(i);
    }
  }
  expect(h.allCalls.slice().sort()).toEqual(allCalls);

  const sorted = h.formatted();
  for (let group of sorted) {
    expect(group).toEqual(eachGroup);
  }
})

it('never starts a new group unless it has to', () => {
  const n = 3;
  const r = 4;
  const h = new PlayerHistory(n);
  for (let i = 0; i < 100; ++i) {
    h.clear();
    h.add(0);
    h.newGroup();
    for (let j = 0; j < n * r; ++j) {
      h.add();
    }
    expect(h.numberOfGroups).toBe(r + 1);
  }
})

it('can perform simple undo', () => {
  const h = new PlayerHistory(5);
  h.undo(); // should do nothing, but not throw an error
  expect(h.numberOfGroups).toBe(1);
  expect(h.numberOfCalls).toBe(0);
  h.add(1);
  expect(h.numberOfGroups).toBe(1);
  expect(h.numberOfCalls).toBe(1);
  h.undo();
  expect(h.numberOfGroups).toBe(1);
  expect(h.numberOfCalls).toBe(0);
  h.add(2);
  h.add(1);
  h.add(3);
  h.undo();
  expect(h.allCalls).toEqual([2, 1]);
  expect(h.formatted()).toEqual([[1, 2]]);
})

it('can undo across groups', () => {
  const h = new PlayerHistory(5);
  h.add(1);
  h.add(1);
  h.add(1);
  expect(h.numberOfGroups).toBe(3);
  h.undo();
  expect(h.numberOfGroups).toBe(3);
  expect(h.formatted().length).toBe(2);
  h.undo();
  expect(h.numberOfGroups).toBe(2);
  expect(h.formatted().length).toBe(1);
})

it('resets the time after an undo', (done) => {
  const h = new PlayerHistory(10);
  h.add();
  h.add();
  expect(h.numberOfGroups).toBe(1);
  setTimeout(() => {
    h.undo();
    expect(h.numberOfGroups).toBe(1);
    setTimeout(() => {
      h.add();
      expect(h.numberOfGroups).toBe(1);
      expect(h.numberOfCalls).toBe(2);
      done();
    }, 100);
  }, MAX_GROUPING_TIME + 100);
})

it('can be cleared', () => {
  const h = new PlayerHistory(10);
  h.add();
  h.add();
  h.add();
  h.add();
  h.clear();

  expect(h.numberOfGroups).toBe(1);
  expect(h.numberOfCalls).toBe(0);
  expect(h.allCalls).toEqual([]);
  expect(h.formatted()).toEqual([]);

  const x = h.add();
  expect(h.numberOfGroups).toBe(1);
  expect(h.numberOfCalls).toBe(1);
  expect(h.allCalls).toEqual([x]);
  expect(h.formatted()).toEqual([[x]]);
})

it('doesn\'t repeat calls immediately', () => {
  const h = new PlayerHistory(3);
  let last = -1;
  for (let i = 0; i < 100; ++i) {
    const next = h.add();
    expect(next === last).toBeFalsy();
    last = next;
  }
})

it('does allow repeat calls with only 1 player', () => {
  const h = new PlayerHistory(1);
  expect(h.add(0)).toBe(0);
  expect(h.add(0)).toBe(0);
  expect(h.add(0)).toBe(0);
  expect(h.add(0)).toBe(0);
  expect(h.add(0)).toBe(0);
})

