export const MAX_GROUPING_TIME = 1200;
type NumberGroup = number[];

export class PlayerHistory {
  private data: NumberGroup[];
  private players: number;
  private lastEdit: number;

  constructor (players: number) {
    this.data = [[]];
    this.players = players;
    this.lastEdit = 0;
  }

  get numberOfGroups () {
    return this.data.length;
  }

  get numberOfCalls () {
    return this.data.reduce((sum: number, group: NumberGroup) => sum + group.length, 0);
  }

  get allCalls () {
    return this.data.reduce((calls: number[], group: NumberGroup) => calls.concat(group), []);
  }

  get callCounts (): Map<number, number> {
    const counts = new Map();
    for (let i = 0; i < this.players; ++i) {
      counts.set(i, 0);
    }

    for (let group of this.data) {
      for (let x of group) {
        counts.set(x, counts.get(x) + 1);
      }
    }

    return counts;
  }

  get numberOfPlayers () {
    return this.players;
  }

  get rawData () {
    return this.data;
  }

  add (x?: number) {
    // Get random value for x, or ensure it is in appropriate range (0 <= x < players)
    x = x === undefined ? this.randomPlayer() : Math.abs(Math.floor(x)) % this.players;

    // Start a new group if current group is not empty and enough time has elapsed
    if (this.timeElapsed > MAX_GROUPING_TIME) {
      this.newGroup();
    }

    // Start a new group if this value already exists in the current group
    if (this.lastGroup.includes(x)) {
      this.newGroup();
    }

    this.lastGroup.push(x);
    this.setTime();

    return x;
  }

  newGroup () {
    // Only create a new group if current last group is not empty
    if (this.lastGroup.length > 0) {
      this.data.push([]);
    }
  }

  undo () {
    if (this.lastGroup.length > 0) {
      this.lastGroup.pop();
    } else if (this.numberOfGroups > 1) {
      this.data.pop();
      this.lastGroup.pop();
    }
    this.setTime();
  }

  clear () {
    this.data = [[]];
    this.lastEdit = 0;
  }

  formatted () {
    const numberSort = (a: number, b: number) => +(a > b) - +(a < b);
    const formatted = this.data.map((group) => group.slice().sort(numberSort));
    return formatted.filter(group => group.length > 0);
  }

  load (data: NumberGroup[]) {
    this.data = data;
    return this;
  }

  private randomPlayer () {
    const counts = this.callCounts;
    const smallestCount = Math.min(...Array.from(counts.values()))

    // Get list of possible choices
    let choices = (new Array(this.players)).fill(0).map((_, i) => i);

    // Only pick one of the least called players
    choices = choices.filter(player => counts.get(player) === smallestCount);

    // Try to avoid picking one that's already been chosen in this group
    const notInGroup = choices.filter(player => !this.lastGroup.includes(player));
    if (notInGroup.length > 0) {
      choices = notInGroup;
    }

    // If there are still multiple options, don't call the same player as last time
    if (choices.length > 1) {
      const avoidCall = this.allCalls[this.numberOfCalls - 1];
      choices = choices.filter((player => player !== avoidCall));
    }

    const p = choices[Math.floor(Math.random() * choices.length)];

    return p;
  }

  private setTime () {
    this.lastEdit = (new Date()).getTime();
  }

  private get timeElapsed () {
    const now = (new Date()).getTime();
    return now - this.lastEdit;
  }

  private get lastGroup () {
    return this.data[this.data.length - 1];
  }
}
