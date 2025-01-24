import React, { useState } from "react";
import background from "../../images/backgrounds/withdraw_frame.png";
import OkButton from "../Buttons/OkButton";
import { UIState, setUIState } from "../../../data/holdit/properties";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./ConfirmPopup.css";
import { ConfirmPopupInfo } from "../../../data/holdit/models";

interface Props {
  confirmPopupInfo: ConfirmPopupInfo;
}

const ConfirmPopup = ({ confirmPopupInfo }: Props) => {
  const dispatch = useAppDispatch();

  const onClickConfirm = () => {
    dispatch(setUIState(UIState.Idle));
  };

  return (
    <div className="confirm-popup-container">
      <div onClick={onClickConfirm} className="confirm-popup-mask" />
      <div className="confirm-popup-main-container">
        <img src={background} className="confirm-popup-main-background" />
        <p
          className={
            confirmPopupInfo.isError
              ? "confirm-popup-title-text-red"
              : "confirm-popup-title-text-green"
          }
        >
          {confirmPopupInfo.title}
        </p>
        <p className="confirm-popup-description-text">
          {confirmPopupInfo.description}
        </p>
        <div className="confirm-popup-ok-button">
          <OkButton onClick={onClickConfirm} />
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
