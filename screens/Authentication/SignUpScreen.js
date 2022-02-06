import {Formik} from 'formik';
import {observer} from 'mobx-react';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';

import DrugStore from '../../store/CartStore';

import auth from '@react-native-firebase/auth';

import {showMessage} from 'react-native-flash-message';

const SignUpScreen = observer(() => {
  const [loading, setLoading] = useState(false);
  const [signIn, setSignIn] = useState(true);

  // create account
  const signup = async (name, email, password) => {
    try {
      setLoading(true);

      if (password.length < 6) {
        Alert.alert('Password invalid');
        return;
      }

      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          DrugStore.console.log('User account created & signed in!');
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }

          console.error(error);
        });

      auth().onAuthStateChanged(async user => {
        if (user) {
          const token = await user.getIdToken();
          console.log('token: ', token);
          DrugStore.initializeUserCredentials(token, user.uid, user.email);
        }
      });

      showMessage({
        message: 'Account created successfully',
        type: 'success',
      });

      setLoading(false);
    } catch (e) {
      console.log(e);
      Alert.alert('Something went wrong');
      return;
    }
  };

  // Log in
  const login = async (email, password) => {
    try {
      setLoading(true);

      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log('User account created & signed in!');
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }

          console.error(error);
        });

      auth().onAuthStateChanged(async user => {
        if (user) {
          const token = await user.getIdToken();
          console.log('token: ', token);
          DrugStore.initializeUserCredentials(token, user.uid, user.email);
        }
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
      return Alert.alert('Something Really bAd happened!'); //lol
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          width: '100%',
          marginTop: 20,
          padding: 20,
        }}>
        <Text style={{color: '#fff', fontSize: 40}}>
          Welcome Back
          <Text style={{color: 'purple', fontWeight: 'bold', fontSize: 45}}>
            {'  '}Stranger
          </Text>
        </Text>
      </View>
      <TouchableOpacity
        style={{flex: 1, justifyContent: 'center', padding: 20}}
        activeOpacity={1}
        onPress={() => Keyboard.dismiss()}>
        <StatusBar barStyle="light-content" />
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
          }}>
          {({handleChange, values}) => (
            <View>
              {signIn && (
                <TextInput
                  placeholder="Name"
                  style={styles.input}
                  onChangeText={handleChange('name')}
                  autoCapitalize="none"
                />
              )}
              <TextInput
                placeholder="Email"
                style={styles.input}
                onChangeText={handleChange('email')}
                autoCapitalize="none"
              />
              <TextInput
                secureTextEntry
                placeholder="Password"
                style={styles.input}
                onChangeText={handleChange('password')}
                autoCapitalize="none"
              />
              {signIn && (
                <TouchableOpacity
                  disabled={
                    values.email.length < 10 && values.password.length < 6
                  }
                  onPress={() => {
                    signup(values.name, values.email, values.password);
                  }}
                  style={{
                    backgroundColor: 'skyblue',
                    height: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 25,
                  }}>
                  <Text
                    style={{fontSize: 20, fontWeight: 'bold', color: '#000'}}>
                    Create Account
                  </Text>
                </TouchableOpacity>
              )}
              {!signIn && (
                <TouchableOpacity
                  disabled={
                    values.email.length < 10 && values.password.length < 6
                  }
                  onPress={() => {
                    login(values.email, values.password);
                  }}
                  style={{
                    backgroundColor: 'purple',
                    height: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 25,
                  }}>
                  {!loading ? (
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#fff',
                      }}>
                      Login
                    </Text>
                  ) : (
                    <ActivityIndicator size="large" color="#fff" />
                  )}
                </TouchableOpacity>
              )}
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  marginVertical: 20,
                }}>
                {!signIn ? (
                  <Text style={{color: '#fff'}}>
                    Create an account.{' '}
                    <Text
                      style={{color: 'purple', fontWeight: 'bold'}}
                      onPress={() => setSignIn(true)}>
                      Sign in
                    </Text>
                  </Text>
                ) : (
                  <Text style={{color: '#fff'}}>
                    Already have an account.{' '}
                    <Text
                      style={{color: 'purple', fontWeight: 'bold'}}
                      onPress={() => setSignIn(false)}>
                      Login
                    </Text>
                  </Text>
                )}
              </View>
            </View>
          )}
        </Formik>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  input: {
    height: 60,
    width: '100%',
    backgroundColor: '#FFF',
    marginVertical: 10,
    paddingLeft: 10,
    color: '#000',
    fontSize: 20,
    fontWeight: '500',
  },
});

export default SignUpScreen;
