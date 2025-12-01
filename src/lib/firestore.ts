import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  Timestamp,
  arrayUnion,
  collection,
  query,
  where,
  getDocs,
  addDoc
} from 'firebase/firestore';
import { db } from './firebase';

export interface UserData {
  email: string;
  username: string;
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
  lastSentDate?: string; // ISO date string in PST
  lastReceivedDate?: string; // ISO date string in PST
  sentMessages?: string[]; // Array of message IDs
  receivedMessages?: string[]; // Array of message IDs
  createdAt: any;
  updatedAt: any;
}

export interface MessageData {
  id: string;
  senderId: string;
  senderEmail: string;
  recipientId: string | null;
  recipientEmail: string | null;
  text: string;
  timestamp: any;
  status: 'pending' | 'delivered';
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

// Get user by email
export const getUserByEmail = async (email: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', email));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        ...data,
        email: data.email || email
      } as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
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
      lastSentDate: null,
      lastReceivedDate: null,
      sentMessages: [],
      receivedMessages: [],
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

// Helper: Get current date in PST as ISO string (YYYY-MM-DD)
const getPSTDateString = (): string => {
  const now = new Date();
  // Convert to PST (UTC-8)
  const pstOffset = -8 * 60; // PST is UTC-8
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const pstDate = new Date(utc + (pstOffset * 60000));
  return pstDate.toISOString().split('T')[0]; // YYYY-MM-DD
};

// Check if user can send today
export const canSendToday = async (userId: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return false;
    
    const userData = userDoc.data();
    const today = getPSTDateString();
    
    // User can send if they haven't sent today
    return !userData.lastSentDate || userData.lastSentDate !== today;
  } catch (error) {
    console.error('Error checking canSendToday:', error);
    return false;
  }
};

// Check if user can receive today
export const canReceiveToday = async (userId: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return false;
    
    const userData = userDoc.data();
    const today = getPSTDateString();
    
    // User can receive if they haven't received today
    return !userData.lastReceivedDate || userData.lastReceivedDate !== today;
  } catch (error) {
    console.error('Error checking canReceiveToday:', error);
    return false;
  }
};

// Mark message as sent for user
export const markMessageSent = async (userId: string, messageId: string) => {
  try {
    const today = getPSTDateString();
    await updateDoc(doc(db, 'users', userId), {
      lastSentDate: today,
      sentMessages: arrayUnion(messageId),
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error marking message sent:', error);
    return { success: false, error };
  }
};

// Mark message as received for user
export const markMessageReceived = async (userId: string, messageId: string) => {
  try {
    const today = getPSTDateString();
    await updateDoc(doc(db, 'users', userId), {
      lastReceivedDate: today,
      receivedMessages: arrayUnion(messageId),
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error marking message received:', error);
    return { success: false, error };
  }
};

// Add points to user
export const addPoints = async (userId: string, pointsToAdd: number) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return { success: false, error: 'User not found' };
    }
    
    const currentPoints = userDoc.data().points || 0;
    await updateDoc(doc(db, 'users', userId), {
      points: currentPoints + pointsToAdd,
      updatedAt: Timestamp.now()
    });
    return { success: true, newPoints: currentPoints + pointsToAdd };
  } catch (error) {
    console.error('Error adding points:', error);
    return { success: false, error };
  }
};

// Create a new message
export const createMessage = async (senderId: string, senderEmail: string, text: string) => {
  try {
    const messageRef = await addDoc(collection(db, 'messages'), {
      senderId,
      senderEmail,
      recipientId: null,
      recipientEmail: null,
      text,
      timestamp: Timestamp.now(),
      status: 'pending'
    });
    return { success: true, messageId: messageRef.id };
  } catch (error) {
    console.error('Error creating message:', error);
    return { success: false, error };
  }
};

// Get available messages (pending, not sent by current user)
export const getAvailableMessages = async (excludeUserId: string) => {
  try {
    const q = query(
      collection(db, 'messages'),
      where('status', '==', 'pending')
    );
    
    const querySnapshot = await getDocs(q);
    const messages: MessageData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Exclude messages sent by the current user
      if (data.senderId !== excludeUserId) {
        messages.push({
          id: doc.id,
          ...data
        } as MessageData);
      }
    });
    
    return { success: true, messages };
  } catch (error) {
    console.error('Error getting available messages:', error);
    return { success: false, error, messages: [] };
  }
};

// Assign message to a recipient
export const assignMessageToUser = async (messageId: string, recipientId: string, recipientEmail: string) => {
  try {
    await updateDoc(doc(db, 'messages', messageId), {
      recipientId,
      recipientEmail,
      status: 'delivered'
    });
    return { success: true };
  } catch (error) {
    console.error('Error assigning message:', error);
    return { success: false, error };
  }
};

// Get message by ID
export const getMessageById = async (messageId: string) => {
  try {
    const messageDoc = await getDoc(doc(db, 'messages', messageId));
    if (!messageDoc.exists()) {
      return { success: false, error: 'Message not found' };
    }
    
    return {
      success: true,
      message: {
        id: messageDoc.id,
        ...messageDoc.data()
      } as MessageData
    };
  } catch (error) {
    console.error('Error getting message by ID:', error);
    return { success: false, error };
  }
};

// Get messages by IDs
export const getMessagesByIds = async (messageIds: string[]) => {
  try {
    const messages: MessageData[] = [];
    
    for (const id of messageIds) {
      const result = await getMessageById(id);
      if (result.success && result.message) {
        messages.push(result.message);
      }
    }
    
    return { success: true, messages };
  } catch (error) {
    console.error('Error getting messages by IDs:', error);
    return { success: false, error, messages: [] };
  }
};
