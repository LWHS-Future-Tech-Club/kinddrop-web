import type { NextApiRequest, NextApiResponse } from 'next';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

function randomSeed() {
  return Math.random().toString(36).slice(2, 10);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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

    const seed = randomSeed();
    const profileImage = `https://api.dicebear.com/9.x/rings/svg?seed=${encodeURIComponent(seed)}&backgroundColor=04011E&ringColor=8000FF`;

    await updateDoc(userRef, {
      profileImage,
      updatedAt: Timestamp.now(),
    });

    return res.status(200).json({ success: true, profileImage });
  } catch (err: any) {
    console.error('Regenerate avatar error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
