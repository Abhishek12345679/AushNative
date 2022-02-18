import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { observer } from 'mobx-react';

import Address from '../../components/Address';
import { toISTString } from '../../helpers/toISTString';
import { colors } from '../../constants/colors';
import { DrugType, OrderType } from '../../store/CartStore';

import CartItem from '../../components/CartItem'
import OrderSummary from '../../components/OrderSummary';

const OrderDetailScreen = observer((props: any) => {

  const { order, datetimestamp } = props.route.params;

  return (
    <ScrollView style={styles.container}>
      <OrderSummary
        datetimestamp={datetimestamp}
        totalAmt={(order as OrderType).total_amt}
        orderId={order.order_id}
      />

      <Text
        style={{
          marginHorizontal: 30,
          fontSize: 20,
          fontWeight: 'bold',
          color: "#fff",
          marginVertical: 0
        }}>
        Items
      </Text>
      <View
        style={{
          borderRadius: 12,
          width: '100%',
          overflow: 'hidden',
          paddingHorizontal: 20,
          paddingVertical: 5
        }}>
        {order.items.map((drug: DrugType, index: number) => (
          <CartItem
            key={index}
            drug={drug}
            keyProp={index}
          />
        ))}
      </View>
      <Text
        style={{
          marginHorizontal: 30,
          fontSize: 20,
          fontWeight: 'bold',
          color: "#fff",
          marginVertical: 5
        }}>
        Address
      </Text>
      <View style={{ paddingHorizontal: 25 }}>
        <Address
          address={order.address}
          style={{
            backgroundColor: colors.SECONDARY
          }}
        />
      </View>
    </ScrollView>
  );
});

export const screenOptions = (navData: any) => {
  const datetimestamp = navData.route.params.datetimestamp;
  return {
    headerLargeTitle: false,
    headerTitle: datetimestamp ? toISTString(datetimestamp) : 'Order',
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default OrderDetailScreen;
