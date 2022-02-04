import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";

import HomeScreen, {
  screenOptions as HomeScreenOptions,
} from "../screens/HomeScreen";
import DrugScanner from "../screens/DrugScanner";
import ResultList, {
  screenOptions as ResultListScreenOptions,
} from "../screens/ResultList";
import DrugDetailScreen, {
  screenOptions as DrugDetailScreenOptions,
} from "../screens/DrugDetailScreen";
import CameraPreviewScreen from "../screens/CameraPreviewScreen";
import SettingsScreen from "../screens/SettingsScreen";

import CartScreen from "../screens/CartScreen";

import AddAddressModalScreen from "../screens/AddAddressModalScreen";

import SignUpScreen from "../screens/Authentication/SignUpScreen";

import { enableScreens } from "react-native-screens";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import OrdersScreen from "../screens/Settings/OrdersScreen";
import AddressScreen, {
  screenOptions as AddressScreenOptions,
} from "../screens/Settings/AddressScreen";
import SelectAddressScreen, {
  screenOptions as SelectAddressScreenOptions,
} from "../screens/CheckoutFlow/SelectAddressScreen";

import UploadPrescriptionScreen from "../screens/CheckoutFlow/UploadPrescriptionScreen";

import OrderPreviewScreen from "../screens/CheckoutFlow/OrderPreviewScreen";
import EditProfileScreen from "../screens/Settings/EditProfileScreen";

import SplashScreen from "../screens/SplashScreen";

import MyWebView from "../screens/Settings/MyWebView";

import { AntDesign, Ionicons } from "@expo/vector-icons";

import OrderDetailScreen, {
  screenOptions as OrderDetailScreenOptions,
} from "../screens/Settings/OrderDetailScreen";

import OrderConfirmationStatus from "../screens/CheckoutFlow/OrderConfirmationStatus";

import SearchScreen from "../screens/SearchScreen";

const MyTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: Dimensions.get("window").width / 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 65,
        backgroundColor: "#070d59",
        borderRadius: 15,
        width: "50%",
        marginLeft: 100,
        marginRight: 100,
        shadowColor: "#000",
        shadowOffset: {
          width: 1,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const IconNames = ["scan1"];
        const tabNames = ["| scan"];
        const routeNames = ["Scan"];

        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!event.defaultPrevented) {
            // if (!route.name === "Home") {
            //   navigation.goToTop();
            //   return;
            // }
            navigation.navigate(routeNames[index]);
            console.log(routeNames[index]);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            activeOpacity={1}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ["selected"] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              width: (Dimensions.get("window").width * 13) / 25 / 2,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              flexDirection: "row",
              fontSize: 15,
              // backgroundColor: "#ccc",
            }}
          >
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-around",
                // backgroundColor: "#ccc",
                width: "50%",
              }}
            >
              {/* {index === 0 ? (
                <AntDesign
                  name={IconNames[index]}
                  size={25}
                  color={!isFocused ? "#aaa" : "#fff"}
                />
              ) : (
                <FontAwesome
                  name={IconNames[index]}
                  size={25}
                  color={!isFocused ? "#aaa" : "#fff"}
                />
              )}
              {index === 0 && (
                <Text
                  style={{
                    color: !isFocused ? "#aaa" : "#fff",
                    fontSize: index === 0 ? 22 : 15,
                    fontWeight: "bold",
                  }}
                >
                  {tabNames[index]}
                </Text>
              )} */}
              <AntDesign
                name={IconNames[index]}
                size={25}
                color={!isFocused ? "#aaa" : "#fff"}
              />
              <Text
                style={{
                  color: !isFocused ? "#aaa" : "#fff",
                  fontSize: 22,
                  fontWeight: "bold",
                }}
              >
                {tabNames[index]}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

enableScreens();

const AuthStackNavigator = createNativeStackNavigator();
export const AuthNavigator = () => {
  // const colorScheme = useColorScheme()
  return (
    <AuthStackNavigator.Navigator>
      <AuthStackNavigator.Screen
        name="Signup"
        component={SignUpScreen}
        options={{ headerLargeTitle: false, headerShown: false }}
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
        // options={SelectPaymentsScreenOptions}
      />
      <CheckoutStackNavigator.Screen
        name="OrderPreview"
        component={OrderPreviewScreen}
        options={{
          // stackPresentation: "modal",
          headerTitle: "Order Summary",
        }}
      />

      <CheckoutStackNavigator.Screen
        name="OrderConfirmation"
        component={OrderConfirmationStatus}
        options={{
          stackPresentation: "fullScreenModal",
          headerShown: true,
        }}
      />
    </CheckoutStackNavigator.Navigator>
  );
};

const EditProfileStackNavigator = createNativeStackNavigator();

const EditProfileNavigator = () => {
  return (
    <EditProfileStackNavigator.Navigator
      initialRouteName="Edit Profile"
      // screenOptions={{ headerShown: false }}
    >
      <EditProfileStackNavigator.Screen
        name="Edit Profile"
        component={EditProfileScreen}
        options={{
          // headerShown: false,
          // headerLargeTitle: true,
          headerTranslucent: true,
          headerStyle: {
            blurEffect: "light",
            // backgroundColor: "#000",
          },
          // gestureEnabled: false,
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
          stackPresentation: "modal",
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
          backgroundColor: "#14213d",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerLargeTitle: true,
        // headerTitleAlign: "left",
        headerTintColor: "#fff",
        // headerTitleStyle: {
        //   fontWeight: "bolder",
        //   // fontFamily: "plumpfull",
        fontSize: 20,
        // },
      }}
    >
      <RootStackNavigator.Screen name="SplashScreen" component={SplashScreen} />

      <RootStackNavigator.Screen
        name="Home"
        component={HomeScreen}
        headerTitle="Aushadhalay"
        // options={HomeScreenOptions}
      />
      <RootStackNavigator.Screen
        name="Search"
        component={SearchScreen}
        // headerTitle="Aushadhalay"
        // options={HomeScreenOptions}
        options={{
          stackAnimation: "fade",
          headerBackTitle: "",
          headerTitle: "",
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
  // const colorScheme = useColorScheme()
  return (
    <SettingsStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#14213d",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerLargeTitle: true,
        // headerTitleAlign: "left",
        headerTintColor: "#fff",
      }}
    >
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
            Platform.OS === "android" ? "fullScreenModal" : "modal",
          gestureEnabled: true,
          headerShown: false,
          stackAnimation: Platform.OS === "android" ? "fade" : "default",
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
          // headerRight: false,
          // headerShown: false,
          stackPresentation: "modal",
          stackAnimation: "default",
          // gestureEnabled: false,
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
      tabBarOptions={{
        style: {
          backgroundColor: "#14213d",
          borderTopColor: "#14213d",
          height: 80,
          justifyContent: "center",
        },
        showLabel: false,
      }}
    >
      <BottomNavigationBar.Screen
        name="HomeScreen"
        component={RootNavigator}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="md-home" color={color} size={26} />
          ),
        }}
      />
      <BottomNavigationBar.Screen
        name="ScanScreen"
        component={ScannerNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="md-search" color={color} size={26} />
          ),
          unmountOnBlur: true,
        }}
      />

      <BottomNavigationBar.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-person" color={color} size={26} />
          ),
        }}
      />
    </BottomNavigationBar.Navigator>
  );
};
