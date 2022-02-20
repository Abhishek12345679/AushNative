import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  Pressable,
} from 'react-native';
import Address from '../../components/Address';
import DrugStore, { AddressType } from '../../store/CartStore';

import fetchAddresses from '../../helpers/fetchAddresses';
import { colors } from '../../constants/colors';
import BigButton from '../../components/BigButton';
import { Ionicons } from '@expo/vector-icons'

const SelectAddressScreen = (props: any) => {

  // const isPrescriptionRequired = () => {
  //   let flag = false;
  //   Drugstore.drugs.forEach(item => {
  //     if (item.prescription_req === true) {
  //       flag = true;
  //     }
  //   });
  //   return flag;
  // };

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

  useEffect(() => {
    const fetchStuff = async () => {
      const addresses = await fetchAddresses();
      DrugStore.addAddresses(addresses);
    };
    fetchStuff();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text
        style={{
          marginHorizontal: 30,
          fontSize: 17,
          fontWeight: 'bold',
          color: "#fff",
          marginTop: 20,
          marginBottom: -5
        }}>
        Select an address
      </Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        keyExtractor={item => item.type}
        style={{ padding: 20 }}
        data={DrugStore.addresses}
        renderItem={({ item, index }) => (
          <Address
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
              elevation: 10,

              backgroundColor: colors.SECONDARY,
              marginHorizontal: 10,
              width: 300,
              height: index === selectedAddressIndex ? 185 : 175,
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%'
  },
});

export const screenOptions = (navData: any) => {
  return {
    headerTitle: 'Addresses',
    headerLargeTitle: false,
    headerShown: true,
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
  };
};

export default SelectAddressScreen;
