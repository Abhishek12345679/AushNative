import { Pressable, StatusBar, View } from 'react-native'
import React from 'react'

import { MaterialCommunityIcons, MaterialIcons, Entypo } from '@expo/vector-icons'

interface CameraPreviewButtonsPaneProps {
    windowHeight: number;
    windowWidth: number;
    aspectRatio: number;

    navigation: any;
    toggleRecognisedWordsOverlay: () => void;
    showOverlay: boolean
}

const CameraPreviewButtonsPane = ({ windowHeight, windowWidth, aspectRatio, navigation, toggleRecognisedWordsOverlay, showOverlay }: CameraPreviewButtonsPaneProps) => {
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
                    width: 300,
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
                    onPress={toggleRecognisedWordsOverlay}
                >
                    <Entypo name={showOverlay ? "eye" : "eye-with-line"} size={32} color="black" />
                </Pressable>
            </View>
        </View>
    )
}

export default CameraPreviewButtonsPane