import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import Modal from 'react-native-modal';
import ManualSearchBox from '../components/ManualSearchBox';
import CaptureButton from '../components/CaptureButton';
import ScannerButtonsPane from '../components/ScannerButtonsPane';
import { FlashMode } from 'expo-camera/build/Camera.types';
import { colors } from '../constants/colors'
import RoundButton from '../components/RoundButton';
import { Ionicons } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'

const DrugScanner = (props: any) => {

  const cameraMounted = useIsFocused();

  const { height, width } = Dimensions.get('window');
  const screenRatio = height / width;
  const [query, setQuery] = useState<string>('');
  const [ratio, setRatio] = useState<string>('');
  const [isRatioSet, setIsRatioSet] = useState<boolean>(false);

  const [cameraRef, setCameraRef] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [flashStatus, setFlashStatus] = useState<FlashMode>(FlashMode.off);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [imagePadding, setImagePadding] = useState<number>(0);

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
        props.navigation.navigate('CameraPreviewScreen', {
          photo: photo,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const captureImage = async () => {
    if (cameraRef) {
      if (isCameraReady) {
        const photo = await cameraRef.takePictureAsync({
          base64: true,
        });

        props.navigation.navigate('CameraPreviewScreen', {
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

  const searchQueryChangeHandler = (text: string) => {
    setQuery(text);
  };

  //fixing ratio
  const prepareRatio = async () => {
    let desiredRatio = '4:3'; // Start with the system default
    // This issue only affects Android
    if (Platform.OS === 'android') {
      if (cameraRef) {
        const ratios = await cameraRef.getSupportedRatiosAsync();

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar hidden />
      <GestureRecognizer
        onSwipeUp={onSwipeUp}
        config={config}
        style={{
          flex: 1,
        }}>
        {cameraMounted && (
          <Camera
            ref={ref => {
              setCameraRef(ref);
            }}
            onCameraReady={onCameraReady}
            useCamera2Api={true}
            ratio={ratio}
            style={{
              flex: 1,
              flexDirection: 'row',
              marginBottom: imagePadding * 2,
            }}
            type="back"
            flashMode={flashStatus}
          >
            <View
              style={{
                flex: 0.2,
                backgroundColor: '#ffffff00',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
              }}>
              <RoundButton
                style={{
                  marginRight: 30,
                  marginTop: 20,
                  elevation: 0.4,
                  backgroundColor: "#000000"
                }}
                onPress={() => {
                  props.navigation.goBack()
                }}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#fff"
                />
              </RoundButton>

            </View>
            <View
              style={{
                flex: 0.6,
                backgroundColor: '#ffffff00',
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginStart: -20,
                marginBottom: -100,
              }}>
              <View
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
              flashStatus={flashStatus}
              pickImage={pickImage}
              toggleFlash={() => {
                setFlashStatus(
                  flashStatus === FlashMode.on ?
                    FlashMode.off :
                    FlashMode.on
                );
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
                  height: '50%',
                  backgroundColor: colors.PRIMARY,
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
                  onchange={(event: any) => {
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
