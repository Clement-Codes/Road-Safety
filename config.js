// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import { getDatabase } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCO6IlTGKdF8fNnExI8uJ7uaIzIYuSdcv4",
  authDomain: "roadsafety-42931.firebaseapp.com",
  projectId: "roadsafety-42931",
  storageBucket: "roadsafety-42931.appspot.com",
  messagingSenderId: "71844939359",
  appId: "1:71844939359:web:7496cfe2231b1bef123dea",
  measurementId: "G-2ZV3N3TGE1",
  databaseURL:"https://roadsafety-42931-default-rtdb.europe-west1.firebasedatabase.app/"

};

// Initialize Firebase

firebase.initializeApp(firebaseConfig)

const database = getDatabase();

export default database