import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {RequestError, rpc} from 'zkwasm-minirollup-browser';
import {LeHexBN, query} from 'zkwasm-minirollup-rpc';
import {RootState} from '../app/store';

async function queryHistoryI(prikey: string) {
  try {
    const pubkey = new LeHexBN(query(prikey).pkx).toU64Array();
    console.log(pubkey);
    const data: any = await rpc.queryData(`history/${pubkey[1]}/${pubkey[2]}`)
    return data.data.map((x:any) => {
      const data = x.data.split(",");
      return {
        round: x.object_index,
        bet: data[0],
        checkout: data[1],
      }
    });
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 500) {
        throw "QueryStateError";
      } else {
        throw "UnknownError";
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      throw "No response was received from the server, please check your network connection.";
    } else {
      throw "UnknownError";
    }
  }
}



export const getHistory= createAsyncThunk(
  'client/getHistory',
  async (prikey: string, { rejectWithValue }) => {
    try {
      const res: any = await queryHistoryI(prikey);
      return res;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
)

/*
export interface RequestError {
  errorInfo: string,
  payload: any,
}
*/

interface HistoryState {
  round: number,
  bet: number,
  checkout: number,
}

export interface PropertiesState {
    history: HistoryState[];
    lastError: RequestError | null,
}

const initialState: PropertiesState = {
  history: [],
  lastError: null,
}

const historySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(getHistory.rejected, (state, action) => {
        state.lastError = {
          errorInfo:`send transaction rejected: ${action.payload}`,
          payload: action.payload,
        }
      })
  }
});

export const selectHistory = (state: RootState) => state.history.history;
export default historySlice.reducer;
