// api/health.js - Health Check Endpoint
export default function handler(req, res) {
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

    // Return health status
    res.status(200).json({
        status: 'healthy',
        message: '🤖 AI Tutor Backend is running!',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        endpoints: {
            chat: '/api/chat',
            health: '/api/health'
        }
    });
}
