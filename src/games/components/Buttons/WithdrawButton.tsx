import React from "react";
import ImageButton from "./ImageButton";
import withdrawButtonImage from "../../images/Buttons/Withdraw/withdraw_normal.png";
import withdrawButtonHoverImage from "../../images/Buttons/Withdraw/withdraw_hover.png";
import withdrawButtonClickImage from "../../images/Buttons/Withdraw/withdraw_click.png";
import "./WithdrawButton.css";

interface Props {
  onClick: () => void;
}

const WithdrawButton = ({ onClick }: Props) => {
  return (
    <div className="withdraw-button-scale">
      <ImageButton
        isDisabled={false}
        defaultImagePath={withdrawButtonImage}
        hoverImagePath={withdrawButtonHoverImage}
        clickedImagePath={withdrawButtonClickImage}
        disabledImagePath={withdrawButtonImage}
        onClick={onClick}
      />
    </div>
  );
};

export default WithdrawButton;
