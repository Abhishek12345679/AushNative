import { useState, useEffect } from "react";
import { NativeModules, StatusBar, Platform } from "react-native";
import get from "lodash/get";

const { StatusBarManager } = NativeModules;

export default function useStatusBarHeight() {
  // Initialize w/ currentHeight b/c StatusBar.currentHeight works properly on android on Android
  const [height, setHeight] = useState(StatusBar.currentHeight || 0);

  useEffect(() => {
    if (Platform.OS !== "ios") return;

    StatusBarManager.getHeight(({ height }: { height: number }) => {
      setHeight(height);
    });
    // const listener = StatusBar.addListener(
    //   "statusBarFrameWillChange",
    //   (data: unknown) => {
    //     setHeight(get(data, "statusBarData.frame.height", 0));
    //   }
    // );

    // return () => listener.remove();
  }, []);

  return height;
}
