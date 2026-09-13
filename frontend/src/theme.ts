// Design tokens for Digital-UNI AI Train — dark, premium, futuristic edtech.
import { useMemo } from "react";
import { Appearance, StyleSheet } from "react-native";

export type ColorScheme = "light" | "dark";

const dark = {
  // Surfaces
  surface: "#0a0e1f",
  onSurface: "#eef1f7",
  surfaceSecondary: "#10162c",
  onSurfaceSecondary: "#9aa3bd",
  surfaceTertiary: "#0d1226",
  onSurfaceTertiary: "#6f7896",
  surfaceInverse: "#f4f1e8",
  onSurfaceInverse: "#1b1f2a",
  muted: "#6f7896",

  // Brand
  brand: "#34e08a",
  onBrand: "#04140b",
  brandPrimary: "#34e08a",
  onBrandPrimary: "#04140b",
  brandSecondary: "#1fae8f",
  onBrandSecondary: "#04140b",
  brandTertiary: "#f2a93c",
  onBrandTertiary: "#0a0e1f",

  // Status
  success: "#34e08a",
  onSuccess: "#04140b",
  successBg: "rgba(52,224,138,0.1)",
  successBorder: "rgba(52,224,138,0.3)",
  successText: "#bdf5d8",
  warning: "#f2a93c",
  onWarning: "#0a0e1f",
  warningBg: "rgba(242,169,60,0.1)",
  warningBorder: "rgba(242,169,60,0.3)",
  warningText: "#f2c67a",
  error: "#ff8a8a",
  onError: "#0a0e1f",
  errorBg: "rgba(255,138,138,0.1)",
  errorBorder: "rgba(255,138,138,0.3)",
  info: "#1fae8f",
  onInfo: "#0a0e1f",

  // Lines
  border: "rgba(154,163,189,0.2)",
  borderStrong: "#1fae8f",
  divider: "rgba(154,163,189,0.1)",

  // Ticket helper
  ticketDark: "#0d3520",
  ticketBodyText: "#1b1f2a",
  ticketBodyMuted: "#3b4152",
};

export type ThemeColors = typeof dark;

export const defaultScheme = "dark" satisfies ColorScheme;

export const themes: { light?: ThemeColors; dark: ThemeColors } = { dark };

export function setColorScheme(scheme: ColorScheme | null) {
  Appearance.setColorScheme?.(scheme);
}

setColorScheme?.(defaultScheme);

export function useTheme(): { scheme: ColorScheme; colors: ThemeColors } {
  return { scheme: "dark", colors: dark };
}

export const colors = dark;

export function makeStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  factory: (colors: ThemeColors) => T & StyleSheet.NamedStyles<any>,
): () => T {
  return function useStyles(): T {
    const { colors } = useTheme();
    return useMemo(() => StyleSheet.create(factory(colors)), [colors]);
  };
}
