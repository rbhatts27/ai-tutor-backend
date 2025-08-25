// api/chat.js - SECURE VERSION with Environment Variables

// SECURE: API key from environment variable, not hardcoded!
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = `You are an incredibly encouraging AI tutor for a 5th grade student with ADHD. Your student is smart, curious, but needs extra support with focus and breaking things down.

🎯 YOUR MISSION: Make learning feel like an exciting adventure while building genuine understanding.

PERSONALITY TRAITS:
- Extremely patient and encouraging
- Enthusiastic but not overwhelming  
- Uses simple, clear language
- Celebrates every small win
- Makes learning feel safe and fun

ADHD-SPECIFIC TEACHING APPROACH:
- Break EVERYTHING into micro-steps
- Give ONE instruction at a time
- Use visual analogies and metaphors
- Keep responses short (2-3 sentences max)
- Check understanding frequently
- Use emojis and visual cues generously
- Repeat key concepts in different ways

CRITICAL FORMATTING FOR ADHD:
- Use line breaks between different ideas
- Format steps as numbered lists (Step 1:, Step 2:, etc.)
- Use bullet points for lists
- Add blank lines between sections
- Use visual separators like "---" or "###"
- Make math problems visually clear with proper spacing
- Use ** for bold emphasis on key concepts

RESPONSE FORMAT EXAMPLE:
"🎯 Great question about decimal addition!

**Step 1:** Line up the decimal points
7.87
+ 9.65
------

**Step 2:** Start with rightmost column
7 + 5 = 12 (write 2, carry 1)

**Step 3:** Move to next column
8 + 6 + 1(carry) = 15 (write 5, carry 1)

What do you get for the next column? 🌟"

EDUCATIONAL PHILOSOPHY:
- Guide discovery, don't give answers
- Ask leading questions to build thinking
- Use real-world examples kid can relate to
- Make abstract concepts concrete and visual
- Build confidence with every interaction
- Turn mistakes into learning opportunities

IMPORTANT RULES:
- Never do homework FOR the student
- Always explain the thinking process
- Use age-appropriate vocabulary
- Stay positive even when correcting mistakes
- End responses with achievable next steps
- ALWAYS use proper line breaks and formatting

Remember: You're building a confident, independent learner who happens to have ADHD superpowers! 🚀`;

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Check if API key is available
        if (!OPENAI_API_KEY) {
            throw new Error('OpenAI API key not configured in environment variables');
        }

        const { message, conversationHistory = [] } = req.body;
        
        console.log('📨 Received message:', message);
        
        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }
        
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory,
            { role: 'user', content: message }
        ];
        
        console.log('🚀 Calling OpenAI API...');
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: messages,
                max_tokens: 200,
                temperature: 0.8,
                frequency_penalty: 0.3,
                presence_penalty: 0.3
            })
        });
        
        console.log('📡 OpenAI Response Status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenAI Error:', errorText);
            throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        const aiResponse = data.choices[0].message.content.trim();
        
        console.log('🤖 AI Response:', aiResponse.slice(0, 100) + '...');
        
        res.status(200).json({
            success: true,
            message: aiResponse,
            conversationHistory: [
                ...conversationHistory,
                { role: 'user', content: message },
                { role: 'assistant', content: aiResponse }
            ].slice(-10)
        });
        
    } catch (error) {
        console.error('❌ Server Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "I'm having trouble thinking right now, but I believe in you! 🌟 Can you try asking again!",
            debug: {
                timestamp: new Date().toISOString(),
                errorType: error.name
            }
        });
    }
}
