import type { NextApiRequest, NextApiResponse } from 'next';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// Random username generator (same as signup)
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
  if (req.method === 'GET') {
    // Generate a new username suggestion
    const newUsername = generateUsername();
    return res.status(200).json({ success: true, newUsername });
  }

  if (req.method === 'POST') {
    // Accept the new username
    const { newUsername } = req.body;
    if (!newUsername || typeof newUsername !== 'string') {
      return res.status(400).json({ error: 'New username required' });
    }

    const cookies = req.headers.cookie?.split(';').map(c => c.trim()) || [];
    const userCookie = cookies.find(c => c.startsWith('user='));
    if (!userCookie) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const userEmail = decodeURIComponent(userCookie.split('=')[1]);

    try {
      const userRef = doc(db, 'users', userEmail);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        return res.status(404).json({ error: 'User not found' });
      }

      const data = snap.data();
      const hasRegenerated = data.hasRegeneratedUsername === true;

      if (hasRegenerated) {
        return res.status(403).json({ error: 'You have already regenerated your username once.' });
      }

      await updateDoc(userRef, {
        username: newUsername,
        hasRegeneratedUsername: true,
        updatedAt: Timestamp.now(),
      });

      return res.status(200).json({ success: true, username: newUsername });
    } catch (err: any) {
      console.error('Regenerate username error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
