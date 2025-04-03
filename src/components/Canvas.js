import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric"; // v6

const FabricJSCanvas = () => {
  const canvasEl = useRef();
  const textRef = useRef();
  const canvasContainerRef = useRef();
  const [text, setText] = useState("Text");

  useEffect(() => {
    const options = { backgroundColor: "whitesmoke" };
    canvasContainerRef.current = new fabric.Canvas(canvasEl.current, options);

    textRef.current = createText({});

    canvasContainerRef.current.add(textRef.current);

    return () => {
      canvasContainerRef.current.dispose();
    };
  }, []);

  const createText = ({
    x = 10,
    y = 10,
    fontSize = 24,
    penColor = "blue",
    readonly = false,
    height = "0",
    width = "88",
  }) => {
    const textRef = new fabric.Textbox(text, {
      left: x,
      top: y,
      originX: "left",
      originY: "top",
      fill: penColor,
      width,
      height,
      selectable: !readonly,
      fontSize,
      // lockScalingY: true,
    });
    // textRef.set({ strokeUniform: true });
    textRef.setControlsVisibility({
      mtr: false,
      tl: false,
      tr: false,
      bl: false,
      br: false,
      mb: false,
      mt: false,
    });

    return textRef;
  };
  console.log(textRef);
  return (
    <div>
      <div className="canvas-root">
        <canvas height="400" width="900" ref={canvasEl} />
      </div>
      <input
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          // textRef.current.text = e.target.value;
          textRef.current.set("text", e.target.value);
          canvasContainerRef.current.renderAll();
        }}
      />
    </div>
  );
};

export default FabricJSCanvas;
