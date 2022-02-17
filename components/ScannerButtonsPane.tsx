import { View, Pressable } from 'react-native'
import React from 'react'
import RoundButton from './RoundButton';

import { Entypo, MaterialIcons, Ionicons } from '@expo/vector-icons'
import { CameraType, FlashMode } from 'expo-camera/build/Camera.types';

interface ScannerButtonsPaneProps {
    cameraType: CameraType,
    flashStatus: FlashMode,
    navigation: () => {},
    toggleFrontBackCamera: () => void,
    toggleFlash: () => void,
    toggleManualSearchBox: () => void,
    pickImage: () => void
}

const ScannerButtonsPane = ({
    flashStatus,
    cameraType,
    navigation,
    toggleFrontBackCamera,
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
                marginTop: 35,
            }}>
            <Pressable
                style={{
                    alignSelf: 'flex-end',
                    alignItems: 'flex-end',
                    marginTop: 30,
                    marginEnd: 10,
                }}>
                <RoundButton
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Entypo name="cross" size={25} color="#fff" />
                </RoundButton>
            </Pressable>
            <Pressable
                style={{
                    alignSelf: 'flex-end',
                    alignItems: 'flex-end',
                    marginTop: 10,
                    marginEnd: 10,
                }}>
                <RoundButton
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    onPress={toggleFrontBackCamera}>
                    <MaterialIcons
                        name={cameraType === CameraType.back ? 'camera-front' : 'camera-rear'}
                        size={20}
                        color="#fff"
                    />
                </RoundButton>
            </Pressable>
            <Pressable
                style={{
                    alignSelf: 'flex-end',
                    alignItems: 'flex-end',
                    marginEnd: 10,
                    marginTop: 10,
                }}>
                <RoundButton
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    onPress={toggleFlash}>
                    <Ionicons
                        name={flashStatus === FlashMode.on ? 'ios-flash-off' : 'ios-flash'}
                        size={20}
                        color="#fff"
                    />
                </RoundButton>
            </Pressable>
            <Pressable
                style={{
                    alignSelf: 'flex-end',
                    alignItems: 'flex-end',
                    marginEnd: 10,
                    marginTop: 10,
                }}>
                <RoundButton
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    onPress={toggleManualSearchBox}>
                    <Ionicons name="ios-search" size={20} color="#fff" />
                </RoundButton>
            </Pressable>
            <Pressable
                style={{
                    alignSelf: 'flex-end',
                    alignItems: 'flex-end',
                    marginEnd: 10,
                    marginTop: 10,
                }}>
                <RoundButton
                    onPress={pickImage}
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
                    <MaterialIcons name="photo-library" size={20} color="#fff" />
                </RoundButton>
            </Pressable>
        </View>
    )
}

export default ScannerButtonsPane