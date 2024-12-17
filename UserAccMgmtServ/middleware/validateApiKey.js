// Middleware to validate API key
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key']; // API key from the request header
    const VALID_API_KEYS = process.env.API_KEY; // Replace with your keys
  
    if (!apiKey) {
      return res.status(401).json({ error: 'API key is missing' });
    }
  
    if (!VALID_API_KEYS.includes(apiKey)) {
      return res.status(403).json({ error: 'Invalid API key' });
    }
  
    next(); // API key is valid, proceed to the next middleware or route
  };
  export default validateApiKey