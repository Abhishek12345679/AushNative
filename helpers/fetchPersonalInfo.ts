import firestore from '@react-native-firebase/firestore';
import DrugStore, {ProfileType} from '../store/CartStore';

const fetchPersonalInfo = async (): Promise<ProfileType> => {
  const user = await firestore()
    .collection('users')
    .doc(DrugStore.userCredentials.uid)
    .get();

  return user.data() ? user.data().personal : [];
};

export default fetchPersonalInfo;
