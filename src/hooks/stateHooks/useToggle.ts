import { useState } from "react";

function useToggle(initState?: boolean | (() => boolean)) {
  const [value, setToggle] = useState(initState ?? false);
  const toggle = () => setToggle((value) => !value);

  return [value, { toggle, setToggle }] as const;
}

export default useToggle;
