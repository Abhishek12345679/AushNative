import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { observer } from 'mobx-react';
import DP from './DP';
import { colors } from '../constants/colors';

interface ListItemProps {
  style?: {};
  onPress: () => void;
  keyProp: string | number;
  profile?: boolean;
  imageUrl?: string;
  titleStyle?: {};
  title: string;
  subtitle?: string;
}

const ListItem = observer(({
  imageUrl,
  keyProp,
  onPress,
  profile,
  style,
  title,
  subtitle,
  titleStyle
}: ListItemProps
) => {
  return (
    <Pressable
      android_ripple={{
        color: '#fff',
        borderless: false,
      }}
      style={{ ...styles.listItem, ...style }}
      onPress={onPress}
      key={keyProp}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: profile ? 'space-between' : 'flex-start',
          width: '100%',
        }}>
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={{
              height: 70,
              width: 70,
              margin: 10,
              borderRadius: 5,
            }}
          />
        )}
        {
          <View style={{ height: '100%', marginLeft: 15 }}>
            <Text style={{ ...styles.textBig, ...titleStyle }}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={{ ...styles.textSmall }}>
                {subtitle}
              </Text>
            ) : (
              <></>
            )}
          </View>
        }
        {profile && <DP />}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  listItem: {
    width: '100%',
    height: 85,
    backgroundColor: colors.SECONDARY,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBig: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#fff',
  },
  textSmall: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ListItem;
