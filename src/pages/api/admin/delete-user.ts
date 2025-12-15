import type { NextApiRequest, NextApiResponse } from 'next';
import { doc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { requireAdmin } from '../_utils/auth';

async function deleteMessagesByUser(email: string) {
  const senderQ = query(collection(db, 'messages'), where('senderId', '==', email));
  const recipientQ = query(collection(db, 'messages'), where('recipientEmail', '==', email));

  const [senderSnap, recipientSnap] = await Promise.all([
    getDocs(senderQ),
    getDocs(recipientQ),
  ]);

  const deletions = [
    ...senderSnap.docs.map((d) => deleteDoc(doc(db, 'messages', d.id))),
    ...recipientSnap.docs.map((d) => deleteDoc(doc(db, 'messages', d.id))),
  ];

  await Promise.all(deletions);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const admin = await requireAdmin(req, res);
  if (!admin.ok) return;

  const { email } = req.body || {};
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'email is required' });
  }

  try {
    // Remove associated messages first
    await deleteMessagesByUser(email);
    // Delete user document
    await deleteDoc(doc(db, 'users', email));

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('delete-user error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
