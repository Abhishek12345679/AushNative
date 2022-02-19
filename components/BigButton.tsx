import { Text, Pressable, ActivityIndicator, StyleProp, PressableProps } from 'react-native'
import React from 'react'
import { colors } from '../constants/colors'

interface BigButtonProps {
    disabled?: boolean;
    text: string;
    onPress: () => void;
    loading?: boolean;
    buttonStyle?: {};
}

const BigButton = ({ text, onPress, loading, buttonStyle, disabled }: BigButtonProps) => {
    return (
        <Pressable
            disabled={disabled}
            android_ripple={{
                color: "#fff",
                borderless: false
            }}
            onPress={onPress}
            style={{
                ...{
                    width: '100%',
                    height: 70,
                    backgroundColor: colors.SECONDARY,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: 15,
                    borderRadius: 10,
                },
                ...buttonStyle
            }}>
            {!loading ? (
                <Text
                    style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}
                >
                    {text}
                </Text>
            ) : (
                <ActivityIndicator size="small" color="#fff" />
            )}
        </Pressable>
    )
}

export default BigButton