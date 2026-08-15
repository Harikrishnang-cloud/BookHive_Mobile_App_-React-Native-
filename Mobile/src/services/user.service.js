import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const syncUserProfileWithBackend = async (idToken, name) => {
  try {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
    const response = await fetch(`${apiUrl}/api/users/sync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('Failed to sync user with backend');
    }

    return await response.json();
  } catch (error) {
    console.error('Error syncing user profile with backend:', error);
    throw error;
  }
};

export const createUserProfile = async (uid, data) => {
  try {
    const userRef = doc(db, 'users', uid);
    
    const newProfile = {
      uid,
      name: data.name,
      email: data.email,
      role: 'user',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(userRef, newProfile);
    return newProfile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    
    if (snap.exists()) {
      const data = snap.data();
      // Handle Firebase timestamp conversion
      return {
        ...data,
        uid: data.uid,
        name: data.name,
        email: data.email,
        role: data.role,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};
