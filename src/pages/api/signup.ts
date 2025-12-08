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

  const { email, password, firstName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  if (!firstName || !firstName.trim()) {
    return res.status(400).json({ error: 'First name is required' });
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
    
    // Get user's IP address
    const forwarded = req.headers['x-forwarded-for'];
    const ipAddress = typeof forwarded === 'string' 
      ? forwarded.split(',')[0].trim() 
      : req.socket.remoteAddress || 'Unknown';

    // Create user document
    const profileImage = `https://api.dicebear.com/9.x/rings/svg?seed=${encodeURIComponent(username)}&backgroundColor=04011E&ringColor=8000FF`;
    await setDoc(userRef, {
      email,
      username,
      firstName: firstName.trim(),
      lastName: '',
      password: hashedPassword,
      points: 50,
      profileImage,
      accountType: 'regular',
      roles: ['user'],
      ipAddress,
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
      user: { email, username, firstName: firstName.trim(), points: 50, profileImage } 
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
