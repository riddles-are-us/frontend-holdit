import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { AccountSliceReducer } from 'zkwasm-minirollup-browser';
import endpointReducer from "../data/endpoint";
export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['acccount/deriveL2Account/fulfilled'],
        ignoredActionPaths: ['payload.web3','payload.seed', 'payload.injector'],
        ignoredPaths: [
          "acccount/fetchAccount/fulfilled",
          "account.l1Account.web3",
          "endpoint.zkWasmServiceHelper",
          "account.l2account"
        ],
      },
    }),
  reducer: {
    account: AccountSliceReducer,
    endpoint: endpointReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
