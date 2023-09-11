import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyDViz7XM94C3B1nYXkn18tYJVkVwIpzmSQ",
  authDomain: "fir-with-fileupload.firebaseapp.com",
  projectId: "fir-with-fileupload",
  storageBucket: "fir-with-fileupload.appspot.com",
  messagingSenderId: "719172502554",
  appId: "1:719172502554:web:4ae2bc413f63ba0abd3da3",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)
export const auth = getAuth(app);