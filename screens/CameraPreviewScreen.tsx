//TODO: Checkout Vision Camera: <https://mrousavy.com/react-native-vision-camera/>

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";

import { ModalTitle, ModalContent, BottomModal } from "react-native-modals";

import Modal from "react-native-modal";

import { Ionicons } from "@expo/vector-icons";
import { ImageManipulator } from "expo-image-crop";
// import * as ExpoImageManipulator from "expo-image-manipulator";
import CPButton from "../components/CPButton";
import { extractWords, TextRecognitionResponse } from "../mlkit/TextRecognition";
import RecognisedWordsOverlay from "../components/RecognisedWordsOverlay";

const CameraPreviewScreen = (props: any) => {
  const iOS = Platform.OS === "ios";
  const windowWidth = Dimensions.get("window").width;

  const [photoData, setPhotoData] = useState(props.route.params.photo);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [image, setImage] = useState(photoData.uri);
  const [textRecognitionResponse, setTextRecognitonResponse] =
    useState<TextRecognitionResponse | undefined>(undefined);
  const [aspectRatio, setAspectRatio] = useState(1);


  const removeUselessSpaces = (text) => {
    let newText = text.replace(/\s+/g, " ").trim();
    return newText;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header_footer}>
        <View style={styles.buttonContainer}>
          {!isLoading ? (
            <CPButton
              iOS={iOS ? true : false}
              onpress={async () => {
                setScanning(true);
                if (image) {
                  try {
                    const TextRecognitionResponse = await extractWords(image);
                    if (TextRecognitionResponse.blocks.length > 0) {
                      // console.log(
                      //   "TextRecognitionResponse",
                      //   JSON.stringify(TextRecognitionResponse, null, 4)
                      // );
                      setTextRecognitonResponse(TextRecognitionResponse);
                      setAspectRatio(
                        TextRecognitionResponse.height /
                        TextRecognitionResponse.width
                      );
                    }
                    setScanning(false);
                    setModalVisible(true)
                  } catch (err) {
                    console.error(err);
                    setScanning(false);
                  }
                }
              }}
              color="#FFF"
              text="Confirm"
            />
          ) : (
            <ActivityIndicator size="small" color="#fff" />
          )}
          <Ionicons
            name="ios-camera"
            size={30}
            color="#fff"
            onPress={() => { }}
          />
          <CPButton
            iOS={iOS ? true : false}
            onpress={() => {
              props.navigation.goBack();
            }}
            color="#FFF"
            text="Retake"
          />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Image
          source={{ uri: image }}
          style={{
            position: 'relative',
            height: windowWidth * aspectRatio,
            width: windowWidth,
          }}
          resizeMode="contain"
        />
        {!!textRecognitionResponse && (
          <RecognisedWordsOverlay
            response={textRecognitionResponse}
            scale={windowWidth / textRecognitionResponse.width}
          />
        )}
      </View>

      <View style={styles.header_footer}>
        <View style={styles.buttonContainer}>
          <CPButton iOS={iOS ? true : false} color="#FFF" text="edit" />
          <ImageManipulator
            photo={photoData}
            isVisible={isVisible}
            onPictureChoosed={(cropped_image) => {
              setPhotoData(cropped_image);
              setImage(baseUri + cropped_image.base64);
            }}
            onToggleModal={() => setIsVisible((prev) => !prev)}
            saveOptions={{
              base64: true,
            }}
          />

          <CPButton
            iOS={iOS ? true : false}
            onpress={() => {
              props.navigation.goBack();
            }}
            color="#FFF"
            text="cancel"
          />
        </View>
      </View>
      {/* android specific config broke so back to ios-first*/}
      <Modal backdropColor="#ccc" isVisible={isLoading}>
        <View
          style={{
            height: "50%",
            backgroundColor: "#000",
            padding: 22,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
          }}
        >
          {isLoading && <ActivityIndicator size={24} color="#fff" />}
        </View>
      </Modal>
      <BottomModal
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(false)}
        height={500}
        width={0.5}
        onSwipeOut={() => setModalVisible(false)}
        modalTitle={
          <ModalTitle title="Choose the correct Drug Name " hasTitleBar />
        }
      >
        <ModalContent
          style={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: 0,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
            }}
            style={{
              height: "100%",
              backgroundColor: "#fff",
              padding: 22,
              borderRadius: 20,
            }}
          >
            {!!textRecognitionResponse &&
              textRecognitionResponse
                .blocks
                .map((block, i) => {
                  block.lines.map((line, i) => {
                    line.words.map((word, j) => {
                      console.log(word.text)
                      return (
                        <TouchableOpacity
                          key={i}
                          // style={{
                          //   width: "100%",
                          //   height: 40,
                          //   marginBottom: 20,
                          // }}
                          // onLongPress={() => {
                          //   console.log("Long Press!");
                          // }}
                          onPress={() => {
                            // console.log(word);
                            setModalVisible(false);
                            // props.navigation.navigate("Results", {
                            //   data: word.text,
                            //   mode: "scan",
                            // });
                          }}
                        >
                          <Text style={{ color: '#000' }}>{word.text}</Text>
                        </TouchableOpacity>
                      )
                    }
                    )
                  })
                })}
          </ScrollView>
        </ModalContent>
      </BottomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header_footer: {
    width: "100%",
    height: 100,
    backgroundColor: "#000",
  },
  buttonContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 40,
    marginHorizontal: 10,
    alignItems: "center",
  },
  lottie: {
    width: "90%",
    height: 400,
    backgroundColor: "#000",
  },
});

export default CameraPreviewScreen;
