// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC8aUDfsLiXIlhhBme2L3l94kBXFUaPDfM',
  authDomain: 'hrm-project-526bc.firebaseapp.com',
  projectId: 'hrm-project-526bc',
  storageBucket: 'hrm-project-526bc.appspot.com',
  messagingSenderId: '255757530189',
  appId: '1:255757530189:web:07316a804b5b8fa8851804',
  measurementId: 'G-VQPW9LWKXD'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
