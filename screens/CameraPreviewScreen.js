// FIXME: removeUselessSpaces not running correctly
import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Button,
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Modal as NativeModal,
} from "react-native";

import ml from "@react-native-firebase/ml";

import Modal from "react-native-modal";

import { Ionicons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import { ImageManipulator } from "expo-image-crop";
import CPButton from "../components/CPButton";
import DrugStore from "../store/CartStore";

const CameraPreviewScreen = (props) => {
  const { navigation } = props;

  let [wordList, setWordList] = useState([]);
  // let wordList = [];

  useEffect(() => {
    navigation.addListener("focus", () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    });

    navigation.addListener("blur", () => {
      ScreenOrientation.unlockAsync();
    });
  }, [navigation]);

  const iOS = Platform.OS === "ios";

  const [photoData, setPhotoData] = useState(props.route.params.photo);
  // console.log(Object.keys(photoData));

  const imgHeight = photoData.height;
  const imgWidth = photoData.width;

  console.log(imgWidth);
  console.log(imgHeight);

  const baseUri = "data:image/jpg;base64,";

  const phoneIP = "172.20.10.2";
  const wifiIP = "192.168.0.102";

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [image, setImage] = useState(baseUri + photoData.base64);

  const uid = DrugStore.userCredentials.uid;

  let newImageFile = {
    uri: photoData.uri,
    type: `test/${photoData.uri.split(".")[1]}`,
    name: `test.${photoData.uri.split(".")[1]}`,
  };

  async function processDocument(localPath) {
    const processed = await ml().cloudDocumentTextRecognizerProcessImage(
      localPath
    );
    let temp = [];

    console.log("Found text in document: ", processed.text);

    processed.blocks.forEach((block) => {
      // console.log(Object.keys(block));
      console.log("Bounding box: ", block.boundingBox);
      console.log("Found block with text: ", block.text);
      console.log("Confidence in block: ", block.confidence);
      console.log("Languages found in block: ", block.recognizedLanguages);

      temp.push(removeUselessSpaces(block.text));
    });
    console.log("temp", temp);
    setWordList(temp);
  }

  const hosted_uri = "https://ocr-api-2020.herokuapp.com";

  const getOCRData = async (image) => {
    // const response = await fetch("http://" + wifiIP + ":5000/post-image", {
    //   method: "post",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ imageUrl: image }),
    // });

    const response = await fetch(hosted_uri + "/post-image", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl: image }),
    });

    const data = await response.json();
    return data;
  };

  const uploadImage = async (image) => {
    console.log("uploading...");
    const data = new FormData();
    data.append("file", image);
    data.append("folder", `OCR_Images/${uid}`);
    data.append("upload_preset", "drug_package_image");
    data.append("cloud_name", "abhisheksah69420");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/abhisheksah69420/image/upload",
      //https://api.cloudinary.com/v1_1/<cloud name>/<resource_type>/upload
      {
        method: "POST",
        body: data,
      }
    );

    const resData = await response.json();
    return resData;
  };

  // if (isLoading) {
  //   return (
  //     <View
  //       style={{
  //         ...styles.container,
  //         justifyContent: "center",
  //         alignItems: "center",
  //       }}
  //     >

  //     </View>
  //   );
  // }

  const removeUselessSpaces = (text) => {
    let newStringArray = [];
    text.split(" ").forEach((block, index) => {
      if (block !== "" || block !== " ") {
        newStringArray.push(block);
      }
    });
    return newStringArray.join();
  };

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header_footer}>
        <View style={styles.buttonContainer}>
          {!isLoading ? (
            <CPButton
              iOS={iOS ? true : false}
              onpress={async () => {
                processDocument(photoData.uri).then(() => {
                  console.log("Finished processing file.");
                  setModalVisible(true);
                });
                // setIsLoading(true);
                // const uploadData = await uploadImage(newImageFile);
                // console.log(uploadData);
                // const tmp = await getOCRData(uploadData.url);
                // setIsLoading(false);
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
              props.navigation.pop();
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
            width: "100%",
            height: Dimensions.get("window").height - 200,
            // marginTop: 10,
          }}
        />
      </View>
      <View style={styles.header_footer}>
        <View style={styles.buttonContainer}>
          <CPButton
            iOS={iOS ? true : false}
            onpress={async () => {
              setIsVisible((prev) => !prev);
            }}
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
      <Modal
        backdropColor="#ccc"
        // animationType="fade"
        isVisible={modalVisible}
        // onSwipeComplete={() => setModalVisible(false)}
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
            height: "100%",
            backgroundColor: "#fff",
            padding: 22,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
          }}
        >
          {wordList.map((word, i) => (
            <TouchableOpacity
              style={{
                width: "100%",
                height: 20,
                marginBottom: 20,
                backgroundColor: "#ccc",
              }}
              onPress={() => {
                props.navigation.navigate("Results", {
                  data: word.toLowerCase().trim(),
                  mode: "scan",
                });
              }}
            >
              <Text>{word.trim()}</Text>
            </TouchableOpacity>
          ))}
          <Button
            title="close"
            onPress={() => {
              setModalVisible(false);
            }}
          />
          {/* <AnimatedLoader
            visible={isLoading}
            overlayColor="rgba(255,255,255,0)"
            source={require("../assets/196-material-wave-loading.json")}
            animationStyle={{ height: 100, width: 100 }}
            speed={1}
          /> */}
          {/* {isLoading && <ActivityIndicator size={24} color="#fff" />} */}
        </View>
      </Modal>
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
