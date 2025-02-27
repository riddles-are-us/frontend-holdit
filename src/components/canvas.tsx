import React, { useEffect, useRef, useState } from 'react';
import { SpiriteInfo, ClipRect, Clip, Stage, PositionInfo } from "../animation/clip";
import { stage } from "../animation/spirite";



setInterval(()=>{
  const canvas = document.getElementById("canvas");
  if (canvas) {
     stage.draw(canvas as HTMLCanvasElement);
  }}, 50);

const SquareCanvas = (params: {stage: Stage} ) => {
   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const [ratio, setRatio] = useState(params.stage.getRectRatio(0,0));
   const resizeCanvas = () => {
     const canvas = canvasRef.current;
     if (canvas) {
       const container = canvas.parentElement;
       if (container) {
         canvas.width = container.offsetWidth - 2;
         canvas.height = container.offsetHeight - 8;
         params.stage.setRatio(params.stage.getRectRatio(container.offsetWidth, container.offsetHeight));
       }
     }
   };


   useEffect(() => {
     resizeCanvas(); // Initial resize to set the size
     window.addEventListener('resize', resizeCanvas);
     return () => {
         window.removeEventListener('resize', resizeCanvas);
     };
   }, []);

   return (
           <div className="canvas-container">
        <canvas id="canvas" ref={canvasRef}></canvas>
     </div>
   );
};

export default SquareCanvas;
