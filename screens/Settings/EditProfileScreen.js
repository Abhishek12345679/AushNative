import React from 'react';
import {Text, SafeAreaView} from 'react-native';
import {observer} from 'mobx-react';

const EditProfileScreen = observer(() => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{color: '#fff'}}>Maintainance</Text>
    </SafeAreaView>
  );
});

export default EditProfileScreen;
