import React, { useEffect } from "react";

interface UseDetectMouseDownOutsideProps<Element extends HTMLElement> {
  /**
   * A reference to the top-most element./
   * Clicks on any parents of this element will trigger the callback.
   * Clicking this element or any of it's children will not trigger the callback.
   */
  elementRef?: React.RefObject<Element | null>;

  /**
   * The callback to be invoked when a mouse down
   * has been detected outside the element
   */
  onMouseDown: () => void;

  enabled?: boolean;

  mouseButtons?: Array<"left" | "right">;
}

/**
 * Detects a mouse down event that has occurred outside of the specified element.
 *
 * Note that the term "_outside_" refers to the DOM structure and not the
 * position that the element is displayed on screen. Any clicks on the specified
 * element of any of its children (or it's childrens childrens, recursively)
 * is considered _inside_. Everything else is considered _outside_
 */
function useDetectMouseDownOutside<Element extends HTMLElement>({
  elementRef,
  onMouseDown,
  mouseButtons = ["left"],
  enabled = true,
}: UseDetectMouseDownOutsideProps<Element>) {
  useEffect(() => {
    if (!enabled) return;

    function handler(event: MouseEvent) {
      if (!elementRef) return;
      if (!elementRef.current || elementRef.current === event.target) {
        return;
      }

      let call = true;
      function process(children: HTMLCollection) {
        for (const child of children) {
          if (child === event.target) {
            call = false;
            return;
          }

          if (child.children) {
            process(child.children);
          }
        }
      }

      if (elementRef.current.children) {
        process(elementRef.current.children);
      }

      if (call) {
        onMouseDown();
      }
    }

    if (mouseButtons.includes("left")) {
      window.addEventListener("mousedown", handler);
    }
    if (mouseButtons.includes("right")) {
      window.addEventListener("contextmenu", handler);
    }

    return () => {
      if (mouseButtons.includes("left")) {
        window.removeEventListener("mousedown", handler);
      }
      if (mouseButtons.includes("right")) {
        window.removeEventListener("contextmenu", handler);
      }
    };
  }, [elementRef, enabled, mouseButtons, onMouseDown]);
}

export default useDetectMouseDownOutside;
