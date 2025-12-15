import type { NextApiRequest, NextApiResponse } from 'next';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { requireAdmin } from '../_utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const admin = await requireAdmin(req, res);
  if (!admin.ok) return;

  const { messageId } = req.body || {};
  if (!messageId || typeof messageId !== 'string') {
    return res.status(400).json({ error: 'messageId is required' });
  }

  try {
    await deleteDoc(doc(db, 'messages', messageId));
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('delete-message error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
