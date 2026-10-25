import { getApp, getApps, initializeApp } from "firebase/app";
import { Firestore, getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBYcBgCnYIv85k8MAOzflF7nJ_TO5i2nY",
  authDomain: "gator-hacks-v.firebaseapp.com",
  projectId: "gator-hacks-v",
  storageBucket: "gator-hacks-v.firebasestorage.app",
  messagingSenderId: "975510429611",
  appId: "1:975510429611:web:ce8fe14a3507112f387cee",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let db: Firestore;
try {
  // Long polling makes Firestore reliable inside Expo Go
  db = initializeFirestore(app, { experimentalForceLongPolling: true });
} catch {
  db = getFirestore(app);
}

export { db };