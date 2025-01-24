import { AccountSlice } from "zkwasm-minirollup-browser";
import {
  ZKWasmAppRpc,
  createCommand,
  createWithdrawCommand,
} from "zkwasm-minirollup-rpc";

// Get the current URL components
const currentLocation = window.location;
const protocol = currentLocation.protocol; // e.g., 'http:' or 'https:'
const hostname = currentLocation.hostname; // e.g., 'sinka' or 'localhost'

const fullUrl = `${protocol}//${hostname}` + ":3000";
const rpc = new ZKWasmAppRpc(fullUrl);

export async function queryConfig() {
  try {
    const state = await rpc.query_config();
    return state;
  } catch (error) {
    throw "QueryStateError " + error;
  }
}

export async function send_transaction(cmd: BigUint64Array, prikey: string) {
  try {
    const state = await rpc.sendTransaction(cmd, prikey);
    return state;
  } catch (error) {
    throw "SendTransactionError " + error;
  }
}

export async function query_state(prikey: string) {
  try {
    const state = await rpc.queryState(prikey);
    return state;
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

const CMD_INSTALL_PLAYER = 1n;
const CMD_BET_AND_HOLD = 2n;
const CMD_CHECKOUT = 3n;
const CMD_WITHDRAW = 5n;
const CMD_DEPOSIT = 6n;

export function getInsPlayerTransactionCommandArray(nonce: bigint): BigUint64Array {
  const command = createCommand(nonce, CMD_INSTALL_PLAYER, []);
  return command;
}

export function getWithdrawTransactionCommandArray(
  nonce: bigint,
  amount: bigint,
  account: AccountSlice.L1AccountInfo
): BigUint64Array {
  const address = account!.address.slice(2);
  const command = createWithdrawCommand(
    nonce,
    CMD_WITHDRAW,
    address,
    0n,
    amount
  );
  return command;
}