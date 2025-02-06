interface SpanButtonConfig {
  style?: React.CSSProperties;
  className?: string;
  padWidth: number;
  height: number;
  midWidth: number;
  leftPadImage: string;
  rightPadImage: string,
  midPadImage: string,
  children: any,
}


export function SpanButton(properties: SpanButtonConfig) {
    const divStyle: React.CSSProperties = {
       ...properties.style,
       width: `${properties.padWidth * 2 + properties.midWidth}px`,
       height: `${properties.height}px`,
       display: "flex",
       textAlign: "center",
    };

    const leftPadStyle: React.CSSProperties = {
       display: "flex",
       width: `${properties.padWidth}px`,
       height: `${properties.height}px` ,
       backgroundImage: `url(${properties.leftPadImage})`,
       textAlign: "center",
       backgroundSize: "cover"
    };

    const midPadStyle: React.CSSProperties = {
       display: "flex",
       width: `${properties.midWidth}px`,
       height: `${properties.height}px` ,
       backgroundImage: `url(${properties.midPadImage})`,
       textAlign: "center",
       backgroundSize: "auto 100%",
    };

    const rightPadStyle: React.CSSProperties = {
       display: "flex",
       width: `${properties.padWidth}px`,
       height: `${properties.height}px` ,
       backgroundImage: `url(${properties.rightPadImage})`,
       textAlign: "center",
       backgroundSize: "cover"
    }

    return (
      <div style={divStyle} className={properties.className}>
        <div style={leftPadStyle}>&nbsp;</div><div style={midPadStyle}>{properties.children}</div><div style={rightPadStyle}>&nbsp;</div>
      </div>
    )
}

