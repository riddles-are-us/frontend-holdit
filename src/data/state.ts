import { createSlice } from '@reduxjs/toolkit';
import { RootState } from "../app/store";
import { getConfig, sendTransaction, queryState } from "../request"

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

}

interface UserState {
  player: PlayerInfo | null,
  state: GlobalState,
}

interface PropertiesState {
    uiState: UIState;
    activityState: ActivityState;
    userState: UserState | null;
}

const initialState: PropertiesState = {
    uiState: UIState.Init,
    activityState: ActivityState.Released,
    userState: null,
};

export const propertiesSlice = createSlice({
    name: 'properties',
    initialState,
    reducers: {
      setUIState: (state, action) => {
        state.uiState = action.payload;
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
      .addCase(getConfig.rejected, (state, action) => {
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

export const selectIsLoading = (state: RootState) => state.holdit.uiState == UIState.Loading;
export const selectUIState = (state: RootState) => state.holdit.uiState;
export const selectUserState = (state: RootState) => state.holdit.userState;

export const { setUIState } = propertiesSlice.actions;
export default propertiesSlice.reducer;
