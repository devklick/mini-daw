import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";

// AKA DickPick
import KnobImage from "./assets/knob.svg?react";

import { useMouseDownOnElement } from "../../hooks/mouseHooks";

import "./ControlKnob.scss";
import { MouseEventButton } from "../../utils/mouseUtils";

interface ControlKnobProps {
  min: number;
  max: number;
  defaultValue: number;
  onChange?: (value: number) => void;
  size?: "small";
  disabled?: boolean;
}

function ControlKnob({
  max = 200,
  min = 0,
  defaultValue = 100,
  size = "small",
  onChange,
  disabled,
}: ControlKnobProps) {
  const knobRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [mouseDown] = useMouseDownOnElement({ element: knobRef });
  const lastYRef = useRef<number | null>(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const valueToAngle = (val: number) => {
    const range = max - min;
    const percentage = (val - min) / range;
    const minAngle = -140;
    const maxAngle = 140;
    const rotationRange = maxAngle - minAngle;
    return percentage * rotationRange + minAngle;
  };

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!mouseDown || lastYRef.current === null) return;

      const deltaY = lastYRef.current - event.clientY;
      lastYRef.current = event.clientY;

      const sensitivity = 0.5;
      const newValue = Math.max(
        min,
        Math.min(max, value + deltaY * sensitivity)
      );
      setValue(newValue);
      if (onChange) onChange(newValue);
    },
    [max, min, mouseDown, onChange, value]
  );
  const handleDown = (event: React.MouseEvent) => {
    if (event.button !== MouseEventButton.Left) return;

    event.preventDefault();
    lastYRef.current = event.clientY;
  };

  useEffect(() => {
    const handleMouseUp = () => (lastYRef.current = null);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove, mouseDown]);

  return (
    <div
      ref={knobRef}
      onMouseDown={handleDown}
      onClick={(e) => e.stopPropagation()}
      className={clsx("control-knob", `control-knob--${size}`, {
        [`control-knob--disabled`]: disabled,
      })}
    >
      <div
        className={clsx("control-knob__inner", {
          ["control-knob__inner--disabled"]: disabled,
        })}
        style={{ transform: `rotate(${valueToAngle(value)}deg)` }}
      >
        <KnobImage width={"100%"} />
        <span
          className={clsx("control-knob__pointer", {
            ["control-knob__pointer--disabled"]: disabled,
          })}
        />
      </div>
    </div>
  );
}

export default ControlKnob;
