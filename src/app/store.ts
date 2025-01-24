import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { AccountSliceReducer } from 'zkwasm-minirollup-browser';
import endpointReducer from "../data/endpoint";
import holditReducer from "../data/holdit/holdit";

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['acccount/deriveL2Account/fulfilled', 'meta.arg.l2account'],
        ignoredActionPaths: ['payload.web3','payload.seed', 'payload.injector', 'meta.arg.cmd', 'meta.arg.l2account'],
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
    holdit: holditReducer,
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
