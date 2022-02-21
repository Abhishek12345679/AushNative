import React from 'react'
import { View, StyleSheet } from 'react-native'
import RoundButton from './RoundButton';
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { FlashMode } from 'expo-camera/build/Camera.types';

interface ScannerButtonsPaneProps {
    flashStatus: FlashMode,
    toggleFlash: () => void,
    toggleManualSearchBox: () => void,
    pickImage: () => void
}

const ScannerButtonsPane = ({
    flashStatus,
    toggleFlash,
    toggleManualSearchBox,
    pickImage
}: ScannerButtonsPaneProps
) => {
    return (
        <View
            style={{
                flex: 0.2,
                backgroundColor: '#ffffff00',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
                marginTop: 10,
                marginEnd: 10
            }}>

            <RoundButton
                style={styles.buttonStyle}
                onPress={toggleFlash}>
                <Ionicons
                    name={flashStatus === FlashMode.off ? "ios-flash-off" : "ios-flash"}
                    size={20}
                    color="#fff"
                />
            </RoundButton>

            <RoundButton
                style={styles.buttonStyle}
                onPress={toggleManualSearchBox}
            >
                <Ionicons name="ios-search" size={20} color="#fff" />
            </RoundButton>

            <RoundButton
                onPress={pickImage}
                style={styles.buttonStyle}>
                <MaterialIcons name="photo-library" size={20} color="#fff" />
            </RoundButton>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: '#00000075',
        alignItems: 'center',
        marginVertical: 10,
        justifyContent: 'center',
        elevation: 1
    }
})

export default ScannerButtonsPane