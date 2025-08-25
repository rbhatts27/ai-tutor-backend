// api/health.js - Clean Health Check (No sensitive info)

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    res.status(200).json({
        status: 'healthy',
        message: '🤖 AI Tutor Backend is running securely!',
        timestamp: new Date().toISOString(),
        platform: 'Vercel Serverless',
        version: '2.1-secure',
        security: 'API keys secured with environment variables',
        endpoints: {
            chat: '/api/chat',
            health: '/api/health'
        },
        features: [
            '✅ GPT-4o-mini integration',
            '✅ ADHD-optimized prompts', 
            '✅ Conversation memory',
            '✅ Educational psychology',
            '🔐 Secure environment variables'
        ]
    });
}
