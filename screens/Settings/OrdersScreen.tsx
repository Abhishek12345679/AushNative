import { useFocusEffect } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { StyleSheet, RefreshControl, FlatList, View, Text } from 'react-native';
import OrderItem from '../../components/OrderItem';
import fetchOrders from '../../helpers/fetchOrders';
import DrugStore from '../../store/CartStore';

const OrdersScreen = observer((props: any) => {
  const { navigation } = props;
  const drugs = DrugStore.orders.slice().reverse() as any[]

  console.log(drugs)

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    const orders = await fetchOrders();
    DrugStore.addOrders(orders);
  };

  useFocusEffect(
    React.useCallback(() => {
      try {
        setIsRefreshing(true);
        onRefresh();
        setIsRefreshing(false);
      } catch (err) {
        console.error(err)
      }
    }, [navigation])
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        keyExtractor={(item) => item.datetimestamp}
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        data={drugs}
        renderItem={(order: any, index: number) => (
          <OrderItem
            status={order.item.status}
            key={index}
            datetimestamp={order.item.datetimestamp}
            item={order.item}
            onPress={() => {
              props.navigation.navigate('OrderDetail', {
                order: order.item,
                datetimestamp: order.item.datetimestamp
              });
            }}
          />
        )}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default OrdersScreen;
