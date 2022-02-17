import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';

import DrugStore from '../store/CartStore';

import {observer} from 'mobx-react';
import auth from '@react-native-firebase/auth';
import ListItem from '../components/ListItem';

import {connectActionSheet} from '@expo/react-native-action-sheet';
import {colors} from '../constants/colors';

const SettingsScreen = observer(props => {
  const {showActionSheetWithOptions} = props;

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
      buttonIndex => {
        if (buttonIndex === 0) {
          const logout = async () => {
            try {
              await auth().signOut();
              DrugStore.initializeUserCredentials('', '', '');
              console.log(
                `${DrugStore.userCredentials.uid} logged out successfully`,
              );
            } catch (e) {
              console.log(e);
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
        name={DrugStore.userCredentials.email.substring(
          0,
          DrugStore.userCredentials.email.indexOf('@'),
        )}
        salt_composition={DrugStore.userCredentials.email}
        style={{
          marginBottom: 30,
          borderRadius: 10,
          height: 100,
        }}
        titleStyle={{fontWeight: 'bold', fontSize: 20}}
        noArrow
        profile
        age={19}
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
            style={{height: 70}}
            titleStyle={{fontWeight: '400', fontSize: 18}}
            keyProp={Math.random() * 10}
            key={Math.random() * 10}
            name={item}
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
            style={{height: 70}}
            titleStyle={{fontWeight: '400', fontSize: 18}}
            keyProp={Math.random() * 10}
            key={Math.random() * 10}
            name={item}
            onPress={() => {
              props.navigation.navigate('MyWebView', {
                url:
                  index === 0
                    ? 'https://aushadhalay.flycricket.io/privacy.html'
                    : 'https://aushadhalay.flycricket.io/terms.html',
                headerTitle: item,
              });
            }}
          />
        ))}
      </View>
      <ListItem
        name="Log Out"
        onPress={onOpenActionSheet}
        style={{
          marginVertical: 25,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          height: 60,
        }}
        titleStyle={{fontWeight: 'bold', fontSize: 18, color: 'red'}}
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
  input: {
    width: '100%',
    borderColor: 'black',
    borderBottomWidth: 2,
    marginBottom: 10,
    height: 30,
    borderRadius: 10,
    fontSize: 15,
    textAlign: 'left',
    textAlignVertical: 'bottom',
    paddingHorizontal: 10,
  },
  searchBtn: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

const connectedApp = connectActionSheet(SettingsScreen);

export default connectedApp;
