import React, { useEffect } from "react";
import "./style.scss";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loginL1AccountAsync, selectL1Account, loginL2AccountAsync, selectL2Account } from "../data/accountSlice";
interface IProps {
  handleRestart: () => void;
}

export function ConnectButton(props: IProps) {
  const dispatch = useAppDispatch();
  function connect() {
    dispatch(loginL1AccountAsync());
  }

  return (
    <div onClick={connect}>connect</div>
  );
}

export function LoginButton(props: IProps) {
  const dispatch = useAppDispatch();
  const l1account = useAppSelector(selectL1Account);
  function login() {
    if (l1account) {
        dispatch(loginL2AccountAsync(l1account!));
    }
  }

  return (
    <div onClick={login}>login</div>
  );
}
