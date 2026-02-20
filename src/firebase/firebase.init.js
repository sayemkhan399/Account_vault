
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMmUA9H_1iYbDdqLRN2t7uaCfP_AVuax4",
  authDomain: "vault-4d191.firebaseapp.com",
  projectId: "vault-4d191",
  storageBucket: "vault-4d191.firebasestorage.app",
  messagingSenderId: "390885820255",
  appId: "1:390885820255:web:59b94a0bde9b646c51d8ea"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);