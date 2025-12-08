import type { NextApiRequest, NextApiResponse } from 'next';
import { doc, getDoc, updateDoc, arrayUnion, increment, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { itemId, cost } = req.body;
  if (!itemId || typeof cost !== 'number') {
    return res.status(400).json({ error: 'Item ID and cost required' });
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
    const currentPoints = data.points || 0;
    const unlockedItems = data.unlockedItems || [];

    if (unlockedItems.includes(itemId)) {
      return res.status(400).json({ error: 'Item already unlocked' });
    }

    if (currentPoints < cost) {
      return res.status(400).json({ error: 'Not enough karma' });
    }

    await updateDoc(userRef, {
      points: increment(-cost),
      unlockedItems: arrayUnion(itemId),
      updatedAt: Timestamp.now(),
    });

    return res.status(200).json({ 
      success: true, 
      newPoints: currentPoints - cost,
      unlockedItems: [...unlockedItems, itemId]
    });
  } catch (err: any) {
    console.error('Unlock item error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
