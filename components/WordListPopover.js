import {
  Menu,
  MenuOptions,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";
import { Text, View, StyleSheet } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

const { Popover } = renderers;

const WordListPopover = (props) => {
  const word = props.word;
  return (
    <Menu renderer={Popover} rendererProps={{ preferredPlacement: "bottom" }}>
      <MenuTrigger style={props.menuTrigger} onPress={props.onPress}>
        <Text>{word.text}</Text>
        {/* {props.children} */}
      </MenuTrigger>
      <MenuOptions style={styles.menuOptions}>{props.options}</MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backdrop: {},
  menuOptions: {
    padding: 50,
  },
  menuTrigger: {
    padding: 5,
  },
  triggerText: {
    fontSize: 20,
  },
  contentText: {
    fontSize: 18,
  },
});

export default WordListPopover;
