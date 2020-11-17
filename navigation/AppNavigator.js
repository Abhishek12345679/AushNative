// TODO: Add Dark Theme Programatically

import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";

import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

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

import DrugImporterScreen, {
  screenOptions as DrugImporterScreenOptions,
} from "../screens/DrugImporterScreen";
import CartScreen from "../screens/CartScreen";

import AddAddressModalScreen from "../screens/AddAddressModalScreen";

import SignUpScreen from "../screens/Authentication/SignUpScreen";
import LoginScreen from "../screens/Authentication/LoginScreen";

import { enableScreens } from "react-native-screens";
import { createStackNavigator } from "@react-navigation/stack";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import OrdersScreen from "../screens/Settings/OrdersScreen";
import AddressScreen, {
  screenOptions as AddressScreenOptions,
} from "../screens/Settings/AddressScreen";
import ProfileScreen from "../screens/Settings/ProfileScreen";
import SelectAddressScreen, {
  screenOptions as SelectAddressScreenOptions,
} from "../screens/CheckoutFlow/SelectAddressScreen";
import SelectPaymentsScreen, {
  screenOptions as SelectPaymentsScreenOptions,
} from "../screens/CheckoutFlow/SelectPaymentsScreen";
import OrderPreviewScreen from "../screens/CheckoutFlow/OrderPreviewScreen";
import EditProfileScreen from "../screens/Settings/EditProfileScreen";
import HealthConditionsScreen, {
  screenOptions as HealthConditionsScreenOptions,
} from "../screens/Settings/HealthConditionsScreen";

import SplashScreen from "../screens/SplashScreen";

import MyWebView from "../screens/Settings/MyWebView";

import {
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome,
} from "@expo/vector-icons";
import sampleshop from "../screens/shop/sampleshop";
import OrderDetailScreen, {
  screenOptions as OrderDetailScreenOptions,
} from "../screens/Settings/OrderDetailScreen";
import OrderConfirmationStatus from "../screens/CheckoutFlow/OrderConfirmationStatus";
// import { SplashScreen } from "expo";

// const MyTabBar = ({ state, descriptors, navigation }) => {
//   return (
//     <View
//       style={{
//         position: "absolute",
//         bottom: Dimensions.get("window").width / 20,
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "center",
//         height: 65,
//         backgroundColor: "#070d59",
//         borderRadius: 15,
//         width: "50%",
//         marginLeft: 100,
//         marginRight: 100,
//         shadowColor: "#000",
//         shadowOffset: {
//           width: 1,
//           height: 1,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 10,
//       }}
//     >
//       {state.routes.map((route, index) => {
//         const { options } = descriptors[route.key];

//         const IconNames = ["scan1"];
//         const tabNames = ["| scan"];
//         const routeNames = ["Scan"];

//         const isFocused = state.index === index;
//         const onPress = () => {
//           const event = navigation.emit({
//             type: "tabPress",
//             target: route.key,
//             canPreventDefault: true,
//           });

//           if (!event.defaultPrevented) {
//             // if (!route.name === "Home") {
//             //   navigation.goToTop();
//             //   return;
//             // }
//             navigation.navigate(routeNames[index]);
//             console.log(routeNames[index]);
//           }
//         };

//         const onLongPress = () => {
//           navigation.emit({
//             type: "tabLongPress",
//             target: route.key,
//           });
//         };

//         return (
//           <TouchableOpacity
//             key={index}
//             activeOpacity={1}
//             accessibilityRole="button"
//             accessibilityStates={isFocused ? ["selected"] : []}
//             accessibilityLabel={options.tabBarAccessibilityLabel}
//             testID={options.tabBarTestID}
//             onPress={onPress}
//             onLongPress={onLongPress}
//             style={{
//               width: (Dimensions.get("window").width * 13) / 25 / 2,
//               height: 40,
//               alignItems: "center",
//               justifyContent: "center",
//               flex: 1,
//               flexDirection: "row",
//               fontSize: 15,
//               // backgroundColor: "#ccc",
//             }}
//           >
//             <View
//               style={{
//                 alignItems: "center",
//                 flexDirection: "row",
//                 justifyContent: "space-around",
//                 // backgroundColor: "#ccc",
//                 width: "50%",
//               }}
//             >
//               {/* {index === 0 ? (
//                 <AntDesign
//                   name={IconNames[index]}
//                   size={25}
//                   color={!isFocused ? "#aaa" : "#fff"}
//                 />
//               ) : (
//                 <FontAwesome
//                   name={IconNames[index]}
//                   size={25}
//                   color={!isFocused ? "#aaa" : "#fff"}
//                 />
//               )}
//               {index === 0 && (
//                 <Text
//                   style={{
//                     color: !isFocused ? "#aaa" : "#fff",
//                     fontSize: index === 0 ? 22 : 15,
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {tabNames[index]}
//                 </Text>
//               )} */}
//               <AntDesign
//                 name={IconNames[index]}
//                 size={25}
//                 color={!isFocused ? "#aaa" : "#fff"}
//               />
//               <Text
//                 style={{
//                   color: !isFocused ? "#aaa" : "#fff",
//                   fontSize: 22,
//                   fontWeight: "bold",
//                 }}
//               >
//                 {tabNames[index]}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// };

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
      <AuthStackNavigator.Screen name="Login" component={LoginScreen} />
    </AuthStackNavigator.Navigator>
  );
};

const CheckoutStackNavigator = createNativeStackNavigator();

const CheckoutNavigator = () => {
  return (
    <CheckoutStackNavigator.Navigator
    // screenOptions={({ navigation }) => ({
    //   headerRight: () => {
    //     return (
    //       <TouchableOpacity
    //         onPress={() => {
    //           navigation.navigate("Cart");
    //         }}
    //       >
    //         <Text style={{ color: "blue" }}>Cancel</Text>
    //       </TouchableOpacity>
    //     );
    //   },
    // })}
    // screenOptions={}
    >
      <CheckoutStackNavigator.Screen
        name="SelectAddress"
        component={SelectAddressScreen}
        options={SelectAddressScreenOptions}
      />
      {/* <CheckoutStackNavigator.Screen
        name="SelectPayment"
        component={SelectPaymentsScreen}
        options={SelectPaymentsScreenOptions}
      /> */}
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
      // screenOptions={{ headerTranslucent: true }}
    >
      <EditProfileStackNavigator.Screen
        name="Edit Profile"
        component={EditProfileScreen}
        options={{
          headerShown: true,
          // headerLargeTitle: true,
          headerTranslucent: true,
          headerStyle: {
            blurEffect: "light",
            // backgroundColor: "#000",
          },
        }}
      />
    </EditProfileStackNavigator.Navigator>
  );
};

const RootStackNavigator = createNativeStackNavigator();
export const RootNavigator = () => {
  return (
    <RootStackNavigator.Navigator
      initialRouteName="Home"
      // mode="modal"
      screenOptions={({ route, navigation }) => ({
        headerHideShadow: true,
        // headerStyle: { marginTop: 90 },
      })}
    >
      <RootStackNavigator.Screen
        name="SplashScreen"
        component={SplashScreen}
        // headerTitle="Scan"
        // options={HomeScreenOptions}
      />

      <RootStackNavigator.Screen
        name="Home"
        component={HomeScreen}
        // headerTitle="Scan"
        options={HomeScreenOptions}
      />

      <RootStackNavigator.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          // headerLargeTitle: true,
          // stackPresentation: "modal",
          headerShown: true,
          headerTitle: "Settings",
        }}
      />
      <RootStackNavigator.Screen
        name="MyWebView"
        component={MyWebView}
        // options={{
        //   // headerLargeTitle: true,
        //   // stackPresentation: "modal",
        //   headerShown: true,
        //   headerTitle: "Settings",
        // }}
      />

      <RootStackNavigator.Screen
        name="Scan"
        component={DrugScanner}
        options={{
          headerShown: false,
          stackPresentation: "modal",
          gestureEnabled: false,
        }}
      />
      <RootStackNavigator.Screen
        name="Results"
        component={ResultList}
        options={ResultListScreenOptions}
      />
      <RootStackNavigator.Screen
        name="Drug"
        component={DrugDetailScreen}
        options={DrugDetailScreenOptions}
      />
      <RootStackNavigator.Screen
        name="Import"
        component={DrugImporterScreen}
        options={{ gestureEnabled: false, stackPresentation: "modal" }}
      />
      <RootStackNavigator.Screen
        name="Confirm"
        component={CameraPreviewScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <RootStackNavigator.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerLargeTitle: false,
          // headerRight: false,
          // headerShown: false,
        }}
      />
      <RootStackNavigator.Screen
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
      <RootStackNavigator.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerLargeTitle: false,
        }}
      />
      <RootStackNavigator.Screen
        name="EditProfile"
        component={EditProfileNavigator}
        options={{ stackPresentation: "modal" }}
      />
      <RootStackNavigator.Screen
        name="Addresses"
        component={AddressScreen}
        options={AddressScreenOptions}
      />
      <RootStackNavigator.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          headerLargeTitle: false,
        }}
      />
      <RootStackNavigator.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={OrderDetailScreenOptions}
      />
      <RootStackNavigator.Screen
        name="CheckoutFlow"
        component={CheckoutNavigator}
        options={{
          // stackPresentation: "modal",
          gestureEnabled: false,
          headerShown: false,
          // headerTitle:
        }}
      />
      <RootStackNavigator.Screen
        name="Health Conditions"
        component={HealthConditionsScreen}
        options={HealthConditionsScreenOptions}
      />
    </RootStackNavigator.Navigator>
  );
};

// const ShopStackNavigator = createNativeStackNavigator();

// export const ShopNavigator = () => {
//   return (
//     <ShopStackNavigator.Navigator>
//       <ShopStackNavigator.Screen
//         name="ShopHome"
//         component={sampleshop}
//         options={{
//           headerLargeTitle: true,
//           headerHideShadow: true,
//           headerTitle: "Dukaan",
//         }}
//       />
//     </ShopStackNavigator.Navigator>
//   );
// };

// const BottomNavigationBar = createBottomTabNavigator();

// export const TabNavigator = () => {
//   return (
//     <BottomNavigationBar.Navigator tabBar={(props) => <MyTabBar {...props} />}>
//       <BottomNavigationBar.Screen name="ScanScreen" component={RootNavigator} />

//       {/* <BottomNavigationBar.Screen
//         name="SplashScreen"
//         component={ShopNavigator}
//       /> */}
//     </BottomNavigationBar.Navigator>
//   );
// };
