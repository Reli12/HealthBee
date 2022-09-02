import firebase from "firebase/compat/app";
import "firebase/auth";
import "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyA1xDvy47Q73_vwXdtardsEYerhIweGBFc",
  authDomain: "healtbeeproduction.firebaseapp.com",
  databaseURL:
    "https://healtbeeproduction-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "healtbeeproduction",
  storageBucket: "healtbeeproduction.appspot.com",
  messagingSenderId: "706543717058",
  appId: "1:706543717058:web:3df923748c17161ba1895b",
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
