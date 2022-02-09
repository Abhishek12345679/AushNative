import React from 'react';
import {Platform} from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import DrugScanner from '../screens/DrugScanner';
import ResultList, {
  screenOptions as ResultListScreenOptions,
} from '../screens/ResultList';
import DrugDetailScreen, {
  screenOptions as DrugDetailScreenOptions,
} from '../screens/DrugDetailScreen';
import CameraPreviewScreen from '../screens/CameraPreviewScreen';
import SettingsScreen from '../screens/SettingsScreen';

import CartScreen from '../screens/CartScreen';

import AddAddressModalScreen from '../screens/AddAddressModalScreen';

import SignUpScreen from '../screens/Authentication/SignUpScreen';

import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import OrdersScreen from '../screens/Settings/OrdersScreen';
import AddressScreen, {
  screenOptions as AddressScreenOptions,
} from '../screens/Settings/AddressScreen';
import SelectAddressScreen, {
  screenOptions as SelectAddressScreenOptions,
} from '../screens/CheckoutFlow/SelectAddressScreen';

import UploadPrescriptionScreen from '../screens/CheckoutFlow/UploadPrescriptionScreen';

import OrderPreviewScreen from '../screens/CheckoutFlow/OrderPreviewScreen';
import EditProfileScreen from '../screens/Settings/EditProfileScreen';

import SplashScreen from '../screens/SplashScreen';

import MyWebView from '../screens/Settings/MyWebView';

import {Ionicons, Fontisto} from '@expo/vector-icons';

import OrderDetailScreen, {
  screenOptions as OrderDetailScreenOptions,
} from '../screens/Settings/OrderDetailScreen';

import OrderConfirmationStatus from '../screens/CheckoutFlow/OrderConfirmationStatus';

import SearchScreen from '../screens/SearchScreen';

enableScreens();
const AuthStackNavigator = createNativeStackNavigator();
export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator>
      <AuthStackNavigator.Screen
        name="Signup"
        component={SignUpScreen}
        options={{headerLargeTitle: false, headerShown: false}}
      />
    </AuthStackNavigator.Navigator>
  );
};

const CheckoutStackNavigator = createNativeStackNavigator();

const CheckoutNavigator = () => {
  return (
    <CheckoutStackNavigator.Navigator>
      <CheckoutStackNavigator.Screen
        name="SelectAddress"
        component={SelectAddressScreen}
        options={SelectAddressScreenOptions}
      />
      <CheckoutStackNavigator.Screen
        name="UploadPrescription"
        component={UploadPrescriptionScreen}
      />
      <CheckoutStackNavigator.Screen
        name="OrderPreview"
        component={OrderPreviewScreen}
        options={{
          headerTitle: 'Order Summary',
        }}
      />

      <CheckoutStackNavigator.Screen
        name="OrderConfirmation"
        component={OrderConfirmationStatus}
        options={{
          stackPresentation: 'fullScreenModal',
          headerShown: true,
        }}
      />
    </CheckoutStackNavigator.Navigator>
  );
};

const EditProfileStackNavigator = createNativeStackNavigator();

const EditProfileNavigator = () => {
  return (
    <EditProfileStackNavigator.Navigator initialRouteName="Edit Profile">
      <EditProfileStackNavigator.Screen
        name="Edit Profile"
        component={EditProfileScreen}
        options={{
          headerTranslucent: true,
          headerStyle: {
            blurEffect: 'light',
          },
        }}
      />
    </EditProfileStackNavigator.Navigator>
  );
};

const ScannerStackNavigator = createNativeStackNavigator();

const ScannerNavigator = () => {
  return (
    <ScannerStackNavigator.Navigator initialRouteName="Scan">
      <ScannerStackNavigator.Screen
        name="Scan"
        component={DrugScanner}
        options={{
          headerShown: false,
          stackPresentation: 'modal',
          gestureEnabled: false,
          unmountOnBlur: true,
        }}
      />
      <ScannerStackNavigator.Screen
        name="Results"
        component={ResultList}
        options={ResultListScreenOptions}
      />
      <ScannerStackNavigator.Screen
        name="Drug"
        component={DrugDetailScreen}
        options={DrugDetailScreenOptions}
      />
      <ScannerStackNavigator.Screen
        name="Confirm"
        component={CameraPreviewScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <ScannerStackNavigator.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerLargeTitle: false,
        }}
      />
    </ScannerStackNavigator.Navigator>
  );
};

const RootStackNavigator = createNativeStackNavigator();
export const RootNavigator = () => {
  return (
    <RootStackNavigator.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerHideShadow: true,
        headerStyle: {
          backgroundColor: '#14213d',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerLargeTitle: true,
        headerTintColor: '#fff',
        fontSize: 20,
      }}>
      <RootStackNavigator.Screen name="SplashScreen" component={SplashScreen} />

      <RootStackNavigator.Screen
        name="Home"
        component={HomeScreen}
        headerTitle="Aushadhalay"
      />
      <RootStackNavigator.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: false,
        }}
      />
      <RootStackNavigator.Screen
        name="Drug"
        component={DrugDetailScreen}
        options={DrugDetailScreenOptions}
      />
      <RootStackNavigator.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerLargeTitle: false,
        }}
      />

      <RootStackNavigator.Screen
        name="CheckoutFlow"
        component={CheckoutNavigator}
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      />
    </RootStackNavigator.Navigator>
  );
};

const SettingsStackNavigator = createNativeStackNavigator();

export const SettingsNavigator = () => {
  return (
    <SettingsStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#14213d',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerLargeTitle: true,
        headerTintColor: '#fff',
      }}>
      <SettingsStackNavigator.Screen
        name="SettingsScreen"
        component={SettingsScreen}
      />
      <SettingsStackNavigator.Screen name="Orders" component={OrdersScreen} />
      <SettingsStackNavigator.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={OrderDetailScreenOptions}
      />
      <SettingsStackNavigator.Screen
        name="EditProfile"
        component={EditProfileNavigator}
        options={{
          stackPresentation:
            Platform.OS === 'android' ? 'fullScreenModal' : 'modal',
          gestureEnabled: true,
          headerShown: false,
          stackAnimation: Platform.OS === 'android' ? 'fade' : 'default',
        }}
      />
      <SettingsStackNavigator.Screen
        name="Addresses"
        component={AddressScreen}
        options={AddressScreenOptions}
      />
      <SettingsStackNavigator.Screen
        name="Add New Address"
        component={AddAddressModalScreen}
        options={{
          headerLargeTitle: false,
          stackPresentation: 'modal',
          stackAnimation: 'default',
        }}
      />
      <SettingsStackNavigator.Screen name="MyWebView" component={MyWebView} />
    </SettingsStackNavigator.Navigator>
  );
};

const BottomNavigationBar = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <BottomNavigationBar.Navigator
      initialRouteName="HomeScreen"
      // tabBar={(props) => <MyTabBar {...props} />}
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#14213d',
          borderTopColor: '#14213d',
          height: 55,
          // justifyContent: 'center',
          elevation: 10,
        },
        tabBarShowLabel: false,
        headerShown: false,
      }}>
      <BottomNavigationBar.Screen
        name="HomeScreen"
        component={RootNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <Fontisto name="pills" color={color} size={22} />
          ),
        }}
      />
      <BottomNavigationBar.Screen
        name="ScanScreen"
        component={ScannerNavigator}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name="scan" color={color} size={22} />
          ),
          unmountOnBlur: true,
        }}
      />

      <BottomNavigationBar.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name="ios-person" color={color} size={22} />
          ),
        }}
      />
    </BottomNavigationBar.Navigator>
  );
};
