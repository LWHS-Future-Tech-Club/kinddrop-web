import type { NextApiRequest, NextApiResponse } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const cookies = req.headers.cookie?.split(';').map((c) => c.trim()) || [];
    const userCookie = cookies.find((c) => c.startsWith('user='));
    if (!userCookie) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const email = decodeURIComponent(userCookie.split('=')[1]);
    
    // Get user's IP address
    const forwarded = req.headers['x-forwarded-for'];
    const ip = typeof forwarded === 'string' 
      ? forwarded.split(',')[0].trim() 
      : req.socket.remoteAddress || 'Unknown';
    
    const snap = await getDoc(doc(db, 'users', email));
    if (!snap.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }
    const data = snap.data();
    
    // Count messages
    const sentMessagesCount = Array.isArray(data.sentMessages) ? data.sentMessages.length : 0;
    const receivedMessagesCount = Array.isArray(data.receivedMessages) ? data.receivedMessages.length : 0;
    
    // Format creation date
    const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null;
    
    return res.status(200).json({
      success: true,
      user: {
        id: email,
        email: data.email || email,
        username: data.username || null,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        points: typeof data.points === 'number' ? data.points : 0,
        profileImage: data.profileImage || null,
        hasRegeneratedUsername: data.hasRegeneratedUsername === true,
        unlockedItems: Array.isArray(data.unlockedItems) ? data.unlockedItems : [],
        ipAddress: data.ipAddress || ip,
        accountType: data.accountType || 'regular',
        roles: Array.isArray(data.roles) ? data.roles : ['user'],
        sentMessagesCount,
        receivedMessagesCount,
        createdAt,
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
