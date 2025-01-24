import React from "react";
import ImageButton from "./ImageButton";
import okButtonImage from "../../images/Buttons/Ok/ok.png";
import okButtonHoverImage from "../../images/Buttons/Ok/ok_hv.png";
import okButtonClickImage from "../../images/Buttons/Ok/ok_click.png";
import "./OkButton.css";

interface Props {
  onClick: () => void;
}

const OkButton = ({ onClick }: Props) => {
  return (
    <div className="ok-button-scale">
      <ImageButton
        isDisabled={false}
        defaultImagePath={okButtonImage}
        hoverImagePath={okButtonHoverImage}
        clickedImagePath={okButtonClickImage}
        disabledImagePath={okButtonClickImage}
        onClick={onClick}
      />
    </div>
  );
};

export default OkButton;
