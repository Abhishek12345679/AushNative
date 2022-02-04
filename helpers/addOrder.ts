import firestore from "@react-native-firebase/firestore";
import DrugStore from "../store/CartStore";

const addOrder = async (order) => {
  try {
    await firestore()
      .collection("users")
      .doc(DrugStore.userCredentials.uid)
      .update({
        orders: order,
      });
    console.log("Placed Order");
  } catch (err) {
    console.error("Failed to add order to the firestore db");
  }
};

export default addOrder;
