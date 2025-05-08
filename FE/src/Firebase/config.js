import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzOVC5jVJb6oz3CV5fjbde4YhQOVsHgT8",
  authDomain: "fe-project-2276f.firebaseapp.com",
  projectId: "fe-project-2276f",
  storageBucket: "fe-project-2276f.firebasestorage.app",
  messagingSenderId: "63268339035",
  appId: "1:63268339035:web:aea9eddefe65e320b62e7e",
  measurementId: "G-3PD3KXMP5N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);