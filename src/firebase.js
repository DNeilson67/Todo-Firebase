// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, addDoc, collection, getDocs, getFirestore, query, where, setDoc } from "firebase/firestore";  
import {GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth"
import {getStorage} from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCsenLQyLPbCKjMESLkO4XLwOpb_WsBYaE",
  authDomain: "to-do-3e3ca.firebaseapp.com",
  projectId: "to-do-3e3ca",
  storageBucket: "to-do-3e3ca.appspot.com",
  messagingSenderId: "432545233516",
  appId: "1:432545233516:web:dfeefceaa2eb26efd8b649",
  measurementId: "G-18EDTTPJ6R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); 

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async (e) => {
  e.preventDefault();
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
  }
  window.location.href = "/todo";} catch (err) {
    
  }
};

const regisNewUser = async (e, auth, email, password, username) =>{
  e.preventDefault();
  try{
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    await updateProfile(user, {displayName : username, photoURL : 'https://gravatar.com/avatar/f368a4bdd2ae828746de4d5dd08702b0?s=400&d=mp&r=x'})
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
    });
    window.location.href = "/todo";};
  } catch(err){
    document.getElementById('error_modal').showModal();
  }
}

export {db, auth, signInWithGoogle, storage, regisNewUser}