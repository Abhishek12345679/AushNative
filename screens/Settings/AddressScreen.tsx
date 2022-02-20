import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import DrugStore from '../../store/CartStore';

import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react';
import Address from '../../components/Address';
import fetchAddresses from '../../helpers/fetchAddresses';
import { colors } from '../../constants/colors';
import { useFocusEffect } from '@react-navigation/native'

const AddressScreen = observer((props: any) => {
  const { navigation } = props;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStuff = async () => {
    setIsRefreshing(true);
    const addresses = await fetchAddresses();
    DrugStore.addAddresses(addresses);
    setIsRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      try {
        fetchStuff();
      } catch (err) {
        console.error(err)
      }
    }, [navigation])
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={fetchStuff} />
      }
    >
      {DrugStore.addresses.map((address, index) => (
        <Address
          key={index}
          address={address}
          style={{
            backgroundColor: colors.SECONDARY,
            elevation: 10,
            marginVertical: 20
          }}
        />
      ))}
    </ScrollView>
  );
});

export const screenOptions = (navData: any) => {
  return {
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          navData.navigation.navigate('AddAddressModalScreen')
        }}
      >
        <Ionicons name="ios-add" size={24} color="white" />
      </TouchableOpacity>
    ),
    headerLargeTitle: false,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    padding: 20,
  },
});

export default AddressScreen;

