"use strict";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
const staticPath = path.join(__dirname, "../client/dist");
app.use(express.static(staticPath));
async function startServer() {
  try {
    await registerRoutes(app);
    app.get("*", (req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });
    app.listen(PORT, "localhost", () => {
      console.log(`\u2705 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("\u274C Failed to start server:", error);
    process.exit(1);
  }
}
startServer();
