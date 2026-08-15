import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updatePassword
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const register = async (email, pass) => {
  return await createUserWithEmailAndPassword(auth, email, pass);
};

export const login = async (email, pass) => {
  return await signInWithEmailAndPassword(auth, email, pass);
};

export const logout = async () => {
  return await firebaseSignOut(auth);
};

export const resetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};

export const changePassword = async (newPassword) => {
  if (!auth.currentUser) throw new Error("No authenticated user");
  return await updatePassword(auth.currentUser, newPassword);
};
