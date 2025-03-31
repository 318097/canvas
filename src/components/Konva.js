import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Stage, Layer, Star, Text } from "react-konva";

function generateShapes() {
  return [...Array(10)].map((_, i) => ({
    id: i.toString(),
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    rotation: Math.random() * 180,
    isDragging: false,
  }));
}

const Konva = () => {
  // const [stars, setStars] = React.useState(INITIAL_STATE);
  const [shapes, setShapes] = useState({
    text: "Try to drag a star",
    // x: stage.width() / 2,
    y: 15,
    fontSize: 30,
    fontFamily: "Calibri",
    fill: "green",
    draggable: true,
  });

  const handleTextInput = useCallback((index, char) => {
    setShapes((prevShapes) => {
      const target = { ...prevShapes };

      if (char === "Backspace") {
        target.text = target.text.substring(0, target.text.length - 1);
      } else {
        target.text += char;
      }

      return target;
    });
  }, []);

  useEffect(() => {
    // if (!selectedShape) return;

    const handleKey = (e) => {
      if (e.key === "Enter") {
        // setSelectedShape(undefined);
        return;
      }

      handleTextInput?.(null, e.key);
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [handleTextInput]);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Text {...shapes} />
      </Layer>
    </Stage>
  );
};

export default Konva;
