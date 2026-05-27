import { auth, db } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from '../types';

export const authService = {
  login: async (credentials: { email: string; password: string }): Promise<{ user: User; token: string }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const token = await userCredential.user.getIdToken();

      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      return {
        user: userDoc.data() as User,
        token
      };
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/user-not-found') {
        throw new Error('Invalid Credentials.');
      } else if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid credentials. Please check your email and password.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Account locked due to too many failed attempts. Try again later.');
      }
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  },

  register: async (data: any): Promise<{ user: User; token: string }> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(userCredential.user, { displayName: data.name });

      const token = await userCredential.user.getIdToken();
      const joinedDate = new Date().toISOString();
      const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=3B82F6&color=fff`;

      const newUser: User = {
        id: userCredential.user.uid,
        name: data.name,
        email: data.email,
        role: 'citizen',
        avatar,
        ward: data.ward || 'Unknown',
        joinedDate
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);

      return {
        user: newUser,
        token
      };
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email is already in use');
      }
      throw new Error(error.message || 'Registration failed');
    }
  },

  logout: async (): Promise<void> => {
    await signOut(auth);
  },

  getProfile: async (): Promise<User> => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('Not authenticated');

    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    if (!userDoc.exists()) throw new Error('User profile not found');

    return userDoc.data() as User;
  }
};
