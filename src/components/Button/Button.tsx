import React, { CSSProperties } from "react";
import clsx from "clsx";

import theme, { ThemeColor } from "../../theme";

import "./Button.scss";

type SizeValue = `${number}%` | number | "auto";
type BoxSizes = Partial<{ width: SizeValue; height: SizeValue }>;
type ButtonSize = SizeValue | BoxSizes;
type AspectRatio = `${number}/${number}`;
type CornerRadiuses = Partial<{
  tl: SizeValue;
  tr: SizeValue;
  bl: SizeValue;
  br: SizeValue;
}>;
type Radius = SizeValue | CornerRadiuses;

interface ButtonProps {
  onClick(): void;
  size?: ButtonSize;
  children?: React.ReactNode;
  backgroundColor?: ThemeColor;
  color?: ThemeColor;
  className?: string;
  ratio?: AspectRatio;
  radius?: Radius;
}

function Button({
  onClick,
  size = "100%",
  backgroundColor = "primary1",
  ratio = "1/1",
  radius = 4,
  color,
  className,
  children,
}: ButtonProps) {
  // Would be good to avoid sto many inline styles.
  // Too many variations to build into CSS classes.
  // Could maybe to something with CSS vars
  // Could maybe move to styles components, but that would involve too much refactoring
  // Could maybe use emotion/css to dynamically build style class
  const styles: CSSProperties = {
    ...getSizeStyles(size),
    ...getRadiusStyles(radius),
    backgroundColor: theme.color[backgroundColor],
    color: color && theme.color[color],
    aspectRatio: ratio,
  };

  return (
    <button
      className={clsx("button", className)}
      style={styles}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function getRadiusStyles(radius: Radius | undefined):
  | {
      borderRadius: CSSProperties["borderRadius"];
    }
  | Partial<{
      borderTopLeftRadius: CSSProperties["borderTopLeftRadius"];
      borderTopRightRadius: CSSProperties["borderTopRightRadius"];
      borderBottomLeftRadius: CSSProperties["borderBottomLeftRadius"];
      borderBottomRightRadius: CSSProperties["borderBottomRightRadius"];
    }>
  | undefined {
  if (!radius) return undefined;

  if (isCornerRadiuses(radius)) {
    return {
      borderTopLeftRadius: radius.tl,
      borderTopRightRadius: radius.tr,
      borderBottomLeftRadius: radius.bl,
      borderBottomRightRadius: radius.br,
    };
  }

  return { borderRadius: radius };
}

function getSizeStyles(size: ButtonSize): {
  width: CSSProperties["width"];
  height: CSSProperties["height"];
} {
  let width;
  let height;

  if (isBoxSizes(size)) {
    width = size.width ?? "auto";
    height = size.height ?? "auto";
  } else {
    width = size;
    height = size;
  }

  return { height, width };
}

function isBoxSizes(size: ButtonSize): size is BoxSizes {
  const boxSizes = size as BoxSizes;
  if (!boxSizes) return false;
  return boxSizes.height !== undefined || boxSizes.width !== undefined;
}

function isCornerRadiuses(radius: Radius): radius is CornerRadiuses {
  const corners = radius as CornerRadiuses;
  if (!radius) return false;
  return (
    corners.tl !== undefined ||
    corners.tr !== undefined ||
    corners.bl !== undefined ||
    corners.br !== undefined
  );
}

export default Button;
