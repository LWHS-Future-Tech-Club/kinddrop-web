import type { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { requireAdmin } from '../_utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const admin = await requireAdmin(req, res);
  if (!admin.ok) return;

  try {
    const snap = await getDocs(collection(db, 'messages'));
    const messages = snap.docs.map((docSnap) => {
      const data = docSnap.data();
      const timestamp = data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : null;
      return {
        id: docSnap.id,
        senderId: data.senderId || null,
        senderEmail: data.senderEmail || null,
        recipientId: data.recipientId || null,
        recipientEmail: data.recipientEmail || null,
        status: data.status || 'pending',
        text: data.text || '',
        timestamp,
      };
    });

    return res.status(200).json({ messages });
  } catch (error: any) {
    console.error('list-messages error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
