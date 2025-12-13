import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
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
    const userRef = doc(db, 'users', email);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userData = userSnap.data();
    const valid = await bcrypt.compare(password, userData.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Ban check
    if (userData.banned) {
      res.setHeader('Set-Cookie', 'user=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
      return res.status(403).json({ error: 'Account is banned' });
    }
    
    // Update IP address on login
    const forwarded = req.headers['x-forwarded-for'];
    const ipAddress = typeof forwarded === 'string' 
      ? forwarded.split(',')[0].trim() 
      : req.socket.remoteAddress || 'Unknown';
    
    await updateDoc(userRef, {
      ipAddress,
      lastLoginAt: Timestamp.now()
    });
    
    // Set a simple cookie for session (for demo purposes)
    res.setHeader('Set-Cookie', `user=${encodeURIComponent(email)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
    return res.status(200).json({ success: true, user: { email: userData.email, username: userData.username, points: userData.points, banned: !!userData.banned, roles: userData.roles || [] } });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
