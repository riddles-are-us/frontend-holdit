import { createSlice } from '@reduxjs/toolkit';
import { RootState } from "../../app/store";
import { getConfig, sendTransaction, queryState } from "../../games/request"
import { ConfirmPopupInfo, ResourceAmountPair, emptyConfirmPopupInfo } from "./models"

export enum UIState{
  Init,
  Idle,
  Loading,
  InstallPlayer,
  QueryState,
  ConnectingError,
  WaitingTxReply,
  CollectingTxInfo,
  CollectingDepositInfo,
  WaitingDepositReply,
  WithdrawPopup,
  WithdrawPopupLoading,
  DepositPopup,
  DepositPopupLoading,
  ConfirmPopup,
  QueryConfig,
}

export enum ActivityState {
  Hold,
  Released
}

interface PlayerInfo {
  nonce: number,
  data: {
    balance: number,
    lastBet: number,
    lastBetRound: number,
  }
}

interface GlobalState {
  counter: number,
  currentRound: number,
  prepare: number,
  ratio: number,
  players: any,
}

interface UserState {
  player: PlayerInfo | null,
  state: GlobalState,
}

interface PropertiesState {
    uiState: UIState;
    activityState: ActivityState;
    userState: UserState | null;
    nonce: string;
    confirmPopupInfo: ConfirmPopupInfo;
}

const initialState: PropertiesState = {
    uiState: UIState.Init,
    activityState: ActivityState.Released,
    userState: null,
    nonce: "0",
    confirmPopupInfo: emptyConfirmPopupInfo,
};

export const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setUIState: (state, action) => {
      state.uiState = action.payload;
    },
    setConfirmPopupInfo: (state, action) => {
      state.confirmPopupInfo = action.payload;
    },
    setActivityState: (state, action) => {
      state.activityState = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConfig.fulfilled, (state, action) => {
        state.uiState = UIState.QueryState;
        console.log("query config fulfilled");
      })
      .addCase(getConfig.rejected, (_, action) => {
        console.log(`query config rejected: ${action.payload}`);
      })
      .addCase(sendTransaction.fulfilled, (state, action) => {
        const loadedState = action.payload.state;
        const loadedPlayer = action.payload.player;
        state.userState = {
          player: null,
          state: {
            counter: loadedState.counter,
            currentRound: loadedState.currentRound,
            prepare: loadedState.prepare,
            ratio: loadedState.ratio,
            players: [],
          }
        }
        if(loadedPlayer != null) {
          state.userState.player = loadedPlayer;
          state.uiState = UIState.Idle;
        } else {
          state.uiState = UIState.InstallPlayer;
        }
      })
      .addCase(sendTransaction.rejected, (state, action) => {
        console.log(`send transaction rejected: ${action.payload}`);
      })
      .addCase(queryState.fulfilled, (state, action) => {
        const loadedState = action.payload.state;
        const loadedPlayer = action.payload.player;
        state.userState = {
          player: null,
          state: {
            counter: loadedState.counter,
            currentRound: loadedState.currentRound,
            prepare: loadedState.prepare,
            ratio: loadedState.ratio,
            players: loadedState.players,
          }
        }
        if(loadedPlayer != null) {
          state.userState.player = loadedPlayer;
          state.uiState = UIState.Idle;
        } else {
          state.uiState = UIState.InstallPlayer;
        }
        console.log("query state fulfilled");
      })
      .addCase(queryState.rejected, (state, action) => {
        state.uiState = UIState.ConnectingError;
        console.log(`query state rejected: ${action.payload}`);
      });
    }
});

export const selectIsLoading = (state: RootState) => state.holdit.properties.uiState == UIState.Loading;
export const selectUserState = (state: RootState) => state.holdit.properties.userState;
export const selectUIState = (state: RootState) => state.holdit.properties.uiState;
export const selectNonce = (state: RootState) => BigInt(state.holdit.properties.nonce);
export const selectConfirmPopupInfo = (state: RootState) => state.holdit.properties.confirmPopupInfo;

export const { setUIState, setConfirmPopupInfo } = propertiesSlice.actions;
export default propertiesSlice.reducer;