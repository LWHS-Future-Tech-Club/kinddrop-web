import type { NextApiRequest, NextApiResponse } from 'next';
import { canSendToday, canReceiveToday } from '../../lib/firestore';

/**
 * GET /api/check-send-status
 * Returns whether the current user can send a message today and if they can receive
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user from cookie (read 'user' cookie set by login/signup)
    const cookies = req.headers.cookie?.split(';').map((c) => c.trim()) || [];
    const userCookie = cookies.find((c) => c.startsWith('user='));
    if (!userCookie) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const userEmail = decodeURIComponent(userCookie.split('=')[1]);

    // Check if user can send and receive today
    const canSend = await canSendToday(userEmail);
    const canReceive = await canReceiveToday(userEmail);

    return res.status(200).json({ canSend, canReceive });
  } catch (error: any) {
    console.error('Error checking send status:', error);
    return res.status(500).json({ error: error.message || 'Failed to check send status' });
  }
}
