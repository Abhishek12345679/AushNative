import firestore from '@react-native-firebase/firestore';
import DrugStore, {OrderType} from '../store/CartStore';
import fetchOrders from './fetchOrders';

const addOrder = async (order: OrderType) => {
  try {
    const user = firestore()
      .collection('users')
      .doc(DrugStore.userCredentials.uid);

    const userExists = (await user.get()).exists;

    console.log('user: ', userExists);

    if (userExists) {
      const orders = await fetchOrders();
      await user.update({
        orders: [...orders, order],
      });
    } else {
      await user.set({
        orders: order,
      });
    }
    console.log('Placed Order');
  } catch (err) {
    console.error('Error: ', err);
  }
};

export default addOrder;
