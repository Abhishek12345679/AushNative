import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import DrugStore from '../store/CartStore';
import { observer } from 'mobx-react';
import auth from '@react-native-firebase/auth';
import storage, { FirebaseStorageTypes } from '@react-native-firebase/storage';
import ListItem from '../components/ListItem';
import { colors } from '../constants/colors';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import addProfilePicture from '../helpers/profilePicture/addProfilePicture';
import fetchPersonalInfo from '../helpers/fetchPersonalInfo';


const SettingsScreen = observer((props: any) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const PRIVACY_PAGE_URL = 'https://aushadhalay.flycricket.io/privacy.html';
  const TC_PAGE_URL = 'https://aushadhalay.flycricket.io/terms.html';

  const [uploading, setUploading] = useState(false)
  const [localPFP, setLocalPFP] = useState<string>("")

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
      async (buttonIndex: number) => {
        if (buttonIndex === 0) {
          try {
            await auth().signOut()
            console.log(
              `${DrugStore.userCredentials.uid} logged out successfully`,
            );
            // DrugStore.initializeUserCredentials('', '', '');
          } catch (e) {
            console.error(e);
          }
        }
      },
    );
  };

  const launchImageLibrary = async () => {
    try {
      const photo = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });
      if (!photo.cancelled) {
        updateProfilePicture((photo as any).uri)
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateProfilePicture = async (fileUrl: string) => {
    try {
      setUploading(true)
      const reference = storage().ref(`users/${DrugStore.userCredentials.uid}/pfp/${Date.now()}.png`);
      const task = reference.putFile(fileUrl);

      task.on('state_changed', (taskSnapshot: FirebaseStorageTypes.TaskSnapshot) => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      })

      task
        .then(async () => {
          const downloadUrl = await reference.getDownloadURL()
          await addProfilePicture(downloadUrl)
          console.log('Image uploaded to the bucket!: ', downloadUrl);
        })
      setUploading(false)
    } catch (err) {
      console.error(err)
      setUploading(false)
    }
  }

  const fetchPFP = async () => {
    const personalInfo = await fetchPersonalInfo();

    if (personalInfo.display_picture) {
      DrugStore.setPFP(personalInfo.display_picture)
      setLocalPFP(personalInfo.display_picture)
    }
  }


  useEffect(() => {
    try {
      setUploading(true);
      fetchPFP()
      setUploading(false);
    } catch (err) {
      console.error(err)
    }
  }, [uploading]);

  return (
    <ScrollView style={styles.container}>
      <ListItem
        keyProp={Math.random() * 12}
        title={
          DrugStore.profile.name ??
          DrugStore.userCredentials.email.substring(
            0,
            DrugStore.userCredentials.email.indexOf('@'),
          )}
        subtitle={DrugStore.userCredentials.uid}
        style={{
          marginBottom: 30,
          borderRadius: 10,
          height: 100,
        }}
        titleStyle={{ fontWeight: 'bold', fontSize: 20 }}
        profile={true}
        onPress={launchImageLibrary}
        loading={uploading}
        pfp={localPFP}
      />
      <View
        style={{
          borderRadius: 12,
          width: '100%',
          overflow: 'hidden',
        }}>
        {['Addresses', 'Orders'].map((item, index) => (
          <ListItem
            keyProp={Math.random() * 12 + index}
            style={{ height: 70 }}
            titleStyle={{ fontSize: 18 }}
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
            keyProp={Math.random() * 12 + index}
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
        keyProp={Math.random() * 12 - 1}
        title="Log Out"
        onPress={onOpenActionSheet}
        style={{
          marginVertical: 25,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          height: 75,
          backgroundColor: "rgba(255,0,0,0.6)"
        }}
        titleStyle={{ fontWeight: 'bold', fontSize: 18, color: 'white' }}
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
