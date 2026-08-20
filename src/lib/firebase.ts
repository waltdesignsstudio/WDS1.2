import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPzs5kav0wocJbM4Q_HeI869H-hUtqwGE",
  authDomain: "waltdesignsstudio-84b20.firebaseapp.com",
  projectId: "waltdesignsstudio-84b20",
  storageBucket: "waltdesignsstudio-84b20.firebasestorage.app",
  messagingSenderId: "98336395942",
  appId: "1:98336395942:web:abd30494cc7b285f785a67",
  measurementId: "G-1GVQ7N7785"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize analytics safely in browser environments that support it
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        getAnalytics(app);
      }
    })
    .catch(() => {});
}

// Enable only Firebase Authentication
export const auth = getAuth(app);
