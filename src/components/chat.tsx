import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from "react-dom";
import {selectL2Account} from 'zkwasm-minirollup-browser/src/reduxstate';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import { sendExtrinsicTransaction } from "../request";
import BN from "bn.js";
import {createAsyncThunk} from '@reduxjs/toolkit';
import {rpc} from 'zkwasm-minirollup-browser';
import {selectUserState} from '../data/state';
import {LeHexBN} from 'zkwasm-minirollup-rpc';
import {setUIState, selectUIState, ModalIndicator} from '../data/ui';

// Function to convert a string to a Uint64Array
function stringToUint64Array(input: string): BigUint64Array {
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(input);

    // Calculate the required length for the Uint64Array (each element is 8 bytes)
    const length = Math.ceil(uint8Array.length / 8);
    const uint64Array = new BigUint64Array(length);

    for (let i = 0; i < uint8Array.length; i++) {
        const byteIndex = i % 8;
        const elementIndex = Math.floor(i / 8);
        uint64Array[elementIndex] |= BigInt(uint8Array[i]) << BigInt(byteIndex * 8);
    }

    return uint64Array;
}

// Function to convert a Uint64Array back to a string
function uint64ArrayToString(uint64Array: BigUint64Array): string {
    const uint8Array = [];

    for (let i = 0; i < uint64Array.length; i++) {
        for (let byteIndex = 0; byteIndex < 8; byteIndex++) {
            const byteValue = Number((uint64Array[i] >> BigInt(byteIndex * 8)) & BigInt(0xff));
            if (byteValue != 0) {
                uint8Array.push(byteValue);
            }
        }
    }
    //console.log(uint8Array);

    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(uint8Array));
}

function splitIntoChunks(str: string, chunkSize: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    chunks.push(str.slice(i, i + chunkSize));
  }
  return chunks;
}

function littleEndianHexToBigint(hexString: string) {
  // Remove the '0x' prefix if it exists
  if (hexString.startsWith('0x')) {
    hexString = hexString.slice(2);
  }

  // Ensure the hex string has an even length
  if (hexString.length % 2 !== 0) {
    hexString = '0' + hexString;
  }

  // Reverse the hex string to convert it from little-endian to big-endian
  let reversedHex = '';
  for (let i = hexString.length - 2; i >= 0; i -= 2) {
    reversedHex += hexString.slice(i, i + 2);
  }

  // Create a BN instance from the big-endian hex string
  const bn = new BN(reversedHex, 16);
  return BigInt(bn.toString());
}

function bnStringToUint64Array(hex: string) {
  // 64 bit / 4 = 16 chars
  const u64hexarray = splitIntoChunks(hex, 16);
  return u64hexarray.map((x) => littleEndianHexToBigint(x));
}

interface CommentInfo {
  msg: string;
  pubkey: string;
}

function encodePID(pubkey: string) {
  const pid = new LeHexBN(pubkey).toU64Array();
  return (`0x${pid[1].toString(16)}${pid[2].toString(16)}`)
}


function decodeComments(dataArray: CommentInfo[]) {
  const msgs = dataArray.map((x) => {
    const u64array = bnStringToUint64Array(x.msg);
    return {
      pubkey: x.pubkey,
      msg: uint64ArrayToString(new BigUint64Array(u64array))
    }
  });
  return msgs;
}

export const getComments = createAsyncThunk(
  'client/getComments',
  async (_prikey: string, { rejectWithValue }) => {
    try {
      const result: any = await rpc.queryData(`comments`);
      return decodeComments(result.data);
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
)



const ChatHistoryInput = (properties: {lpanel: HTMLDivElement}) => {
  const [history, setHistory] = useState<CommentInfo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const userState = useAppSelector(selectUserState);
  const uiState = useAppSelector(selectUIState);

  const dispatch = useAppDispatch();
  const l2account = useAppSelector(selectL2Account);

  function sendComment(message: string) {
          dispatch(sendExtrinsicTransaction({cmd: stringToUint64Array(message), prikey: l2account!.getPrivateKey()}))
          .then((action) => {
              if (sendExtrinsicTransaction.fulfilled.match(action)) {
                  const dataArray: CommentInfo[] = action.payload.data;
                  const msgs = decodeComments(dataArray);
                  setHistory(msgs);
              }
          });
          setInputValue("");
  }

  function queryComment() {
          dispatch(getComments(l2account!.getPrivateKey()))
          .then((action) => {
              if (getComments.fulfilled.match(action)) {
                  const msgs: CommentInfo[] = action.payload;
                  setHistory(msgs);
              }
          });
  }


  function onSubmit() {
    if(userState?.player) {
      sendComment(inputValue);
    }
  }


  useEffect(() => {
    if(uiState.modal == ModalIndicator.CHAT && userState?.player) {
      queryComment();
    }
  }, [userState]);

  function switchToChatPanel() {
    dispatch(setUIState({modal: ModalIndicator.CHAT}));
  }

  return (
    <div className="input-field">
       {uiState.modal == ModalIndicator.CHAT &&
       ReactDOM.createPortal(
       (<div className="comment-field">
          <h4>Live Chat:</h4>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {history.map((item, index) => (
               <li key={index} style={{ margin: '5px 0' }}>{encodePID(item.pubkey)}: {item.msg}</li>
            ))}
          </ul>
        </div>
      ),
      properties.lpanel
      )}

      <input
        id = "comment-message"
        type="text"
        value={inputValue}
        placeholder="Say something..."
        onFocus={() => switchToChatPanel()}
        //onBlur={() => setIsFocused(false)}
        onChange = {(e) => setInputValue(e.target.value)}
      />
      <button onClick={onSubmit} style={{fontSize: '16px', cursor: 'pointer' }}></button>
    </div>
  );
};

export default ChatHistoryInput;

