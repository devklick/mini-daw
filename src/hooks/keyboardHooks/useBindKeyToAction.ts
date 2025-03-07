import { useEffect } from "react";
import { KeyCode, isKeyCode } from "./keyCode";

interface UseBindKeyToActionProps {
  keys: Array<KeyCode>;
  actions: Array<() => void>;
}

function useBindKeyToAction({ keys, actions }: UseBindKeyToActionProps) {
  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (isKeyCode(event.code) && keys.includes(event.code)) {
        actions.forEach((action) => action());
      }
    }

    window?.addEventListener("keydown", handler);

    return () => {
      window?.removeEventListener("keydown", handler);
    };
  }, [actions, keys]);
}

export default useBindKeyToAction;
