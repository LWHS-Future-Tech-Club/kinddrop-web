import type { NextApiRequest, NextApiResponse } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { canSendToday, createMessage, markMessageSent, addPoints } from '../../lib/firestore';
import { requireActiveUser } from './_utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await requireActiveUser(req, res);
  if (!auth.ok) return;
  const userEmail = auth.email;
  
  // Get message text from body
  const { text, customization } = req.body;
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Message text required' });
  }

  try {
    // Validate user exists in Firestore
    const userRef = doc(db, 'users', userEmail);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user can send today
    const canSend = await canSendToday(userEmail);
    if (!canSend) {
      return res.status(403).json({ error: 'You have already sent a message today. Come back tomorrow!' });
    }

    // Create message in messages collection
    const messageResult = await createMessage(userEmail, userEmail, text.trim(), customization || {});
    if (!messageResult.success) {
      return res.status(500).json({ error: 'Failed to create message' });
    }

    // Mark message as sent for user
    await markMessageSent(userEmail, messageResult.messageId!);

    // Add 10 points to user
    const pointsResult = await addPoints(userEmail, 10);
    
    return res.status(200).json({ 
      success: true, 
      messageId: messageResult.messageId,
      points: pointsResult.newPoints || 0
    });
  } catch (error: any) {
    console.error('Error in send-message:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
