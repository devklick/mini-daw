import { useEffect, useRef } from "react";
import clsx from "clsx";

import {
  CSSDimensions,
  Dimensions,
  MinDimensions,
  Position,
} from "../../hooks/mouseHooks/useDragToResize";
import useAppletManagerStore, {
  BaseProps,
} from "../../Applets/stores/useAppletManagerStore";
import { usePositionableElement } from "../../hooks/mouseHooks";
import Button from "../Button";

import "./Applet.scss";
import { uppercase } from "../../utils/stringUtils";

type TitleBarButton = "close" | "min" | "max";

const cardinals = ["n", "e", "s", "w"] as const;
const ordinals = ["ne", "se", "sw", "nw"] as const;

interface AppletProps extends BaseProps {
  title: string;
  id: string;
  initialDimensions: CSSDimensions;
  initialPosition: Position;
  maxDimensions?: Dimensions;
  minDimensions?: MinDimensions;
  titleBarButtons?: Partial<Record<TitleBarButton, true>>;
}

function Applet({
  id,
  initialDimensions,
  initialPosition,
  title,
  // maxDimensions,
  minDimensions = { height: "init", width: "init" },
  children,
  hidden,
  zIndex,
  onClose,
  titleBarButtons,
}: AppletProps) {
  const closeApplet = useAppletManagerStore((s) => s.closeApplet);
  const focusApplet = useAppletManagerStore((s) => s.focusApplet);

  // Need a ref to point to the app for moving it around the screen
  const appRef = useRef<HTMLDivElement | null>(null);

  const {
    moveHandle,
    maximize,
    minimize: _minimize,
    ...resizeHandles
  } = usePositionableElement({
    elementRef: appRef,
    initialPosition,
    minDimensions,
    appletId: id,
  });

  function handleClose() {
    closeApplet(id);
    onClose?.();
  }
  function handleFocus() {
    focusApplet(id);
  }

  return (
    <div
      className="applet"
      ref={appRef}
      onMouseDown={handleFocus}
      style={{
        width: initialDimensions.width,
        height: initialDimensions.height,
        top: initialPosition.y,
        left: initialPosition.x,
        zIndex,
        display: hidden ? "none" : "grid",
      }}
    >
      {/* Add the elements that will be used to resize the applet */}
      {[...cardinals, ...ordinals].map((pos) => {
        const type = pos.length === 1 ? "edge" : "corner";
        const handle = resizeHandles[`resizeHandle${uppercase(pos)}`];
        return (
          <div
            className={clsx(`applet__${type}`, `applet__${type}--${pos}`)}
            ref={handle}
            key={`handle-${pos}`}
          />
        );
      })}

      <div
        className={clsx("applet__title-bar", "drag-to-move")}
        ref={moveHandle}
      >
        <div className={clsx("applet__title-wrapper", "drag-to-move")}>
          <span className={clsx("applet__title", "drag-to-move")}>{title}</span>
        </div>

        <div className={clsx("applet__window-buttons-wrapper", "drag-to-move")}>
          <div className="applet__window-buttons">
            {titleBarButtons?.max && (
              <Button
                backgroundColor="accentGreen"
                color="light3"
                onClick={maximize}
                size={{ height: "100%" }}
                className="applet__window-button--max"
              >
                +
              </Button>
            )}
            {titleBarButtons?.close && (
              <Button
                backgroundColor="accentRed"
                color="accentYellow"
                onClick={handleClose}
                size={{ height: "100%" }}
                className="applet__window-button--close"
              >
                X
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="applet__content">{children}</div>
    </div>
  );
}

export default Applet;
