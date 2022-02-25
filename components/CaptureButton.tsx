import React from 'react'
import { View, Pressable, StyleSheet } from 'react-native'

interface CaptureButtonProps {
    captureImage: () => Promise<void>
}

const CaptureButton = ({ captureImage }: CaptureButtonProps) => {
    return (
        <Pressable
            android_ripple={{
                color: '#121212',
                borderless: true,
            }}
            style={styles.captureButton}
            onPress={captureImage}>
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 65,
                    width: 65,
                    borderRadius: 65 / 2.0,
                    // backgroundColor: '#fff',
                }}
            />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    captureButton: {
        marginStart: 45,
        borderColor: '#fff',
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
        width: 80,
        borderRadius: 40,
        marginEnd: 10,
        marginTop: 10,
        elevation: 10
    },
});

export default CaptureButton