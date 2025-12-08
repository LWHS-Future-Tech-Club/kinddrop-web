import type { NextApiRequest, NextApiResponse } from 'next';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cookies = req.headers.cookie?.split(';').map((c) => c.trim()) || [];
    const userCookie = cookies.find((c) => c.startsWith('user='));
    if (!userCookie) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const email = decodeURIComponent(userCookie.split('=')[1]);

    const { firstName, lastName } = req.body;

    // Validate first name is required
    if (!firstName || !firstName.trim()) {
      return res.status(400).json({ error: 'First name is required' });
    }

    const userRef = doc(db, 'users', email);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }

    await updateDoc(userRef, {
      firstName: firstName.trim(),
      lastName: (lastName || '').trim(),
      updatedAt: Timestamp.now()
    });

    return res.status(200).json({ 
      success: true, 
      firstName: firstName.trim(),
      lastName: (lastName || '').trim()
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
