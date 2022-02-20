import { LinearGradient } from 'expo-linear-gradient';
import { observer } from 'mobx-react';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import DrugStore from '../store/CartStore';

interface DPProps {
  loading?: boolean
  outerStyle?: {};
  innerStyle?: {};
}

const DP = observer(({ loading, innerStyle, outerStyle }: DPProps) => {

  const url: string = DrugStore.profile.display_picture;

  const name = DrugStore.userCredentials.email.substring(
    0,
    DrugStore.userCredentials.email.indexOf('@'),
  );

  if (loading) {
    return (
      <LinearGradient
        colors={['red', 'gold', 'red',]}
        style={{ ...styles.outer, ...outerStyle }}>
        <ActivityIndicator
          color="#000"
          size="small"
        />
      </LinearGradient>
    )
  }

  return (
    <LinearGradient
      colors={['red', 'gold', 'red',]}
      style={{ ...styles.outer, ...outerStyle }}>
      {url ?
        <Image
          style={{ ...styles.inner, ...innerStyle }}
          source={{
            uri: url
          }}
        /> :
        <View
          style={{
            ...styles.inner,
            ...innerStyle,
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
    width: 80,
    height: 80,
    borderRadius: 80 / 2.0,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20
  },
});

export default DP;
