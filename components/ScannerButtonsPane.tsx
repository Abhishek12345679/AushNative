import React from 'react'
import { View, StyleSheet } from 'react-native'
import RoundButton from './RoundButton';
import { Entypo, MaterialIcons, Ionicons } from '@expo/vector-icons'
import { FlashMode } from 'expo-camera/build/Camera.types';

interface ScannerButtonsPaneProps {
    flashStatus: FlashMode,
    navigation: any,
    toggleFlash: () => void,
    toggleManualSearchBox: () => void,
    pickImage: () => void
}

const ScannerButtonsPane = ({
    flashStatus,
    navigation,
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
            }}>
            <RoundButton
                style={styles.buttonStyle}
                onPress={() => {
                    navigation.goBack();
                }}>
                <Entypo name="cross" size={25} color="#fff" />
            </RoundButton>
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
                style={{
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    marginEnd: 10,
                    marginTop: 10,

                }}
                onPress={toggleManualSearchBox}>
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
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        marginEnd: 10,
        marginTop: 10,
        justifyContent: 'center'
    }
})

export default ScannerButtonsPane