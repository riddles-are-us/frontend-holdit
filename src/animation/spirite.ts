import { SpiriteInfo, ClipRect, Clip, Stage, PositionInfo } from "./clip";

import explodeSrc from "../images/explode.png";
import backgroundSrc from "../images/arena.png";
import minionSrc from "../images/minion.png";

const explodeImage = new Image();
explodeImage.src = explodeSrc;

const backgroundImage = new Image();
backgroundImage.src = backgroundSrc;

const minionImage = new Image();
minionImage.src = minionSrc;

const explodeSpirite = new SpiriteInfo("explode", 1330, 800, explodeImage);
for (let i=30; i< 57; i++) {
  explodeSpirite.clips.push(new ClipRect(0, 1330* i, 1330*(i+1), 800));
}

const bossSpirite = new SpiriteInfo("boss", 1330, 800, explodeImage);
for (let i=0; i< 30; i++) {
  bossSpirite.clips.push(new ClipRect(0, 1330* i, 1330*(i+1), 800));
}

const backgroundSpirite = new SpiriteInfo("background", 1330, 800, backgroundImage);
backgroundSpirite.clips.push(new ClipRect(0, 0, 1330, 800));

const STAGE_HEIGHT = 800;
const STAGE_WIDTH = 1330;

export const stage = new Stage(STAGE_WIDTH, STAGE_HEIGHT);

// Add Boss Clip
//
const bossClip = new Clip("boss", new ClipRect(0, 0, 1297, 1027), 1, stage);
bossClip.setAnimationClip(0, 0, 0, bossSpirite);
bossClip.setAnimationClip(0, 0, 0, explodeSpirite);
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

const minionSpiriteFront = new SpiriteInfo("front", 150, 150, minionImage);
for (let i=0; i< 6; i++) {
  minionSpiriteFront.clips.push(new ClipRect(0, 150* i, 150*(i+1), 150));
}

const minionSpiriteBack = new SpiriteInfo("back", 150, 150, minionImage);
for (let i=6; i< 12; i++) {
  minionSpiriteBack.clips.push(new ClipRect(0, 150* i, 150*(i+1), 150));
}

export const addMinion = (clipName: string, top: number, left: number) => {
  const minionClip = new Clip(clipName, new ClipRect(0, 0, 1330, 800), 0, stage);
  minionClip.top  = top;
  minionClip.left = left;
  minionClip.setAnimationClip(top, left, 0, minionSpiriteFront);
  minionClip.setAnimationClip(top, left, 0, minionSpiriteBack);
  minionClip.switchAnimationClip("front");
  stage.addClip(minionClip);
  minionClip.show();
  minionClip.play();
  return minionClip;
}

const middle = {
  top: 400,  
  left: 560,
};

const mclip = addMinion("abc", 180, 800);
//const mclip = addMinion("abc", 325, 560);
mclip.target.push([630, 200]);
mclip.target.push([630, 170]);

export function targetEventHandler(clip: Clip) {
  let dtop = clip.top - middle.top;
  let dleft = clip.left - middle.left;
  //const radius = Math.sqrt(dtop * dtop + dleft* dleft);
  const radius = 200;
  const angle = Math.atan2(dleft, dtop);
  console.log("old angle", angle);
  const deltaAngle = (Math.random() - 1) * Math.PI / 12;
  //const deltaAngle = Math.PI;
  console.log("delta angle", deltaAngle);
  const newAngle = angle - deltaAngle;
  console.log("new angle", newAngle);
  dtop = radius * Math.sin(newAngle);
  dleft = radius * Math.cos(newAngle);
  clip.target.unshift([dleft + middle.left, -dtop + middle.top]);
}

stage.registerEventHandler(mclip, targetEventHandler);



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




