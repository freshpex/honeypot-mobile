import { StyleSheet } from "react-native";
import { useAppearanceStore } from "@/shared/state/appearance-store";

export const theme = {
  colors: {
    honey: "#F5B841",
    leaf: "#2F7D32",
    charcoal: "#202124",
    cream: "#FFF9ED",
  },
};

const darkColorMap: Record<string, string> = {
  "#FAF9F8": "#151312",
  "#FFFFFF": "#221E1B",
  "#FFF9ED": "#201914",
  "#FFF8E4": "#2A2114",
  "#FFF8DD": "#2A2114",
  "#FFF4D8": "#2A2114",
  "#FFF3EE": "#2B1D18",
  "#FFF0EA": "#2B1D18",
  "#FFF0E9": "#2B1D18",
  "#FFEAE2": "#342018",
  "#FFE8DF": "#342018",
  "#FFE7DF": "#FFE8DF",
  "#FFE0D6": "#3A241B",
  "#FFD1C1": "#6B3324",
  "#FFD0C0": "#6B3324",
  "#FFCCBA": "#6B3324",
  "#FFC0AA": "#7B3C2A",
  "#FFB69E": "#7B3C2A",
  "#FFB59E": "#7B3C2A",
  "#FF8B68": "#B94725",
  "#FF7A52": "#B94725",
  "#FFA083": "#C85E3D",
  "#FF4A17": "#FF6B3A",
  "#C8320D": "#FF7C55",
  "#D33B14": "#FF7C55",
  "#E6E2DE": "#3C352F",
  "#EEEAE6": "#3A332D",
  "#EEE7E2": "#3A332D",
  "#EFEAE6": "#3A332D",
  "#E9E4E0": "#3A332D",
  "#E8E2DD": "#3A332D",
  "#E4DFDA": "#3A332D",
  "#E2DDD8": "#3A332D",
  "#E1DBD5": "#3A332D",
  "#DEDAD6": "#3A332D",
  "#DDD8D3": "#3A332D",
  "#DCD6D0": "#4A423B",
  "#D6D0CB": "#4A423B",
  "#C9C5C1": "#756C64",
  "#B7B1AC": "#756C64",
  "#9D9690": "#AFA7A0",
  "#9B9691": "#AFA7A0",
  "#9A948F": "#AFA7A0",
  "#96928E": "#5B534C",
  "#8F8983": "#AFA7A0",
  "#8F8A85": "#AFA7A0",
  "#8E8A86": "#AFA7A0",
  "#8D8781": "#AFA7A0",
  "#8B8580": "#AFA7A0",
  "#8A847F": "#AFA7A0",
  "#837D77": "#AFA7A0",
  "#817B75": "#BFB6AE",
  "#77716B": "#B5ADA5",
  "#706A65": "#C5BCB3",
  "#6C5A51": "#D1C5BB",
  "#4F4640": "#E2D8CF",
  "#302A26": "#E8DDD4",
  "#27231F": "#F4EDE7",
  "#191817": "#F8F2ED",
  "#181817": "#F8F2ED",
  "#171513": "#FFF8F1",
  "#161616": "#FFF8F1",
  "#202124": "#FFF8F1",
  "#F8F6F4": "#26211E",
  "#F5F2EF": "#2A2521",
  "#F2EFED": "#2A2521",
  "#F1EFED": "#2A2521",
  "#CFF8DF": "#133D2A",
  "#E8FBF3": "#133D2A",
  "#EAFBF2": "#133D2A",
  "#E9FFF3": "#133D2A",
  "#91E6B4": "#287A52",
  "#89E6AD": "#287A52",
  "#57D9A4": "#287A52",
  "#45D49D": "#287A52",
  "#2CC979": "#55E0A0",
  "#26B97A": "#55E0A0",
  "#14B86E": "#55E0A0",
  "#12B76A": "#55E0A0",
  "#08A46B": "#55E0A0",
  "#087A3B": "#8EF0BD",
  "#E8F7FF": "#132C3A",
  "#EBF7FF": "#132C3A",
  "#EAF7FF": "#132C3A",
  "#ECF8FF": "#132C3A",
  "#BFE8FF": "#2E6F91",
  "#34A8F4": "#76C9FF",
  "#1A9BE8": "#76C9FF",
  "#16A3FF": "#76C9FF",
  "#1479B8": "#A6DDFF",
  "#EDF1FF": "#1B2440",
  "#F0EAFE": "#241A3A",
  "#7E48E8": "#B694FF",
  "#FFF0C9": "#3A2B13",
  "#F3DE98": "#7A611F",
  "#F8D889": "#7A611F",
  "#F2A300": "#FFC857",
  "#F0BE42": "#FFC857",
  "#F0A000": "#FFC857",
  "#F59E0B": "#FFC857",
  "#FFB020": "#FFC857",
  "#E88700": "#FFB947",
  "#D77600": "#FFD480",
  "#B46F00": "#FFD480",
  "#9A6A00": "#FFD480",
  "#9A6500": "#FFD480",
  "#16274A": "#101828",
  "#000000": "#000000",
};

const darkRgbaMap: Record<string, string> = {
  "rgba(255, 255, 255, 0.96)": "rgba(34, 30, 27, 0.96)",
  "rgba(255, 255, 255, 0.88)": "rgba(34, 30, 27, 0.88)",
  "rgba(255, 255, 255, 0.86)": "rgba(34, 30, 27, 0.86)",
  "rgba(255,255,255,0.92)": "rgba(34,30,27,0.92)",
  "rgba(255,255,255,0.88)": "rgba(34,30,27,0.88)",
  "rgba(255,255,255,0.25)": "rgba(255,255,255,0.18)",
  "rgba(255,255,255,0.24)": "rgba(255,255,255,0.16)",
  "rgba(255,255,255,0.2)": "rgba(255,255,255,0.14)",
  "rgba(255,255,255,0.18)": "rgba(255,255,255,0.12)",
  "rgba(255,255,255,0.16)": "rgba(255,255,255,0.12)",
  "rgba(0,0,0,0.76)": "rgba(0,0,0,0.82)",
};

const colorProperties = new Set([
  "backgroundColor",
  "borderBottomColor",
  "borderColor",
  "borderLeftColor",
  "borderRightColor",
  "borderTopColor",
  "color",
  "shadowColor",
  "textDecorationColor",
  "tintColor",
]);

export const resolveThemeColor = (value: string) => {
  if (useAppearanceStore.getState().mode !== "dark") {
    return value;
  }

  return darkColorMap[value] ?? darkColorMap[value.toUpperCase()] ?? darkRgbaMap[value] ?? value;
};

const resolveStyle = (style: unknown) => {
  const flatStyle = StyleSheet.flatten(style);

  if (!flatStyle) {
    return flatStyle;
  }

  const themedStyle: Record<string, unknown> = { ...flatStyle };

  for (const key of Object.keys(themedStyle)) {
    const value = themedStyle[key];
    if (typeof value === "string" && colorProperties.has(key)) {
      themedStyle[key] = resolveThemeColor(value);
    }
  }

  return themedStyle;
};

export const createThemedStyleSheet = <T extends StyleSheet.NamedStyles<T>>(
  styles: T,
) => {
  const createdStyles = StyleSheet.create(styles);

  return new Proxy(createdStyles, {
    get(target, property: string) {
      const value = target[property as keyof T];
      if (typeof property === "string" && value) {
        return resolveStyle(value);
      }
      return value;
    },
  }) as T;
};

export const skeuo = {
  action: {
    shadowColor: "#FF4A17",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 14,
  },
  card: {
    shadowColor: "#6B3B21",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  deepCard: {
    shadowColor: "#6B3B21",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
  },
  floating: {
    shadowColor: "#201B18",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
  },
  inset: {
    borderTopColor: "rgba(255,255,255,0.88)",
    borderTopWidth: 1,
  },
  pressed: {
    shadowColor: "#6B3B21",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
};

