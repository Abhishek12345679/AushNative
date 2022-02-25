import { View, Text, Pressable } from 'react-native'
import React from 'react'

import { Ionicons } from '@expo/vector-icons'

interface IconWithBadgesProps {
    value?: number | string;
    iconName: string;
    iconSize: number;
    iconColor: string;
    onPress: () => void;
    badgeColor?: string;
}

const IconWithBadge = ({ iconName, value, onPress, iconSize, iconColor, badgeColor }: IconWithBadgesProps) => {
    return (
        <Pressable
            style={{
                position: 'relative',
                height: 40,
                width: 40,
                marginStart: 10,
                justifyContent: 'center',
                alignItems: 'center',
            }}
            android_ripple={{
                color: "#fff",
                borderless: true
            }}
            onPress={onPress}>
            <Ionicons
                name={(iconName as any)}
                size={iconSize}
                color={iconColor}
            />
            {typeof value === 'number' &&
                value > 0 &&
                <View
                    style={{
                        alignItems: 'center',
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: badgeColor,
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        justifyContent: 'center',
                    }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>
                        {value}
                    </Text>
                </View>
            }
        </Pressable>
    )
}

export default IconWithBadge