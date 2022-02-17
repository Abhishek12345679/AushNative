import React from 'react';
import {View, Text, Switch, StyleSheet} from 'react-native';

const SwitchGroup = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.label}</Text>
      <Switch onValueChange={props.onValueChange} value={props.value} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
    height: 75,
  },
  text: {
    fontWeight: 'normal',
    fontSize: 18,
  },
});

export default SwitchGroup;
