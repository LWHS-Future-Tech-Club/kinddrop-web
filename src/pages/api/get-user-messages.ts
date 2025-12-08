import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserByEmail, getMessagesByIds } from '../../lib/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user email from 'user' cookie set by login/signup
    const cookies = req.headers.cookie?.split(';').map((c) => c.trim()) || [];
    const userCookie = cookies.find((c) => c.startsWith('user='));
    if (!userCookie) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const userEmail = decodeURIComponent(userCookie.split('=')[1]);

    // Get user data
    const user = await getUserByEmail(userEmail);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get sent and received messages
    const sentMessageIds = user.sentMessages || [];
    const receivedMessageIds = user.receivedMessages || [];

    const sentResult = await getMessagesByIds(sentMessageIds);
    const receivedResult = await getMessagesByIds(receivedMessageIds);

    // Format messages for the client, normalize timestamp to milliseconds
    const normalizeTs = (ts: any): number => {
      if (!ts) return Date.now();
      if (typeof ts?.toDate === 'function') {
        return ts.toDate().getTime();
      }
      if (typeof ts?.seconds === 'number') {
        return ts.seconds * 1000;
      }
      try {
        return new Date(ts).getTime();
      } catch {
        return Date.now();
      }
    };

    const formattedSent = (sentResult.success ? sentResult.messages : []).map((msg: any) => ({
      id: msg.id,
      text: msg.text,
      recipientEmail: msg.recipientEmail ?? null,
      timestampMs: normalizeTs(msg.timestamp),
      customization: msg.customization || {},
      type: 'sent' as const
    }));

    const formattedReceived = (receivedResult.success ? receivedResult.messages : []).map((msg: any) => ({
      id: msg.id,
      text: msg.text,
      senderEmail: msg.senderEmail ?? null,
      timestampMs: normalizeTs(msg.timestamp),
      customization: msg.customization || {},
      type: 'received' as const
    }));

    return res.status(200).json({
      sentMessages: formattedSent,
      receivedMessages: formattedReceived
    });
  } catch (error: any) {
    console.error('Error getting user messages:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
