import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  TouchableOpacity,
  Text,
  Alert,
  Pressable,
} from 'react-native';
import DrugStore from '../store/CartStore';
import { observer } from 'mobx-react';
import Geolocation, { AuthorizationLevel, ErrorCallback, GeoOptions, SuccessCallback } from 'react-native-geolocation-service';
import LocationPicker from '../components/LocationPicker';
import { GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';
import fetchOrders from '../helpers/fetchOrders';
import fetchAddresses from '../helpers/fetchAddresses';
import { colors } from '../constants/colors';

import { useActionSheet } from '@expo/react-native-action-sheet';

const HomeScreen = observer((props: any) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const [modalVisible, setModalVisible] = useState(false);
  const [locName, setLocName] = useState('select location');

  const geoOptions: GeoOptions = {
    enableHighAccuracy: true,
    timeout: 200000,
    maximumAge: 60 * 60 * 24,
  };

  const geoSuccess: SuccessCallback = async (position: any) => {
    console.log('Success', position);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyCjU7w1itUVJwRQKOctj6HYzySmKgUkX8I`,
    )
    const responseData = await response.json()
    let locName = responseData.results[0].formatted_address.substring(
      responseData.results[0].formatted_address.indexOf(",") + 1);
    setLocName(locName);
  };

  const geoFailure: ErrorCallback = (error: any) => {
    console.log('Error: ', error);
  };


  const hasPermissionsIOS = async (authorizationLevel: AuthorizationLevel) => {
    const status = await Geolocation.requestAuthorization(authorizationLevel);

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "Aushadhalay" to determine your location.`,
        '',
        [
          { text: "Don't Use Location", onPress: () => { } },
        ],
      );
    }

    return false;
  };

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      const status = await hasPermissionsIOS("whenInUse");
      return status;
    }

    if (Platform.OS === 'android') {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (status === "granted") {
        return true
      }
    }
  };

  useEffect(() => {
    const fetchingStuff = async () => {
      const orders = await fetchOrders();
      DrugStore.addOrders(orders);

      const addresses = await fetchAddresses();
      console.log('addresses: ', JSON.stringify(addresses, null, 2));
      DrugStore.addAddresses(addresses);
    };
    fetchingStuff();
  }, []);

  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <>
          {Platform.OS === "ios" ? <Text
            style={{
              color: "#fff",
              fontSize: 20,
              fontWeight: 'bold',
              margin: 5
            }}
          >
            Aushadhalay
          </Text> :
            <></>
          }
        </>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <Pressable
            style={{
              marginStart: 10,
              height: 40,
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            android_ripple={{
              color: "#fff",
              borderless: true
            }}
            onPress={() => {
              props.navigation.navigate('Search');
            }}>
            <Ionicons name="md-search" size={22} color="#fff" />
          </Pressable>
          <Pressable
            style={{
              marginStart: 10,
              height: 40,
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}
            android_ripple={{
              color: "#fff",
              borderless: true
            }}
            onPress={() => {
              props.navigation.navigate('Cart');
            }}>
            <Ionicons name="md-cart" size={24} color="#fff" />
            {DrugStore.count > 0 &&
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "red",
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>
                  {DrugStore.count}
                </Text>
              </View>
            }
          </Pressable>
        </View>
      ),
      headerTitle: Platform.OS === "ios" ? '' : "Aushadhalay",
      headerStyle: {
        backgroundColor: colors.PRIMARY,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        headerHideShadow: true
      },
      headerLargeTitle: false,
      headerTintColor: '#fff',
      fontSize: 20,
    });
  }, []);

  const onOpenActionSheet = () => {
    const options = ['Detect Current Location', 'Select Manually', 'Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex: number) => {
        if (buttonIndex === 0) {
          const hasPermissions = await requestPermissions();
          if (hasPermissions) {
            console.log("has permissions = ", hasPermissions)
            Geolocation.getCurrentPosition(geoSuccess, geoFailure, geoOptions);
          }
        } else if (buttonIndex === 1) {
          setModalVisible(true);
        }
      },
    );
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}>
      <LocationPicker
        location={locName}
        onPress={() => {
          onOpenActionSheet();
        }}
      />
      <Modal
        presentationStyle="formSheet"
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        onDismiss={() => {
          setModalVisible(false);
        }}

      >
        <TouchableWithoutFeedback
          onPressOut={() => {
            setModalVisible(false);
          }}

        >
          <View style={{ flex: 1 }}>
            <GooglePlacesAutocomplete
              textInputProps={{ autoCorrect: false }}
              fetchDetails={true}
              placeholder="Search"
              currentLocation={true}
              currentLocationLabel="Current location"
              onPress={(_, details: GooglePlaceDetail) => {
                setLocName(details.formatted_address);
                setModalVisible(false);
              }}
              query={{
                key: 'AIzaSyCjU7w1itUVJwRQKOctj6HYzySmKgUkX8I', // api key for Google Places API
                language: 'en',
                components: 'country:in',
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    flexDirection: 'column',
    flexGrow: 1,
  },
  scanButton: {
    height: 60,
    width: '35%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
});

export default HomeScreen;
