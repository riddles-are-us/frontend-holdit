import { SpiriteInfo, ClipRect, Clip, Stage, PositionInfo, Target } from "./clip";

import bossSrc from "../images/boss.png";
import explodeSrc from "../images/explode.png";
import backgroundSrc from "../images/arena.png";
import minionSrc1 from "../images/minion-01.png";
import minionSrc2 from "../images/minion-02.png";

const bossImage = new Image();
bossImage.src = bossSrc;


const explodeImage = new Image();
explodeImage.src = explodeSrc;

const backgroundImage = new Image();
backgroundImage.src = backgroundSrc;

const minionImage1 = new Image();
minionImage1.src = minionSrc1;

const minionImage2 = new Image();
minionImage2.src = minionSrc2;

const explodeWidth = 1330;
const explodeHeight = 880;

const bossHeight = 287;
const bossWidth = 280;

function createSpirite(name: string, w: number, h: number, image: HTMLImageElement, start: number, nbclips: number) {
  const spirite = new SpiriteInfo(name, w, h, image)
  for (let i=start; i<start+nbclips; i++) {
    spirite.clips.push(new ClipRect(0, w * i, w * (i+1), h));
  }
  return spirite;
}

const explodeSpirite = createSpirite("explode", explodeWidth, explodeHeight, explodeImage, 0, 56);
const angrySpirite = createSpirite("angry", explodeWidth, explodeHeight, explodeImage, 30, 26);

const bossSpirite = createSpirite("boss", bossWidth, bossHeight, bossImage, 0, 111);

const backgroundSpirite = new SpiriteInfo("background", 1330, 800, backgroundImage);
backgroundSpirite.clips.push(new ClipRect(0, 0, 1330, 800));

const STAGE_HEIGHT = 800;
const STAGE_WIDTH = 1330;

export const stage = new Stage<HTMLImageElement>(STAGE_WIDTH, STAGE_HEIGHT);

// Add Boss Clip
//
const bossClip = new Clip("boss", new ClipRect(0, 0, 1297, 1027), 1, stage);
bossClip.setPos(320, 630);
bossClip.setAnimationClip(bossHeight/2, bossWidth/2, 0, bossSpirite);
bossClip.setAnimationClip(explodeHeight/2 - 100, explodeWidth/2 - 50, 0, angrySpirite);
bossClip.setAnimationClip(explodeHeight/2 - 100, explodeWidth/2 - 50, 0, explodeSpirite);
bossClip.switchAnimationClip("boss");
stage.addClip(bossClip);
//bossClip.show();
//bossClip.play();


// Add Background Clip
//
const backgroundClip = new Clip("background", new ClipRect(0, 0, 1297, 1027), 0, stage);
backgroundClip.setAnimationClip(0, 0, 0, backgroundSpirite);
backgroundClip.switchAnimationClip("background");
stage.addClip(backgroundClip);
backgroundClip.show();


const clipConfig = {
  width: 100,
  height: 100,
  clips: [
    {
      name: "run-left-front",
      size: 10,
    },
    {
      name: "stand-left-front",
      size: 11,
    },
    {
      name: "run-right-back",
      size: 10,
    },
    {
      name: "stand-right-back",
      size: 11,
    },
    {
      name: "run-right-front",
      size: 10,
    },
    {
      name: "stand-right-front",
      size: 11,
    },
    {
      name: "run-left-back",
      size: 10,
    },
    {
      name: "stand-left-back",
      size: 11,
    },
  ]
}

export function addMinion(clipName: string, top: number, left: number): Clip<HTMLImageElement> {
  let random = Math.random() * 100;
  const minionClip = new Clip<HTMLImageElement>(clipName, new ClipRect(0, 0, 1330, 800), 0, stage);
  let index = 0;

  random = Math.floor(random);
  random = random % 2;
  const minionImage = random == 0 ? minionImage1 : minionImage2;

  for(const c of clipConfig.clips) {
    const minionSpirite = new SpiriteInfo(c.name, clipConfig.width, clipConfig.height, minionImage);
    for (let i=index; i<index + c.size; i++) {
      minionSpirite.clips.push(new ClipRect(0, 100* i, 100*(i+1), 100));
    }
    minionClip.setSpeed(10);
    minionClip.setPos(top, left);
    minionClip.setAnimationClip(0, 0, 0, minionSpirite);
    index += c.size;
  }
  minionClip.switchAnimationClip("run-left-front");
  stage.addClip(minionClip);
  minionClip.show();
  minionClip.play();
  minionClip.setMessage("take the chance!");
  return minionClip;
}

const middle = {
  top: 450,
  left: 560,
};

function pickMessage() {
  const msgs = ["", "hold!!", "I will take the risk"];
  const r = Math.floor(Math.random() * 3);
  return msgs[r];
}

export function idlingHandler(clip: Clip<HTMLImageElement>) {
  let dtop = clip.top - middle.top;
  let dleft = clip.left - middle.left;
  //const radius = Math.sqrt(dtop * dtop + dleft* dleft);
  const radius = 200;
  const angle = Math.atan2(-dtop, dleft);
  const deltaAngle = (Math.random() - 0.5) * Math.PI / 6;
  const newAngle = angle + deltaAngle;
  dtop = radius * Math.sin(newAngle);
  dleft = radius * Math.cos(newAngle);
  const newTop = dtop + middle.top;
  const newLeft = dleft + middle.left;
  let moveType = "run";
  const speed = Math.floor(Math.random() * 10 + 3);
  if (speed < 7) {
    clip.setSpeed(2);
    moveType = "stand";
  } else {
    clip.setSpeed(10);
  }
  clip.setMessage(pickMessage());
  if (newTop <= clip.top) {
    if (newLeft <= clip.left) {
      clip.switchAnimationClip(`${moveType}-left-back`);
    } else {
      clip.switchAnimationClip(`${moveType}-right-back`);
    }
  } else {
    if (newLeft <= clip.left) {
      clip.switchAnimationClip(`${moveType}-left-front`);
    } else {
      clip.switchAnimationClip(`${moveType}-right-front`);
    }
  }
  clip.target.unshift(new Target(-dtop + middle.top, dleft + middle.left, idlingHandler));
}

export function quitHandler(clip: Clip<HTMLImageElement>) {
  stage.removeClip(clip.name);
}

export function minionEnter(name: string) {
  const random = Math.floor(Math.random() * 20) - 10;
  const mclip = addMinion(name, 180 + random, 800 + random * 4);
  //const mclip = addMinion("abc", 325, 560);
  mclip.target.push(new Target<HTMLImageElement>(200, 700, idlingHandler));
  mclip.target.push(new Target<HTMLImageElement>(170, 700, ()=>{return;}));
}

export function minionLeave(name: string) {
  const mclip = stage.getClip(name);
  //const mclip = addMinion("abc", 325, 560);
  if (mclip) {
    mclip!.target = [new Target(830, 630, quitHandler)];
  }

}

export function minionDie(name: string) {
  const mclip = stage.getClip(name);
  //const mclip = addMinion("abc", 325, 560);
  if (mclip) {
    mclip!.target = [new Target(830, 630, quitHandler)];
  }
}

function generateCircleTrace() {
  const points: Array<[number, number]> = [];
  const numPoints = 10;
  const radius = 200;
  const angleIncrement = (2 * Math.PI) / numPoints;
  for (let i=0; i<numPoints + 1; i++) {
    const angle = i * angleIncrement;
    const x = middle.left + radius * Math.cos(angle);
    const y = middle.top + radius * Math.sin(angle);
    points.push([x, y]);
  }
  return points;
}

minionEnter("testMinion1");
minionEnter("testMinion2");
minionEnter("testMinion3");

