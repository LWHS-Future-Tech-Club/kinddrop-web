import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// Random username generator
const generateUsername = (): string => {
  const adjectives = [
    'Happy', 'Sunny', 'Bright', 'Kind', 'Gentle', 'Swift', 'Bold', 'Brave',
    'Calm', 'Wise', 'Cool', 'Warm', 'Sweet', 'Clever', 'Witty', 'Jolly',
    'Merry', 'Noble', 'Proud', 'Quick', 'Silent', 'Steady', 'Strong', 'True'
  ];
  
  const nouns = [
    'Panda', 'Tiger', 'Eagle', 'Dolphin', 'Phoenix', 'Dragon', 'Wolf', 'Bear',
    'Falcon', 'Lion', 'Otter', 'Raven', 'Swan', 'Hawk', 'Fox', 'Owl',
    'Whale', 'Shark', 'Turtle', 'Rabbit', 'Deer', 'Moose', 'Lynx', 'Seal'
  ];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  
  return `${adjective}${noun}${number}`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    // Check if user already exists
    const userRef = doc(db, 'users', email);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate random username
    const username = generateUsername();

    // Create user document
    await setDoc(userRef, {
      email,
      username,
      password: hashedPassword,
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

    // Set cookie for session
    res.setHeader('Set-Cookie', `user=${encodeURIComponent(email)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
    
    return res.status(201).json({ 
      success: true, 
      user: { email, username, points: 50 } 
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
