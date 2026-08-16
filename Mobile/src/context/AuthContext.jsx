import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserProfile } from '../services/user.service';

export const AuthContext = createContext({
  firebaseUser: null,
  userProfile: null,
  loading: true,
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid) => {
    try {
      const profile = await getUserProfile(uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching profile in AuthProvider', error);
      setUserProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (firebaseUser) {
      await fetchProfile(firebaseUser.uid);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await fetchProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser, userProfile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
