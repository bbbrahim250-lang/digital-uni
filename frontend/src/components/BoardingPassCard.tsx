import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/src/theme";
import { IMAGES } from "@/src/data/appData";

export type BoardingPassCardProps = {
  tag: string;              // e.g. "SCHOOL OF AI" / "AI LAB RESEARCH"
  title: string;            // event/campaign title
  subtitle: string;         // one-line description
  priceLabel: string;       // e.g. "$125 – $2,000"
  refId: string;            // e.g. "DU-HALLOWEEN-2026"
  pillLabel: string;        // e.g. "ADMIT ONE" or "SUPPORTER"
  panelKicker?: string;     // e.g. "EVENT TICKET" or "DONATION TICKET"
  testID?: string;
};

export default function BoardingPassCard({
  tag, title, subtitle, priceLabel, refId, pillLabel,
  panelKicker = "EVENT TICKET", testID,
}: BoardingPassCardProps) {
  return (
    <View testID={testID} style={styles.card}>
      {/* Brand header strip */}
      <View style={styles.brandStrip}>
        <Text style={styles.brandLeft}>
          <Text style={styles.brandLeftPri}>DIGITAL-UNI </Text>
          <Text style={styles.brandLeftAcc}>AI TRAIN</Text>
        </Text>
        <Text style={styles.brandRight}>LEARN · CERTIFY · BUILD · BELONG</Text>
      </View>

      {/* Two-column body */}
      <View style={styles.body}>
        {/* Left: photo + copy */}
        <View style={styles.leftCol}>
          <Image source={IMAGES.stations} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient
            colors={["rgba(10,14,31,0.35)", "rgba(10,14,31,0.85)"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.leftContent}>
            <View style={styles.schoolPill}>
              <Text style={styles.schoolPillTxt}>{tag}</Text>
            </View>
            <Text style={styles.eventTitle}>{title}</Text>
            <Text style={styles.eventSub}>{subtitle}</Text>
          </View>
        </View>

        {/* Right: price panel */}
        <View style={styles.rightCol}>
          <Text style={styles.rightKickerTop}>BOARDING PASS</Text>
          <Text style={styles.rightKickerSub}>{panelKicker}</Text>
          <Text style={styles.rightPriceLabel}>TICKET PRICE</Text>
          <Text style={styles.rightPrice}>{priceLabel}</Text>
        </View>
      </View>

      {/* Cream footer with QR + ID + pill */}
      <View style={styles.cream}>
        <View style={styles.qrMini}>
          <View style={styles.qrGrid}>
            {Array.from({ length: 9 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.qrCell,
                  { backgroundColor: [0, 2, 3, 5, 6, 8].includes(i) ? "#000" : "#fff" },
                ]}
              />
            ))}
          </View>
        </View>
        <Text style={styles.refId}>{refId}</Text>
        <View style={styles.admitPill}>
          <Text style={styles.admitPillTxt}>{pillLabel}</Text>
        </View>
      </View>

      {/* Tagline strip */}
      <View style={styles.tagStrip}>
        <Text style={styles.tagStripTxt}>EDUCATION HAS NO BORDERS.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
  },
  brandStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#0a1a2e",
  },
  brandLeft: { fontSize: 11, fontWeight: "700", letterSpacing: 1 },
  brandLeftPri: { color: colors.brandTertiary },
  brandLeftAcc: { color: colors.brandSecondary },
  brandRight: { color: colors.onSurfaceSecondary, fontSize: 9, fontWeight: "600", letterSpacing: 1 },
  body: { flexDirection: "row", minHeight: 160 },
  leftCol: {
    flex: 3,
    position: "relative",
    overflow: "hidden",
  },
  leftContent: { padding: 12, justifyContent: "space-between", flex: 1 },
  schoolPill: {
    backgroundColor: colors.brandTertiary,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  schoolPillTxt: { color: "#0a0e1f", fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  eventTitle: { color: colors.onSurface, fontSize: 15, fontWeight: "700", marginTop: 12, lineHeight: 20 },
  eventSub: { color: colors.onSurfaceSecondary, fontSize: 11, marginTop: 8, lineHeight: 16 },
  rightCol: {
    flex: 1,
    backgroundColor: "#0d1a2e",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: "rgba(154,163,189,0.15)",
    borderStyle: "dashed",
  },
  rightKickerTop: { color: colors.onSurfaceSecondary, fontSize: 8, fontWeight: "700", letterSpacing: 1.5 },
  rightKickerSub: { color: colors.onSurfaceTertiary, fontSize: 7, fontWeight: "600", letterSpacing: 1, marginTop: 2 },
  rightPriceLabel: { color: colors.onSurfaceSecondary, fontSize: 8, fontWeight: "700", letterSpacing: 1.5, marginTop: 14 },
  rightPrice: { color: colors.brandTertiary, fontSize: 15, fontWeight: "700", marginTop: 4, textAlign: "center", lineHeight: 20 },
  cream: {
    backgroundColor: colors.surfaceInverse,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  qrMini: {
    width: 32, height: 32, backgroundColor: "#fff",
    borderWidth: 1, borderColor: "#000",
    alignItems: "center", justifyContent: "center", padding: 2,
  },
  qrGrid: {
    flex: 1, flexDirection: "row", flexWrap: "wrap", width: "100%", height: "100%",
  },
  qrCell: { width: "33.33%", height: "33.33%" },
  refId: {
    flex: 1, color: colors.ticketBodyMuted, fontSize: 10, fontWeight: "700", letterSpacing: 1,
  },
  admitPill: {
    backgroundColor: colors.brandTertiary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  admitPillTxt: { color: "#0a0e1f", fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  tagStrip: {
    backgroundColor: "#0a1a2e",
    paddingVertical: 6,
    alignItems: "center",
  },
  tagStripTxt: { color: colors.onSurfaceSecondary, fontSize: 9, fontStyle: "italic", letterSpacing: 1.5 },
});
