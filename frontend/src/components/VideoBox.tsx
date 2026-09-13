import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

type Props = {
  source: string;
  style?: any;
  contentFit?: "cover" | "contain";
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  testID?: string;
};

export default function VideoBox({
  source,
  style,
  contentFit = "cover",
  autoPlay = true,
  loop = true,
  muted = true,
  testID,
}: Props) {
  // Web: use plain HTML5 <video> — autoplay-muted + playsInline is the only
  // universally reliable path in modern browsers; expo-video's web player
  // was hitting MEDIA_ERR_SRC_NOT_SUPPORTED here.
  if (Platform.OS === "web") {
    return React.createElement("video", {
      src: source,
      autoPlay,
      loop,
      muted,
      playsInline: true,
      "data-testid": testID,
      style: {
        width: "100%",
        height: "100%",
        objectFit: contentFit,
        display: "block",
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
