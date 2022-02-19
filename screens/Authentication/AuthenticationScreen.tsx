import { Formik } from 'formik';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  TextInput,
} from 'react-native';

import DrugStore from '../../store/CartStore';
import auth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import updatePersonalInfo from '../../helpers/updatePersonalInfo'
import { colors } from '../../constants/colors'
import BigButton from '../../components/BigButton'

const AuthenticationScreen = observer(() => {
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // create account
  const signUp = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);

      if (password.length < 6) {
        Alert.alert('Password invalid');
        return;
      }

      const { user } = await auth().createUserWithEmailAndPassword(email, password);
      const token = await user.getIdToken();
      DrugStore.initializeUserCredentials(token, user.uid, user.email);

      await updatePersonalInfo({
        name: name,
      })

      showMessage({
        message: 'Account created successfully',
        type: 'success',
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);

      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('That email address is already in use!');
      }
      if (error.code === 'auth/invalid-email') {
        Alert.alert('That email address is invalid!');
      }
      Alert.alert("[Error]: ", error);

    }
  };

  // Log in
  const logIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user } = await auth().signInWithEmailAndPassword(email, password);
      const token = await user.getIdToken();
      DrugStore.initializeUserCredentials(token, user.uid, user.email);
      setLoading(false);

    } catch (error) {
      setLoading(false);

      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('That email address is already in use!');
      }
      if (error.code === 'auth/invalid-email') {
        Alert.alert('That email address is invalid!');
      }
      Alert.alert("[Error]: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View
        style={{
          width: '100%',
          marginTop: 20,
          paddingVertical: 20,
          paddingHorizontal: 15
        }}>
        <Text style={{ color: '#fff', fontSize: 50, fontWeight: 'bold' }}>
          {!isNewUser ? "Hello! 🥳" : "Welcome\nBack 🥳"}
        </Text>
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
          }}
          onSubmit={async (values) => {
            try {
              setLoading(true)
              if (isNewUser) {
                await signUp(values.name, values.email, values.password)
              } else {
                await logIn(values.email, values.password)
              }
              setLoading(false)
            } catch (err) {
              setLoading(false)
              console.error(err)
            }
          }}
        >
          {({ handleChange, handleSubmit }) => (
            <View style={{ marginTop: 50 }}>
              {isNewUser && (
                <TextInput
                  placeholder="Name"
                  placeholderTextColor="#ccc"
                  style={styles.input}
                  onChangeText={handleChange('name')}
                  autoCapitalize="none"
                />
              )}
              <TextInput
                placeholder="joe@joe.com"
                placeholderTextColor="#ccc"
                style={styles.input}
                onChangeText={handleChange('email')}
                autoCapitalize="none"
              />
              <TextInput
                placeholderTextColor="#ccc"
                secureTextEntry
                placeholder="Password"
                style={styles.input}
                onChangeText={handleChange('password')}
                autoCapitalize="none"
              />
              <BigButton
                // disabled={}
                buttonStyle={{
                  backgroundColor: "skyblue",
                  marginTop: 20,
                  marginBottom: 5
                }}
                text={isNewUser ? "Join Us" : "Login"}
                onPress={handleSubmit}
                loading={loading}
              />
              <Text
                style={{ color: "#fff", fontWeight: "normal" }}
                onPress={() => setIsNewUser((prev) => !prev)}
              >
                {isNewUser ? "Already have an account? Click to Login" : "Don't have an acccount? Create Here."}
              </Text>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
  },
  input: {
    height: 60,
    backgroundColor: colors.SECONDARY,
    marginVertical: 10,
    paddingLeft: 10,
    color: '#fff',
    fontSize: 17,
    borderRadius: 5
  },
});

export default AuthenticationScreen;
