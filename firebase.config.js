// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVIr_2lNrtKmyTxGVrNDWMRnulpmQ9ReA",
  authDomain: "el-salto-de-tequendama.firebaseapp.com",
  projectId: "el-salto-de-tequendama",
  storageBucket: "el-salto-de-tequendama.appspot.com",
  messagingSenderId: "1081187568689",
  appId: "1:1081187568689:web:1b2446d518c94950539910",
  measurementId: "G-20KCG3ZT5F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db}