import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSchemeSchema, insertNewsSchema, insertDocumentSchema, insertSettingSchema, insertBranchSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

// Extend Express session type
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    isAdmin?: boolean;
  }
}

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Simple local development authentication bypass
  app.get("/api/login", (req, res) => {
    // Auto-login for local development
    req.session.userId = "local-admin";
    req.session.isAdmin = true;
    res.redirect("/");
  });

  app.get("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      res.redirect("/");
    });
  });

  // Mock auth endpoint for frontend
  app.get("/api/auth/user", (req, res) => {
    if (req.session && req.session.isAdmin) {
      res.json({
        id: "local-admin",
        username: "admin",
        email: "admin@localhost"
      });
    } else {
      // Auto-authenticate for local development
      req.session.userId = "local-admin";
      req.session.isAdmin = true;
      res.json({
        id: "local-admin", 
        username: "admin",
        email: "admin@localhost"
      });
    }
  });

  // Admin authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);

      const user = await storage.fetchAdminUserByUserName(username)

      if(user) {
        req.session.userId = "local-admin";
        req.session.isAdmin = true;
        res.json({ message: "Login successful", user: { id: "local-admin", username: "admin" } });
        return
      }
      
      // Simple local credentials - you can change these
      if (username === "admin" && password === "admin") {
        req.session.userId = "local-admin";
        req.session.isAdmin = true;
        res.json({ message: "Login successful", user: { id: "local-admin", username: "admin" } });
      } else {
        res.status(401).json({ message: "Invalid credentials. Use admin/admin" });
      }
    } catch (error) {
      console.log('error======', error)
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Middleware to check admin auth - bypassed for local development
  const requireAdmin = (req: any, res: any, next: any) => {
    // Auto-authenticate for local development
    if (!req.session.isAdmin) {
      req.session.userId = "local-admin";
      req.session.isAdmin = true;
    }
    next();
  };

  // Schemes API
  app.get("/api/schemes", async (req, res) => {
    try {
      const schemes = await storage.getSchemes();
      res.json(schemes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schemes" });
    }
  });

  app.post("/api/schemes", requireAdmin, async (req, res) => {
    try {
      const schemeData = insertSchemeSchema.parse(req.body);
      const scheme = await storage.createScheme(schemeData);
      res.json(scheme);
    } catch (error) {
      res.status(400).json({ message: "Invalid scheme data" });
    }
  });

  app.put("/api/schemes/:id", requireAdmin, async (req, res) => {
    try {
      const schemeData = insertSchemeSchema.partial().parse(req.body);
      const scheme = await storage.updateScheme(req.params.id, schemeData);
      if (!scheme) {
        return res.status(404).json({ message: "Scheme not found" });
      }
      res.json(scheme);
    } catch (error) {
      res.status(400).json({ message: "Invalid scheme data" });
    }
  });

  app.delete("/api/schemes/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteScheme(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Scheme not found" });
      }
      res.json({ message: "Scheme deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete scheme" });
    }
  });

  // News API
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  app.post("/api/news", requireAdmin, async (req, res) => {
    try {
      const newsData = insertNewsSchema.parse(req.body);
      const news = await storage.createNews(newsData);
      res.json(news);
    } catch (error) {
      res.status(400).json({ message: "Invalid news data" });
    }
  });

  app.put("/api/news/:id", requireAdmin, async (req, res) => {
    try {
      const newsData = insertNewsSchema.partial().parse(req.body);
      const news = await storage.updateNews(req.params.id, newsData);
      if (!news) {
        return res.status(404).json({ message: "News item not found" });
      }
      res.json(news);
    } catch (error) {
      res.status(400).json({ message: "Invalid news data" });
    }
  });

  app.delete("/api/news/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteNews(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "News item not found" });
      }
      res.json({ message: "News item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete news item" });
    }
  });

  // Documents API
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents", requireAdmin, async (req, res) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(documentData);
      res.json(document);
    } catch (error) {
      res.status(400).json({ message: "Invalid document data" });
    }
  });

  app.delete("/api/documents/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteDocument(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  // Settings API
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings/:id", requireAdmin, async (req, res) => {
    try {
      const updateData = insertSettingSchema.partial().parse(req.body);
      const setting = await storage.updateSetting(req.params.id, updateData);
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      res.status(400).json({ message: "Invalid setting data" });
    }
  });

  // Branch API
  app.get("/api/branches", async (req, res) => {
    try {
      const branches = await storage.getBranches();
      res.json(branches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch branches" });
    }
  });

  app.post("/api/branches", requireAdmin, async (req, res) => {
    try {
      const branchData = insertBranchSchema.parse(req.body);
      const branch = await storage.createBranch(branchData);
      res.status(201).json(branch);
    } catch (error) {
      res.status(400).json({ message: "Invalid branch data" });
    }
  });

  app.put("/api/branches/:id", requireAdmin, async (req, res) => {
    try {
      const updateData = insertBranchSchema.partial().parse(req.body);
      const branch = await storage.updateBranch(req.params.id, updateData);
      if (!branch) {
        return res.status(404).json({ message: "Branch not found" });
      }
      res.json(branch);
    } catch (error) {
      res.status(400).json({ message: "Invalid branch data" });
    }
  });

  app.delete("/api/branches/:id", requireAdmin, async (req, res) => {
    try {
      const success = await storage.deleteBranch(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Branch not found" });
      }
      res.json({ message: "Branch deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete branch" });
    }
  });

  // User API
  app.get("/api/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", requireAdmin, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.put("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      const updateData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, updateData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.delete("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      const success = await storage.deleteUser(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}