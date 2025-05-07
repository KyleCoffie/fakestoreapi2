import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";
declare module "dotenv" {
  export function config(): void;
}
 
export const auth: Auth;
export const db: Firestore;

  