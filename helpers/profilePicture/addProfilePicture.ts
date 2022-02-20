import firestore from '@react-native-firebase/firestore';
import DrugStore from '../../store/CartStore';
import fetchPersonalInfo from '../../helpers/fetchPersonalInfo';

const addProfilePicture = async (pfp: string) => {
  try {
    const user = firestore()
      .collection('users')
      .doc(DrugStore.userCredentials.uid);

    const userExists = (await user.get()).exists;

    if (userExists) {
      const pInfo = await fetchPersonalInfo();
      pInfo.display_picture = pfp;
      await user.update({
        personal: pInfo,
      });
    }
    console.log('Successfully Added Photo!!');
  } catch (err) {
    console.error('Error: ', err);
  }
};

export default addProfilePicture;
