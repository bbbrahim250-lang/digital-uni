import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors } from "@/src/theme";

export function Chip({ children, tone = "muted", testID }: { children: string; tone?: "muted" | "warning" | "success" | "error"; testID?: string }) {
  const bg =
    tone === "warning" ? colors.warningBg :
    tone === "success" ? colors.successBg :
    tone === "error" ? colors.errorBg :
    "rgba(154,163,189,0.08)";
  const border =
    tone === "warning" ? colors.warningBorder :
    tone === "success" ? colors.successBorder :
    tone === "error" ? colors.errorBorder :
    colors.border;
  const color =
    tone === "warning" ? colors.warningText :
    tone === "success" ? colors.successText :
    tone === "error" ? colors.error :
    colors.onSurfaceSecondary;
  return (
    <View testID={testID} style={[chipStyles.chip, { backgroundColor: bg, borderColor: border }]}>
      <Text style={[chipStyles.chipTxt, { color }]}>{children}</Text>
    </View>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipTxt: { fontSize: 11, fontWeight: "500" },
});

export function PrimaryButton({ label, onPress, disabled, testID, tone = "primary" }: { label: string; onPress: () => void; disabled?: boolean; testID?: string; tone?: "primary" | "gold" }) {
  const bg = disabled ? "rgba(154,163,189,0.2)" : tone === "gold" ? colors.brandTertiary : colors.brandPrimary;
  const txt = disabled ? colors.onSurfaceTertiary : "#04140b";
  return (
    <Pressable testID={testID} onPress={onPress} disabled={disabled} style={[btnStyles.btn, { backgroundColor: bg }]}>
      <Text style={[btnStyles.btnTxt, { color: txt }]}>{label}</Text>
    </Pressable>
  );
}

export function GhostButton({ label, onPress, testID }: { label: string; onPress: () => void; testID?: string }) {
  return (
    <Pressable testID={testID} onPress={onPress} style={btnStyles.ghost}>
      <Text style={btnStyles.ghostTxt}>{label}</Text>
    </Pressable>
  );
}

const btnStyles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  btnTxt: { fontSize: 14, fontWeight: "700", letterSpacing: 0.5 },
  ghost: { paddingVertical: 12, alignItems: "center", justifyContent: "center" },
  ghostTxt: { color: colors.onSurfaceSecondary, fontSize: 13, fontWeight: "500" },
});

export function PickerRow({
  label, subtitle, selected, onPress, testID,
}: { label: string; subtitle?: string; selected: boolean; onPress: () => void; testID?: string }) {
  return (
    <Pressable testID={testID} onPress={onPress} style={[pickerStyles.row, selected && pickerStyles.rowSel]}>
      <View style={{ flex: 1 }}>
        <Text style={pickerStyles.rowLabel}>{label}</Text>
        {subtitle ? <Text style={pickerStyles.rowSub}>{subtitle}</Text> : null}
      </View>
      <View style={[pickerStyles.radio, selected && pickerStyles.radioSel]}>
        {selected && <View style={pickerStyles.radioDot} />}
      </View>
    </Pressable>
  );
}

const pickerStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
    marginVertical: 4,
  },
  rowSel: { borderColor: colors.brandPrimary, backgroundColor: "rgba(52,224,138,0.05)" },
  rowLabel: { color: colors.onSurface, fontSize: 14, fontWeight: "600" },
  rowSub: { color: colors.onSurfaceSecondary, fontSize: 12, marginTop: 2 },
  radio: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    borderColor: colors.border, alignItems: "center", justifyContent: "center",
  },
  radioSel: { borderColor: colors.brandPrimary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.brandPrimary },
});

export function Card({ children, style, testID }: any) {
  return (
    <View testID={testID} style={[cardStyles.card, style]}>
      {children}
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export function SectionTitle({ children, testID }: { children: string; testID?: string }) {
  return <Text testID={testID} style={sectionStyles.title}>{children}</Text>;
}
const sectionStyles = StyleSheet.create({
  title: { color: colors.onSurface, fontSize: 20, fontWeight: "700", marginTop: 20, marginBottom: 10 },
});
