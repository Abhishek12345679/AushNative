import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import DrugStore from '../../store/CartStore';

import {Ionicons} from '@expo/vector-icons';
import {observer} from 'mobx-react';
import Address from '../../components/Address';
import fetchAddresses from '../../helpers/fetchAddresses';
import {colors} from '../../constants/colors';

const AddressScreen = observer(props => {
  const {navigation} = props;
  useEffect(() => {
    const fetchStuff = async () => {
      const addresses = await fetchAddresses();
      DrugStore.addAddresses(addresses);
    };
    fetchStuff();
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      {DrugStore.addresses.map((address, index) => (
        <Address
          key={index}
          address={address}
          style={{
            backgroundColor: colors.SECONDARY,
            elevation: 10,
          }}
        />
      ))}
    </ScrollView>
  );
});

export const screenOptions = navData => {
  return {
    headerRight: () => (
      <TouchableOpacity
        onPress={() => navData.navigation.navigate('Add New Address')}>
        <Ionicons name="ios-add-outline" size={24} color="white" />
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
