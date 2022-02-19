import firestore from '@react-native-firebase/firestore';
import DrugStore from '../store/CartStore';

const fetchPersonalInfo = async () => {
    const user = await firestore()
        .collection('users')
        .doc(DrugStore.userCredentials.uid)
        .get();

    return user.data() ? user.data().personal : []
};

export default fetchPersonalInfo;
