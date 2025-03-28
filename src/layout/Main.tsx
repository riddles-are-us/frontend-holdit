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
import { stage }  from "../animation/spirite";
import {SpanButton} from "../components/Ratio";

import padLeft from "../images/ratio/frame_left.png";
import padRight from "../images/ratio/frame_right.png";
import padMid from "../images/ratio/frame_middle.png";
import {selectUIState} from "../data/ui";
import {Menu} from "../components/Menu";
import LeftPanel from "../components/LeftPanel";
import {WithdrawModal} from "../components/Common";
import MultiplyImage from "../images/multiply.png";

const padLeftImage = new Image();
padLeftImage.src = padLeft;

const padRightImage = new Image();
padRightImage.src = padRight;

const padMidImage = new Image();
padMidImage.src = padMid;

const CMD_INSTALL_PLAYER = 1n;

export function Main() {
  const connectState = useAppSelector(selectConnectState);
  const l2account = useAppSelector(AccountSlice.selectL2Account);
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



  return (
    <>
      <div id="right-panel">
        <div className='stage'>
        </div>

        <SquareCanvas stage={stage}></SquareCanvas>
        {userState?.state?.prepare == 0 &&
          <div className='banner'>
              <SpanButton className="automargin" padWidth={61} height={74} leftPadImage={padLeftImage.src} rightPadImage={padRightImage.src} midPadImage={padMidImage.src} midWidth={288}>
                      <div className="automargin">
                        <div className="left20">
                          <img src={MultiplyImage}/>
                          <span>{(userState?.state?.ratio / 100).toFixed(2)}</span>
                        </div>
                      </div>
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

        <Menu handleRestart={()=>{return}}></Menu>
        {lpanel.current && userState?.player &&
          <BetHistory lpanel={lpanel.current}></BetHistory>
        }

      </div>

      <LeftPanel ref = {lpanel}></LeftPanel>


      {lpanel.current &&
        <>
        <ChatHistoryInput lpanel={lpanel.current}></ChatHistoryInput>
        <WithdrawModal lpanel={lpanel.current} balanceOf={(a)=>a.data.balance} handleClose={()=>{return;}} ></WithdrawModal>
        <Overview lpanel={lpanel.current}></Overview>
        </>
      }
      {userState?.state &&
      <Event></Event>
      }
    </>
  );
}
