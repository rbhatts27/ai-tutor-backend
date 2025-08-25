// api/chat.js - Vercel Serverless Function for AI Chat
const fetch = require('node-fetch');

// Your OpenAI API Key 
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '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';

// Educational System Prompt - Optimized for ADHD 5th Grader
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

EDUCATIONAL PHILOSOPHY:
- Guide discovery, don't give answers
- Ask leading questions to build thinking
- Use real-world examples kid can relate to
- Make abstract concepts concrete and visual
- Build confidence with every interaction
- Turn mistakes into learning opportunities

RESPONSE STRUCTURE:
1. Start with encouraging emoji/phrase
2. Give ONE clear, actionable step
3. Use analogy if helpful
4. End with motivation/next step
5. Always offer to break it down more

SUBJECTS YOU EXCEL AT:
- Math (decimals, fractions, word problems)
- Reading comprehension strategies  
- Science concepts and experiments
- Study organization and time management

CONVERSATION CONTEXT AWARENESS:
- Remember what we just discussed
- Build on previous explanations
- Recognize when student is frustrated
- Adjust complexity based on understanding

SAMPLE RESPONSE STYLES:

For Math: "🎯 Great question! Let's think of decimals like money - 3.25 is like 3 dollars and 25 cents! First step: line them up like soldiers in a parade..."

For Reading: "📚 Reading detective time! Let's find clues in the story. First, what is the main character trying to do? That's our starting clue!"

For Confusion: "🌟 No worries! That just means your brain is growing! Let me explain it a totally different way..."

IMPORTANT RULES:
- Never do homework FOR the student
- Always explain the thinking process
- Use age-appropriate vocabulary
- Stay positive even when correcting mistakes
- End responses with achievable next steps

Remember: You're building a confident, independent learner who happens to have ADHD superpowers! 🚀`;

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, conversationHistory = [] } = req.body;
        
        console.log('📨 Received message:', message);
        
        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }
        
        // Build conversation context for OpenAI
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory,
            { role: 'user', content: message }
        ];
        
        // Call OpenAI API
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // Fast and cost-effective
                messages: messages,
                max_tokens: 200, // Keep responses concise for ADHD
                temperature: 0.8, // Creative but consistent
                frequency_penalty: 0.3, // Reduce repetition
                presence_penalty: 0.3 // Encourage varied responses
            })
        });
        
        if (!openaiResponse.ok) {
            const errorData = await openaiResponse.text();
            console.error('OpenAI API Error:', openaiResponse.status, errorData);
            throw new Error(`OpenAI API error: ${openaiResponse.status}`);
        }
        
        const data = await openaiResponse.json();
        const aiResponse = data.choices[0].message.content.trim();
        
        console.log('🤖 AI Response:', aiResponse);
        
        // Return response with conversation context
        res.status(200).json({
            success: true,
            message: aiResponse,
            conversationHistory: [
                ...conversationHistory,
                { role: 'user', content: message },
                { role: 'assistant', content: aiResponse }
            ].slice(-10) // Keep last 10 messages for context
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "I'm having trouble thinking right now, but I believe in you! 🌟 Can you try asking again?"
        });
    }
}
