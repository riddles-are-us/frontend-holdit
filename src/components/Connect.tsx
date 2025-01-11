import React, { useEffect } from "react";
import "./style.scss";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {AccountSlice} from "zkwasm-minirollup-browser";
import {
    MDBBtn,
} from 'mdb-react-ui-kit';
interface IProps {
  handleRestart: () => void;
}

export function ConnectButton(props: IProps) {
  const dispatch = useAppDispatch();
  function connect() {
    alert("connect");
    dispatch(AccountSlice.loginL1AccountAsync());
  }
  return (
    <MDBBtn onClick={connect}>connect </MDBBtn>
  );
}

export function LoginButton(props: IProps) {
  const dispatch = useAppDispatch();
  const l1account = useAppSelector(AccountSlice.selectL1Account);
  function login() {
    if (l1account) {
        dispatch(AccountSlice.loginL2AccountAsync(l1account!));
    }
  }

  return (
    <MDBBtn onClick={login}>login</MDBBtn>
  );
}
