import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  StatusBar,
  StyleSheet
} from 'react-native';

import { Formik } from 'formik';
import RadioButtonRN from 'radio-buttons-react-native';

import { showMessage } from 'react-native-flash-message';
import { observer } from 'mobx-react';
import addAddresses from '../helpers/addAddress';
import BigButton from '../components/BigButton';
import { colors } from '../constants/colors';

const AddAddressModalScreen = observer(props => {
  const [addingAddress, setAddingAddress] = useState(false);
  // const [type, setType] = useState('Home');

  // const AddressType = ['Home', 'Work', 'Other'];

  return (
    <ScrollView style={{ paddingHorizontal: 20, paddingVertical: 5 }}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView behavior="position">
        <Formik
          initialValues={{
            type: 'home',
            name: '',
            add_line_1: '',
            add_line_2: '',
            ph_no: '',
          }}
          onSubmit={async values => {
            console.log('Submitting...');

            setAddingAddress(true);
            await addAddresses({
              type: values.type,
              name: values.name,
              add_line_1: values.add_line_1,
              add_line_2: values.add_line_2,
              ph_no: '+91' + values.ph_no,
            });

            showMessage({
              message: 'New Address Added',
              type: 'success',
              duration: 500,
            });

            setAddingAddress(true);
            props.navigation.pop();
          }}>
          {({ handleChange, handleSubmit, values }) => (
            <ScrollView>
              <TextInput
                onChangeText={handleChange('name')}
                value={values.name}
                style={styles.inputStyle}
                placeholder={'Name'}
                placeholderTextColor="#ccc"
              />

              <TextInput
                keyboardType="phone-pad"
                onChangeText={handleChange('ph_no')}
                value={values.ph_no}
                style={styles.inputStyle}
                placeholder={'Mobile'}
                placeholderTextColor="#ccc"
              />
              <TextInput
                onChangeText={handleChange('add_line_1')}
                value={values.add_line_1}
                style={styles.inputStyle}
                placeholder={'Address Line 1'}
                placeholderTextColor="#ccc"
              />
              <TextInput
                onChangeText={handleChange('add_line_2')}
                value={values.add_line_2}
                style={styles.inputStyle}
                placeholder={'Address Line 2'}
                placeholderTextColor="#ccc"
              />

              <BigButton
                text="Submit"
                loading={addingAddress}
                onPress={handleSubmit}
                buttonStyle={{
                  backgroundColor: "red"
                }}
              />
            </ScrollView>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  inputStyle: {
    height: 60,
    marginVertical: 15,
    // borderBottomWidth: 0.5,
    borderColor: '#fff',
    color: "#fff",
    backgroundColor: colors.SECONDARY,
    borderRadius: 10,
    paddingHorizontal: 20
  }
})

export default AddAddressModalScreen;
