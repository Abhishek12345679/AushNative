//TODO: Checkout Vision Camera: <https://mrousavy.com/react-native-vision-camera/>

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
} from "react-native"
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { extractWords, TextRecognitionResponse } from "../mlkit/TextRecognition";
import RecognisedWordsOverlay from "../components/RecognisedWordsOverlay";
import { colors } from "../constants/colors";
import RoundButton from "../components/RoundButton";

const CameraPreviewScreen = (props: any) => {

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const image = props.route.params.photo.uri;
  const [textRecognitionResponse, setTextRecognitonResponse] =
    useState<TextRecognitionResponse | undefined>(undefined);
  const [aspectRatio, setAspectRatio] = useState(1);

  const [loading, setLoading] = useState(false)

  const processImage = async (image: string) => {
    if (image) {
      try {
        const TextRecognitionResponse = await extractWords(image);

        if (TextRecognitionResponse.blocks.length > 0) {
          setTextRecognitonResponse(TextRecognitionResponse);
          setAspectRatio(
            TextRecognitionResponse.height /
            TextRecognitionResponse.width
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      await processImage(image)
      setLoading(false)
    }
    run()
  }, [])

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: 'center',
          backgroundColor: colors.PRIMARY
        }}
      >
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#fff" />
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",

        }}
      >
        <Image
          source={{ uri: image }}
          style={{
            position: 'relative',
            height: (windowWidth * aspectRatio),
            width: windowWidth,
            marginTop: StatusBar.currentHeight
          }}
          resizeMode="cover"
        />
        {!!textRecognitionResponse && (
          <RecognisedWordsOverlay
            navigation={props.navigation}
            response={textRecognitionResponse}
            scale={windowWidth / textRecognitionResponse.width}
          />
        )}
      </View>
      <RoundButton
        style={{
          position: "absolute",
          left: 10,
          top: StatusBar.currentHeight + 10,
        }}
        children={<Ionicons name="chevron-back" color="#fff" size={30} />}
        onPress={() => {
          props.navigation.goBack()
        }}
        disabled={false}
      />
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
              props.navigation.goBack()
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
              props.navigation.goBack()
            }}
          >
            <MaterialCommunityIcons name="close" size={32} color="red" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
});

export default CameraPreviewScreen;
