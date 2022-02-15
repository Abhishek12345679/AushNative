import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import Address from '../../components/Address';
import DrugStore from '../../store/CartStore';

import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import fetchAddresses from '../../helpers/fetchAddresses';

const SelectAddressScreen = props => {
  const {drugs} = DrugStore;

  const isPrescriptionRequired = () => {
    let flag = false;
    drugs.forEach(item => {
      if (item.prescription_req === true) {
        flag = true;
      }
    });
    return flag;
  };

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
      <StatusBar barStyle="dark-content" />
      <View style={{flex: 1}}>
        <ProgressSteps stepCount={4} activeStep={0}>
          <ProgressStep label="Address" nextBtnText=""></ProgressStep>
          <ProgressStep label="Preview" nextBtnText=""></ProgressStep>
          <ProgressStep label="Prescription" nextBtnText=""></ProgressStep>
          <ProgressStep label="Payment" nextBtnText=""></ProgressStep>
        </ProgressSteps>
      </View>

      <FlatList
        keyExtractor={item => item.type}
        style={{padding: 20}}
        data={DrugStore.addresses}
        ListFooterComponent={
          <View>
            <TouchableOpacity
              style={{
                marginVertical: 20,
                height: 60,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000',
              }}
              onPress={() => props.navigation.navigate('Add New Address')}>
              <Text style={{color: '#fff', fontSize: 15, fontWeight: '500'}}>
                Add New Address
              </Text>
            </TouchableOpacity>
            <TouchableHighlight
              style={{
                height: 60,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000',
                marginBottom: 40,
              }}
              onPress={() => {
                console.log('prescr_req', isPrescriptionRequired());
                isPrescriptionRequired()
                  ? props.navigation.navigate('UploadPrescription', {
                      selectedAddressIndex: selectedAddressIndex,
                      // paymentMode: 'sample',
                    })
                  : props.navigation.navigate('OrderPreview', {
                      noPrescriptionRequired: true,
                      selectedAddressIndex: selectedAddressIndex,
                      // paymentMode: 'sample',
                    });
              }}>
              <Text style={{color: '#fff', fontSize: 15, fontWeight: '500'}}>
                Deliver to this address
              </Text>
            </TouchableHighlight>
          </View>
        }
        renderItem={({item, index}) => (
          <Address
            onPress={() => {
              setSelectedAddressIndex(index);
            }}
            style={{
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowRadius: 10,
              borderWidth: index === selectedAddressIndex ? 2 : 0,
              borderColor: 'blue',
            }}
            keyProp={item.ph_no}
            address={item}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});

export const screenOptions = navData => {
  return {
    headerTitle: 'Addresses',
    headerLargeTitle: false,
    headerShown: true,
    headerRight: () => (
      <Text
        style={{color: 'rgb(36,61,138)', fontWeight: '500', fontSize: 17}}
        onPress={() => {
          navData.navigation.pop();
        }}>
        cancel
      </Text>
    ),
  };
};

export default SelectAddressScreen;
