import { useRef } from "react";
import {
  CSSDimensions,
  Dimensions,
  MinDimensions,
  Position,
} from "../../hooks/mouseHooks/useDragToResize";
import useAppletManagerStore, {
  BaseProps,
} from "../../stores/useAppletManagerStore";
import "./Applet.scss";
import usePositionableElement from "../../hooks/mouseHooks/usePositionableElement";
import clsx from "clsx";

interface AppletProps extends BaseProps {
  title: string;
  id: string;
  initialDimensions: CSSDimensions;
  initialPosition: Position;
  maxDimensions?: Dimensions;
  minDimensions?: MinDimensions;
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
}: AppletProps) {
  const closeApplet = useAppletManagerStore((s) => s.closeApplet);
  const focusApplet = useAppletManagerStore((s) => s.focusApplet);

  // Need a ref to point to the app for moving it around the screen
  const appRef = useRef<HTMLDivElement | null>(null);

  const {
    moveHandle,
    resizeHandleE,
    resizeHandleN,
    resizeHandleNE,
    resizeHandleNW,
    resizeHandleS,
    resizeHandleSE,
    resizeHandleSW,
    resizeHandleW,
  } = usePositionableElement({
    elementRef: appRef,
    initialPosition,
    minDimensions,
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
      <div
        className={clsx("applet__corner", "applet__corner--nw")}
        ref={resizeHandleNW}
      />
      <div
        className={clsx("applet__edge", "applet__edge--n")}
        ref={resizeHandleN}
      />
      <div
        className={clsx("applet__corner", "applet__corner--ne")}
        ref={resizeHandleNE}
      />
      <div
        className={clsx("applet__edge", "applet__edge--e")}
        ref={resizeHandleE}
      />

      <div
        className={clsx("applet__title-bar", "drag-to-move")}
        ref={moveHandle}
      >
        <div className={clsx("applet__title-wrapper", "drag-to-move")}>
          <span className={clsx("applet__title", "drag-to-move")}>{title}</span>
        </div>

        <div className={clsx("applet__window-buttons-wrapper", "drag-to-move")}>
          <div className="applet__window-buttons">
            <button
              className={clsx(
                "applet__window-button",
                "applet__window-button--close"
              )}
              onClick={handleClose}
            >
              X
            </button>
          </div>
        </div>
      </div>

      <div className="applet__content">{children}</div>

      <div
        className={clsx("applet__corner", "applet__corner--sw")}
        ref={resizeHandleSW}
      />
      <div
        className={clsx("applet__edge", "applet__edge--s")}
        ref={resizeHandleS}
      />
      <div
        className={clsx("applet__corner", "applet__corner--se")}
        ref={resizeHandleSE}
      />
      <div
        className={clsx("applet__edge", "applet__edge--w")}
        ref={resizeHandleW}
      />
    </div>
  );
}

export default Applet;
