import React from "react";

import { Rect } from "../../hooks/mouseHooks/useDragToResize";
import useAppletManagerStore from "../stores/useAppletManagerStore";

function toPx(value: number): `${number}px` {
  return `${value}px`;
}

interface UseAppletMinMaxParams {
  appletRef: React.RefObject<HTMLElement | null>;
  appletRect: React.RefObject<Partial<Rect>>;
  appletId: string;
}
function useAppletMinMax({
  appletRect,
  appletRef,
  appletId,
}: UseAppletMinMaxParams) {
  const contentRef = useAppletManagerStore((s) => s.contentRef);
  const hideApplet = useAppletManagerStore((s) => s.hideApplet);

  function maximize() {
    const boundary = contentRef.current?.getBoundingClientRect();
    const window = appletRef.current;
    if (!contentRef.current || !boundary || !window) {
      return;
    }

    appletRect.current.top = 0;
    appletRect.current.left = 0;
    appletRect.current.width = boundary.width;
    appletRect.current.height = boundary.height;

    window.style.top = toPx(0);
    window.style.left = toPx(0);
    window.style.width = toPx(boundary.width);
    window.style.height = toPx(boundary.height);
  }

  function minimize() {
    hideApplet(appletId);
  }

  return {
    maximize,
    minimize,
  };
}

export default useAppletMinMax;
