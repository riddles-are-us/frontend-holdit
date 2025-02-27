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

export interface Target {
  top: number;
  left: number;
  handler: (clip: Clip) => void;
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
  stage: Stage;
  focus: boolean;
  hover: boolean;
  halted: boolean;
  target: Array<Target>;
  active: boolean;
  stopFrame: number | null;
  zIndex: number;
  stopCallback: (c: Clip) => void;

  constructor(name: string, boundry: ClipRect, zIndex: number, stage: Stage) {
    this.name = name;
    this.boundry = boundry;
    this.vx = 0;
    this.vy = 0;
    this.top = 0;
    this.left = 0;
    this.currentFrame = null;
    this.currentClip = null;
    this.clips = new Map<string, SpiriteInfo>();
    this.stage = stage;
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
    const r = this.stage.ratio;
    const bottom = this.top + w * r.ratio + r.top;
    const right = this.left + w * r.ratio + r.left;
    const margin = w * r.ratio / 4;
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
      const r = this.stage.ratio;
      return [this.left + r.ratio * w/2, this.top + r.ratio*w]
    }
    else {
      return null;
    }
  }

  getCurrentImage() {
      return this.clips.get(this.currentClip!)!.src;
  }


  setSpeed() {
    const ratio = this.stage.ratio.ratio;
    if (this.target.length != 0) {
      const len = this.target.length - 1;
      let rx = this.target[len].left - this.left;
      let ry = this.target[len].top - this.top;
      if (Math.abs(rx) > 10) {
        rx = Math.sign(rx) * 10;
      }
      if (Math.abs(ry) > 10) {
        ry = Math.sign(ry) * 10;
      }
      this.vx = rx;
      this.vy = ry;
      if (rx*rx + ry*ry < 5) {
        const target = this.target.pop();
        if (this.target.length == 0) {
          target.handler(this);
          //this.stage.emitEvent(this, "ReachTarget");
        }
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
      const ratio = this.stage.ratio;
      const rect = this.getCurrentRect();
      const w = rect.right - rect.left;
      const h = rect.bottom - rect.top;
      const src = this.getCurrentImage();
      const left = this.left * ratio.ratio + ratio.left;
      const top = this.top * ratio.ratio + ratio.top;
      ctx.drawImage(src, rect.left, rect.top, w, h, left, top, w * ratio.ratio, h * ratio.ratio);

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
      this.setSpeed();
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

class Event {
  clip: Clip;
  eventType: string;
  constructor(clip: Clip, event: string) {
    this.clip = clip;
    this.eventType = event; 
  }
}

export class Stage {
  clips: Map<string, Clip>;
  ratio: PositionInfo;
  events: Array<Event>;
  eventHandler: Map<string, (c:Clip)=> void>;
  stageHeight: number;
  stageWidth: number;
  constructor(stageWidth: number, stageHeight: number) {
    this.clips = new Map();
    this.eventHandler = new Map();
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    this.events = [];
    this.ratio = {
        ratio:0,
        top:0,
        left: 0,
      }
  }

  emitEvent(clip: Clip, eventType: string) {
    const handler = this.eventHandler.get(clip.name);
    if (handler) {
      handler(clip);
    }
    //this.events.unshift(new Event(clip, eventType));
  }

  registerEventHandler(clip: Clip, cb: (c:Clip) => void) {
    this.eventHandler.set(clip.name, cb);
  }

  getRectRatio(effW: number, effH: number): PositionInfo {
    if (effW == 0 || effH == 0) {
      return {
        ratio:0,
        top:0,
        left: 0,
      }
    }
    if ((effW/effH) > (this.stageWidth/this.stageHeight)) {
      // spread to fit height
      const ratio = effW / this.stageWidth;
      const height = ratio * this.stageHeight;
      return {
        ratio: ratio,
        top: (effH - height)/2,
        left: 0,
      }
    } else {
      // spread to fit width
      const ratio = effH / this.stageHeight;
      const width = ratio * this.stageWidth;
      return {
        ratio: ratio,
        top: 0,
        left: (effW - width)/2,
      }
    }
  }

  setRatio(r: PositionInfo) {
    this.ratio = r;
  }


  addClip(clip: Clip) {
    this.clips.set(clip.name, clip);
  }

  removeClip(clipName: string) {
    this.clips.delete(clipName);
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

