import React from 'react';
import { observer } from 'mobx-react';
import { View, Text, Pressable, Image } from 'react-native';
import { colors } from '../constants/colors';
import { OrderType } from '../store/CartStore';
import ImageStack from './ImageStack';

interface OrderItemProps {
  item: OrderType;
  status: boolean;
  onPress: () => void;
  datetimestamp: number;
}

const OrderItem = observer(({ status, item, onPress, datetimestamp }: OrderItemProps) => {

  const toISTString = (unixtime: number): string => {
    const dateObject = new Date(unixtime);
    const humanDateFormat = dateObject.toString();
    return humanDateFormat.substring(0, humanDateFormat.indexOf(':') - 3);
  };

  return (
    <Pressable
      style={{
        flexDirection: 'row',
        backgroundColor: status ? colors.SECONDARY : "red",
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,

        shadowOpacity: 0.3,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowRadius: 20,
        elevation: 10
      }}
      android_ripple={{
        color: "#fff",
        borderless: false
      }}
      onPress={onPress}>
      <ImageStack item={item} />
      <View
        style={{
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}>
        <Text style={{ fontSize: 17, fontWeight: "bold", color: "#fff" }}>
          {toISTString(datetimestamp)}
        </Text>
        <View style={{ alignItems: 'flex-start', flexDirection: 'row', marginTop: 5 }}>
          <Text style={{ fontWeight: 'bold', color: "#fff", marginEnd: 10 }}>Total</Text>
          <Text style={{ color: '#FFF', fontWeight: 'normal' }}>
            ₹{item.total_amt}
          </Text>
        </View>
      </View>
    </Pressable>
  );
});

export default OrderItem;
