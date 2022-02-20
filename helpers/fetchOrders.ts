import firestore from '@react-native-firebase/firestore';
import DrugStore, {OrderType} from '../store/CartStore';

const fetchOrders = async (): Promise<Array<OrderType>> => {
  try {
    const user = await firestore()
      .collection('users')
      .doc(DrugStore.userCredentials.uid)
      .get();

    const userData = user.data();
    // console.log(userData.orders);
    if (userData.orders) {
      return userData.orders;
    } else {
      return [];
    }
  } catch (err) {
    console.log(err);
    return [];
  }
};

export default fetchOrders;
