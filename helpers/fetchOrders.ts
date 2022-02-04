import firestore from "@react-native-firebase/firestore";
import DrugStore from "../store/CartStore";

const fetchOrders = async () => {
  const orders = await firestore()
    .collection("users")
    .doc(DrugStore.userCredentials.uid)
    .get();

  // console.log("orders: ", orders.data().orders);
  const ordersData = orders.data();
  if (ordersData) {
    if (ordersData.orders.length > 0) {
      return ordersData.orders;
    }
    return [ordersData.orders];
  } else {
    return [];
  }
};

export default fetchOrders;