import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/src/theme";
import { BTC_RATE_USD, BTC_AS_OF } from "@/src/data/appData";

type Row = { label: string; value: string };
export type TicketProps = {
  kicker: string;
  kickerRight?: string;
  title: string;
  refId: string;
  rows: Row[];
  qrLabel: string;
  totalLabel: string;
  totalValue: string;
  subLine?: string;
  footer: string;
  showBtcBadge?: boolean;
  btcUsdAmount?: number;
  testID?: string;
};

export default function Ticket({
  kicker,
  kickerRight,
  title,
  refId,
  rows,
  qrLabel,
  totalLabel,
  totalValue,
  subLine,
  footer,
  showBtcBadge,
  btcUsdAmount,
  testID,
}: TicketProps) {
  const btc = btcUsdAmount ? (btcUsdAmount / BTC_RATE_USD).toFixed(btcUsdAmount >= 100 ? 4 : 6) : null;
  return (
    <View style={styles.wrap} testID={testID}>
      <LinearGradient colors={["#0d3520", "#0a2416"]} style={styles.header}>
        <View style={styles.headerRow}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <View style={styles.logoMark}>
              <Text style={styles.logoMarkTxt}>UNI</Text>
            </View>
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.brand}>DIGITAL-UNI</Text>
              <Text style={styles.microTag}>{kickerRight || "Moving at the speed of learning"}</Text>
            </View>
          </View>
          <Text style={styles.kicker}>{kicker}</Text>
        </View>
        <View style={styles.rail}>
          <View style={styles.dot} />
          <View style={styles.line} />
          <View style={styles.dot} />
          <View style={styles.line} />
          <View style={styles.dot} />
          <Text style={{ color: colors.brandPrimary, fontSize: 16, marginLeft: 6 }}>🚄</Text>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.bodyTop}>
          <Text style={styles.bodyTitle}>{title}</Text>
          <Text style={styles.refId}>{refId}</Text>
        </View>
        {rows.map((r, i) => (
          <View key={i} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{r.label}</Text>
            <Text style={styles.detailValue}>{r.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.perf}>
        <View style={[styles.punch, { left: -8 }]} />
        <View style={styles.dash} />
        <View style={[styles.punch, { right: -8 }]} />
      </View>

      <View style={[styles.body, { paddingTop: 12 }]}>
        <View style={styles.qrRow}>
          <View style={styles.qrBlock}>
            <View style={styles.qrBox}>
              <Text style={{ fontSize: 32 }}>⬛</Text>
            </View>
            <Text style={styles.qrLabel}>{qrLabel}</Text>
            <Text style={styles.qrRef}>{refId}</Text>
          </View>
          <View style={{ alignItems: "flex-end", flex: 1 }}>
            <Text style={styles.totalLabel}>{totalLabel}</Text>
            <Text style={styles.totalValue}>{totalValue}</Text>
            {subLine ? <Text style={styles.subLine}>{subLine}</Text> : null}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerTxt}>{footer}</Text>
      </View>

      {showBtcBadge && btc && (
        <LinearGradient
          colors={["#f2a93c", "#c8871f"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.btcBadge}
        >
          <Text style={styles.btcLabel}>DIGITAL VALUE EQUIVALENT</Text>
          <Text style={styles.btcAmount}>₿ {btc}</Text>
          <Text style={styles.btcDisc}>Reference BTC rate, {BTC_AS_OF} · not a live feed</Text>
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    overflow: "visible",
    backgroundColor: colors.surfaceInverse,
    marginVertical: 12,
  },
  header: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  headerRow: { flexDirection: "row", alignItems: "center" },
  logoMark: {
    width: 28, height: 28, borderRadius: 6,
    backgroundColor: colors.brandTertiary,
    alignItems: "center", justifyContent: "center",
  },
  logoMarkTxt: { color: "#0a0e1f", fontSize: 9, fontWeight: "700" },
  brand: { color: colors.onSurface, fontSize: 12, fontWeight: "700", letterSpacing: 1 },
  microTag: { color: colors.onSurfaceSecondary, fontSize: 8 },
  kicker: { color: colors.brandTertiary, fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  rail: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.brandPrimary },
  line: { flex: 1, height: 1, backgroundColor: "rgba(52,224,138,0.4)", marginHorizontal: 4 },
  body: {
    backgroundColor: colors.surfaceInverse,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bodyTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  bodyTitle: { color: colors.ticketBodyText, fontSize: 13, fontWeight: "700", letterSpacing: 1, flex: 1 },
  refId: { color: colors.brandSecondary, fontSize: 11, fontWeight: "700" },
  detailRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 4 },
  detailLabel: { color: colors.ticketBodyMuted, fontSize: 9, letterSpacing: 1, fontWeight: "600" },
  detailValue: { color: colors.ticketBodyText, fontSize: 11, fontWeight: "600", maxWidth: "60%", textAlign: "right" },
  perf: {
    height: 16, backgroundColor: colors.surfaceInverse,
    flexDirection: "row", alignItems: "center", position: "relative",
  },
  dash: { flex: 1, height: 1, borderTopWidth: 1, borderTopColor: colors.ticketBodyMuted, borderStyle: "dashed", marginHorizontal: 8 },
  punch: {
    position: "absolute", width: 16, height: 16, borderRadius: 8,
    backgroundColor: colors.surface, top: 0,
  },
  qrRow: { flexDirection: "row", alignItems: "center" },
  qrBlock: { alignItems: "flex-start" },
  qrBox: {
    width: 56, height: 56, backgroundColor: "#fff", alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#000",
  },
  qrLabel: { color: colors.ticketBodyMuted, fontSize: 8, marginTop: 4, letterSpacing: 1 },
  qrRef: { color: colors.ticketBodyMuted, fontSize: 7, marginTop: 2 },
  totalLabel: { color: colors.ticketBodyMuted, fontSize: 9, letterSpacing: 1 },
  totalValue: { color: colors.ticketBodyText, fontSize: 18, fontWeight: "700", marginTop: 2 },
  subLine: { color: colors.ticketBodyMuted, fontSize: 9, marginTop: 2 },
  footer: {
    backgroundColor: colors.brandPrimary,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
  },
  footerTxt: { color: colors.onBrand, fontSize: 11, fontWeight: "700", letterSpacing: 1 },
  btcBadge: {
    marginTop: 10, borderRadius: 12, padding: 12, alignItems: "center",
  },
  btcLabel: { color: "#0a0e1f", fontSize: 9, fontWeight: "700", letterSpacing: 2 },
  btcAmount: { color: "#0a0e1f", fontSize: 20, fontWeight: "700", marginTop: 4 },
  btcDisc: { color: "rgba(10,14,31,0.7)", fontSize: 8, marginTop: 4 },
});
