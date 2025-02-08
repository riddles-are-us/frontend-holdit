import {useEffect, useRef, useState} from "react";

interface SpanButtonConfig {
  style?: React.CSSProperties;
  className?: string;
  topPadHeight: number;
  bottomPadHeight: number;
  width: number;
  midHeight: number;
  topPadImage: string;
  bottomPadImage: string,
  midPadImage: string,
  children: any,
}


export function VerticalSpanButton(properties: SpanButtonConfig) {
    const divRef = useRef<HTMLDivElement | null>(null);
    const [height, setHeight] = useState(0);
    const [divStyle, setDivStyle] = useState<React.CSSProperties> ({
       ...properties.style,
       height: `${properties.topPadHeight + properties.bottomPadHeight + height}px`,
       width: `${properties.width}px`,
       textAlign: "center",
    });

    const topPadStyle: React.CSSProperties = {
       width: `${properties.width}px`,
       height: `${properties.topPadHeight}px` ,
       backgroundImage: `url(${properties.topPadImage})`,
       textAlign: "center",
       backgroundSize: "cover"
    };

    const [midPadStyle, setMidPadStyle] = useState<React.CSSProperties> ({
       width: `${properties.width}px`,
       height: `${height}px` ,
       backgroundImage: `url(${properties.midPadImage})`,
       textAlign: "center",
       backgroundSize: "100% auto",
    });

    const bottomPadStyle: React.CSSProperties = {
       width: `${properties.width}px`,
       height: `${properties.bottomPadHeight}px` ,
       backgroundImage: `url(${properties.bottomPadImage})`,
       textAlign: "center",
       backgroundSize: "cover"
    }

    function resize() {
      if (divRef.current) {
         const parentHeight = divRef.current.parentElement!.offsetHeight;
         const innerHeight = parentHeight - properties.bottomPadHeight - properties.topPadHeight;
         setDivStyle({
                 ...properties.style,
                 height: `${properties.topPadHeight + properties.bottomPadHeight + innerHeight}px`,
                 width: `${properties.width}px`,
                 textAlign: "center",
         });
          setMidPadStyle({
                  width: `${properties.width}px`,
                  height: `${innerHeight}px` ,
                  backgroundImage: `url(${properties.midPadImage})`,
                  textAlign: "center",
                  backgroundSize: "100% auto",
        });
      }
   }

   useEffect(() => {
     resize(); // Initial resize to set the size
     window.addEventListener('resize', resize);
     return () => {
         window.removeEventListener('resize', resize);
    };
   }, []);

   useEffect(() => {
     resize(); // Initial resize to set the size
   }, [divRef]);

   return (
      <div style={divStyle} ref={divRef} className={properties.className}>
        <div style={topPadStyle}>&nbsp;</div><div style={midPadStyle}>{properties.children}</div><div style={bottomPadStyle}>&nbsp;</div>
      </div>
    )
}
