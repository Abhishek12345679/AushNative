// TODO: 2. Styling (Flexbox) Improvements

import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  StatusBar,
  Vibration,
  Platform,
} from "react-native";

import GestureRecognizer from "react-native-swipe-gestures";

import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as ScreenOrientation from "expo-screen-orientation";

import Modal from "react-native-modal";

import { Camera } from "expo-camera";

import { MaterialIcons, Ionicons, Entypo } from "@expo/vector-icons";
import RoundButton from "../components/RoundButton";
import ManualSearchBox from "../components/ManualSearchBox";

const DrugScanner = (props) => {
  useEffect(() => {
    navigation.addListener("focus", () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
    });

    navigation.addListener("blur", () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    });
  }, [navigation]);

  const cameraRef = useRef(null);
  const { navigation } = props;

  // const { width, height } = Dimensions.get("window");
  // console.log(width + " " + height);

  const baseUri = "data:image/jpg;base64,";

  const [measurements, setMeasurements] = useState({});
  const contourRef = useRef(null);

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [isCameraReady, setIsCameraReady] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [flashStatus, setFlashStatus] = useState(
    Camera.Constants.FlashMode.off
  );

  const pickImage = async () => {
    try {
      let photo = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });
      if (!photo.cancelled) {
        props.navigation.pop();

        props.navigation.navigate("Confirm", {
          photo: photo,
        });
      }

      // console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { CameraStatus } = await Camera.requestPermissionsAsync();
        const { GalleryStatus } = await Permissions.askAsync(
          Permissions.CAMERA_ROLL
        );
        setHasPermission(CameraStatus && GalleryStatus === "granted");
        // measureContour();
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const searchQueryChangeHandler = (text) => {
    setQuery(text);
  };

  // const measureContour = () => {
  //   contourRef.current.measure((x, y, width, height) => {
  //     setMeasurements(x, y, width, height);
  //   });
  // };

  // console.log(measurements);

  if (hasPermission === null) {
    return <View />;
  } else if (hasPermission === false) {
    return (
      <View>
        <Text> No access to camera </Text>
      </View>
    );
  }

  let lastPress = 0;
  // onDoublePress
  const onDoublePress = () => {
    const time = new Date().getTime();
    const delta = time - lastPress;

    const DOUBLE_PRESS_DELAY = 400;
    if (delta < DOUBLE_PRESS_DELAY) {
      setType(
        type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
      );
    }
    lastPress = time;
  };

  const onSwipeUp = () => {
    if (isVisible === false) {
      setIsVisible(true);
    }
  };

  const onSwipeDown = () => {
    if (isVisible === true) {
      setIsVisible(false);
    }
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "light-content" : "dark-content"}
      />
      <GestureRecognizer
        onSwipeUp={(state) => onSwipeUp(state)}
        onSwipeDown={(state) => onSwipeDown(state)}
        config={config}
        style={{
          flex: 1,
          // backgroundColor: this.state.backgroundColor,
        }}
      >
        <Camera
          style={{ flex: 1, flexDirection: "row" }}
          type={type}
          flashMode={flashStatus}
          ref={cameraRef}
          onCameraReady={onCameraReady}
          onStartShouldSetResponder={(evt) => onDoublePress()}
        >
          <View
            style={{
              flex: 0.8,
              backgroundColor: "#ffffff00",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              marginStart: 40,
              marginBottom: -30,
              marginVertical: 150,
            }}
          >
            <View
              ref={contourRef.current}
              onLayout={({ nativeEvent }) => {
                setMeasurements(nativeEvent.layout);
              }}
              style={{
                // flex: 1,
                borderWidth: 3,
                borderColor: "rgb(0, 255, 0)",
                width: "95%",
                height: 100,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 15,
              }}
            />
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.captureButton}
              onPress={async () => {
                if (cameraRef) {
                  if (isCameraReady) {
                    // vibration ->
                    Vibration.vibrate();
                    const photo = await cameraRef.current.takePictureAsync({
                      base64: true,
                    });
                    // console.log(photo);
                    props.navigation.pop();
                    // const manipResult = await ImageManipulator.manipulateAsync(
                    //   photo.uri,
                    //   [
                    //     {
                    //       resize: {
                    //         width: 375,
                    //         height: 667,
                    //       },
                    //     },
                    //   ],
                    //   { base64: true }
                    // );

                    // const contourCroppedImage = await ImageManipulator.manipulateAsync(
                    //   manipResult.uri,
                    //   [
                    //     {
                    //       crop: {
                    //         originX: measurements.x - measurements.width / 2,
                    //         originY: measurements.y + measurements.height / 2,
                    //         width: measurements.width,
                    //         height: measurements.height,
                    //       },
                    //     },
                    //   ],
                    //   { base64: true }
                    // );

                    props.navigation.navigate("Confirm", {
                      // mode:'camera',
                      photo: photo,
                    });
                  }
                }
              }}
            ></TouchableOpacity>
          </View>
          <View
            style={{
              // height: "50%",
              flex: 0.2,
              backgroundColor: "#ffffff00",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-end",
            }}
          >
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                alignItems: "flex-end",
                marginTop: 30,
                marginEnd: 10,
              }}
            >
              <RoundButton
                style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                onPress={() => {
                  props.navigation.goBack();
                }}
              >
                <Entypo name="cross" size={25} color="#fff" />
              </RoundButton>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                alignItems: "flex-end",
                marginTop: 10,
                marginEnd: 10,
              }}
            >
              <RoundButton
                style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              >
                <MaterialIcons
                  name={type === 2 ? "camera-front" : "camera-rear"}
                  size={20}
                  color="#fff"
                />
              </RoundButton>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                alignItems: "flex-end",
                marginEnd: 10,
                marginTop: 10,
              }}
            >
              <RoundButton
                style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                onPress={() => {
                  setFlashStatus(flashStatus === 0 ? 1 : 0);
                }}
              >
                <Ionicons
                  name={flashStatus === 0 ? "ios-flash-off" : "ios-flash"}
                  size={20}
                  color="#fff"
                />
              </RoundButton>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                alignItems: "flex-end",
                marginEnd: 10,
                marginTop: 10,
              }}
            >
              <RoundButton
                style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                onPress={() => {
                  setIsVisible((prev) => !prev);
                }}
              >
                <Ionicons name="ios-search" size={20} color="#fff" />
              </RoundButton>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                alignItems: "flex-end",
                marginEnd: 10,
                marginTop: 10,
              }}
            >
              <RoundButton
                onPress={pickImage}
                style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
              >
                <MaterialIcons name="photo-library" size={20} color="#fff" />
              </RoundButton>
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView>
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 50,
              }}
            ></View>
          </KeyboardAvoidingView>
          <Modal
            // animationIn="fadeIn"
            // animationInTiming={3000}
            // animationOut="jello"
            avoidKeyboard={true}
            isVisible={isVisible}
            onSwipeComplete={() => setIsVisible(false)}
            swipeDirection={["down"]}
            style={{
              justifyContent: "flex-end",
              margin: 0,
              // alignItems: "center",
            }}
            onBackdropPress={() => setIsVisible(false)}
          >
            <View
              style={{
                width: "100%",
                height: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#ccc",
                  width: 50,
                  height: 8,
                  borderRadius: 5,
                }}
              />
            </View>
            <View
              style={{
                height: "75%",
                backgroundColor: "#FFF",
                padding: 22,
                borderTopEndRadius: 15,
                borderTopStartRadius: 15,
              }}
            >
              <ManualSearchBox
                onpress={() => {
                  setIsVisible(false);
                  props.navigation.pop();
                  props.navigation.navigate("Results", {
                    query: query,
                    manual_search: true,
                    mode: selectedIndex === 0 ? "name" : "salt",
                  });
                }}
                onchangeText={searchQueryChangeHandler}
                value={query}
                onchange={(event) => {
                  setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
                }}
                selectedIndex={selectedIndex}
              />
            </View>
          </Modal>
        </Camera>
      </GestureRecognizer>
    </View>
  );
};

const styles = StyleSheet.create({
  captureButton: {
    marginStart: 30,
    // backgroundColor: "#000",
    borderColor: "skyblue",
    borderWidth: 5,
    justifyContent: "center",
    alignItems: "center",
    height: 80,
    width: 80,
    borderRadius: 40,
    marginEnd: 10,
    marginTop: 10,

    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
    },
  },
});

export default DrugScanner;
