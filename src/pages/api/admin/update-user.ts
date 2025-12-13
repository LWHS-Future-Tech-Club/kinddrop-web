import type { NextApiRequest, NextApiResponse } from 'next';
import { doc, updateDoc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { requireAdmin } from '../_utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const admin = await requireAdmin(req, res);
  if (!admin.ok) return;

  const { email, firstName, username, points, roles, accountType, banned } = req.body || {};
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'email is required' });
  }

  try {
    const userRef = doc(db, 'users', email);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatePayload: Record<string, any> = { updatedAt: Timestamp.now() };
    if (firstName !== undefined) updatePayload.firstName = firstName;
    if (username !== undefined) updatePayload.username = username;
    if (points !== undefined) updatePayload.points = points;
    if (Array.isArray(roles)) updatePayload.roles = roles;
    if (accountType !== undefined) updatePayload.accountType = accountType;
    if (banned !== undefined) updatePayload.banned = !!banned;

    await updateDoc(userRef, updatePayload);
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('update-user error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
