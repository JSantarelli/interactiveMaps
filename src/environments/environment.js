// Firebase connection
  // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js"
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js"

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDEslhlteP9FzDmI9ax3p-rwwAMALW6XHA",
    authDomain: "intermaptive.firebaseapp.com",
    projectId: "intermaptive",
    storageBucket: "intermaptive.appspot.com",
    messagingSenderId: "260919370396",
    appId: "1:260919370396:web:583746f34afe4ae4f34359"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore()

  export const submitFacility = (name, description) => {
    addDoc(collection(db, "facilities"), {name, description})
  }
  
