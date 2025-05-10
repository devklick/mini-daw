import React, { useEffect } from "react";

interface UseScrollToChangeParams {
  value: number;
  onChange(value: number): void;
  min?: number;
  max?: number;
  loop?: boolean;
  disabled?: boolean;
}
function useScrollToChange<T extends HTMLElement>(
  elementRef: React.RefObject<T | null>,
  params: UseScrollToChangeParams
) {
  useEffect(() => {
    const element = elementRef?.current;
    if (!element) return;

    function handleWheel(event: WheelEvent) {
      if (params.disabled) return;
      event.preventDefault();

      // convert positive to -1, negative to +1, and add to value
      let newValue = (params.value += Math.sign(event.deltaY) * -1);

      if (params.min !== undefined && newValue < params.min) {
        if (params.loop && params.max !== undefined) {
          newValue = params.max;
        } else {
          newValue = params.min;
        }
      }
      if (params.max !== undefined && newValue > params.max) {
        if (params.loop && params.min !== undefined) {
          newValue = params.min;
        } else {
          newValue = params.max;
        }
      }
      params.onChange(newValue);
    }
    element.addEventListener("wheel", handleWheel);
    return () => element.removeEventListener("wheel", handleWheel);
  }, [elementRef, params]);
}

export default useScrollToChange;
