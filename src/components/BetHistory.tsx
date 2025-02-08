import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {AccountSlice} from 'zkwasm-minirollup-browser';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {selectUserState} from '../data/state';
import {selectHistory, getHistory, selectUIState, ModalIndicator} from '../data/ui';

export default function BetHistory(properties: {lpanel: HTMLDivElement}) {
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const history = useAppSelector(selectHistory);
  const userState = useAppSelector(selectUserState);
  const uiState = useAppSelector(selectUIState);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (l2account) {
      dispatch(getHistory(l2account!.getPrivateKey()));
    }
  }, [l2account, userState]);

  useEffect(() => {
    if (l2account) {
      dispatch(getHistory(l2account!.getPrivateKey()));
    }
  }, [l2account]);

  function content() {
    return (
    <>
      <h4>Your game history</h4>
    <table className="w-full border border-gray-200 shadow-md mt-2">
      <thead>
      <tr className="bg-gray-100 text-left">
        <th className="p-2 border">Round</th>
        <th className="p-2 border">Betting Amount</th>
        <th className="p-2 border">Checkout Amount</th>
      </tr>
      </thead>
        <tbody>
        {history.map((item, index) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="p-2 border">{item.round}</td>
            <td className="p-2 border">{item.bet}</td>
            <td className="p-2 border">{item.checkout}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </>
    )
  }

  return (
    <>
      {uiState.modal == ModalIndicator.HISTORY &&
      ReactDOM.createPortal(
        content(),
        properties.lpanel
      )}
    </>
  );
}
