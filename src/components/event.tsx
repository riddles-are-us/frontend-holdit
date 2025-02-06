import React, {useEffect, useState} from 'react';
import {useAppSelector} from '../app/hooks';
import {GlobalState, selectConnectState, selectUserState} from '../data/state';
import {stage} from './canvas';

interface PlayerRecord {
  pid: string[];
  amount: number;
  checkout: number;
}

export default function Event() {
  const userState = useAppSelector(selectUserState);
  const [state, setState]  = useState<GlobalState>(userState!.state!);
  const [players, setPlayers] = useState<PlayerRecord[]>(userState!.state!.players);
  useEffect(() => {
    for (const player of userState!.state!.players!) {
      const p = players.find(x => x.pid[0] == player.pid[0]);
      if (p!=null) {
        if (player.checkout != p.checkout) {
           console.log(`${player.pid} has checked out ${player.checkout}`);
        }
      } else {
           console.log(`${player.pid} has entered the arena`);
      }
    }
    setPlayers(userState!.state!.players);
  }, [userState]);

  useEffect(() => {
    if (userState?.state?.ratio == 0 && state.ratio!=0) {
        stage.getClip("boss")!.switchAnimationClip("explode");
        stage.getClip("boss")!.playRange(0, 26, (clip) => {clip.switchAnimationClip("boss"); clip.stop()});
    }
    if (userState!.state!.prepare > 0) {
        stage.getClip("boss")!.show();
        stage.getClip("boss")!.stop();
    }
    if (userState!.state!.prepare == 0 && userState!.state!.ratio > state.ratio) {
        stage.getClip("boss")!.playRange(0, 25, (clip) => {clip.show(); return;});
    }
    setState(userState!.state);
  }, [userState]);

  return (
    <div>
    </div>
  );
}
