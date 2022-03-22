import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  FlatList,
  Pressable,
  RefreshControl,
  Platform,
} from 'react-native';
import Address from '../../components/Address';
import DrugStore, { AddressType } from '../../store/CartStore';
import fetchAddresses from '../../helpers/fetchAddresses';
import { colors } from '../../constants/colors';
import BigButton from '../../components/BigButton';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native';

const SelectAddressScreen = (props: any) => {
  const hasFocused = useIsFocused();
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [refreshing, setIsRefreshing] = useState(false);

  // const isPrescriptionRequired = () => {
  //   let flag = false;
  //   Drugstore.drugs.forEach(item => {
  //     if (item.prescription_req === true) {
  //       flag = true;
  //     }
  //   });
  //   return flag;
  // };

  const fetchStuff = async () => {
    const addresses = await fetchAddresses();
    DrugStore.addAddresses(addresses);
  };

  useEffect(() => {
    if (hasFocused) {
      setIsRefreshing(true)
      fetchStuff()
      setIsRefreshing(false)
    }
  }, [hasFocused])

  return (
    <>
      <StatusBar barStyle="light-content" />
      {DrugStore.addresses.length > 0 ? <>
        <FlatList
          showsHorizontalScrollIndicator={false}
          // horizontal={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchStuff}
            />
          }
          contentContainerStyle={{
            // justifyContent: 'center',
            // alignItems: 'center'
          }}
          style={{ paddingHorizontal: 10 }}
          data={DrugStore.addresses}
          ListHeaderComponent={() => (
            <Text
              style={{
                marginHorizontal: 10,
                marginVertical: 20,
                fontSize: 17,
                fontWeight: 'bold',
                color: "#fff",
              }}>
              Select an address
            </Text>
          )}
          renderItem={({ item, index }) => (
            <Address
              selected={selectedAddressIndex === index}
              nameTextStyle={{
                color: "#FFF"
              }}
              keyProp={index}
              onPress={() => {
                setSelectedAddressIndex(index);
              }}
              style={{
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowRadius: 10,
                elevation: 1,

                backgroundColor: colors.SECONDARY,
                marginHorizontal: 5,
                marginVertical: 10,
                width: '90%',
                height: 175,
              }}
              address={item as AddressType}
              addressLineTextStyle={{
                color: "#FFF"
              }}
            />
          )}
        />
        <View
          style={{
            margin: 20,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <BigButton
            onPress={() => {
              props.navigation.navigate('UploadPrescription', {
                selectedAddressIndex: selectedAddressIndex,
              });
            }}
            text="Deliver to this Address"
            buttonStyle={{
              backgroundColor: colors.SECONDARY
            }}
          />
        </View>
      </> :
        <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: 'center' }}>
          <Text>Add an address to cumtinue!s</Text>
        </View>
      }
    </>
  );
};

export const screenOptions = (navData: any) => {
  return {
    headerTitle: 'Addresses',
    headerLargeTitle: false,
    headerRight: () => (
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
          navData.navigation.navigate('AddAddressModalScreen');
        }}>
        <Ionicons name="md-add" size={30} color="#fff" />
      </Pressable>
    ),
    headerLeft: () => (
      <Pressable
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        android_ripple={{
          color: "#fff",
          borderless: true
        }}
        onPress={() => {
          navData.navigation.goBack();
        }}>
        {Platform.OS === "ios" ?
          <MaterialIcons name="keyboard-arrow-left" size={40} color="#fff" /> :
          <Ionicons name="arrow-back" size={25} color="#fff" />
        }
      </Pressable>
    ),
  };
};

export default SelectAddressScreen;
