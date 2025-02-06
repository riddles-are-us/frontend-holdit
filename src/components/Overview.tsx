import React, {useEffect, useState} from 'react';
import {AccountSlice} from 'zkwasm-minirollup-browser';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {selectUserState} from '../data/state';
import {selectHistory, getHistory} from '../data/ui';

export default function Overview() {
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const history = useAppSelector(selectHistory);
  const userState = useAppSelector(selectUserState);
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


  return (
    <div className="round-overview">
      <div>
        {userState?.state?.players?.length || 0} players are in the arena. (round {userState?.state?.currentRound}) 
      </div>
      <table className="w-full border border-gray-200 shadow-md mt-2 mb-2">
        <thead>
      <tr className="bg-gray-100 text-left">
        <th className="p-2 border">PlayerId</th>
        <th className="p-2 border">Bet</th>
        <th className="p-2 border">Checkout</th>
      </tr>
      </thead>
        <tbody>
        {userState?.state?.players?.map((item: any, index:number) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="p-2 border">{item.pid[0]}</td>
            <td className="p-2 border">{item.amount}</td>
            <td className="p-2 border">{item.checkout}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
