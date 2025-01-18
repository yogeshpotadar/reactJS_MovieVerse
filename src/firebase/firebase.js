import { initializeApp } from "firebase/app";
import {getFirestore, collection} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDYutFbsbenXEbi67GbUId6kscV09a18NM",
  authDomain: "movieverse-2009c.firebaseapp.com",
  projectId: "movieverse-2009c",
  storageBucket: "movieverse-2009c.appspot.com",
  messagingSenderId: "711660121016",
  appId: "1:711660121016:web:b3d2bb0af09f02ac7f7d4d",
  measurementId: "G-YQPBK62NY9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const moviesRef = collection(db, "movies");
export const reviewsRef = collection(db, "reviews");
export const usersRef = collection(db, "users");

export default app;