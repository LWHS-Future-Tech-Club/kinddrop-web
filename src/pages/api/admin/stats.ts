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
    const usersSnap = await getDocs(collection(db, 'users'));
    const messagesSnap = await getDocs(collection(db, 'messages'));

    let pendingMessages = 0;
    let deliveredMessages = 0;

    messagesSnap.forEach((docSnap) => {
      const status = docSnap.data().status;
      if (status === 'pending') pendingMessages += 1;
      else if (status === 'delivered') deliveredMessages += 1;
    });

    return res.status(200).json({
      totalUsers: usersSnap.size,
      totalMessages: messagesSnap.size,
      pendingMessages,
      deliveredMessages,
    });
  } catch (error: any) {
    console.error('admin stats error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
