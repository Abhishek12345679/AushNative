import firestore from "@react-native-firebase/firestore";
import DrugStore from "../store/CartStore";

const fetchAddresses = async () => {
  const user = await firestore()
    .collection("users")
    .doc(DrugStore.userCredentials.uid)
    .get();

  const userData = user.data();
  if (userData) {
    if (userData.addresses.length > 0) {
      return userData.addresses;
    }
    return [userData.addresses];
  } else {
    return [];
  }
};

export default fetchAddresses;
