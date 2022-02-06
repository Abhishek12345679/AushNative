import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';

import GestureRecognizer from 'react-native-swipe-gestures';
import {useFocusEffect} from '@react-navigation/native';

import * as ImagePicker from 'expo-image-picker';
import {Camera} from 'expo-camera';

import Modal from 'react-native-modal';

import {MaterialIcons, Ionicons, Entypo} from '@expo/vector-icons';
import RoundButton from '../components/RoundButton';
import ManualSearchBox from '../components/ManualSearchBox';
import {colors} from '../constants/colors';

const DrugScanner = props => {
  const [cameraRef, setCameraRef] = useState(null);
  const [camera, setCamera] = useState(null);
  const [mounted, setMounted] = useState(true);

  const contourRef = useRef(null);

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [isCameraReady, setIsCameraReady] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [flashStatus, setFlashStatus] = useState(
    Camera.Constants.FlashMode.off,
  );

  // Screen Ratio and image padding
  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState('4:3');
  const {height, width} = Dimensions.get('window');
  const screenRatio = height / width;
  const [isRatioSet, setIsRatioSet] = useState(false);

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
        // props.navigation.pop();

        props.navigation.navigate('Confirm', {
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
        const {CameraStatus} = await Camera.requestCameraPermissionsAsync();
        const {GalleryStatus} =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasPermission(CameraStatus && GalleryStatus === 'granted');
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const onCameraReady = async () => {
    setIsCameraReady(true);
    if (!isRatioSet) {
      await prepareRatio();
    }
  };

  useEffect(() => {
    onCameraReady;
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setMounted(true);
      return () => {
        console.log('unmounted');
        setMounted(false);
      };
    }, []),
  );

  //fixing ratio
  const prepareRatio = async () => {
    let desiredRatio = '4:3'; // Start with the system default
    // This issue only affects Android
    if (Platform.OS === 'android') {
      const ratios = await camera.getSupportedRatiosAsync();
      // console.log(ratios);

      // Calculate the width/height of each of the supported camera ratios
      // These width/height are measured in landscape mode
      // find the ratio that is closest to the screen ratio without going over
      let distances = {};
      let realRatios = {};
      let minDistance = null;
      for (const ratio of ratios) {
        const parts = ratio.split(':');
        const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
        realRatios[ratio] = realRatio;
        // ratio can't be taller than screen, so we don't want an abs()
        const distance = screenRatio - realRatio;
        distances[ratio] = realRatio;
        if (minDistance == null) {
          minDistance = ratio;
        } else {
          if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = ratio;
          }
        }
      }
      // set the best match
      desiredRatio = minDistance;
      //  calculate the difference between the camera width and the screen height
      const remainder = Math.floor(
        (height - realRatios[desiredRatio] * width) / 2,
      );
      // set the preview padding and preview ratio
      setImagePadding(remainder / 2);
      setRatio(desiredRatio);
      // Set a flag so we don't do this
      // calculation each time the screen refreshes
      setIsRatioSet(true);
    }
  };

  const searchQueryChangeHandler = text => {
    setQuery(text);
  };

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
          : Camera.Constants.Type.back,
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

  const captureImage = async () => {
    if (cameraRef) {
      if (isCameraReady) {
        const photo = await cameraRef.takePictureAsync({
          base64: true,
          // quality: 0.5,
        });

        props.navigation.navigate('Confirm', {
          // mode:'camera',
          photo: photo,
        });
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      <GestureRecognizer
        onSwipeUp={state => onSwipeUp(state)}
        onSwipeDown={state => onSwipeDown(state)}
        config={config}
        style={{
          flex: 1,
          backgroundColor: '#14213d',
        }}>
        {mounted && (
          <Camera
            ratio={ratio}
            style={{
              flex: 1,
              backgroundColor: '#000',
              flexDirection: 'row',
              marginTop: imagePadding,
              marginBottom: imagePadding,
            }}
            type={type}
            flashMode={flashStatus}
            ref={ref => {
              setCamera(ref);
              setCameraRef(ref);
            }}
            onCameraReady={onCameraReady}
            onStartShouldSetResponder={evt => onDoublePress()}
            useCamera2Api>
            <View
              style={{
                flex: 0.8,
                backgroundColor: '#ffffff00',
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginStart: 40,
                marginBottom: -30,
                marginVertical: 150,
              }}>
              <View
                ref={contourRef.current}
                style={{
                  width: '95%',
                  height: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 15,
                }}
              />
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.captureButton}
                onPress={captureImage}>
                <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
                  Capture
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 0.2,
                backgroundColor: '#ffffff00',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'flex-end',
                  marginTop: 30,
                  marginEnd: 10,
                }}>
                <RoundButton
                  style={{backgroundColor: 'rgba(0,0,0,0.4)'}}
                  onPress={() => {
                    props.navigation.goBack();
                  }}>
                  <Entypo name="cross" size={25} color="#fff" />
                </RoundButton>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'flex-end',
                  marginTop: 10,
                  marginEnd: 10,
                }}>
                <RoundButton
                  style={{backgroundColor: 'rgba(0,0,0,0.4)'}}
                  onPress={() => {
                    setType(
                      type === Camera.Constants.Type.front
                        ? Camera.Constants.Type.back
                        : Camera.Constants.Type.front,
                    );
                  }}>
                  <MaterialIcons
                    name={type === 2 ? 'camera-front' : 'camera-rear'}
                    size={20}
                    color="#fff"
                  />
                </RoundButton>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'flex-end',
                  marginEnd: 10,
                  marginTop: 10,
                }}>
                <RoundButton
                  style={{backgroundColor: 'rgba(0,0,0,0.4)'}}
                  onPress={() => {
                    setFlashStatus(flashStatus === 0 ? 1 : 0);
                  }}>
                  <Ionicons
                    name={flashStatus === 0 ? 'ios-flash-off' : 'ios-flash'}
                    size={20}
                    color="#fff"
                  />
                </RoundButton>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'flex-end',
                  marginEnd: 10,
                  marginTop: 10,
                }}>
                <RoundButton
                  style={{backgroundColor: 'rgba(0,0,0,0.4)'}}
                  onPress={() => {
                    setIsVisible(prev => !prev);
                  }}>
                  <Ionicons name="ios-search" size={20} color="#fff" />
                </RoundButton>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'flex-end',
                  marginEnd: 10,
                  marginTop: 10,
                }}>
                <RoundButton
                  onPress={pickImage}
                  style={{backgroundColor: 'rgba(0,0,0,0.4)'}}>
                  <MaterialIcons name="photo-library" size={20} color="#fff" />
                </RoundButton>
              </TouchableOpacity>
            </View>
            <KeyboardAvoidingView>
              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 50,
                }}></View>
            </KeyboardAvoidingView>
            <Modal
              avoidKeyboard={true}
              isVisible={isVisible}
              onSwipeComplete={() => setIsVisible(false)}
              swipeDirection={['down']}
              style={{
                justifyContent: 'flex-end',
                margin: 0,
              }}
              onBackdropPress={() => setIsVisible(false)}>
              <View
                style={{
                  width: '100%',
                  height: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: '#ccc',
                    width: 50,
                    height: 8,
                    borderRadius: 5,
                  }}
                />
              </View>
              <View
                style={{
                  height: '75%',
                  backgroundColor: '#FFF',
                  padding: 22,
                  borderTopEndRadius: 15,
                  borderTopStartRadius: 15,
                }}>
                <ManualSearchBox
                  onpress={() => {
                    setIsVisible(false);
                    props.navigation.navigate('Results', {
                      query: query,
                      manual_search: true,
                      mode: selectedIndex === 0 ? 'name' : 'salt',
                    });
                  }}
                  onchangeText={searchQueryChangeHandler}
                  value={query}
                  onchange={event => {
                    setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
                  }}
                  selectedIndex={selectedIndex}
                />
              </View>
            </Modal>
          </Camera>
        )}
      </GestureRecognizer>
    </View>
  );
};

const styles = StyleSheet.create({
  captureButton: {
    marginEnd: 10,
    marginTop: 10,
    marginStart: 30,
    width: 250,
    height: 80,
    backgroundColor: colors.PRIMARY,
    borderRadius: 50,
    elevation: 20, //android only
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DrugScanner;
