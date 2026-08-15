import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserProfile } from '../services/user.service';
import { UserProfile } from '../types/user';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext({
  firebaseUser: null,
  userProfile: null,
  loading: true,
  refreshProfile: async () => {},
}); // casting to AuthContextType removed for now since createContext type is inferred or any

export const AuthProvider = ({ children }: { children: any }) => {
  const [firebaseUser, setFirebaseUser] = useState(null as FirebaseUser | null);
  const [userProfile, setUserProfile] = useState(null as UserProfile | null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string) => {
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
