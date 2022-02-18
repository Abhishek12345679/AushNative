import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import { colors } from '../constants/colors'

interface BigButtonProps {
    text: string;
    onPress: () => void;
    loading: boolean;
}

const BigButton = ({ text, onPress, loading }: BigButtonProps) => {
    return (
        <Pressable
            android_ripple={{
                color: "#fff",
                borderless: true
            }}
            onPress={onPress}
            style={{
                width: '100%',
                height: 70,
                backgroundColor: colors.SECONDARY,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
                borderRadius: 10,
            }}>
            {!loading ? (
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
                    {text}
                </Text>
            ) : (
                <View>
                    <ActivityIndicator size="small" color="#fff" />
                </View>
            )}
        </Pressable>
    )
}

export default BigButton