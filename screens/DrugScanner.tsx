import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import GestureRecognizer from 'react-native-swipe-gestures';
import { useFocusEffect } from '@react-navigation/native';

import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

import Modal from 'react-native-modal';

import ManualSearchBox from '../components/ManualSearchBox';
import CaptureButton from '../components/CaptureButton';
import ScannerButtonsPane from '../components/ScannerButtonsPane';
import { CameraType, FlashMode } from 'expo-camera/build/Camera.types';

const DrugScanner = (props: any) => {

  const [cameraRef, setCameraRef] = useState(null);
  const [camera, setCamera] = useState(null);
  const [mounted, setMounted] = useState<boolean>(true);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [cameraType, setCameraType] = useState<CameraType>(CameraType.back);
  const [flashStatus, setFlashStatus] = useState<FlashMode>(FlashMode.off);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const contourRef = useRef(null);

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [imagePadding, setImagePadding] = useState<number>(0);
  const [ratio, setRatio] = useState<string>();
  const { height, width } = Dimensions.get('window');
  const screenRatio = height / width;
  const [isRatioSet, setIsRatioSet] = useState<boolean>(false);

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

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
        props.navigation.navigate('Confirm', {
          photo: photo,
        });
      }
    } catch (E) {
      console.log(E);
    }
  };

  const captureImage = async () => {
    if (cameraRef) {
      if (isCameraReady) {
        const photo = await cameraRef.takePictureAsync({
          base64: true,
        });

        props.navigation.navigate('Confirm', {
          photo: photo,
        });
      }
    }
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

  const searchQueryChangeHandler = (text: string) => {
    setQuery(text);
  };

  //fixing ratio
  const prepareRatio = async () => {
    let desiredRatio = '4:3'; // Start with the system default
    // This issue only affects Android
    if (Platform.OS === 'android') {
      if (camera) {
        const ratios = await camera.getSupportedRatiosAsync();
        console.log(ratios);

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
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (cameraStatus && galleryStatus) {
          setHasPermission(true);
        }
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
    onCameraReady();
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


  if (hasPermission === null) {
    return <View />;
  } else if (hasPermission === false) {
    return (
      <View>
        <Text> No access to camera </Text>
      </View>
    );
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureRecognizer
        onSwipeUp={onSwipeUp}
        onSwipeDown={onSwipeDown}
        config={config}
        style={{
          flex: 1,
        }}>
        {mounted && (
          <Camera
            ratio={ratio}
            style={{
              flex: 1,
              flexDirection: 'row',
              marginTop: imagePadding - 5,
              // marginBottom: imagePadding,
            }}
            type={cameraType}
            flashMode={flashStatus}
            ref={ref => {
              setCamera(ref);
              setCameraRef(ref);
            }}
            onCameraReady={onCameraReady}
            useCamera2Api={true}
          >
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
              <CaptureButton captureImage={captureImage} />
            </View>
            <ScannerButtonsPane
              cameraType={cameraType}
              flashStatus={flashStatus}
              navigation={props.navigation}
              pickImage={pickImage}
              toggleFlash={() => {
                setFlashStatus(
                  flashStatus === FlashMode.on ?
                    FlashMode.off :
                    FlashMode.on
                );
              }}
              toggleFrontBackCamera={() => {
                setCameraType(
                  cameraType === CameraType.front
                    ? CameraType.back
                    : CameraType.front
                )
              }}
              toggleManualSearchBox={() => {
                setIsVisible(prev => !prev);
              }}

            />
            <KeyboardAvoidingView>

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
                    // backgroundColor: '#ccc',
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
    </SafeAreaView>
  );
};

export default DrugScanner;
