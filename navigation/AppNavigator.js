import React from 'react';
import {Button, Platform} from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import DrugScanner from '../screens/DrugScanner';
import ResultList from '../screens/ResultList';
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
import {colors} from '../constants/colors';

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
    <CheckoutStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.PRIMARY,
        },
        headerTintColor: '#FFF',
      }}>
      <CheckoutStackNavigator.Screen
        name="SelectAddress"
        component={SelectAddressScreen}
        options={SelectAddressScreenOptions}
      />
      <CheckoutStackNavigator.Screen
        name="UploadPrescription"
        component={UploadPrescriptionScreen}
        options={{
          headerTitle: 'Prescription',
        }}
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
          headerShown: false,
          // headerTranslucent: true,
          // headerStyle: {
          //   blurEffect: 'light',
          // },
        }}
      />
    </EditProfileStackNavigator.Navigator>
  );
};

const ScannerStackNavigator = createNativeStackNavigator();

const ScannerNavigator = () => {
  return (
    <ScannerStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.PRIMARY,
          borderTopColor: colors.SECONDARY,
        },
        headerLargeTitle: false,
        headerTintColor: '#fff',
      }}>
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
      <ScannerStackNavigator.Screen name="Results" component={ResultList} />
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
          headerStyle: {
            backgroundColor: colors.SECONDARY,
          },
        }}
      />
    </ScannerStackNavigator.Navigator>
  );
};

const RootStackNavigator = createNativeStackNavigator();
export const RootNavigator = () => {
  return (
    <RootStackNavigator.Navigator initialRouteName="Home">
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
          headerStyle: {
            backgroundColor: colors.PRIMARY,
            borderBottomColor: colors.SECONDARY,
          },
          headerLargeTitle: false,
          headerTintColor: '#fff',
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
          backgroundColor: colors.PRIMARY,
          borderBottomColor: colors.SECONDARY,
        },
        headerLargeTitle: false,
        headerTintColor: '#fff',
      }}>
      <SettingsStackNavigator.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          headerLargeTitle: false,
          headerTitle: 'Settings',
        }}
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
        options={
          {
            // stackPresentation:
            //   Platform.OS === 'android' ? 'fullScreenModal' : 'modal',
            // gestureEnabled: true,
            // headerShown: false,
            // stackAnimation: Platform.OS === 'android' ? 'fade' : 'default',
          }
        }
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

export const TabNavigator = ({navigation}) => {
  return (
    <BottomNavigationBar.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.PRIMARY,
          borderTopColor: colors.SECONDARY,
          height: Platform.OS === 'ios' ? 100 : 75,
          elevation: 10,
        },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarInactiveTintColor: '#a2a2a2',
        tabBarActiveTintColor: 'cyan',
      }}>
      <BottomNavigationBar.Screen
        name="HomeScreen"
        component={RootNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <Fontisto name="home" color={color} size={22} />
          ),
        }}
      />

      <BottomNavigationBar.Screen
        name="Scan"
        component={ScannerNavigator}
        options={{
          tabBarIcon: () => (
            <Ionicons name="md-scan-circle" color="#FFF" size={70} />
          ),
          unmountOnBlur: true,
        }}
        listeners={{
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('ScanScreen');
          },
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

const MainStackNavigator = createNativeStackNavigator();

export const MainNavigator = () => {
  return (
    <MainStackNavigator.Navigator>
      <MainStackNavigator.Screen
        name="Home"
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <MainStackNavigator.Screen
        name="ScanScreen"
        component={ScannerNavigator}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
    </MainStackNavigator.Navigator>
  );
};
