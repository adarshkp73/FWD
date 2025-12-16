import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {

  apiKey: "AIzaSyAgWZoEJAljCPwfT4KSnkuyLpRshg_W8Ao",

  authDomain: "nowplaying-5bdd3.firebaseapp.com",

  projectId: "nowplaying-5bdd3",

  storageBucket: "nowplaying-5bdd3.firebasestorage.app",

  messagingSenderId: "129786279888",

  appId: "1:129786279888:web:106ff5a1df97806367abd5",

  measurementId: "G-W6WWLN1JR6"

};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Auth instance
export const auth = getAuth(app);