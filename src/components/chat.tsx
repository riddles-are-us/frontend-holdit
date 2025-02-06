import React, { useEffect, useRef, useState } from 'react';
import {selectL2Account} from 'zkwasm-minirollup-browser/src/reduxstate';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import { sendExtrinsicTransaction } from "../request";
import BN from "bn.js";
import {createAsyncThunk} from '@reduxjs/toolkit';
import {rpc} from 'zkwasm-minirollup-browser';
import {selectUserState} from '../data/state';


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

function decodeComments(dataArray: string[]) {
  const msgs = dataArray.map((x) => {
    const u64array = bnStringToUint64Array(x);
    return uint64ArrayToString(new BigUint64Array(u64array))
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



const ChatHistoryInput = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const userState = useAppSelector(selectUserState);

  const dispatch = useAppDispatch();
  const l2account = useAppSelector(selectL2Account);

  function sendComment(message: string) {
          setIsFocused(true);
          dispatch(sendExtrinsicTransaction({cmd: stringToUint64Array(message), prikey: l2account!.getPrivateKey()}))
          .then((action) => {
              if (sendExtrinsicTransaction.fulfilled.match(action)) {
                  const dataArray: string[] = action.payload.data;
                  const msgs = dataArray.map((x) => {
                    const u64array = bnStringToUint64Array(x);
                    return uint64ArrayToString(new BigUint64Array(u64array))
                  });
                  setHistory(msgs);
              }
          });
          setInputValue("");
  }

  function queryComment() {
          dispatch(getComments(l2account!.getPrivateKey()))
          .then((action) => {
              if (getComments.fulfilled.match(action)) {
                  const msgs: string[] = action.payload;
                  setHistory(msgs);
              }
          });
          setInputValue("");
  }


  function onSubmit(){
    sendComment(inputValue);
  }

  useEffect(() => {
    if(isFocused) {
      queryComment();
    }
  }, [userState]);

  return (
    <div id="chat-history">
      {isFocused && (
              <div style={{textAlign: "left", background: '#f8f8f8', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <strong>Chat History:</strong>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {history.map((item, index) => (
              <li key={index} style={{ margin: '5px 0' }}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <input
        id = "comment-message"
        type="text"
        value={inputValue}
        placeholder="Say something..."
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{ padding: '10px', width: '100%', fontSize: '16px' }}
        onChange = {(e) => setInputValue(e.target.value)}
      />
      <button onClick={onSubmit} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>Submit</button>
      </div>
    </div>
  );
};

export default ChatHistoryInput;

