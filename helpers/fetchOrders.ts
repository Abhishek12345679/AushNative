import firestore from "@react-native-firebase/firestore";
import DrugStore from "../store/CartStore";

const fetchOrders = async () => {
  const orders = await firestore()
    .collection("users")
    .doc(DrugStore.userCredentials.uid)
    .get();

  console.log("orders: ", orders);
};

export default fetchOrders;
