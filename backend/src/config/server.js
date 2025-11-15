// KIRO-AI: Server configuration with security headers and CORS settings
// CORS is restricted to the frontend origin to prevent unauthorized access
export const serverConfig = {
  port: parseInt(process.env.PORT || "3001", 10),
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  headers: {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block"
  }
};
