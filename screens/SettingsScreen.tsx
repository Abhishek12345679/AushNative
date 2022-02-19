import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import DrugStore from '../store/CartStore';

import { observer } from 'mobx-react';
import auth from '@react-native-firebase/auth';
import ListItem from '../components/ListItem';

import { connectActionSheet } from '@expo/react-native-action-sheet';
import { colors } from '../constants/colors';

import { useActionSheet } from '@expo/react-native-action-sheet';

const SettingsScreen = observer((props) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const PRIVACY_PAGE_URL = 'https://aushadhalay.flycricket.io/privacy.html';
  const TC_PAGE_URL = 'https://aushadhalay.flycricket.io/terms.html';

  const onOpenActionSheet = () => {
    const options = ['Log Out', 'Cancel'];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (buttonIndex: number) => {
        if (buttonIndex === 0) {
          const logout = async () => {
            try {
              await auth().signOut();
              DrugStore.initializeUserCredentials('', '', '');
              console.log(
                `${DrugStore.userCredentials.uid} logged out successfully`,
              );
            } catch (e) {
              console.error(e);
            }
          };
          logout();
        }
      },
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ListItem
        keyProp={'d' + 0}
        title={DrugStore.userCredentials.email.substring(
          0,
          DrugStore.userCredentials.email.indexOf('@'),
        )}
        subtitle={DrugStore.userCredentials.email}
        style={{
          marginBottom: 30,
          borderRadius: 10,
          height: 100,
        }}
        titleStyle={{ fontWeight: 'bold', fontSize: 20 }}
        profile
        onPress={() => {
          props.navigation.navigate('EditProfile', {
            screen: 'Edit Profile',
          });
        }}
      />
      <View
        style={{
          borderRadius: 12,
          width: '100%',
          overflow: 'hidden',
        }}>
        {['Addresses', 'Orders'].map((item, index) => (
          <ListItem
            style={{ height: 70 }}
            titleStyle={{ fontSize: 18 }}
            keyProp={'a' + index}
            title={item}
            onPress={() => props.navigation.navigate(item)}
          />
        ))}
      </View>

      <View
        style={{
          borderRadius: 12,
          width: '100%',
          overflow: 'hidden',
          marginTop: 20,
        }}>
        {['Privacy Policy', 'Terms and Conditions'].map((item, index) => (
          <ListItem
            style={{ height: 70 }}
            titleStyle={{ fontSize: 18 }}
            keyProp={'b' + index}
            title={item}
            onPress={() => {
              props.navigation.navigate('MyWebView', {
                url: index === 0 ? PRIVACY_PAGE_URL : TC_PAGE_URL,
                headerTitle: item,
              });
            }}
          />
        ))}
      </View>
      <ListItem
        keyProp={'c' + 0}
        title="Log Out"
        onPress={onOpenActionSheet}
        style={{
          marginVertical: 25,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          height: 60,
        }}
        titleStyle={{ fontWeight: 'bold', fontSize: 18, color: 'red' }}
      />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    padding: 20,
  },
});

export default SettingsScreen