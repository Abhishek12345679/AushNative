import React from 'react';
import { View, Text } from 'react-native';

interface TagProps {
  value?: string;
  bgc: string;
  textColor: string;
  label?: string;
}

const Tag = ({ value, bgc, label, textColor }: TagProps) => {
  return (
    <View
      style={{
        backgroundColor: bgc,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderRadius: 20,
        marginEnd: 10,
        width: 120,
        height: 35,
        marginBottom: 10,
      }}>
      {value && (
        <View style={{ width: 25, height: 25, marginEnd: 10 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>{value}</Text>
        </View>
      )}
      <Text style={{ fontWeight: '500', color: textColor }}>
        {label}
      </Text>
    </View>
  );
};

export default Tag;
