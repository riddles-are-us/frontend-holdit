/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./style.scss";
import { selectConnectState, selectUserState} from "../data/state";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { AccountSlice, ConnectState } from "zkwasm-minirollup-browser";
import { queryInitialState, queryState, sendTransaction } from "../request";
import { createCommand } from "zkwasm-minirollup-rpc";
import SquareCanvas from "./../components/canvas";
import ChatHistoryInput from "../components/chat";
import Event from "../components/event";
import BetHistory from "../components/BetHistory";
import Overview from "../components/Overview";
import { stage }  from "../components/canvas";
import {SpanButton} from "../components/Ratio";

import padLeft from "../images/ratio/frame_left.png";
import padRight from "../images/ratio/frame_right.png";
import padMid from "../images/ratio/frame_middle.png";
import {selectUIState} from "../data/ui";
import {Menu} from "../components/Menu";
import LeftPanel from "../components/LeftPanel";
import { WithdrawModal } from "tx-modal-kit";
import { ModalIndicator } from "../data/ui";
import {createWithdrawCommand} from "zkwasm-minirollup-rpc";

const padLeftImage = new Image();
padLeftImage.src = padLeft;

const padRightImage = new Image();
padRightImage.src = padRight;

const padMidImage = new Image();
padMidImage.src = padMid;

const CMD_INSTALL_PLAYER = 1n;
const CMD_BET_AND_HOLD = 2n;
const CMD_CHECKOUT = 3n;
const CMD_WITHDRAW = 5n;

export function Main() {
  const connectState = useAppSelector(selectConnectState);
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const l1account = useAppSelector(AccountSlice.selectL1Account);
  const userState = useAppSelector(selectUserState);
  const uiState = useAppSelector(selectUIState);
  const dispatch = useAppDispatch();
  const [inc, setInc] = useState(0);
  const lpanel = useRef<HTMLDivElement | null>(null);

  function updateState() {
    if (connectState == ConnectState.Idle) {
      dispatch(queryState(l2account!.getPrivateKey()));
    } else if (connectState == ConnectState.Init) {
      dispatch(queryInitialState("1"));
    }
    setInc(inc + 1);
  }

  useEffect(() => {
    if (l2account && connectState == ConnectState.Init) {
      dispatch(queryState(l2account!.getPrivateKey()));
    } else {
      dispatch(queryInitialState("1"));
    }
  }, [l2account]);

  useEffect(() => {
    setTimeout(() => {
      updateState();
    }, 3000);
  }, [inc]);


  useEffect(() => {
    if (connectState == ConnectState.InstallPlayer) {
      const command = createCommand(0n, CMD_INSTALL_PLAYER, []);
      dispatch(sendTransaction({
        cmd: command,
        prikey: l2account!.getPrivateKey()
      }));
    }
  }, [connectState]);

  function place() {
      const command = createCommand(0n, CMD_BET_AND_HOLD, [100n]);
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

  const useTransactionModal = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
      if (uiState.modal === ModalIndicator.WITHDRAW || uiState.modal === ModalIndicator.DEPOSIT) {
        setShow(true);
      } else {
        setShow(false);
      }
    }, [uiState.modal]);

    return show;
  };

  const showTransactionModal = useTransactionModal();

  function getWithdrawTransactionCommandArray(
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

  const withdraw = async (amount: number) => {
    if(!l1account) {
      throw new Error("You have not yet obtained a mainchain account (Layer 1 account).");
    }

    if(!l2account) {
      throw new Error("You have not yet obtained a sidechain account (Layer 2 account).");
    }

    const action = await dispatch(
      sendTransaction({
        cmd: getWithdrawTransactionCommandArray(
          BigInt(userState?.player?.nonce || 0),
          BigInt(amount),
          l1account!
        ),
        prikey: l2account!.getPrivateKey(),
      })
    )

    if (sendTransaction.fulfilled.match(action)) {
      const current_balance = action.payload.player.data.balance;
      //setShowResult(true);
      //setInfoMessage("Withdraw Success: current balance is " +  current_balance);
      //closeModal();
    } else if(sendTransaction.rejected.match(action)) {
      throw Error("Withdraw Error: " +  action.payload);
    }
  };

  const deposit = async (amount: string) => {
    try {
      if(!l1account) {
        throw new Error("You have not yet obtained a mainchain account (Layer 1 account).");
      }

      if(!l2account) {
        throw new Error("You have not yet obtained a sidechain account (Layer 2 account).");
      }

      const action = await dispatch(
        AccountSlice.depositAsync({
          tokenIndex: 0,
          amount: Number(BigInt(amount)),
          l2account: l2account!,
          l1account: l1account!,
        })
      );

      if (AccountSlice.depositAsync.fulfilled.match(action)) {
        //'setInfoMessage("Deposit Success: " +  action.payload!.hash);
        //setShowResult(true);
        //closeModal();
      } else if (AccountSlice.depositAsync.rejected.match(action)) {
        if (action.error.message == null) {
          throw new Error("Deposit Failed: Unknown Error");
        } else if (action.error.message.startsWith("user rejected action")) {
          throw new Error("Deposit Failed: User rejected action");
        } else {
          throw new Error("Deposit Failed: " + action.error.message);
        }
      }
    } catch (error: any) {
      throw new Error("Deposit1 Failed: " + error);
    }
  };

  return (
    <>
      <div id="right-panel">
        <div className='stage'>
        </div>

        <SquareCanvas stage={stage}></SquareCanvas>
        {userState?.state?.prepare == 0 &&
          <div className='banner'>
              <SpanButton className="automargin" padWidth={61} height={74} leftPadImage={padLeftImage.src} rightPadImage={padRightImage.src} midPadImage={padMidImage.src} midWidth={288}>
                  <div className="automargin"> x {userState?.state?.ratio / 100}</div>
              </SpanButton>
          </div>
        }
        {userState?.state?.prepare != 0 && userState?.state?.ratio !=0 &&
          <div className="banner">
              <SpanButton className="automargin" padWidth={61} height={74} leftPadImage={padLeftImage.src} rightPadImage={padRightImage.src} midPadImage={padMidImage.src} midWidth={388}>
                  <div className="automargin">round {userState?.state?.currentRound} start in {userState?.state?.prepare}s</div>
          </SpanButton>
          </div>
        }
        {userState?.state?.ratio ==0 &&
          <div className="banner">
            <SpanButton className="automargin" padWidth={61} height={74} leftPadImage={padLeftImage.src} rightPadImage={padRightImage.src} midPadImage={padMidImage.src} midWidth={288}>
              <div className="automargin">round {userState?.state?.currentRound} bursted</div>
            </SpanButton>
          </div>
        }

        <div className="control">
        </div>
        {userState?.state?.ratio == 0 &&
          <div className='explode'>
          </div>
        }
        <Menu handleRestart={()=>{return}}></Menu>
        {lpanel.current && userState?.player &&
          <BetHistory lpanel={lpanel.current}></BetHistory>
        }

      </div>

      {notBet() && inPreparation() &&
      <div onClick = {place} className="hold-btn">
      join and hold
      </div>
      }
      {bet() &&
      <div className="hold-btn">
          {!inPreparation() &&
              <div onClick = {checkout}> release your {userState?.player?.data.lastBet} bet  </div>
          }
          {inPreparation() &&
              <div onClick = {checkout}> you have placed {userState?.player?.data.lastBet} </div>
          }
      </div>
      }
      {!bet() && !inPreparation() &&
      <div className="hold-btn"> Audience Mode </div>
      }
      <LeftPanel ref = {lpanel}></LeftPanel>


      {lpanel.current &&
        <>
          <ChatHistoryInput lpanel={lpanel.current}></ChatHistoryInput>
          <WithdrawModal
            withdraw={withdraw}
            deposit={deposit}
            show={showTransactionModal}
            lpanel={lpanel.current}
            uiStateModal={uiState.modal}
            ModalIndicator={ModalIndicator}
            balance={userState?.player?.data.balance || 0}
          />
          <Overview lpanel={lpanel.current}></Overview>
        </>
      }
      {userState?.state &&
      <Event></Event>
      }
    </>
  );
}
