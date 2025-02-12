import React, { useEffect, useRef, useState } from 'react';
import {selectL2Account} from 'zkwasm-minirollup-browser/src/reduxstate';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {sendTransaction } from "../request";
import {selectUserState} from '../data/state';
import {createCommand, LeHexBN} from 'zkwasm-minirollup-rpc';
import {setUIState, selectUIState, ModalIndicator} from '../data/ui';

const CMD_BET_AND_HOLD = 2n;
const CMD_CHECKOUT = 3n;

const BetButton = () => {
  const [inputValue, setInputValue] = useState("");
  const userState = useAppSelector(selectUserState);
  const dispatch = useAppDispatch();
  const l2account = useAppSelector(selectL2Account);

  function place() {
      const command = createCommand(0n, CMD_BET_AND_HOLD, [BigInt(inputValue)]);
      dispatch(sendTransaction({
        cmd: command,
        prikey: l2account!.getPrivateKey()
      }));
  }

  function checkout() {
      const command = createCommand(0n, CMD_CHECKOUT, []);
      dispatch(sendTransaction({
        cmd: command,
        prikey: l2account!.getPrivateKey()
      }));
  }

  function inPreparation(): boolean {
      if (userState?.state?.prepare != undefined) {
          return (userState?.state.prepare > 0);
      } else {
          return false;
      }

  }

  function notBet(): boolean {
      if (userState?.player != undefined) {
          return (userState?.player.data.lastBetRound <= userState?.state.currentRound);
      } else {
          return false;
      }
  }

  function bet(): boolean {
      if (userState?.player != undefined) {
          return ((userState?.player.data.lastBetRound > userState?.state.currentRound && inPreparation())
              || (userState?.player.data.lastBetRound == userState?.state.currentRound && !inPreparation()))
      } else {
          return false;
      }
  }

  return (
    <>
      {notBet() && inPreparation() &&
      <div className="bet-btn">
         <input id="place-bet"
          placeholder="Amount of token you want to place ..."
          value={inputValue}
          onChange = {(e) => setInputValue(e.target.value)}
         >
         </input>
         <div onClick = {place}> join and hold</div>
      </div>
      }
      {bet() && !inPreparation() &&
         <div className="hold-btn-checkout" onClick={checkout}>
              <div className="number">{userState!.player!.data.lastBet * userState!.state!.ratio / 100}</div>
              <div className="button" onClick = {checkout}> </div>
         </div>
      }
      {bet() && inPreparation() &&
         <div className="hold-btn-wait">
              <div className="number">{userState?.player?.data.lastBet}</div>
              <div className="button"> </div>
         </div>
      }
      {!bet() && !inPreparation() &&
      <div className="audience-mode"> Audience Mode </div>
      }
    </>
  );
};

export default BetButton;

