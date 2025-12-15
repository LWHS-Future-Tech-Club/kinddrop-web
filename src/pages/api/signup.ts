import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import filter from 'leo-profanity';

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

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  // Username rules: 3-20 chars, letters/numbers/underscore only, no spaces
  const cleanedUsername = String(username).trim();
  const usernamePattern = /^[A-Za-z0-9_]{3,20}$/;
  if (!usernamePattern.test(cleanedUsername)) {
    return res.status(400).json({ error: 'Username must be 3-20 characters and use only letters, numbers, or underscores (no spaces).' });
  }

  // Profanity check on username
  try {
    filter.loadDictionary();
    if (filter.check(cleanedUsername)) {
      return res.status(400).json({ error: 'Please choose a different username (profanity detected).' });
    }
  } catch {}

  try {
    // Check if user already exists
    const userRef = doc(db, 'users', cleanedUsername);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document (no PII)
    const profileImage = `https://api.dicebear.com/9.x/rings/svg?seed=${encodeURIComponent(cleanedUsername)}&backgroundColor=04011E&ringColor=8000FF`;
    await setDoc(userRef, {
      username: cleanedUsername,
      password: hashedPassword,
      points: 0,
      profileImage,
      accountType: 'regular',
      roles: ['user'],
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
    res.setHeader('Set-Cookie', `user=${encodeURIComponent(cleanedUsername)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
    
    return res.status(201).json({ 
      success: true, 
      user: { username: cleanedUsername, points: 0, profileImage } 
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
