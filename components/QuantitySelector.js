import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

import {AntDesign} from '@expo/vector-icons';
import {colors} from '../constants/colors';

const QuantitySelector = props => {
  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.input}
          value={props.quantity}
          editable={false}
        />
      </View>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingVertical: 10,
        }}>
        <AntDesign
          name="plus"
          size={20}
          color="#fff"
          onPress={props.onIncrease}
        />
        <AntDesign
          name="minus"
          size={20}
          color="#fff"
          onPress={props.onDecrease}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.SECONDARY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    width: 80,
    borderRadius: 10,
    paddingHorizontal: 3,
  },
  input: {
    backgroundColor: '#fff',
    height: 65,
    width: 50,
    marginStart: 0,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    fontSize: 30,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
});

export default QuantitySelector;
