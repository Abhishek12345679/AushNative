import firestore from '@react-native-firebase/firestore';
import DrugStore from '../store/CartStore';

export interface personalInfoProps {
  name: string;
  pfp?: string;
  dob?: number;
}

const updatePersonalInfo = async (personalInfo: personalInfoProps) => {
  try {
    const user = firestore()
      .collection('users')
      .doc(DrugStore.userCredentials.uid);

    const userExists = (await user.get()).exists;

    if (userExists) {
      await user.update({
        personal: personalInfo,
      });
    }
    console.log('Updated Info');
  } catch (err) {
    console.error('Error: ', err);
  }
};

export default updatePersonalInfo;
