import type { NextApiRequest, NextApiResponse } from 'next';
import { canSendToday, canReceiveToday } from '../../lib/firestore';
import { requireActiveUser } from './_utils/auth';

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
    const auth = await requireActiveUser(req, res);
    if (!auth.ok) return;
    const userEmail = auth.email;

    // Check if user can send and receive today
    const canSend = await canSendToday(userEmail);
    const canReceive = await canReceiveToday(userEmail);

    return res.status(200).json({ canSend, canReceive });
  } catch (error: any) {
    console.error('Error checking send status:', error);
    return res.status(500).json({ error: error.message || 'Failed to check send status' });
  }
}
