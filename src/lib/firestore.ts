import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  Timestamp,
  arrayUnion
} from 'firebase/firestore';
import { db } from './firebase';

export interface UserData {
  email: string;
  points: number;
  unlockedItems: string[];
  messages: Array<{
    id: string;
    text: string;
    type: 'sent' | 'received';
    timestamp: Date;
    customization: {
      fontFamily: string;
      color: string;
      backgroundColor: string;
      fontSize: string;
    };
  }>;
  createdAt: any;
  updatedAt: any;
}

// Get user data
export const getUser = async (userId: string) => {
  try {
    console.log('Fetching user with ID:', userId);
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      console.log('User found:', userDoc.data());
      const data = userDoc.data();
      // Convert Firestore Timestamps to Date objects for messages
      if (data.messages) {
        data.messages = data.messages.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp?.toDate ? msg.timestamp.toDate() : new Date(msg.timestamp)
        }));
      }
      return { success: true, data: data as UserData };
    }
    console.log('User not found');
    return { success: false, error: 'User not found' };
  } catch (error: any) {
    console.error('Error getting user:', error);
    return { success: false, error: error.message || error };
  }
};

// Update user points
export const updateUserPoints = async (userId: string, points: number) => {
  try {
    await updateDoc(doc(db, 'users', userId), { 
      points,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating points:', error);
    return { success: false, error };
  }
};

// Unlock an item for a user
export const unlockItem = async (userId: string, itemId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const currentItems = userDoc.data().unlockedItems || [];
      if (!currentItems.includes(itemId)) {
        await updateDoc(doc(db, 'users', userId), {
          unlockedItems: arrayUnion(itemId),
          updatedAt: Timestamp.now()
        });
      }
      return { success: true };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    console.error('Error unlocking item:', error);
    return { success: false, error };
  }
};

// Add a message to user's message array
export const addMessage = async (userId: string, message: any) => {
  try {
    const messageWithTimestamp = {
      ...message,
      timestamp: Timestamp.now()
    };
    
    await updateDoc(doc(db, 'users', userId), {
      messages: arrayUnion(messageWithTimestamp),
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding message:', error);
    return { success: false, error };
  }
};

// Helper method for testing - creates a test user
export const createTestUser = async (userId: string, email: string) => {
  try {
    console.log('Creating user with ID:', userId, 'and email:', email);
    await setDoc(doc(db, 'users', userId), {
      email,
      points: 50,
      unlockedItems: ['font-sans', 'color-black', 'bg-white', 'size-medium'],
      messages: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log('User created successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating test user:', error);
    return { success: false, error: error.message || error };
  }
};
