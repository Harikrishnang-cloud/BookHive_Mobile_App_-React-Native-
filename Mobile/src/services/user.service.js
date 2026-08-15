import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const syncUserProfileWithBackend = async (idToken, name = '') => {
  try {
    // Make sure you have EXPO_PUBLIC_API_URL defined in your Mobile/.env file 
    // Example: EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP_ADDRESS:5000
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
    
    const response = await fetch(`${apiUrl}/api/users/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to sync user profile');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error syncing user with backend:', error);
    throw error;
  }
};

export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};
