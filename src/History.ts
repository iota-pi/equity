export const MAX_GROUPING_TIME = 1200;
type NumberGroup = number[];

export class History {
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

  sorted () {
    const numberSort = (a: number, b: number) => +(a > b) - +(a < b);
    return this.data.map((group) => group.slice().sort(numberSort));
  }

  private randomPlayer () {
    const counts = this.callCounts;
    const fewestCalls = Math.min(...Array.from(counts.values()))
    let x = 0;
    let i = 0;

    // Avoid calling the same number twice in a row if possible
    let avoidCall = this.allCalls[this.numberOfCalls - 1];
    if (this.players <= 1) {
      avoidCall = -1;
    }

    do {
      x = Math.floor(Math.random() * this.players);
    } while ((counts.get(x) !== fewestCalls || x === avoidCall) && (++i < this.players * 100));

    return x;
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
