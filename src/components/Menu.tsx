import { useAppDispatch, useAppSelector } from "../app/hooks";
import {AccountSlice} from "zkwasm-minirollup-browser";
import { addressAbbreviation } from "../utils/address";
import {loginL1AccountAsync, loginL2AccountAsync} from "zkwasm-minirollup-browser/src/reduxstate";
import {selectUIState, setUIState, ModalIndicator} from "../data/ui";
import {selectUserState} from "../data/state";
import BetButton from "../components/Bet";
interface IProps {
  handleRestart: () => void;
}

export function Menu(props: IProps) {
  const dispatch = useAppDispatch();
  const l1account = useAppSelector(AccountSlice.selectL1Account);
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const uiState = useAppSelector(selectUIState);
  const userState = useAppSelector(selectUserState);
  function login() {
    if (l1account) {
      dispatch(AccountSlice.loginL2AccountAsync("ZKWASM-BEAT"));
    } else {
      console.log("connect?");
      dispatch(AccountSlice.loginL1AccountAsync())
      .then((action) => {
        if (loginL1AccountAsync.fulfilled.match(action)) {
          dispatch(AccountSlice.loginL2AccountAsync("ZKWASM-BEAT"));
        }
      });
    }
  }

  function switchHistoryPanel() {
    dispatch(setUIState({modal: ModalIndicator.HISTORY}))
  }

  function switchWithdrawPanel() {
    dispatch(setUIState({modal: ModalIndicator.WITHDRAW}))
  }

  function switchDepositPanel() {
    dispatch(setUIState({modal: ModalIndicator.DEPOSIT}))
  }

  function MainButton() {
     if (userState?.player != null) {
         return <BetButton></BetButton>
     } else {
         return <div onClick={login} className="audience-mode"> Sign In </div>
     }
  }

  return (
    <div className="fade-in">
      <div className='avator'>
      </div>
      <div className='balance'>Balance: {userState?.player?.data.balance}</div>

      <div className='withdraw-btn' onClick={()=> switchWithdrawPanel()}>
      </div>
      <div className='history-btn' onClick={()=> switchHistoryPanel()}>
      </div>
      <div className='deposit-btn' onClick={()=> switchDepositPanel()}>
      </div>
      {userState?.player != null && <BetButton></BetButton>}
      {userState?.player == null &&
         <div onClick={login} className="audience-mode"> Sign In </div>
      }
   </div>
  )
}


