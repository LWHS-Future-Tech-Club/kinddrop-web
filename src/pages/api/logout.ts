import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Clear the session cookie by setting it with Max-Age=0
    res.setHeader('Set-Cookie', 'user=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
    
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
