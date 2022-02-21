import firestore from '@react-native-firebase/firestore';
import DrugStore, {AddressType} from '../store/CartStore';
import fetchAddresses from './fetchAddresses';

const addAddresses = async (address: AddressType) => {
  try {
    const user = firestore()
      .collection('users')
      .doc(DrugStore.userCredentials.uid);

    const userExists = (await user.get()).exists;

    if (userExists) {
      const addresses = await fetchAddresses();
      await user.update({
        addresses: [...addresses, address],
      });
      console.log('Saved Address');
    } else {
      await user.set({
        addresses: [address],
      });
      console.log('Saved Address');
    }
  } catch (err) {
    console.error('Error: ', err);
  }
};

export default addAddresses;
