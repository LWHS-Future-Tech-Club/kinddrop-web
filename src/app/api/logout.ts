import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Clear the user cookie
  res.setHeader('Set-Cookie', 'user=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax');
  res.status(200).json({ success: true });
}
