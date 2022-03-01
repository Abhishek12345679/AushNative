import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import { AntDesign } from '@expo/vector-icons';
import { colors } from '../constants/colors';

interface QuantitySelectorProps {
  quantity: string;
  onIncrease: () => void;
  onDecrease: () => void;
}

const QuantitySelector = ({ quantity, onDecrease, onIncrease }: QuantitySelectorProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={quantity}
        editable={false}
      />
      <View>
        <AntDesign
          name="plus"
          size={20}
          color="#fff"
          style={{
            marginBottom: 7,
          }}
          onPress={onIncrease}
        />
        <AntDesign
          name="minus"
          size={20}
          color="#fff"
          onPress={onDecrease}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: 70,
    backgroundColor: colors.SECONDARY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    paddingEnd: 5,
  },
  input: {
    backgroundColor: '#FFF',
    height: 60,
    width: 40,
    textAlign: 'center',
    fontSize: 35,
    fontWeight: 'bold',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    color: "#000",
  },
});

export default QuantitySelector;
