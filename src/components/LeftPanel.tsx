import React, { ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react';
import {VerticalSpanButton} from './VertialSpanButton';
import {selectUIState, setUIState} from "../data/ui";

import padTop from "../images/ratio/chat_top.png";
import padBottom from "../images/ratio/chat_bottom.png";
import padMid from "../images/ratio/chat_mid.png";
import {useAppSelector} from '../app/hooks';
import {useDispatch} from 'react-redux';

const padTopImage = new Image();
padTopImage.src = padTop;

const padBottomImage = new Image();
padBottomImage.src = padBottom;

const padMidImage = new Image();
padMidImage.src = padMid;

const LeftPanel = forwardRef((props, ref: ForwardedRef<HTMLDivElement>) => {
  const uiState = useAppSelector(selectUIState);
  const dispatch = useDispatch();
  function hidePanel() {
    dispatch(setUIState({modal:null}));
  }
  return (
    <div id="left-panel" className={uiState.modal != null ? "historyShow" : "historyHide"}>
      <div ref={ref}></div>
      <div className={`vertical-span-button ${uiState.modal != null? 'Show' : 'Hide'}`}>
        <VerticalSpanButton topPadHeight={77} bottomPadHeight={77} width={53} topPadImage={padTopImage.src} bottomPadImage={padBottomImage.src} midPadImage={padMidImage.src} midHeight ={388}>
          <div className="cancel-btn" onClick={()=>hidePanel()}></div>
        </VerticalSpanButton>
      </div>
    </div>
  );
})

export default LeftPanel;
