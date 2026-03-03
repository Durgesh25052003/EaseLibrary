// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaNOfGgaa4PECrI6MUxerZe_Pu-HXYCl0",
  authDomain: "library-management-system-u.firebaseapp.com",
  projectId: "library-management-system-u",
  storageBucket: "library-management-system-u.firebasestorage.app",
  messagingSenderId: "545884417765",
  appId: "1:545884417765:web:aa032537d0e52cf030ae0c",
  measurementId: "G-YXDY6JGS97",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
