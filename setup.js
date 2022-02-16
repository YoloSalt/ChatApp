// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxnHKtdiLLs2WXtcGmKxipmkDWAuLbJOU",
  authDomain: "tai-chinh.firebaseapp.com",
  projectId: "tai-chinh",
  storageBucket: "tai-chinh.appspot.com",
  messagingSenderId: "589878160478",
  appId: "1:589878160478:web:b89395e4145b77980618cf",
  measurementId: "G-ZY35X0CELV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);