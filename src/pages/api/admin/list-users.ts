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
    const snap = await getDocs(collection(db, 'users'));
    const users = snap.docs.map((docSnap) => {
      const data = docSnap.data();
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null;
      const lastLoginAt = data.lastLoginAt?.toDate ? data.lastLoginAt.toDate().toISOString() : null;
      return {
        email: data.email || docSnap.id,
        username: data.username || '',
        points: typeof data.points === 'number' ? data.points : 0,
        roles: Array.isArray(data.roles) ? data.roles : [],
        accountType: data.accountType || 'regular',
        banned: !!data.banned,
        createdAt,
        lastLoginAt,
      };
    });

    return res.status(200).json({ users });
  } catch (error: any) {
    console.error('list-users error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
