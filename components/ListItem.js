import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {observer} from 'mobx-react';
import DP from './DP';

const ListItem = observer(props => {
  return (
    <TouchableOpacity
      style={{...styles.listItem, ...props.style}}
      activeOpacity={0.75}
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
            <Text style={{...styles.textBig, ...props.titleStyle}}>
              {props.name}
            </Text>
            {props.salt_composition ? (
              <Text style={{...styles.textSmall, ...props.saltTextStyle}}>
                {props.salt_composition}
              </Text>
            ) : (
              <></>
            )}
          </View>
        }
        {props.profile && <DP />}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  listItem: {
    width: '100%',
    height: 85,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  textBig: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  textSmall: {
    fontSize: 15,
    color: 'purple',
    fontWeight: 'normal',
  },
});

export default ListItem;
