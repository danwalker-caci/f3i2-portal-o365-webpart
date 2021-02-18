import { Dictionary } from "@/types"

/** @enum */
export enum ThemeName {
  DEFAULT = "default",
  LIGHT = "light",
  DARK = "dark",
  SUMMER = "summer"
}

/** @enum */
export enum ThemeLabel {
  default = "Default",
  light = "Light",
  dark = "Dark",
  summer = "Summer"
}

/** @type */
export type Theme = Dictionary<string>

/** @enum */
export enum ThemePropertiesDictionary {
  bsPrimary = "--primary",
  bsSecondary = "--secondary",
  bsSuccess = "--success",
  bsInfo = "--info",
  bsWarning = "--warning",
  bsDanger = "--danger",
  bsLight = "--light",
  bsDark = "--dark",
  bsWhite = "--white",
  bsBlack = "--black",
  bsBlue = "--blue",
  bsIndigo = "--indigo",
  bsPurple = "--purple",
  bsPink = "--pink",
  bsRed = "--red",
  bsOrange = "--orange",
  bsYellow = "--yellow",
  bsGreen = "--green",
  bsTeal = "--teal",
  bsCyan = "--cyan",
  bsAzure = "--azure",
  bsGray = "--gray-600",
  bsGraydark = "--gray-800",
  bsGray100 = "--gray-100",
  bsGray200 = "--gray-200",
  bsGray300 = "--gray-300",
  bsGray400 = "--gray-400",
  bsGray500 = "--gray-500",
  bsGray600 = "--gray-600",
  bsGray700 = "--gray-700",
  bsGray800 = "--gray-800",
  bsGray900 = "--gray-900",

  navLinkColor = "--nav-link-color",
  navLinkBackColor = "--nav-link-bg-color",
  navLinkHoverColor = "--nav-link-hover-color",
  navLinkHoverBackColor = "--nav-link-hover-bg-color",

  sfToolbarBackground = "--tbar-default-bg"
}
