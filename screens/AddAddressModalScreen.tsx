import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Text,
  Pressable,
  StyleSheet
} from 'react-native';

import { Formik } from 'formik';
import RadioButtonRN from 'radio-buttons-react-native';

import { showMessage } from 'react-native-flash-message';
import { observer } from 'mobx-react';
import addAddresses from '../helpers/addAddress';
import { colors } from '../constants/colors';
import BigButton from '../components/BigButton';

const AddAddressModalScreen = observer(props => {
  const [addingAddress, setAddingAddress] = useState(false);
  const [type, setType] = useState('Home');

  // const AddressType = ['Home', 'Work', 'Other'];

  return (
    <ScrollView style={{ paddingHorizontal: 20, paddingVertical: 5 }}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView behavior="position">
        <Formik
          initialValues={{
            type: '',
            name: '',
            add_line_1: '',
            add_line_2: '',
            ph_no: '',
          }}
          onSubmit={async values => {
            console.log('Submitting...');

            setAddingAddress(true);
            await addAddresses({
              type: type,
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
              {/* <RadioButtonRN
                initial={1}
                data={AddressType}
                selectedBtn={item => {
                  setType(item);
                }}
                circleSize={16}
              /> */}
              <TextInput
                onChangeText={handleChange('name')}
                value={values.name}
                style={styles.inputStyle}
                placeholder={'Name'}
                placeholderTextColor="#fff"
              />

              <TextInput
                keyboardType="phone-pad"
                onChangeText={handleChange('ph_no')}
                value={values.ph_no}
                style={styles.inputStyle}
                placeholder={'Mobile'}
                placeholderTextColor="#fff"
              />
              <TextInput
                onChangeText={handleChange('add_line_1')}
                value={values.add_line_1}
                style={styles.inputStyle}
                placeholder={'Address Line 1'}
                placeholderTextColor="#fff"
              />
              <TextInput
                onChangeText={handleChange('add_line_2')}
                value={values.add_line_2}
                style={styles.inputStyle}
                placeholder={'Address Line 2'}
                placeholderTextColor="#fff"
              />

              <BigButton
                text="Submit"
                loading={addingAddress}
                onPress={handleSubmit}
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
    height: 75,
    marginTop: 20,
    borderBottomWidth: 0.5,
    borderColor: '#fff',
    color: "#fff",
  }
})

export default AddAddressModalScreen;
