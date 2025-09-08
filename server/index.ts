import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";

// Fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Session middleware - REQUIRED for authentication
app.use(session({
  secret: 'your-secret-key-here', // Change this to a secure random string
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files from the top-level dist folder
const staticPath = path.join(__dirname, "../dist");
app.use(express.static(staticPath));

// Register API routes
async function startServer() {
  try {
    await registerRoutes(app);
    
    // Fallback: serve index.html for any non-API route
    app.get("*", (req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });
    
    app.listen(PORT, "localhost", () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();