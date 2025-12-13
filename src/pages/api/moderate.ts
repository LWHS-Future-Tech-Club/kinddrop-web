import type { NextApiRequest, NextApiResponse } from 'next';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY environment variable is not set');
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simple in-memory cooldown to avoid hammering after 429s
let cooldownUntil: number | null = null;

async function callModerationAPI(text: string, retries = 3): Promise<any> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch('https://api.openai.com/v1/moderations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({ 
          model: 'omni-moderation-latest',
          input: text 
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.results[0];
      }

      // Log rate limit headers
      const rateLimitLimit = response.headers.get('x-ratelimit-limit-requests');
      const rateLimitRemaining = response.headers.get('x-ratelimit-remaining-requests');
      const rateLimitReset = response.headers.get('x-ratelimit-reset-requests');

      console.log('Rate limit info:', {
        limit: rateLimitLimit,
        remaining: rateLimitRemaining,
        reset: rateLimitReset,
        status: response.status
      });

      if (response.status === 429) {
        const errorData = await response.json().catch(() => ({}));
        // Rate limited - wait and retry
        if (attempt < retries - 1) {
          const waitTime = Math.pow(2, attempt) * 2000; // exponential backoff: 2s, 4s, 8s
          console.log(`Rate limited, waiting ${waitTime}ms before retry...`);
          await delay(waitTime);
          continue;
        }
        throw new Error(`Rate limited by OpenAI API. Retry after: ${rateLimitReset || 'unknown'}`);
      }

      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    } catch (error: any) {
      if (attempt === retries - 1) {
        throw error;
      }
      // Wait before retrying
      await delay(1000);
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required' });
  }

  // Respect cooldown window if set
  if (cooldownUntil && Date.now() < cooldownUntil) {
    const secondsLeft = Math.ceil((cooldownUntil - Date.now()) / 1000);
    return res.status(429).json({ error: `Cooldown active. Please wait ${secondsLeft}s and try again.` });
  }

  try {
    const result = await callModerationAPI(text);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Moderation API error:', error);
    
    if (error.message.includes('Rate limited')) {
      // Set a 30s cooldown window
      cooldownUntil = Date.now() + 30_000;
      return res.status(429).json({ error: error.message });
    }
    
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
}
