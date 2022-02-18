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
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderRadius: 10,
        marginEnd: 10,
        marginBottom: 10,

        elevation: 10,

        paddingHorizontal: 20,
        paddingVertical: 10,
        height: 45,
      }}>
      <Text style={{ color: textColor, fontSize: 12 }}>
        {label}
      </Text>
      {value && <Text style={{ color: textColor, fontWeight: 'bold' }}>{value}</Text>}
    </View>
  );
};

export default Tag;
