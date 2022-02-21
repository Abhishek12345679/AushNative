import React from "react";
import { StyleSheet, Pressable } from "react-native";

interface RoundButtonProps {
  disabled?: boolean;
  onPress?: () => void;
  style?: {},
  children?: JSX.Element
}

const RoundButton = ({ disabled, onPress, style, children }: RoundButtonProps) => {
  return (
    <Pressable
      disabled={disabled}
      android_ripple={{
        color: "#000",
        borderless: true
      }}
      onPress={onPress}
      style={{ ...styles.button, ...style }}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    elevation: 1
  },
});

export default RoundButton;
