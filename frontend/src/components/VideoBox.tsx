import React from "react";
import { StyleSheet, View } from "react-native";
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
