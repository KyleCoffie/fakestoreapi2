import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore();
const userRef = doc(db, "users", user.uid);
await setDoc(userRef, {
  email: user.email,
  createdAt: new Date(),
});
console.log("User document created in Firestore:", userRef.id);
