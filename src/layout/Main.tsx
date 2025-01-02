/* eslint-disable */
import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { ConnectButton, LoginButton } from "../components/Connect";
import "./style.scss";

export function Main() {
  return (
    <>
      <ConnectButton handleRestart={()=>{return;}}></ConnectButton>
      <LoginButton handleRestart={()=>{return;}}></LoginButton>
    </>
  );
}
