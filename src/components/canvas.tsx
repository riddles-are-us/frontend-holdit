import React, { useEffect, useRef, useState } from 'react';
import { SpiriteInfo, ClipRect, Clip, Stage, PositionInfo } from "../animation/clip";
import { stage } from "../animation/spirite";



setInterval(()=>{
  const canvas = document.getElementById("canvas");

  if (canvas) {
    const context = (canvas as HTMLCanvasElement).getContext("2d")!;
    const dc = {
        clear: () => {
            context.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        },
        drawImage: (image:HTMLImageElement, sx:number, sy:number, sw:number, sh:number, dx:number, dy:number, dw:number, dh:number) => {
            context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        },
            drawText: (message: string, left: number, top: number, msgWidth: number) => {
            context.fillStyle = "black";  // Red color
            context.fillRect(left, top, msgWidth, 20);
            context.fillStyle = "white";  // Red color
            context.font = "12px Arial";
            context.fillText(message, left, top); // text, x, y

        }
    }
    stage.draw(dc);
  }}, 50);

const SquareCanvas = (params: {stage: Stage<HTMLImageElement>} ) => {
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
