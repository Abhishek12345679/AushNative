import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons";
import { extractWords, TextRecognitionResponse } from "../mlkit/TextRecognition";
import RecognisedWordsOverlay from "../components/RecognisedWordsOverlay";
import { colors } from "../constants/colors";
import RoundButton from "../components/RoundButton";
import CameraPreviewButtonsPane from "../components/CameraPreviewButtonsPane";

const CameraPreviewScreen = (props: any) => {

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const image = props.route.params.photo.uri;
  const [textRecognitionResponse, setTextRecognitonResponse] =
    useState<TextRecognitionResponse | undefined>(undefined);
  const [aspectRatio, setAspectRatio] = useState(1);

  const [loading, setLoading] = useState(false)

  const [showOverlay, setShowOverlay] = useState(false)

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
        {!!textRecognitionResponse && showOverlay && (
          <RecognisedWordsOverlay
            key={1}
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
        onPress={() => {
          props.navigation.goBack()
        }}
      >
        <Ionicons name="chevron-back" color="#fff" size={30} />
      </RoundButton>
      <CameraPreviewButtonsPane
        showOverlay={showOverlay}
        toggleRecognisedWordsOverlay={() => setShowOverlay((prev) => !prev)}
        aspectRatio={aspectRatio}
        navigation={props.navigation}
        windowHeight={windowHeight}
        windowWidth={windowWidth}
      />
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
