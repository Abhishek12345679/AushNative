import firestore from "@react-native-firebase/firestore";
import DrugStore, { Address } from "../store/CartStore";
import fetchAddresses from "./fetchAddresses";

const addAddresses = async (address: Address) => {
  try {
    const user = firestore()
      .collection("users")
      .doc(DrugStore.userCredentials.uid);

    const userExists = (await user.get()).exists;

    // console.log("user: ", userExists);

    if (userExists) {
      const addresses = await fetchAddresses();
      await user.update({
        addresses: [...addresses, address],
      });
    } else {
      await user.set({
        addresses: address,
      });
    }
    console.log("Saved Address");
  } catch (err) {
    console.error("Error: ", err);
  }
};

export default addAddresses;