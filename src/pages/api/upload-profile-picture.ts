import type { NextApiRequest, NextApiResponse } from 'next';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

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
    const email = decodeURIComponent(userCookie.split('=')[1]);

    const { profileImage } = req.body;

    if (!profileImage) {
      return res.status(400).json({ error: 'Profile image is required' });
    }

    // Validate it's a data URL or valid URL
    if (!profileImage.startsWith('data:image/') && !profileImage.startsWith('http')) {
      return res.status(400).json({ error: 'Invalid image format' });
    }

    const userRef = doc(db, 'users', email);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }

    await updateDoc(userRef, {
      profileImage,
      updatedAt: Timestamp.now()
    });

    return res.status(200).json({ success: true, profileImage });
  } catch (error: any) {
    console.error('Upload profile picture error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
