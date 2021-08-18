import firebase from 'firebase';
import 'firebase/auth';

const FirebaseCredentials = {
  apiKey: "AIzaSyA5kUowUYSWIuY3OD4FlzUmHiu6u49O75o",
  authDomain: "tonovermelho-35267.firebaseapp.com",
  projectId: "tonovermelho-35267",
  storageBucket: "tonovermelho-35267.appspot.com",
  messagingSenderId: "640782420432",
  appId: "1:640782420432:web:a5a7e04733337b4ff851d5",
  measurementId: "G-MDHXVRN5HQ"
}

if (!firebase.apps.length) {
   firebase.initializeApp(FirebaseCredentials);
}else {
   firebase.app();
}
export default firebase;
export const firestore = firebase.firestore();
export const auth = firebase.auth();
