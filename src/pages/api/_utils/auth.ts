import type { NextApiRequest, NextApiResponse } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export type SafeUser = {
  email: string;
  roles: string[];
  accountType?: string;
  banned?: boolean;
};

export function getUserEmailFromCookie(req: NextApiRequest): string | null {
  const cookies = req.headers.cookie?.split(';').map((c) => c.trim()) || [];
  const userCookie = cookies.find((c) => c.startsWith('user='));
  if (!userCookie) return null;
  return decodeURIComponent(userCookie.split('=')[1]);
}

export async function requireActiveUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ ok: true; email: string; user: any } | { ok: false }> {
  const email = getUserEmailFromCookie(req);
  if (!email) {
    res.status(401).json({ error: 'Not authenticated' });
    return { ok: false };
  }

  const snap = await getDoc(doc(db, 'users', email));
  if (!snap.exists()) {
    res.status(404).json({ error: 'User not found' });
    return { ok: false };
  }

  const data = snap.data();
  if (data?.banned) {
    // Clear cookie so client is logged out immediately
    res.setHeader('Set-Cookie', 'user=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
    res.status(403).json({ error: 'Account is banned' });
    return { ok: false };
  }

  return { ok: true, email, user: data };
}

export async function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ ok: true; email: string; user: any } | { ok: false }> {
  const email = getUserEmailFromCookie(req);
  if (!email) {
    res.status(401).json({ error: 'Not authenticated' });
    return { ok: false };
  }

  const snap = await getDoc(doc(db, 'users', email));
  if (!snap.exists()) {
    res.status(404).json({ error: 'User not found' });
    return { ok: false };
  }

  const data = snap.data();
  const roles = Array.isArray(data.roles) ? data.roles : [];
  const isAdmin = roles.includes('admin') || data.accountType === 'admin';

  if (!isAdmin) {
    res.status(403).json({ error: 'Admin access required' });
    return { ok: false };
  }

  if (data?.banned) {
    res.status(403).json({ error: 'Account is banned' });
    return { ok: false };
  }

  return { ok: true, email, user: data };
}
