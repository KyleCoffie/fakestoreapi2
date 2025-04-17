import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore(); //called to retrieve the database instance. This instance (db) is then used for any subsequent database operations.
const userRef = doc(db, "users", user.uid); //This line creates a reference to a document within the "users" collection. The document's identifier is derived from user.uid, which uniquely identifies the user. If a document with this ID does not already exist, Firestore will create one when data is written.
await setDoc(userRef, { //function is used to write an object to the document.
  email: user.email,
  createdAt: new Date(),
});
console.log("User document created in Firestore:", userRef.id);
