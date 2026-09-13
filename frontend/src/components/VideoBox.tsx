import React from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

type Props = {
  source: any;
  poster?: string;
  style?: any;
  contentFit?: "cover" | "contain";
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  testID?: string;
};

function resolveWebSrc(source: any): string {
  if (typeof source === "string") return source;
  // On web, require() returns either a plain URL string or an object with { uri }.
  // Image.resolveAssetSource handles both consistently.
  try {
    const resolved = Image.resolveAssetSource(source);
    if (resolved && resolved.uri) return resolved.uri;
  } catch {
    // fall through
  }
  return typeof source === "object" && source?.uri ? source.uri : String(source);
}

export default function VideoBox({
  source,
  poster,
  style,
  contentFit = "cover",
  autoPlay = true,
  loop = true,
  muted = true,
  testID,
}: Props) {
  if (Platform.OS === "web") {
    const src = resolveWebSrc(source);
    return React.createElement("video", {
      src,
      poster,
      autoPlay,
      loop,
      muted,
      playsInline: true,
      preload: "auto",
      "data-testid": testID,
      style: {
        width: "100%",
        height: "100%",
        objectFit: contentFit,
        display: "block",
        backgroundColor: "#0a0e1f",
      },
    });
  }
  return <NativeVideoBox {...{ source, style, contentFit, autoPlay, loop, muted, testID }} />;
}

function NativeVideoBox({
  source, style, contentFit = "cover", autoPlay = true, loop = true, muted = true, testID,
}: Props) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = loop;
    p.muted = muted;
    if (autoPlay) p.play();
  });
  return (
    <View testID={testID} style={[styles.wrap, style]}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFillObject}
        contentFit={contentFit}
        nativeControls={false}
        allowsFullscreen={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: "hidden" },
});
