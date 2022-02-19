import firestore from '@react-native-firebase/firestore';
import DrugStore from '../store/CartStore';

const fetchOrders = async () => {
  const orders = await firestore()
    .collection('users')
    .doc(DrugStore.userCredentials.uid)
    .get();

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
