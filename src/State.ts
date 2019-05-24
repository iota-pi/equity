import { PlayerHistory } from './History'

export default interface State {
  players: number,
  history: PlayerHistory,
  names: string[],
  dontConfirmClear: number,
  dialog: boolean,
  drawer: boolean,
  showNames: boolean,
  showCounts: boolean,
};
