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
import * as Yup from 'yup';
import { MaterialCommunityIcons } from '@expo/vector-icons'

const AuthenticationScreen = observer(() => {
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const signupSchema = Yup.object().shape({
    name: Yup.string().required('Enter Name'),
    email: Yup.string().email('Invalid email').required('Email Required'),
    password: Yup.string().min(8, "Password should be >= 8 characters.").required('Password Required')
  });

  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email Required'),
    password: Yup.string().min(8, "Password should be >= 8 characters.").required('Password Required')
  });


  const signUp = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      if (password.length < 6) {
        Alert.alert('Password invalid');
        return;
      }

      const { user } = await auth().createUserWithEmailAndPassword(email.trim(), password.trim());
      const token = await user.getIdToken();
      DrugStore.initializeUserCredentials(token, user.uid, user.email);

      await updatePersonalInfo({
        name: name.trim(),
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
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert("Auth Error", 'That email address is invalid!');
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };

  const logIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user } = await auth().signInWithEmailAndPassword(email.trim(), password.trim());
      const token = await user.getIdToken();
      DrugStore.initializeUserCredentials(token, user.uid, user.email);
      setLoading(false);

    } catch (error) {
      setLoading(false);

      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('That email address is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert("Auth Error", 'That email address is invalid!');
      } else if (error.code === 'auth/user-not-found') {
        Alert.alert("Auth Error", 'No user associated with these credentials');
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };

  return (
    <View>
      <StatusBar barStyle="light-content" />
      <View
        style={{
          width: '100%',
          marginTop: 50,
          paddingVertical: 20,
          paddingHorizontal: 15
        }}
      >
        <Text
          style={{ color: '#fff', fontSize: 50, fontWeight: 'bold' }}
        >
          {!isNewUser ? "Hello! 🥳" : "Welcome\nBack 🥳"}
        </Text>
        <Formik
          validationSchema={isNewUser ? signupSchema : loginSchema}
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
              Alert.alert(err)
            }
          }}
        >
          {({ handleChange, handleSubmit, errors, touched }) => (
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
              {isNewUser &&
                errors.name &&
                touched.name &&
                <Text style={styles.errorText}>{errors.name}</Text>
              }
              <TextInput
                placeholder="joe@joe.com"
                placeholderTextColor="#ccc"
                style={styles.input}
                onChangeText={handleChange('email')}
                autoCapitalize="none"
              />
              {errors.email &&
                touched.email &&
                <Text style={styles.errorText}>{errors.email}</Text>
              }
              <TextInput
                placeholderTextColor="#ccc"
                secureTextEntry
                placeholder="Password"
                style={styles.input}
                onChangeText={handleChange('password')}
                autoCapitalize="none"
              />
              {errors.password &&
                touched.password &&
                <View style={styles.errorContainer}>
                  <MaterialCommunityIcons name="close-circle" size={18} color="#FF3232" />
                  <Text style={styles.errorText}>{errors.password}</Text>
                </View>
              }
              <BigButton
                buttonStyle={{
                  backgroundColor: "#fff",
                  marginTop: 30,
                  marginBottom: 20,
                }}
                titleStyle={{
                  color: '#000',
                  fontSize: 18
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
  input: {
    height: 60,
    backgroundColor: colors.SECONDARY,
    marginVertical: 10,
    paddingLeft: 10,
    color: '#fff',
    fontSize: 17,
    borderRadius: 5
  },
  errorText: {
    color: "#FF3232",
    fontWeight: 'normal',
    marginStart: 10,
    fontSize: 15
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.SECONDARY,
    width: 175,
    padding: 5,
    borderRadius: 5
  }
});

export default AuthenticationScreen;
