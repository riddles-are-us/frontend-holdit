import React, {useEffect, useState} from 'react';
import {useAppSelector} from '../app/hooks';
import {GlobalState, selectConnectState, selectUserState} from '../data/state';
import {stage, minionDie, minionLeave, minionEnter} from '../animation/spirite';

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
    if (userState?.state?.ratio == 0 && state.ratio!=0) {
        const clip = stage.getClip("boss")!;
        clip.switchAnimationClip("explode", 0);
        clip.play();
        clip.playRange(0, 54, (clip) => {
                clip.stop();
                clip.switchAnimationClip("boss");
                clip.show();
        });
        for (const p of players) {
           minionDie(`${p.pid}`);
           console.log(`${p.pid} 's robot exploded ${p.checkout}`);
        }
        setPlayers([]);

    } else {
        if (userState!.state!.prepare > 0) {
            stage.getClip("boss")!.show();
            stage.getClip("boss")!.stop();
        }
        if (userState!.state!.prepare == 0 && userState!.state!.ratio > state.ratio) {
            stage.getClip("boss")!.show();
            stage.getClip("boss")!.switchAnimationClip("boss");
            stage.getClip("boss")!.play();
            //stage.getClip("boss")!.playRange(0, 25, (clip) => {clip.show(); return;});
        }
        for (const player of userState!.state!.players!) {
           const p = players.find(x => x.pid[0] == player.pid[0]);
           if (p!=null) {
              if (player.checkout != p.checkout) {
                      minionLeave(`${player.pid}`);
                      console.log(`${player.pid} has checked out ${player.checkout}`);
              }
           } else {
              console.log(`${player.pid} has entered the arena`);
              minionEnter(`${player.pid}`);
           }
        }
        setPlayers(userState!.state!.players);
    }
    setState(userState!.state);
  }, [userState]);

  return (
    <div>
    </div>
  );
}
