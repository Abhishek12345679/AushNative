import React from 'react';

import {Text, TouchableOpacity, Platform} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {colors} from '../constants/colors';

const LocationPicker = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={props.onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.PRIMARY,
        height: 40,
        // marginTop: Platform.OS === 'ios' ? 90 : 65,
      }}>
      <Text
        style={{
          marginEnd: 5,
          marginStart: Platform.OS === 'ios' ? 20 : 15,
          fontWeight: '500',
          fontSize: 16.5,
          color: '#fff',
        }}>
        {props.location.indexOf(',') === -1
          ? props.location
          : props.location.substring(0, props.location.indexOf(',', 2))}
      </Text>
      <MaterialIcons name="keyboard-arrow-down" size={24} color="#fff" />
    </TouchableOpacity>
  );
};

export default LocationPicker;
