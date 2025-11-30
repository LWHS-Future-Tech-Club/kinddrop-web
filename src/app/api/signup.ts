import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

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

    // Store user in Firestore
    await setDoc(userRef, {
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      points: 50,
      unlockedItems: ['font-sans', 'color-black', 'bg-white', 'size-medium'],
      messages: [],
    });

    res.setHeader('Set-Cookie', `user=${encodeURIComponent(email)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
    return res.status(201).json({ success: true, user: { email, points: 50 } });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
