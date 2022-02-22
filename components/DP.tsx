import { LinearGradient } from 'expo-linear-gradient';
import { observer } from 'mobx-react';
import React from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet } from 'react-native';
import DrugStore from '../store/CartStore';
import PFPPlaceholder from './PFPPlaceholder';

interface DPProps {
  loading?: boolean;
  pfp?: string;
  outerStyle?: {};
  innerStyle?: {};
  onPress?: () => void;
}

const DP = observer(({ loading, innerStyle, outerStyle, pfp, onPress }: DPProps) => {
  const url: string = pfp ?? DrugStore.profile.display_picture;
  const name = DrugStore.userCredentials.email.substring(
    0,
    DrugStore.userCredentials.email.indexOf('@'),
  );

  return (
    <Pressable
      android_ripple={{
        color: "#000000",
        borderless: true
      }}
      style={{ ...DPStyles.outer }}
      onPress={onPress}
    >
      <LinearGradient
        colors={['red', 'gold', 'red',]}
        style={{ ...DPStyles.outer, ...outerStyle }}
      >
        {
          url ?
            <Image
              style={{ ...DPStyles.inner, ...innerStyle }}
              source={{
                uri: url
              }}
            />
            : loading ?
              <ActivityIndicator
                color="#000"
                size="small"
              />
              : <PFPPlaceholder
                name={name}
              />
        }
      </LinearGradient>
    </Pressable>
  );
});

export const DPStyles = StyleSheet.create({
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
