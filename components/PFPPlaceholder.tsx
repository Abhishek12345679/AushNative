import { View, Text } from 'react-native'
import React from 'react'
import { DPStyles } from './DP'

interface PFPPlaceholderProps {
    name: string;
    innerStyle?: {}
}

const PFPPlaceholder = ({ name, innerStyle }: PFPPlaceholderProps) => {
    return (
        <View
            style={{
                ...DPStyles.inner,
                ...innerStyle,
            }}

        >
            <Text
                style={{
                    color: "#fff",
                    fontWeight: 'bold',
                    fontSize: 30
                }}
            >
                {name.split(" ").map((name) => name[0].toUpperCase())}
            </Text>
        </View>
    )
}

export default PFPPlaceholder