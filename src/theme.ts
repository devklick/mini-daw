function getCSSVar(name: string, prefix: string = "--") {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`${prefix}${name}`)
    .trim();
}

export type ThemeColor = keyof (typeof theme)["color"];

const theme = {
  color: {
    // Polar Night
    get base1() {
      return getCSSVar("color-base-1");
    },
    get base2() {
      return getCSSVar("color-base-2");
    },
    get base3() {
      return getCSSVar("color-base-3");
    },
    get base4() {
      return getCSSVar("color-base-4");
    },

    // Snow Storm
    get light1() {
      return getCSSVar("color-light-1");
    },
    get light2() {
      return getCSSVar("color-light-2");
    },
    get light3() {
      return getCSSVar("color-light-3");
    },

    // Frost
    get primary1() {
      return getCSSVar("color-primary-1");
    },
    get primary2() {
      return getCSSVar("color-primary-2");
    },
    get primary3() {
      return getCSSVar("color-primary-3");
    },
    get primary4() {
      return getCSSVar("color-primary-4");
    },

    // Aurora
    get accentRed() {
      return getCSSVar("color-accent-red");
    },
    get accentOrange() {
      return getCSSVar("color-accent-orange");
    },
    get accentYellow() {
      return getCSSVar("color-accent-yellow");
    },
    get accentGreen() {
      return getCSSVar("color-accent-green");
    },
    get accentPurple() {
      return getCSSVar("color-accent-purple");
    },
  },
} as const;

export default theme;
