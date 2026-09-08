
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewai-d45c4.firebaseapp.com",
  projectId: "interviewai-d45c4",
  storageBucket: "interviewai-d45c4.firebasestorage.app",
  messagingSenderId: "56708582461",
  appId: "1:56708582461:web:9594abe0faf9d44edb2e54"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {auth,provider}