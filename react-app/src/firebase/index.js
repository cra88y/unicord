import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCEQeIjww8ItahxG2SR-Tkr6xXA_g1qNSc",
  authDomain: "unicord-ddaf0.firebaseapp.com",
  projectId: "unicord-ddaf0",
  storageBucket: "unicord-ddaf0.appspot.com",
  messagingSenderId: "840601807499",
  appId: "1:840601807499:web:b9c317645f9328a531028e",
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
