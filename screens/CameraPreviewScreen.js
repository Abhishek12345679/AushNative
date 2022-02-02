//TODO: Checkout Vision Camera: <https://mrousavy.com/react-native-vision-camera/>

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import FastImage from "react-native-fast-image";

import { ModalTitle, ModalContent, BottomModal } from "react-native-modals";

import Modal from "react-native-modal";

import { Ionicons } from "@expo/vector-icons";
import { ImageManipulator } from "expo-image-crop";
import * as ExpoImageManipulator from "expo-image-manipulator";
import CPButton from "../components/CPButton";
import { extractWords } from "../mlkit/TextRecognition";

const CameraPreviewScreen = (props) => {
  let [wordList, setWordList] = useState([]);
  const iOS = Platform.OS === "ios";

  const [photoData, setPhotoData] = useState(props.route.params.photo);

  // const imgHeight = photoData.height;
  // const imgWidth = photoData.width;
  // console.log({ imgHeight, imgWidth });

  console.log(photoData.uri);

  // const baseUri = "data:image/jpg;base64,";
  // const ctx = withMenuContex

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const [image, setImage] = useState(baseUri + photoData.base64);
  const [image, setImage] = useState(photoData.uri);

  const removeUselessSpaces = (text) => {
    let newText = text.replace(/\s+/g, " ").trim();
    return newText;
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [words, setWords] = useState([]);

  useEffect(() => {
    const resizeImage = async () => {
      const manipResult = await ExpoImageManipulator.manipulateAsync(
        photoData.localUri || photoData.uri,
        [
          {
            resize: {
              height: Dimensions.get("window").height - 200,
              width: Dimensions.get("window").width,
            },
          },
        ]
      );
      console.log(manipResult.height);
      setImage(manipResult.uri);
    };
    resizeImage();
  }, []);

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
                if (image) extractWords(image);
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
            onPress={() => {}}
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
        <FastImage
          source={{
            uri: image,
            priority: FastImage.priority.normal,
          }}
          style={{
            height: Dimensions.get("window").height - 200,
            width: Dimensions.get("window").width,
            resizeMode: "contain",
            position: "relative",
          }}
        />
        {wordList.map((word, i) => (
          <TouchableOpacity
            onPress={() => {
              console.log("press");
              setModalVisible(true);
              setWords(word.text.trim().split(" "));
            }}
            style={{
              position: "absolute",
              borderWidth: 3,
              borderColor: "red",
              left: word.boundingBox.left,
              top: word.boundingBox.top,
              right: word.boundingBox.right,
              bottom: word.boundingBox.bottom,
              height: Math.abs(word.boundingBox.top - word.boundingBox.bottom),
              width: Math.abs(word.boundingBox.left - word.boundingBox.right),
              padding: 5,
              borderRadius: 5,
            }}
          ></TouchableOpacity>
        ))}
        <View
          style={{
            width: "100%",
            height: Dimensions.get("window").height - 200,
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {scanning && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: 150,
                  width: 150,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fff",
                }}
              >
                <ActivityIndicator size="large" color="#000" />
              </View>
            </View>
          )}
        </View>
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
            {words.map((word, i) => (
              <TouchableOpacity
                key={i}
                style={{
                  width: "100%",
                  height: 40,
                  marginBottom: 20,
                }}
                onLongPress={() => {
                  console.log("Long Press!");
                }}
                onPress={() => {
                  console.log(word);
                  setModalVisible(false);
                  props.navigation.navigate("Results", {
                    data: word,
                    mode: "scan",
                  });
                }}
              >
                <Text>{word}</Text>
              </TouchableOpacity>
            ))}
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
