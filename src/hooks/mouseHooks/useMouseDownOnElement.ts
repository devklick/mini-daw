import React, { useEffect, useState } from "react";

interface UseMouseDownOnElementProps<Element extends HTMLElement> {
  element: React.RefObject<Element | null>;
}

function useMouseDownOnElement<Element extends HTMLElement>({
  element,
}: UseMouseDownOnElementProps<Element>) {
  const [mouseDown, setMouseDown] = useState(false);
  useEffect(() => {
    const elem = element.current;
    if (!elem) return;

    const handleMouseDown = () => setMouseDown(true);
    const handleMouseUp = () => setMouseDown(false);

    elem.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      elem.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  return [mouseDown] as const;
}

export default useMouseDownOnElement;
