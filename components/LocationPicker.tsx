import React from 'react';
import { Text, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

interface LocationPickerProps {
  onPress: () => void;
  location: string;
}

const LocationPicker = ({ onPress, location }: LocationPickerProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.PRIMARY,
        height: 40,
        justifyContent: 'flex-start'
      }}>
      <Text
        style={{
          marginEnd: 5,
          marginStart: Platform.OS === 'ios' ? 20 : 15,
          fontSize: 17,
          color: '#fff',
          fontWeight: 'bold'
        }}>
        {
          location.indexOf(',') === -1
            ? location
            : location.substring(0, location.indexOf(',', 2))
        }
      </Text>
      <MaterialIcons name="keyboard-arrow-down" size={24} color="#fff" />
    </TouchableOpacity>
  );
};

export default LocationPicker;
