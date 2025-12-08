import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { doc, getDoc, setDoc, deleteDoc, Timestamp } from 'firebase/firestore';
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
    const currentEmail = decodeURIComponent(userCookie.split('=')[1]);

    const { newEmail, password } = req.body;

    if (!newEmail || !password) {
      return res.status(400).json({ error: 'New email and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (newEmail === currentEmail) {
      return res.status(400).json({ error: 'New email must be different from current email' });
    }

    // Check if new email already exists
    const newUserRef = doc(db, 'users', newEmail);
    const newUserSnap = await getDoc(newUserRef);
    if (newUserSnap.exists()) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const currentUserRef = doc(db, 'users', currentEmail);
    const currentUserSnap = await getDoc(currentUserRef);
    
    if (!currentUserSnap.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = currentUserSnap.data();
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Password is incorrect' });
    }

    // Create new user document with new email
    await setDoc(newUserRef, {
      ...userData,
      email: newEmail,
      updatedAt: Timestamp.now()
    });

    // Delete old user document
    await deleteDoc(currentUserRef);

    // Update cookie with new email
    res.setHeader('Set-Cookie', `user=${encodeURIComponent(newEmail)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);

    return res.status(200).json({ success: true, email: newEmail });
  } catch (error: any) {
    console.error('Change email error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
