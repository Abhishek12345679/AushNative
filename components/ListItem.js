import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {observer} from 'mobx-react';
import DP from './DP';
import {colors} from '../constants/colors';

const ListItem = observer(props => {
  return (
    <Pressable
      android_ripple={{
        color: '#fff',
        borderless: false,
      }}
      style={{...styles.listItem, ...props.style}}
      onPress={props.onPress}
      key={props.keyProp}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: props.profile ? 'space-between' : 'flex-start',
          width: '100%',
        }}>
        {props.imageUrl && !props.profile && (
          <Image
            source={{uri: props.imageUrl}}
            style={{
              height: 70,
              width: 70,
              margin: 10,
              borderRadius: 5,
            }}
          />
        )}
        {
          <View style={{height: '100%', marginLeft: 15}}>
            <Text style={{...styles.textBig}}>{props.name}</Text>
            {props.salt_composition ? (
              <Text style={{...styles.textSmall}}>
                {props.salt_composition}
              </Text>
            ) : (
              <></>
            )}
          </View>
        }
        {props.profile && <DP />}
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
    borderBottomColor: '#ccc',
    padding: (10, 10, 10, 10),
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
