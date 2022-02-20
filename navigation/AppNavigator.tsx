import React from 'react';
import { Platform, Pressable } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import DrugScanner from '../screens/DrugScanner';
import ResultList from '../screens/ResultList';
import DrugDetailScreen from '../screens/DrugDetailScreen';
import CameraPreviewScreen from '../screens/CameraPreviewScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CartScreen from '../screens/CartScreen';
import AddAddressModalScreen from '../screens/AddAddressModalScreen';
import AuthenticationScreen from '../screens/Authentication/AuthenticationScreen';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import { Ionicons } from '@expo/vector-icons';
import OrderDetailScreen, {
  screenOptions as OrderDetailScreenOptions,
} from '../screens/Settings/OrderDetailScreen';
import OrderSuccessScreen from '../screens/CheckoutFlow/OrderSuccessScreen';
import OrderFailureScreen from '../screens/CheckoutFlow/OrderFailureScreen';
import SearchScreen from '../screens/SearchScreen';
import { colors } from '../constants/colors';
import ScannedResultsScreen from '../screens/ScannedResultsScreen';

enableScreens();

const AuthStackNavigator = createNativeStackNavigator();
export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator>
      <AuthStackNavigator.Screen
        name="Auth"
        component={AuthenticationScreen}
        options={{ headerLargeTitle: false, headerShown: false }}
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
        name="OrderSuccessScreen"
        component={OrderSuccessScreen}
        options={{
          headerShown: true,
        }}
      />
      <CheckoutStackNavigator.Screen
        name="OrderFailureScreen"
        component={OrderFailureScreen}
      />
    </CheckoutStackNavigator.Navigator>
  );
};

const EditProfileStackNavigator = createNativeStackNavigator();

const EditProfileNavigator = () => {
  return (
    <EditProfileStackNavigator.Navigator
      initialRouteName="Edit Profile"
      screenOptions={{
        headerTitle: 'Edit Profile',
      }}>
      <EditProfileStackNavigator.Screen
        name="Edit Profile"
        component={EditProfileScreen}
        options={{
          headerShown: false,
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
        },
        headerLargeTitle: false,
        headerTintColor: '#fff',
      }}>
      <ScannerStackNavigator.Screen
        name="Scan"
        component={DrugScanner}
        options={{
          headerShown: false,
        }}
      />
      <ScannerStackNavigator.Screen name="Results" component={ResultList} />
      <ScannerStackNavigator.Screen
        name="ScannedResultsScreen"
        component={ScannedResultsScreen}
      />
      <ScannerStackNavigator.Screen
        name="Drug"
        component={DrugDetailScreen}
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
        options={{
          headerTitle: "Aushadhalay"
        }}
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
      />
      <RootStackNavigator.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerLargeTitle: false,
          headerStyle: {
            backgroundColor: colors.PRIMARY,
          },
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
        options={{
          headerTitle: 'Edit Profile',
        }}
      />
      <SettingsStackNavigator.Screen
        name="Addresses"
        component={AddressScreen}
        options={AddressScreenOptions}
      />
      <SettingsStackNavigator.Screen
        name="AddAddressModalScreen"
        component={AddAddressModalScreen}
        options={{
          headerLargeTitle: false,
        }}
      />
      <SettingsStackNavigator.Screen name="MyWebView" component={MyWebView} />
    </SettingsStackNavigator.Navigator>
  );
};

const BottomNavigationBar = createBottomTabNavigator();

export const TabNavigator = ({ navigation }) => {
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
        tabBarInactiveTintColor: '#fff',
        tabBarActiveTintColor: '#fff',
      }}>
      <BottomNavigationBar.Screen
        name="HomeScreen"
        component={RootNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={!focused ? 'home-outline' : 'home'}
              color={color}
              size={22}
            />
          ),
        }}
      />

      <BottomNavigationBar.Screen
        name="ScanNav"
        component={ScannerNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Pressable
              android_ripple={{
                color: '#fff',
                borderless: true,
              }}
              style={{
                width: 70,
                height: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                navigation.navigate('ScanScreen');
              }}>
              <Ionicons
                name={!focused ? 'md-scan-circle' : 'md-scan-circle'}
                color="#fff"
                size={60}
              />
            </Pressable>
          ),
          unmountOnBlur: true,
        }}
      />

      <BottomNavigationBar.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={!focused ? 'ios-person-outline' : 'ios-person'}
              color={color}
              size={22}
            />
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
        }}
      />
    </MainStackNavigator.Navigator>
  );
};
