/* eslint-disable */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./style.scss";
import {Container, Row, Col, Button} from "react-bootstrap";
import Footer from "../components/Foot";
import Nav from "../components/Nav";
import Banner from "../components/Banner";
import { selectUIState, selectUserState, UIState} from "../data/state";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { AccountSlice } from "zkwasm-minirollup-browser";
import { queryState, sendTransaction } from "../request";
import { createCommand } from "zkwasm-minirollup-rpc";

const CMD_INSTALL_PLAYER = 1n;
const CMD_BET_AND_HOLD = 2n;
const CMD_CHECKOUT = 3n;
const CMD_WITHDRAW = 5n;
const CMD_DEPOSIT = 6n;

export function Main() {
  const uiState = useAppSelector(selectUIState);
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const userState = useAppSelector(selectUserState);
  const dispatch = useAppDispatch()
  const [inc, setInc] = useState(0);

  function updateState() {
    if (uiState == UIState.Idle) {
      dispatch(queryState(l2account!.address));
    }
    setInc(inc + 1);
  }
 
  useEffect(() => {
    if (l2account && uiState == UIState.Init) {
      dispatch(queryState(l2account!.address));
    }
  }, [l2account]);

  useEffect(() => {
    setTimeout(() => {
      updateState();
    }, 3000);
  }, [inc]);


  useEffect(() => {
    if (uiState == UIState.InstallPlayer) {
      const command = createCommand(0n, CMD_INSTALL_PLAYER, []);
      dispatch(sendTransaction({
        cmd: command,
        prikey: l2account!.address
      }));
    }
  }, [uiState]);

  function place() {
      const command = createCommand(0n, CMD_BET_AND_HOLD, [100n]);
      dispatch(sendTransaction({
        cmd: command,
        prikey: l2account!.address
      }));
  }

  function checkout() {
      const command = createCommand(0n, CMD_CHECKOUT, []);
      dispatch(sendTransaction({
        cmd: command,
        prikey: l2account!.address
      }));
  }

  return (
    <>
      <Nav/>
      <p>
      {uiState}
      </p>
      <div>
      <li>player nonce: {userState?.player?.nonce}</li>
      <li>player balance: {userState?.player?.data.balance}</li>
      <li>player lastBet: {userState?.player?.data.lastBet}</li>
      <li>player lastBetRound: {userState?.player?.data.lastBetRound}</li>
      <li>current round: {userState?.state?.currentRound}</li>
      <li>current ratio: {userState?.state?.ratio}</li>
      <li>prepare: {userState?.state?.prepare}</li>
      <li>counter: {userState?.state?.counter}</li>
      </div>

      <Button onClick={place}>place</Button>
      <Button onClick={checkout}>checkout</Button>

      <div>{userState?.state?.players?.length} players has entered the arena </div>
      <>
      {userState?.state?.players.map((x:any) => 
        <div>{x.pid}</div>
      )}
      </>

    </>
  );
}
