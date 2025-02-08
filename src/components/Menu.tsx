import { useAppDispatch, useAppSelector } from "../app/hooks";
import {AccountSlice} from "zkwasm-minirollup-browser";
import {
    MDBBtn,
} from 'mdb-react-ui-kit';
import { addressAbbreviation } from "../utils/address";
import {loginL1AccountAsync, loginL2AccountAsync} from "zkwasm-minirollup-browser/src/reduxstate";
import {selectUIState, setUIState, ModalIndicator} from "../data/ui";
interface IProps {
  handleRestart: () => void;
}

export function Menu(props: IProps) {
  const dispatch = useAppDispatch();
  const l1account = useAppSelector(AccountSlice.selectL1Account);
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const uiState = useAppSelector(selectUIState);
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

  function SwithHistoryPanel() {
    dispatch(setUIState({modal: ModalIndicator.HISTORY}))
  }

  return (
    <div className="fade-in">
      <div onClick={login} className='avator'>
      </div>
      <div className='deposit-btn'>
      </div>
      <div className='history-btn' onClick={()=> SwithHistoryPanel()}>
      </div>
      <div className='withdraw-btn'>
      </div>
   </div>
  )
}


