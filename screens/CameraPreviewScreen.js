import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { ModalTitle, ModalContent, BottomModal } from "react-native-modals";

import ml from "@react-native-firebase/ml";

import Modal from "react-native-modal";

import { Ionicons } from "@expo/vector-icons";
import { ImageManipulator } from "expo-image-crop";
import * as ExpoImageManipulator from "expo-image-manipulator";
import CPButton from "../components/CPButton";
// import { TouchableNativeFeedback } from "react-native";

import { StackActions, NavigationActions } from "react-navigation";
import { ImageBackground } from "react-native";

const CameraPreviewScreen = (props) => {
  let [wordList, setWordList] = useState([]);
  const iOS = Platform.OS === "ios";

  const [photoData, setPhotoData] = useState(props.route.params.photo);

  // const imgHeight = photoData.height;
  // const imgWidth = photoData.width;

  // console.log({ imgHeight, imgWidth });
  console.log(photoData.uri);

  // const baseUri = "data:image/jpg;base64,";

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rippleOverflow, setRippleOverflow] = useState(false);

  // const [image, setImage] = useState(baseUri + photoData.base64);
  const [image, setImage] = useState(photoData.uri);

  async function processDocument(localPath) {
    const processed = await ml().cloudDocumentTextRecognizerProcessImage(
      localPath,
      {
        languageHints: ["en"], // to avoid diacritics(accents)
      }
    );
    let temp = [];

    console.log("Found text in document: ", processed.text);

    processed.blocks.forEach((block) => {
      // console.log(Object.keys(block));
      // const boundingBox = block.boundingBox
      console.log("Bounding box: ", block.boundingBox);
      console.log("Found block with text: ", block.text);
      console.log("Confidence in block: ", block.confidence);
      console.log("Languages found in block: ", block.recognizedLanguages);

      // adding to wordList
      const newText = removeUselessSpaces(block.text);
      // newText.forEach((text) => {
      //   temp[text]= block.
      // });
      let phrase = {};
      phrase = {
        text: newText,
        boundingBox: {
          left: block.boundingBox[0],
          top: block.boundingBox[1],
          right: block.boundingBox[2],
          bottom: block.boundingBox[3],
        },
      };
      temp.push(phrase);
    });

    console.log("temp", temp[0]);
    setWordList(temp);
  }

  const removeUselessSpaces = (text) => {
    let newText = text.replace(/\s+/g, " ").trim();
    return newText;
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [scanning, setScanning] = useState(false);

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
                processDocument(image).then(() => {
                  console.log("Finished processing file.");
                  // setModalVisible(true);
                  setScanning(false);
                });
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
        <Image
          source={{
            uri: image,
          }}
          style={{
            // flex: 1,
            height: Dimensions.get("window").height - 200,
            width: Dimensions.get("window").width,
            resizeMode: "contain",
            // marginTop: 10,
            // width: 4640,
            // height: 2610,
            position: "relative",
          }}
        ></Image>
        {wordList.map((word, i) => (
          <TouchableOpacity
            onPress={() => {
              // console.log("Short Press!");
              // setModalVisible(false);
              props.navigation.navigate("Results", {
                data: word.text.toLowerCase(),
                mode: "scan",
              });
            }}
            style={{
              // flex: 1,
              position: "absolute",
              // backgroundColor: "#000",
              borderWidth: 3,
              borderColor: "#000",
              left: word.boundingBox.left,
              top: word.boundingBox.top,
              right: word.boundingBox.right,
              bottom: word.boundingBox.bottom,
              height: Math.abs(word.boundingBox.top - word.boundingBox.bottom),
              width: Math.abs(word.boundingBox.left - word.boundingBox.right),
              padding: 20,
            }}
          >
            <Text>{word.text}</Text>
          </TouchableOpacity>
        ))}
        <View
          style={{
            // flex: 1,
            width: "100%",
            height: Dimensions.get("window").height - 200,
            // backgroundColor: "red",
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
          <CPButton
            iOS={iOS ? true : false}
            // onpress={async () => {
            //   setIsVisible((prev) => !prev);
            // }}
            color="#FFF"
            text="edit"
          />
          <ImageManipulator
            photo={photoData}
            isVisible={isVisible}
            onPictureChoosed={(cropped_image) => {
              setPhotoData(cropped_image);
              setImage(baseUri + cropped_image.base64);
            }}
            onToggleModal={() => setIsVisible((prev) => !prev)}
            saveOptions={{
              // compress: 1,
              // format: "jpeg",
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
      {/* android  specific config broke so back to ios-first*/}
      <Modal
        backdropColor="#ccc"
        // animationType="fade"
        isVisible={isLoading}
        // onSwipeComplete={() => setIsLoading(false)}
        // swipeDirection={["down"]}
        style={
          {
            // justifyContent: "flex-end",
            // margin: 10,
            // justifyContent: "center",
            // alignItems: "center",
            // backgroundColor: "#000",
            // borderRadius: 15,
          }
        }
      >
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
            {/* {wordList.map((word, i) => (
              <TouchableOpacity
                key={i}
                style={{
                  width: "100%",
                  height: 40,
                  marginBottom: 20,
                  // backgroundColor: "#ccc",
                }}
                onLongPress={() => {
                  console.log("Long Press!");
                }}
                onPress={() => {
                  console.log("Short Press!");
                  setModalVisible(false);
                  props.navigation.navigate("Results", {
                    data: word.toLowerCase(),
                    mode: "scan",
                  });
                }}
              >
                <Text>{word}</Text>
              </TouchableOpacity>
            ))} */}
            {/* <Button
            title="close"
            onPress={() => {
              setModalVisible(false);
            }}
          />  */}
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
