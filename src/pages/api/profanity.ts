import type { NextApiRequest, NextApiResponse } from 'next';
import leoProfanity from 'leo-profanity';

// Initialize dictionary once
leoProfanity.loadDictionary();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required' });
  }

  // Check for profanity
  const isProfane = leoProfanity.check(text);
  const cleaned = leoProfanity.clean(text);
  const badWords = (leoProfanity.list() as string[]).filter((w: string) => text.toLowerCase().includes(w));

  return res.status(200).json({
    flagged: isProfane,
    categories: {
      profanity: isProfane,
    },
    category_scores: {
      profanity: isProfane ? 1 : 0,
    },
    details: {
      badWordsMatched: badWords,
      cleanedText: cleaned,
    }
  });
}
