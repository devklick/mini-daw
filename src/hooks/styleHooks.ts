import { useViewport } from "./windowHooks";

type UseBreakpointReturn = [boolean, number];
export function useBreakpoint(
  px: number,
  type: "min-height" | "max-height" | "min-width" | "max-width"
): UseBreakpointReturn {
  const [width, height] = useViewport();

  let hit: boolean;
  switch (type) {
    case "max-height":
      hit = height <= px;
      break;
    case "max-width":
      hit = width <= px;
      break;
    case "min-height":
      hit = height >= px;
      break;
    case "min-width":
      hit = width >= px;
      break;
  }

  return [hit, type.includes("height") ? height : width];
}

export function useMinHeightBreakpoint(px: number): boolean {
  const [hit] = useBreakpoint(px, "min-height");
  return hit;
}
export function useMaxHeightBreakpoint(px: number): boolean {
  const [hit] = useBreakpoint(px, "max-height");
  return hit;
}
export function useMinWidthBreakpoint(px: number): boolean {
  const [hit] = useBreakpoint(px, "min-width");
  return hit;
}
export function useMaxWidthBreakpoint(px: number): boolean {
  const [hit] = useBreakpoint(px, "max-width");
  return hit;
}
