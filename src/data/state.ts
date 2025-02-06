import { RootState } from "../app/store";
import { createStateSlice, PropertiesState, ConnectState } from "zkwasm-minirollup-browser";

export interface PlayerInfo {
  nonce: number,
  data: {
    balance: number,
    lastBet: number,
    lastBetRound: number,
  }
}

export interface GlobalState {
  counter: number,
  currentRound: number,
  prepare: number,
  ratio: number,
  players: any,
}

const initialState: PropertiesState<PlayerInfo, GlobalState, any> = {
    connectState: ConnectState.Init,
    userState: null,
    lastError: null,
    config: null,
};

export const propertiesSlice = createStateSlice(initialState);

export const selectConnectState = (state: RootState) => state.holdit.connectState;
export const selectUserState = (state: RootState) => state.holdit.userState;

export const { setConnectState } = propertiesSlice.actions;
export default propertiesSlice.reducer;
