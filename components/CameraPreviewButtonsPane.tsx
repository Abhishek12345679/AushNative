import { Pressable, StatusBar, View } from 'react-native'
import React from 'react'

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

interface CameraPreviewButtonsPaneProps {
    windowHeight: number;
    windowWidth: number;
    aspectRatio: number;

    navigation: any;
}

const CameraPreviewButtonsPane = ({ windowHeight, windowWidth, aspectRatio, navigation }: CameraPreviewButtonsPaneProps) => {
    return (
        <View
            style={{
                width: '100%',
                height: windowHeight - (windowWidth * aspectRatio) - StatusBar.currentHeight,
                backgroundColor: "#000",
                justifyContent: "center",
                alignItems: 'center',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
            }}
        >
            <View
                style={{
                    width: 250,
                    height: 70,
                    backgroundColor: "#fff",
                    borderRadius: 35,
                    flexDirection: 'row',
                    alignItems: "center",
                    paddingHorizontal: 30,
                    elevation: 100
                }}
            >
                <Pressable
                    android_ripple={{
                        color: "#000",
                        borderless: true
                    }}
                    style={{
                        height: 35,
                        width: 35,
                        marginEnd: 35
                    }}
                    onPress={() => {
                        navigation.goBack()
                    }}
                >
                    <MaterialCommunityIcons name="camera-retake" size={32} color="#000" />
                </Pressable>
                <Pressable
                    android_ripple={{
                        color: "#000",
                        borderless: true
                    }}
                    style={{
                        height: 35,
                        width: 35,
                        marginEnd: 35

                    }}
                    onPress={() => {
                        // do something
                    }}
                >
                    <MaterialIcons name="done" size={32} color="darkgreen" />
                </Pressable>
                <Pressable
                    android_ripple={{
                        color: "#000",
                        borderless: true
                    }}
                    style={{
                        height: 35,
                        width: 35,
                        marginEnd: 35
                    }}
                    onPress={() => {
                        navigation.goBack()
                    }}
                >
                    <MaterialCommunityIcons name="close" size={32} color="red" />
                </Pressable>
            </View>
        </View>
    )
}

export default CameraPreviewButtonsPane