import React, { useEffect, useRef, useState } from 'react';
import { SpiriteInfo, ClipRect, Clip, Stage, PositionInfo } from "../animation/clip";

import explodeSrc from "../images/explode.png";
import backgroundSrc from "../images/arena.jpg";

const explodeImage = new Image();
explodeImage.src = explodeSrc;


const backgroundImage = new Image();
backgroundImage.src = backgroundSrc;

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

export const stage = new Stage();

const STAGE_HEIGHT = 800;
const STAGE_WIDTH = 1330;

setInterval(()=>{
  const canvas = document.getElementById("canvas");
  if (canvas) {
     stage.draw(canvas as HTMLCanvasElement);
  }}, 50);

function getRectRatio(effW: number, effH: number): PositionInfo {
  if (effW == 0 || effH == 0) {
    return {
      ratio:0,
      top:0,
      left: 0,
    }
  }
  if ((effW/effH) > (STAGE_WIDTH/STAGE_HEIGHT)) {
    // spread to fit height
    const ratio = effW/STAGE_WIDTH;
    const height = ratio * STAGE_HEIGHT;
    return {
      ratio: ratio,
      top: (effH - height)/2,
      left: 0,
    }
  } else {
    // spread to fit width
    const ratio = effH/STAGE_HEIGHT;
    const width = ratio * STAGE_WIDTH;
    return {
      ratio: ratio,
      top: 0,
      left: (effW - width)/2,
    }
  }
}

const SquareCanvas = (params: {stage: Stage} ) => {
   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const [ratio, setRatio] = useState(getRectRatio(0,0));
   const resizeCanvas = () => {
     const canvas = canvasRef.current;
     if (canvas) {
       const container = canvas.parentElement;
       if (container) {
         canvas.width = container.offsetWidth - 2;
         canvas.height = container.offsetHeight - 8;
         setRatio(getRectRatio(container.offsetWidth, container.offsetHeight))
       }
     }
   };
   const [bossClip, setBossClip] = useState<Clip | null>(null);
   const [backgroundClip, setBackgroundClip] = useState<Clip | null>(null);


   useEffect(() => {
     resizeCanvas(); // Initial resize to set the size
     window.addEventListener('resize', resizeCanvas);
     return () => {
         window.removeEventListener('resize', resizeCanvas);
     };



   }, []);

   useEffect(() => {
     const canvas = canvasRef.current;
     if (canvas) {
       const container = canvas.parentElement;
       if (container) {
         if (bossClip == null) {
           const bossClip = new Clip("boss", new ClipRect(0, 0, 1297, 1027), ratio, 1);
           bossClip.setAnimationClip(0, 0, 0, bossSpirite);
           bossClip.setAnimationClip(0, 0, 0, explodeSpirite);
           bossClip.switchAnimationClip("boss");
           params.stage.addClip("boss", bossClip);
           setBossClip(bossClip);
           bossClip.show();
           bossClip.play();
         } else {
           bossClip.parentRatio = ratio;
         }
         if (backgroundClip == null) {
           const backgroundClip = new Clip("background", new ClipRect(0, 0, 1297, 1027), ratio, 0);
           backgroundClip.setAnimationClip(0, 0, 0, backgroundSpirite);
           backgroundClip.switchAnimationClip("background");
           params.stage.addClip("background", backgroundClip);
           setBackgroundClip(backgroundClip);
           backgroundClip.show();
         } else {
           backgroundClip.parentRatio = ratio;
         }
       }
     }
   }, [canvasRef, ratio]);

   return (
           <div className="canvas-container">
        <canvas id="canvas" ref={canvasRef}></canvas>
     </div>
   );
};

export default SquareCanvas;
