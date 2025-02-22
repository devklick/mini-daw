import React, { useEffect, useRef } from "react";
import useToggle from "../../../hooks/stateHooks/useToggle";

interface UseContextMenuParams<Element extends HTMLElement> {
  targetElement: React.RefObject<Element | null>;
}

interface UseContextMenuReturnOpen {
  isOpen: true;
  position: { x: number; y: number };
  close(): void;
}

interface UseContextMenuReturnClosed {
  isOpen: false;
}
export type UseContextMenuReturn =
  | UseContextMenuReturnOpen
  | UseContextMenuReturnClosed;

function useContextMenu<Element extends HTMLElement>({
  targetElement,
}: UseContextMenuParams<Element>): UseContextMenuReturn {
  const [isOpen, { setToggle: setOpen }] = useToggle();
  const position = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (!targetElement.current) return;

    function handleRightClick(e: MouseEvent) {
      position.current = { x: e.clientX, y: e.clientY };
      e.stopPropagation();
      e.preventDefault();
      setOpen(true);
    }
    targetElement.current.addEventListener("contextmenu", handleRightClick);
  }, [setOpen, targetElement]);

  const setClosed = () => setOpen(false);

  return {
    isOpen: isOpen,
    position: position.current,
    close: setClosed,
  };
}

export default useContextMenu;
