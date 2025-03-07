function getCSSVar(name: string, prefix: string = "--") {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`${prefix}${name}`)
    .trim();
}

const theme = {
  // Polar Night
  colorBase1: getCSSVar("color-base-1"),
  colorBase2: getCSSVar("color-base-2"),
  colorBase3: getCSSVar("color-base-3"),
  colorBase4: getCSSVar("color-base-4"),

  // Snow Storm
  colorLight1: getCSSVar("color-light-1"),
  colorLight2: getCSSVar("color-light-2"),
  colorLight3: getCSSVar("color-light-3"),

  // Frost
  colorPrimary1: getCSSVar("color-primary-1"),
  colorPrimary2: getCSSVar("color-primary-2"),
  colorPrimary3: getCSSVar("color-primary-3"),
  colorPrimary4: getCSSVar("color-primary-4"),

  // Aurora
  colorAccentRed: getCSSVar("color-accent-red"),
  colorAccentOrange: getCSSVar("color-accent-orange"),
  colorAccentYellow: getCSSVar("color-accent-yellow"),
  colorAccentGreen: getCSSVar("color-accent-green"),
  colorAccentPurple: getCSSVar("color-accent-purple"),
};

export default theme;
