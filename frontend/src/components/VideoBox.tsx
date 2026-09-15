import React, { useEffect } from "react";
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
  if (source && typeof source === "object") {
    if (typeof source.uri === "string") return source.uri;
    if (typeof source.default === "string") return source.default;
  }
  return "";
}

function NativeVideoBox({
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
    if (autoPlay) {
      try {
        p.play();
      } catch {}
    }
  });

  // Belt-and-suspenders: some Android builds of Expo Go don't honour play()
  // inside the setup callback if the source hasn't finished loading. Kick play
  // again on every "readyToPlay" status change until the player is actually
  // playing. This is a documented pattern in the expo-video repo.
  useEffect(() => {
    if (!player || !autoPlay) return;
    const sub = player.addListener("statusChange", (status: any) => {
      const s = typeof status === "string" ? status : status?.status;
      if (s === "readyToPlay" && !player.playing) {
        try {
          player.play();
        } catch {}
      }
    });
    return () => sub.remove();
  }, [player, autoPlay]);

  return (
    <View style={[styles.wrap, style]} testID={testID}>
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

export default function VideoBox(props: Props) {
  const {
    source,
    poster,
    style,
    contentFit = "cover",
    autoPlay = true,
    loop = true,
    muted = true,
    testID,
  } = props;

  if (Platform.OS === "web") {
    const src = resolveWebSrc(source);
    return React.createElement(
      "div",
      { style: { position: "relative", width: "100%", height: "100%" } },
      poster
        ? React.createElement("img", {
            src: poster,
            style: {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: contentFit,
            },
          })
        : null,
      React.createElement("video", {
        src,
        poster,
        autoPlay,
        loop,
        muted,
        playsInline: true,
        preload: "auto",
        "data-testid": testID,
        style: {
          position: "relative",
          width: "100%",
          height: "100%",
          objectFit: contentFit,
          display: "block",
          backgroundColor: "transparent",
        },
      }),
    );
  }

  return (
    <View style={[styles.wrap, style]} testID={testID}>
      {poster ? (
        <Image
          source={{ uri: poster }}
          style={StyleSheet.absoluteFillObject}
          resizeMode={contentFit === "contain" ? "contain" : "cover"}
        />
      ) : null}
      <NativeVideoBox
        source={source}
        style={StyleSheet.absoluteFillObject}
        contentFit={contentFit}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
    backgroundColor: "#0a0e1f",
    alignItems: "center",
    justifyContent: "center",
  },
});
