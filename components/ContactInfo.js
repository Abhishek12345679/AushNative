import React from 'react';
import {View, Text, Linking, TouchableOpacity, StyleSheet} from 'react-native';

import {AntDesign} from '@expo/vector-icons';

const ContactInfo = () => {
  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      <View
        style={{
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <AntDesign name="customerservice" size={30} color="black" />
        <Text style={{marginStart: 10, fontSize: 30, fontWeight: 'bold'}}>
          Contact Us
        </Text>
      </View>
      <View
        style={{
          padding: 20,
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={styles.contactBtn}
          onPress={() => {
            Linking.openURL('mailto: sah755146@gmail.com');
          }}>
          <Text style={{fontWeight: 'bold'}}>Email Us</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contactBtn}
          onPress={() => {
            Linking.openURL('tel:+917908174073');
          }}>
          <Text style={{fontWeight: 'bold'}}>Call us</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contactBtn: {
    width: '90%',
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
});

export default ContactInfo;
