import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { observer } from 'mobx-react';

import Address from '../../components/Address';
import { toISTString } from '../../helpers/toISTString';
import { colors } from '../../constants/colors';
import { DrugType } from '../../store/CartStore';

import CartItem from '../../components/CartItem'

const OrderDetailScreen = observer((props: any) => {

  const { order, datetimestamp } = props.route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.item}>
        <View style={styles.textCont}>
          <Text style={{ color: "#fff" }}>Order Date</Text>
          <Text style={styles.BoldText}>{toISTString(datetimestamp)}</Text>
        </View>
        <View style={styles.textCont}>
          <Text style={{ color: "#fff" }}>Order Id</Text>
          <Text style={styles.BoldText}>{order.order_id}</Text>
        </View>
        <View style={styles.textCont}>
          <Text style={{ color: "#fff" }}>Total</Text>
          <Text style={styles.BoldText}>
            ₹{order.total_amt.toFixed(2)}
          </Text>
        </View>
      </View>

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
      <View style={{
        paddingHorizontal: 20,
        paddingVertical: 5,
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
  },
  item: {
    marginHorizontal: 25,
    marginVertical: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.SECONDARY,
  },
  textCont: {
    marginVertical: 10,
    // flexDirection: 'row',
    justifyContent: 'space-between',
  },
  BoldText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: 'bold'
  },
});

export default OrderDetailScreen;
