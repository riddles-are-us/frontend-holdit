import React from "react";
import { useAppSelector } from "../../app/hooks";
import WithdrawPopup from "./Popups/WithdrawPopup";
import ConfirmPopup from "./Popups/ConfirmPopup";
import {
  UIState,
  selectUIState,
  selectConfirmPopupInfo
} from "../../data/holdit/properties";
import "./Popups.css";

const Popups = () => {
  const uiState = useAppSelector(selectUIState);
  const showWithdrawPopup =
  uiState == UIState.WithdrawPopup || uiState == UIState.WithdrawPopupLoading;
  const showDepositPopup =
  uiState == UIState.DepositPopup || uiState == UIState.DepositPopupLoading;
  const showConfirmPopup = uiState == UIState.ConfirmPopup;
  const confirmPopupInfo = useAppSelector(selectConfirmPopupInfo);

  return (
    <>
      {showWithdrawPopup && <WithdrawPopup isWithdraw={true} />}
      {showDepositPopup && <WithdrawPopup isWithdraw={false} />}
      {showConfirmPopup && <ConfirmPopup confirmPopupInfo={confirmPopupInfo} />}
    </>
  );
};

export default Popups;
