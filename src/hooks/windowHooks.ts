import { useEffect, useState } from "react";

type UseViewportReturn = [width: number, height: number];
export function useViewport(): UseViewportReturn {
  const [viewport, setViewport] = useState<UseViewportReturn>([0, 0]);

  useEffect(() => {
    const handleResize = () =>
      setViewport([window.innerWidth, window.innerHeight]);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return viewport;
}
