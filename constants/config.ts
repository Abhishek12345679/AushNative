import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBI3PnHGbtsukz2gQ9c2TbBEpQ-UBTFjtU",
  authDomain: "chemy-llc.firebaseapp.com",
  databaseURL: "https://chemy-llc.firebaseio.com",
  projectId: "chemy-llc",
  storageBucket: "chemy-llc.appspot.com",
  messagingSenderId: "377325217652",
  appId: "1:377325217652:web:67af1a48c3867f625f6e21",
};

const Firebase = firebase.initializeApp(firebaseConfig);
export default Firebase;
