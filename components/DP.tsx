import { LinearGradient } from 'expo-linear-gradient';
import { observer } from 'mobx-react';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import DrugStore from '../store/CartStore';

const DP = observer(props => {

  const url: string = DrugStore.profile.display_picture;

  const name = DrugStore.userCredentials.email.substring(
    0,
    DrugStore.userCredentials.email.indexOf('@'),
  );

  return (
    <LinearGradient
      colors={['red', 'gold', 'red',]}
      style={{ ...styles.outer, ...props.outer }}>
      {!url && url.startsWith("file") ?
        <Image
          style={{ ...styles.inner, ...props.inner }}
          source={{
            uri: url
          }}
        /> :
        <View
          style={{
            ...styles.inner,
            ...props.inner,
          }}

        >
          <Text
            style={{
              color: "#fff",
              fontWeight: 'bold',
              fontSize: 30
            }}
          >
            {name.split(" ").map((name) => name[0].toUpperCase())}
          </Text>
        </View>
      }
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
  outer: {
    width: 85,
    height: 85,
    borderRadius: 85 / 2.0,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 15,
  },
  inner: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2.0,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DP;
