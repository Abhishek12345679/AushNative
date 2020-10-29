import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { StyleSheet, RefreshControl, FlatList } from "react-native";
import OrderItem from "../../components/OrderItem";
import DrugStore from "../../store/CartStore";

const OrdersScreen = observer((props) => {
  const { navigation } = props;

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    setIsRefreshing(true);
    DrugStore.fetchOrders();
    setIsRefreshing(false);
  };

  useEffect(() => {
    DrugStore.fetchOrders();
    // console.log("token uid email", DrugStore.userCredentials);
  }, [navigation]);
  // console.log(DrugStore.orders);
  return (
    <FlatList
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
      keyExtractor={(item) => item.datetimestamp.toString()}
      data={DrugStore.orders.slice().reverse()}
      renderItem={(itemData) => (
        <OrderItem
          key={itemData.item.datetimestamp}
          itemData={itemData.item}
          onPress={() => {
            props.navigation.navigate("OrderDetail", {
              item_: DrugStore.orders[itemData.index],
            });
          }}
        />
      )}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
});

export default OrdersScreen;
