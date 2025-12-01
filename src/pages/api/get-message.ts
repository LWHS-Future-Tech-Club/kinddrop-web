import type { NextApiRequest, NextApiResponse } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { canReceiveToday, getAvailableMessages, assignMessageToUser, markMessageReceived } from '../../lib/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract user email from cookie
  const cookies = req.headers.cookie?.split(';').map(c => c.trim()) || [];
  const userCookie = cookies.find(c => c.startsWith('user='));
  
  if (!userCookie) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const userEmail = decodeURIComponent(userCookie.split('=')[1]);

  try {
    // Validate user exists in Firestore
    const userRef = doc(db, 'users', userEmail);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user can receive today
    const canReceive = await canReceiveToday(userEmail);
    if (!canReceive) {
      return res.status(403).json({ error: 'You have already received a message today. Come back tomorrow!' });
    }

    // Get available messages (excluding messages sent by current user)
    const messagesResult = await getAvailableMessages(userEmail);
    if (!messagesResult.success) {
      return res.status(500).json({ error: 'Failed to get messages' });
    }

    const availableMessages = messagesResult.messages || [];

    // If no messages available, return waiting state
    if (availableMessages.length === 0) {
      return res.status(200).json({ 
        success: true, 
        waiting: true,
        message: null
      });
    }

    // Randomly select one message
    const randomIndex = Math.floor(Math.random() * availableMessages.length);
    const selectedMessage = availableMessages[randomIndex];

    // Assign message to current user
    await assignMessageToUser(selectedMessage.id, userEmail, userEmail);

    // Mark message as received for user
    await markMessageReceived(userEmail, selectedMessage.id);

    // Return the message
    return res.status(200).json({ 
      success: true, 
      waiting: false,
      message: {
        id: selectedMessage.id,
        text: selectedMessage.text,
        senderEmail: selectedMessage.senderEmail,
        timestamp: selectedMessage.timestamp
      }
    });
  } catch (error: any) {
    console.error('Error in get-message:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
