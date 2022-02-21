import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Linking,
  ActivityIndicator,
  Platform,
} from 'react-native';

import storage from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';
import DrugStore from '../../store/CartStore';

import BigButton from '../../components/BigButton'
import { colors } from '../../constants/colors';

const UploadPrescriptionScreen = props => {
  const [uploading, setUploading] = useState(false);
  const [prescription, setPrescription] = useState('');
  const urlRegex = new RegExp(/^(https):\/\/[^\s$.?#].[^\s]*$/);
  const isValidUrl = urlRegex.test(prescription);

  // const getPrescriptionDoc = async () => {
  //   // Pick a single file
  //   try {
  //     setUploading(true);
  //     const res = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.allFiles],
  //       copyTo: 'documentDirectory',
  //     });
  //     const uri = Platform.select({
  //       android: res.fileCopyUri,
  //       ios: decodeURIComponent(res.fileCopyUri)?.replace?.('file://', ''),
  //     });

  //     // const base64File = await RNFS.readFile(uri, "base64");
  //     console.log(uri);
  //     setPrescription(uploadPrescriptionDoc(uri));
  //     // setUploading(false);
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       // User cancelled the picker, exit any dialogs or menus and move on
  //       setUploading(false);
  //     } else {
  //       setUploading(false);
  //       throw err;
  //     }
  //   }
  // };

  // const uploadPrescriptionDoc = async uri => {
  //   // setLoading(true);
  //   const ref = storage().ref(
  //     `/prescriptions/${new Date().toISOString()}/${DrugStore.userCredentials.uid
  //     }.jpg`,
  //   );

  //   const snapshot = ref.putFile(uri);

  //   snapshot.on(
  //     storage().TaskEvent.STATE_CHANGED,
  //     s => {
  //       // Observe state change events such as progress, pause, and resume
  //       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //       var progress = (s.bytesTransferred / s.totalBytes) * 100;
  //       console.log('Upload is ' + progress + '% done');
  //       switch (s.state) {
  //         case storage().TaskState.PAUSED: // or 'paused'
  //           console.log('Upload is paused');
  //           break;
  //         case storage().TaskState.RUNNING: // or 'running'
  //           console.log('Upload is running');
  //           break;
  //       }
  //     },
  //     error => {
  //       console.log(error);
  //       return;
  //     },
  //     () => {
  //       snapshot.snapshot.ref.getDownloadURL().then(downloadURL => {
  //         console.log('File available at', downloadURL);
  //         console.log(downloadURL);
  //         setUploading(false);
  //         return downloadURL;
  //       });
  //     },
  //   );
  // };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: 'center' }}></View>
      {/* <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 10,
          borderRadius: 5,
          backgroundColor: '#000',
          marginHorizontal: 20,
          marginTop: 20,
        }}>
        <Text style={{fontWeight: 'bold', color: '#fff'}}>
          Prescription Uploaded
        </Text>
        <Text style={{fontWeight: 'bold', color: '#fff'}}>
          {isValidUrl ? 'Yes' : 'No'}
        </Text>
      </View> */}
      {/* <Text
        onPress={() => {
          Linking.openURL(
            `https://drive.google.com/viewerng/viewer?embedded=true&url=${prescription}`,
          );
        }}>
        {prescription === "" ? "no file" : prescription}link
      </Text> */}

      {/* {!uploading ? (
        <Button
          title="upload"
          onPress={async () => {
            // await getPrescriptionDoc();
            // setTimeout(() => {
            //   setUploading(false);
            // }, 5000);
            // await uploadPrescriptionDoc();
          }}
        />
      ) : (
        <ActivityIndicator size="large" color="#000" />
      )} */}
      <View
        style={{
          margin: 20,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <BigButton
          onPress={() => {
            props.navigation.navigate('OrderPreview', {
              selectedAddressIndex: props.route.params.selectedAddressIndex,
              // fileUrl: prescription,
              // prescriptionUploaded: isValidUrl,
              // noPrescriptionRequired: true,
            });
          }}
          text="Next"
          buttonStyle={{
            backgroundColor: colors.SECONDARY
          }}
        />
      </View>
    </View>
  );
};

export default UploadPrescriptionScreen;
