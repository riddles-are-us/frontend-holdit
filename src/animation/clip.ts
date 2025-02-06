export class ClipRect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  constructor(top: number, left: number, right: number, bottom: number) {
    this.top = top;
    this.left = left;
    this.right = right;
    this.right = right;
    this.bottom = bottom;
  }
}

export class SpiriteInfo {
  height: number;
  width: number;
  name: string;
  clips: Array<ClipRect>;
  src: HTMLImageElement;
  constructor(name:string, width: number, height: number, src: HTMLImageElement) {
    this.width = width;
    this.height = height;
    this.name = name;
    this.clips = [];
    this.src = src;
  }
}

export interface PositionInfo {
  ratio: number;
  top: number;
  left: number;
}



export class Clip {
  name: string;
  top: number;
  left: number;
  vx: number;
  vy: number;
  boundry: ClipRect;
  clips: Map<string, SpiriteInfo>;
  currentFrame: number | null;
  currentClip: string | null;
  parentRatio: PositionInfo;
  focus: boolean;
  hover: boolean;
  halted: boolean;
  target: Array<[number, number]>;
  active: boolean;
  stopFrame: number | null;
  zIndex: number;
  stopCallback: (c: Clip) => void;

  constructor(name: string, boundry: ClipRect, parentRatio: PositionInfo, zIndex: number) {
    this.name = name;
    this.boundry = boundry;
    this.vx = 0;
    this.vy = 0;
    this.top = 0;
    this.left = 0;
    this.currentFrame = null;
    this.currentClip = null;
    this.clips = new Map<string, SpiriteInfo>();
    this.parentRatio = parentRatio;
    this.focus = false;
    this.hover = false;
    this.target = [];
    this.halted = true;
    this.active = false;
    this.stopFrame = null;
    this.zIndex = zIndex;
    this.stopCallback = (c: Clip) => {return;};
  }

  show() {
    this.active = true;
  }

  hide() {
    this.active = false;
  }

  play() {
    this.halted = false;
    this.active = true;
  }

  stop() {
    this.halted = true;
  }

  getCurrentRect() {
    return this.clips.get(this.currentClip!)!.clips[this.currentFrame!];
  }

  inRect(cursorLeft: number, cursorTop: number): boolean {
    const rect = this.getCurrentRect();
    const w = rect.right-rect.left;
    const bottom = this.top + w * this.parentRatio.ratio + this.parentRatio.top;
    const right = this.left + w * this.parentRatio.ratio + this.parentRatio.left;
    const margin = w * this.parentRatio.ratio / 4;
    if (cursorLeft > this.left + margin
      && cursorLeft < right - margin
      && cursorTop > this.top + margin
      && cursorTop < bottom) {
      return true;
    }
    return false;
  }

  select() {
    this.focus = true;
  }

  disSelect() {
    this.focus = false;
  }

  getBottom() {
    if (this.currentClip != null && this.currentFrame != null) {
      const rect = this.getCurrentRect();
      return this.top + (rect.bottom - rect.top);
    }
    else {
      return 0;
    }
  }

  getZCenter() {
    if (this.currentClip != null && this.currentFrame != null) {
      const rect = this.getCurrentRect();
      const w = rect.right-rect.left;
      return [this.left + this.parentRatio.ratio * w/2, this.top + this.parentRatio.ratio*w]
    }
    else {
      return null;
    }
  }

  getCurrentImage() {
      return this.clips.get(this.currentClip!)!.src;
  }


  setSpeed(ratio: number) {
    const rx = 2 * Math.random() - 1;
    const ry = Math.sign(rx) * Math.sqrt(1 - rx*rx);
    if (this.target.length == 0) {
      this.vx = rx * ratio;
      this.vy = ry * ratio;
    } else {
      const len = this.target.length - 1;
      let rx = this.target[len][0] - this.left;
      let ry = this.target[len][1] - this.top;
      if (Math.abs(rx) > 10) {
        rx = Math.sign(rx) * 10;
      }
      if (Math.abs(ry) > 10) {
        ry = Math.sign(ry) * 10;
      }
      this.vx = rx;
      this.vy = ry;
      if (rx*rx + ry*ry < 5) {
        //this.target.pop();
      }
    }
  }

  /*
   * play from frame start to end
   */
  playRange(start: number, end: number, stopcb: (a:Clip) => void) {
    this.active = true;
    this.halted = false;
    this.currentFrame = start;
    this.stopFrame = end;
    this.stopCallback = stopcb;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.currentClip != null && this.currentFrame != null && this.active == true) {
      //Set the fill color
      const rect = this.getCurrentRect();
      const w = rect.right-rect.left;
      const h = rect.bottom - rect.top;
      const src = this.getCurrentImage();
      const left = this.left + this.parentRatio.left;
      const top = this.left + this.parentRatio.top;
      ctx.drawImage(src, rect.left, rect.top, w, h, left, top, w * this.parentRatio.ratio, h * this.parentRatio.ratio);

      if (this.focus == true) {
        ctx.fillStyle = "orange";  // Red color
      } else {
        ctx.fillStyle = "black";  // Red color
      }

      const fullname = `${this.name}`;
      /*
      {
        ctx.fillRect(this.left + 30, this.top - 13, fullname.length * 7 + 5, 15);
        ctx.fillStyle = "white";  // Red color
        ctx.font = "12px Arial";
        ctx.fillText(fullname, this.left+35, this.top); // text, x, y
      }
      */
      if (this.hover == true) {
        //ctx.fillStyle = 'hsl(20%, 100%, 15%)'; // Use 50% gray to desaturate
        //ctx.globalCompositeOperation = "saturation";
        ctx.beginPath();
        ctx.arc(this.left + 50, this.top + 50, 50, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.setLineDash([10, 5]); // Dash of 10px and gap of 5px
        ctx.strokeStyle = 'purple'; // Color of the dashed circle
        ctx.lineWidth = 2;        // Thickness of the dashed line
        ctx.stroke();
      }
    }
  }


  incFrame() {
    if (this.currentFrame != null && this.currentFrame == this.stopFrame) {
      //this.active = false;
      this.halted = true;
      this.stopFrame = null;
      this.stopCallback(this);
      return;
    }
    if (this.currentFrame!=null && this.currentClip!=null && this.halted == false) {
      const len = this.clips.get(this.currentClip)!.clips.length;
      this.currentFrame = (this.currentFrame + 1) % len;
      this.top = this.vy + this.top;
      this.left = this.vx + this.left;
      if (this.target.length == 0) {
        if (this.top < this.boundry.top) {
          this.top = this.boundry.top;
        }
        if (this.top > this.boundry.bottom) {
          this.top = this.boundry.bottom;
        }
        if (this.left < this.boundry.left) {
          this.left = this.boundry.left;
        }
        if (this.left > this.boundry.right) {
          this.left = this.boundry.right;
        }
      }
    }
  }

  switchAnimationClip(name: string, start = 0) {
    this.currentClip = name;
    this.currentFrame = start;
  }

  setAnimationClip(top: number, left: number, start: number, spiriteInfo: SpiriteInfo) {
    this.clips.set(spiriteInfo.name, spiriteInfo);
    this.top = top;
    this.left = left;
    this.currentFrame = start;
  }
}

export class Stage {
  clips: Map<string, Clip>
  constructor() {
    this.clips = new Map();
  }
  addClip(name: string, clip: Clip) {
    this.clips.set(name, clip);
  }
  getClip(name: string) {
    return this.clips.get(name);
  }

  draw(canvas: HTMLCanvasElement) {
    const context = (canvas as HTMLCanvasElement).getContext("2d")!;
    context.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    const carray = Array.from(this.clips.values()).sort((a,b)=> a.zIndex - b.zIndex);
    if (carray.length > 3) {
      console.log("error!!!!");
    }
    for (const v of carray) {
      v.draw(context);
      v.incFrame();
    }
  }
}


