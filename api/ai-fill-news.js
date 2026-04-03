// Serverless Function: AI Content Fill for News
// Stack: Tavily (web search) + DeepSeek V3 (content generation, OpenAI-compatible)

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const TAVILY_API_URL = 'https://api.tavily.com/search';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { theme } = req.body;
  if (!theme) {
    return res.status(400).json({ error: 'Theme (keyword) is required' });
  }

  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'DEEPSEEK_API_KEY is not configured on the server.' });
  }

  try {
    // ── Step 1: Web Search via Tavily ────────────────────────────────────
    let searchContext = '';
    if (TAVILY_API_KEY) {
      try {
        const tavilyRes = await fetch(TAVILY_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: TAVILY_API_KEY,
            query: `${theme} latest news online casino iGaming 2026`,
            search_depth: 'advanced',
            max_results: 3,
            include_answer: true,
          }),
        });

        if (tavilyRes.ok) {
          const tavilyData = await tavilyRes.json();
          const snippets = (tavilyData.results || [])
            .map(r => `[${r.title}]: ${r.content}`)
            .join('\n\n');
          searchContext = tavilyData.answer
            ? `Search Summary: ${tavilyData.answer}\n\nDetailed Results:\n${snippets}`
            : snippets;
        }
      } catch (searchErr) {
        console.warn('Tavily search failed, proceeding without context:', searchErr.message);
      }
    }

    // ── Step 2: Build Messages ───────────────────────────────────────────
    const systemPrompt = `You are an expert iGaming content writer who creates highly structured, educational, and SEO-optimized blog posts similar to leading casino guides.

CRITICAL STYLE & FORMATTING RULES:
1. Tone & Structure: Write with a clear, objective, and educational tone. Start with a direct 1-2 paragraph introduction stating what the article will cover without generic fluff like "In the fast-paced world of...". End with a 1-2 paragraph logical conclusion.
2. Numbered Subheadings: Break the core content into 4-6 distinct sections using numbered headings (e.g., "<h3>1. Data Encryption and Secure Connections</h3>", "<h3>2. Account Verification (KYC Systems)</h3>").
3. Bullet Points: Under almost every numbered heading, include a short introductory sentence followed by a cohesive bulleted list mapping out exactly what it entails (e.g., "What encryption helps protect: <ul><li>Login credentials</li><li>Payment information</li></ul>").
4. No AI Tropes: Do not use over-enthusiastic language, exclamation marks, or robotic transitions. Keep it highly grounded, like an informative technical or policy guide.
5. Internal Links: Naturally insert 2-3 anchor text sentences pretending to link to related guides (e.g., "<p><em>Read more: <a href="#">Online casino payment methods explained</a></em></p>").

JSON OUTPUT RULE: Return ONLY a valid JSON object. No markdown fences. Start with { and end with }.

Required JSON keys:
- "title": Clean, highly descriptive title like "How Online Casino Platforms Protect Player Accounts: Security Systems Explained" (string)
- "slug": lowercase URL slug with hyphens (string)
- "excerpt": 2-3 sentences max summarizing the content directly (string)
- "category": one of "Casino Guide", "Industry News", "Regulation", "New Releases" (string)
- "author": "Editorial Team" (string)
- "tags": 3 relevant educational or feature tags (array of 3 strings)
- "content": HTML article 500-800 words. MUST strictly follow the numbered <h3> and <ul><li> pattern described above. (string)
- "seo_title": 50-60 char click-worthy title (string)
- "seo_description": 150-160 char meta description creating curiosity (string)
- "seo_keywords": 5-8 highly relevant descriptive keywords (string)`;

    const userMessage = searchContext
      ? `Task: Write an authoritative, educational blog post based on this theme: "${theme}"\n\nReal-time Web Data to influence your article:\n${searchContext}`
      : `Task: Write an authoritative, educational blog post based on this theme: "${theme}"\n\nNo live search data available. Rely on expert knowledge to craft an authoritative guide on this topic.`;

    // ── Step 3: Call DeepSeek API ────────────────────────────────────────
    const deepseekRes = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 3000,
        temperature: 0.8,
        response_format: { type: 'json_object' }, // Force JSON output
      }),
    });

    if (!deepseekRes.ok) {
      const errBody = await deepseekRes.json().catch(() => ({}));
      const errMsg = errBody?.error?.message || `DeepSeek API error: ${deepseekRes.status}`;
      console.error('DeepSeek API error:', deepseekRes.status, errMsg);
      return res.status(502).json({ error: errMsg });
    }

    const deepseekData = await deepseekRes.json();
    const rawText = deepseekData.choices?.[0]?.message?.content || '';

    // ── Step 4: Parse JSON ───────────────────────────────────────────────
    let parsedData;
    try {
      const cleaned = rawText
        .replace(/^```(?:json)?\n?/i, '')
        .replace(/\n?```$/i, '')
        .trim();
      parsedData = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('Failed to parse DeepSeek JSON response:', rawText.slice(0, 500));
      return res.status(500).json({ error: 'AI response was not valid JSON. Please try again.' });
    }

    // ── Step 5: Return to frontend ───────────────────────────────────────
    return res.status(200).json(parsedData);

  } catch (error) {
    console.error('AI Fill handler error:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}
