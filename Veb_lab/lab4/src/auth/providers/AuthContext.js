
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged  , createUserWithEmailAndPassword , signInWithEmailAndPassword , signOut} from "firebase/auth";
import { auth , db } from "../../firebase";
import { doc, getDoc , setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userData , setUserData] = useState(null);
  const [loading, setLoading] = useState(true); 


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      setLoading(false);
      if(firebaseUser){
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          setUserData(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);


 async function signUp({email,password}) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setFirebaseUser(userCredential.user );
  }

   async function signIn({email,password}) {
       await signInWithEmailAndPassword(auth, email, password);
    }

   async function logOut() {
      try {
        await signOut(auth);
        window.location.href = "/"
      } catch (error) {
        return error;
      }
    }

     async function saveUserToFirestore(userData) {
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userRef, userData, { merge: true });
        setUserData(userData)
      } catch (error) {
        console.error('Помилка запису у Firestore:', error);
        return error;
      }
    }
  
  return (
    <AuthContext.Provider value={{ firebaseUser,userData, loading , signUp ,signIn , logOut , saveUserToFirestore }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}


export const useAuth = () => useContext(AuthContext);
