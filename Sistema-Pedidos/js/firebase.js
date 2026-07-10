import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMIkZTmAFwqRWfLNLyXMcXjWC03Af-M3Y",
  authDomain: "sistema-pedidos-13769.firebaseapp.com",
  projectId: "sistema-pedidos-13769",
  storageBucket: "sistema-pedidos-13769.firebasestorage.app",
  messagingSenderId: "328947750647",
  appId: "1:328947750647:web:4d0f2dbe23f087939ba5f2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);