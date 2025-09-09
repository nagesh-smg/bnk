// server/index.ts
import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
var MemStorage = class {
  users;
  schemes;
  news;
  documents;
  settings;
  branches;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.schemes = /* @__PURE__ */ new Map();
    this.news = /* @__PURE__ */ new Map();
    this.documents = /* @__PURE__ */ new Map();
    this.settings = /* @__PURE__ */ new Map();
    this.branches = /* @__PURE__ */ new Map();
    this.initializeData();
  }
  initializeData() {
    const adminUser = {
      id: "admin-1",
      username: "admin",
      password: bcrypt.hashSync("admin123", 10)
      // hashed admin password
    };
    this.users.set(adminUser.id, adminUser);
    console.log(this.users);
    const defaultSchemes = [
      {
        id: "scheme-1",
        name: "Fixed Deposit Plus",
        type: "deposit",
        description: "Secure your future with guaranteed returns on your investment.",
        interestRate: "7.25",
        minAmount: "\u20B910,000",
        maxAmount: "\u20B950,00,000",
        tenure: "1-5 years",
        status: "active",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: "scheme-2",
        name: "Recurring Deposit",
        type: "deposit",
        description: "Build wealth systematically with monthly deposits and compound interest.",
        interestRate: "6.75",
        minAmount: "\u20B9500/month",
        maxAmount: "\u20B91,00,000/month",
        tenure: "1-10 years",
        status: "active",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: "scheme-3",
        name: "Home Loan",
        type: "loan",
        description: "Make your dream home a reality with our competitive home loan rates.",
        interestRate: "8.50",
        minAmount: "\u20B91,00,000",
        maxAmount: "\u20B92 Crore",
        tenure: "Up to 30 years",
        status: "active",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: "scheme-4",
        name: "Personal Loan",
        type: "loan",
        description: "Quick approval personal loans for all your immediate financial needs.",
        interestRate: "12.00",
        minAmount: "\u20B925,000",
        maxAmount: "\u20B925 Lakh",
        tenure: "1-7 years",
        status: "active",
        createdAt: /* @__PURE__ */ new Date()
      }
    ];
    defaultSchemes.forEach((scheme) => this.schemes.set(scheme.id, scheme));
    const defaultNews = [
      {
        id: "news-1",
        title: "New Digital Banking Features Launched",
        content: "Experience enhanced online banking with our latest digital features including instant transfers and mobile check deposits.",
        excerpt: "Experience enhanced online banking with our latest digital features including instant transfers and mobile check deposits.",
        publishDate: /* @__PURE__ */ new Date("2023-12-15"),
        status: "published"
      },
      {
        id: "news-2",
        title: "Interest Rates Updated",
        content: "We've revised our deposit and loan interest rates to offer you better returns and competitive borrowing costs.",
        excerpt: "We've revised our deposit and loan interest rates to offer you better returns and competitive borrowing costs.",
        publishDate: /* @__PURE__ */ new Date("2023-12-12"),
        status: "published"
      },
      {
        id: "news-3",
        title: "Award for Best Customer Service",
        content: "Unity Banking receives recognition for outstanding customer service and innovative banking solutions.",
        excerpt: "Unity Banking receives recognition for outstanding customer service and innovative banking solutions.",
        publishDate: /* @__PURE__ */ new Date("2023-12-10"),
        status: "published"
      }
    ];
    defaultNews.forEach((news2) => this.news.set(news2.id, news2));
    const defaultSettings = [
      {
        id: "setting-1",
        key: "total_deposits",
        value: "\u20B912.5 Cr",
        category: "dashboard",
        displayName: "Total Deposits"
      },
      {
        id: "setting-2",
        key: "active_loans",
        value: "\u20B98.2 Cr",
        category: "dashboard",
        displayName: "Active Loans"
      },
      {
        id: "setting-3",
        key: "total_customers",
        value: "2,847",
        category: "dashboard",
        displayName: "Total Customers"
      },
      {
        id: "setting-4",
        key: "monthly_growth",
        value: "+15.3%",
        category: "dashboard",
        displayName: "Monthly Growth"
      },
      {
        id: "setting-5",
        key: "bank_name",
        value: "Unity Banking",
        category: "branding",
        displayName: "Bank Name"
      }
    ];
    defaultSettings.forEach((setting) => this.settings.set(setting.id, setting));
    const defaultBranches = [
      {
        id: "branch-1",
        name: "Unity Banking Main Branch",
        code: "UB001",
        address: "123 Financial District, Banking Street",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        phone: "+91-22-12345678",
        email: "main@unitybanking.com",
        managerName: "Rajesh Kumar",
        managerPhone: "+91-22-12345679",
        managerEmail: "rajesh.kumar@unitybanking.com",
        ifscCode: "UBNK0000001",
        micr: "400000001",
        isActive: true,
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: "branch-2",
        name: "Unity Banking Andheri Branch",
        code: "UB002",
        address: "456 Andheri West, Commercial Complex",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400058",
        phone: "+91-22-23456789",
        email: "andheri@unitybanking.com",
        managerName: "Priya Sharma",
        managerPhone: "+91-22-23456790",
        managerEmail: "priya.sharma@unitybanking.com",
        ifscCode: "UBNK0000002",
        micr: "400000002",
        isActive: true,
        createdAt: /* @__PURE__ */ new Date()
      }
    ];
    defaultBranches.forEach((branch) => this.branches.set(branch.id, branch));
  }
  // Helper for hashing password
  async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
  // User methods
  async getUsers() {
    return Array.from(this.users.values());
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const hashedPassword = await this.hashPassword(insertUser.password);
    const user = { ...insertUser, id, password: hashedPassword };
    this.users.set(id, user);
    return user;
  }
  async updateUser(id, updateData) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedData = { ...updateData };
    if (updateData.password) {
      updatedData.password = await this.hashPassword(updateData.password);
    }
    const updatedUser = { ...user, ...updatedData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async deleteUser(id) {
    return this.users.delete(id);
  }
  // Scheme methods
  async getSchemes() {
    return Array.from(this.schemes.values());
  }
  async getScheme(id) {
    return this.schemes.get(id);
  }
  async createScheme(insertScheme) {
    const id = randomUUID();
    const scheme = {
      ...insertScheme,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      status: insertScheme.status || "active",
      minAmount: insertScheme.minAmount || null,
      maxAmount: insertScheme.maxAmount || null
    };
    this.schemes.set(id, scheme);
    return scheme;
  }
  async updateScheme(id, updateData) {
    const scheme = this.schemes.get(id);
    if (!scheme) return void 0;
    const updatedScheme = { ...scheme, ...updateData };
    this.schemes.set(id, updatedScheme);
    return updatedScheme;
  }
  async deleteScheme(id) {
    return this.schemes.delete(id);
  }
  // News methods
  async getNews() {
    return Array.from(this.news.values()).sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  }
  async getNewsItem(id) {
    return this.news.get(id);
  }
  async createNews(insertNews) {
    const id = randomUUID();
    const news2 = {
      ...insertNews,
      id,
      publishDate: /* @__PURE__ */ new Date(),
      status: insertNews.status || "published"
    };
    this.news.set(id, news2);
    return news2;
  }
  async updateNews(id, updateData) {
    const news2 = this.news.get(id);
    if (!news2) return void 0;
    const updatedNews = { ...news2, ...updateData };
    this.news.set(id, updatedNews);
    return updatedNews;
  }
  async deleteNews(id) {
    return this.news.delete(id);
  }
  // Document methods
  async getDocuments() {
    return Array.from(this.documents.values());
  }
  async getDocument(id) {
    return this.documents.get(id);
  }
  async createDocument(insertDocument) {
    const id = randomUUID();
    const document = { ...insertDocument, id, uploadDate: /* @__PURE__ */ new Date() };
    this.documents.set(id, document);
    return document;
  }
  async updateDocument(id, updateData) {
    const document = this.documents.get(id);
    if (!document) return void 0;
    const updatedDocument = { ...document, ...updateData };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }
  async deleteDocument(id) {
    return this.documents.delete(id);
  }
  // Settings methods
  async getSettings() {
    return Array.from(this.settings.values());
  }
  async getSetting(key) {
    return Array.from(this.settings.values()).find((setting) => setting.key === key);
  }
  async setSetting(insertSetting) {
    const existing = await this.getSetting(insertSetting.key);
    if (existing) {
      const updated = { ...existing, value: insertSetting.value };
      this.settings.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const setting = {
        ...insertSetting,
        id,
        category: insertSetting.category || "general",
        displayName: insertSetting.displayName || insertSetting.key
      };
      this.settings.set(id, setting);
      return setting;
    }
  }
  async updateSetting(id, updateData) {
    const setting = this.settings.get(id);
    if (!setting) return void 0;
    const updatedSetting = { ...setting, ...updateData };
    this.settings.set(id, updatedSetting);
    return updatedSetting;
  }
  // Branch methods implementation
  async getBranches() {
    return Array.from(this.branches.values());
  }
  async getBranch(id) {
    return this.branches.get(id);
  }
  async createBranch(insertBranch) {
    const id = randomUUID();
    const branch = {
      ...insertBranch,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.branches.set(id, branch);
    return branch;
  }
  async updateBranch(id, updateData) {
    const branch = this.branches.get(id);
    if (!branch) return void 0;
    const updatedBranch = { ...branch, ...updateData };
    this.branches.set(id, updatedBranch);
    return updatedBranch;
  }
  async deleteBranch(id) {
    return this.branches.delete(id);
  }
  // Changes
  async fetchAdminUserByUserName(name) {
    console.log(this.users);
    const users2 = Array.from(this.users.values()).find((user) => user.username === name);
    console.log(users2);
    return users2;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var schemes = pgTable("schemes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  // 'deposit' or 'loan'
  description: text("description").notNull(),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  minAmount: text("min_amount"),
  maxAmount: text("max_amount"),
  tenure: text("tenure").notNull(),
  status: text("status").notNull().default("active"),
  // 'active' or 'inactive'
  createdAt: timestamp("created_at").defaultNow()
});
var news = pgTable("news", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  publishDate: timestamp("publish_date").defaultNow(),
  status: text("status").notNull().default("published")
  // 'published' or 'draft'
});
var documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadDate: timestamp("upload_date").defaultNow()
});
var settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  category: text("category").notNull().default("general"),
  displayName: text("display_name").notNull()
});
var branches = pgTable("branches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  managerName: text("manager_name").notNull(),
  managerPhone: text("manager_phone").notNull(),
  managerEmail: text("manager_email").notNull(),
  ifscCode: text("ifsc_code").notNull(),
  micr: text("micr"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertSchemeSchema = createInsertSchema(schemes).omit({
  id: true,
  createdAt: true
});
var insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  publishDate: true
});
var insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadDate: true
});
var insertSettingSchema = createInsertSchema(settings).omit({
  id: true
});
var updateSettingSchema = createInsertSchema(settings).omit({
  id: true,
  key: true
}).partial();
var insertBranchSchema = createInsertSchema(branches).omit({
  id: true,
  createdAt: true
});

// server/routes.ts
import { z } from "zod";
var loginSchema = z.object({
  username: z.string(),
  password: z.string()
});
async function registerRoutes(app2) {
  app2.get("/api/login", (req, res) => {
    req.session.userId = "local-admin";
    req.session.isAdmin = true;
    res.redirect("/");
  });
  app2.get("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      res.redirect("/");
    });
  });
  app2.get("/api/auth/user", (req, res) => {
    if (req.session && req.session.isAdmin) {
      res.json({
        id: "local-admin",
        username: "admin",
        email: "admin@localhost"
      });
    } else {
      req.session.userId = "local-admin";
      req.session.isAdmin = true;
      res.json({
        id: "local-admin",
        username: "admin",
        email: "admin@localhost"
      });
    }
  });
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await storage.fetchAdminUserByUserName(username);
      if (user) {
        req.session.userId = "local-admin";
        req.session.isAdmin = true;
        res.json({ message: "Login successful", user: { id: "local-admin", username: "admin" } });
        return;
      }
      if (username === "admin" && password === "admin") {
        req.session.userId = "local-admin";
        req.session.isAdmin = true;
        res.json({ message: "Login successful", user: { id: "local-admin", username: "admin" } });
      } else {
        res.status(401).json({ message: "Invalid credentials. Use admin/admin" });
      }
    } catch (error) {
      console.log("error======", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });
  app2.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  const requireAdmin = (req, res, next) => {
    if (!req.session.isAdmin) {
      req.session.userId = "local-admin";
      req.session.isAdmin = true;
    }
    next();
  };
  app2.get("/api/schemes", async (req, res) => {
    try {
      const schemes2 = await storage.getSchemes();
      res.json(schemes2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schemes" });
    }
  });
  app2.post("/api/schemes", requireAdmin, async (req, res) => {
    try {
      const schemeData = insertSchemeSchema.parse(req.body);
      const scheme = await storage.createScheme(schemeData);
      res.json(scheme);
    } catch (error) {
      res.status(400).json({ message: "Invalid scheme data" });
    }
  });
  app2.put("/api/schemes/:id", requireAdmin, async (req, res) => {
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
  app2.delete("/api/schemes/:id", requireAdmin, async (req, res) => {
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
  app2.get("/api/news", async (req, res) => {
    try {
      const news2 = await storage.getNews();
      res.json(news2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });
  app2.post("/api/news", requireAdmin, async (req, res) => {
    try {
      const newsData = insertNewsSchema.parse(req.body);
      const news2 = await storage.createNews(newsData);
      res.json(news2);
    } catch (error) {
      res.status(400).json({ message: "Invalid news data" });
    }
  });
  app2.put("/api/news/:id", requireAdmin, async (req, res) => {
    try {
      const newsData = insertNewsSchema.partial().parse(req.body);
      const news2 = await storage.updateNews(req.params.id, newsData);
      if (!news2) {
        return res.status(404).json({ message: "News item not found" });
      }
      res.json(news2);
    } catch (error) {
      res.status(400).json({ message: "Invalid news data" });
    }
  });
  app2.delete("/api/news/:id", requireAdmin, async (req, res) => {
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
  app2.get("/api/documents", async (req, res) => {
    try {
      const documents2 = await storage.getDocuments();
      res.json(documents2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });
  app2.post("/api/documents", requireAdmin, async (req, res) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(documentData);
      res.json(document);
    } catch (error) {
      res.status(400).json({ message: "Invalid document data" });
    }
  });
  app2.delete("/api/documents/:id", requireAdmin, async (req, res) => {
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
  app2.get("/api/settings", async (req, res) => {
    try {
      const settings2 = await storage.getSettings();
      res.json(settings2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });
  app2.put("/api/settings/:id", requireAdmin, async (req, res) => {
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
  app2.get("/api/branches", async (req, res) => {
    try {
      const branches2 = await storage.getBranches();
      res.json(branches2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch branches" });
    }
  });
  app2.post("/api/branches", requireAdmin, async (req, res) => {
    try {
      const branchData = insertBranchSchema.parse(req.body);
      const branch = await storage.createBranch(branchData);
      res.status(201).json(branch);
    } catch (error) {
      res.status(400).json({ message: "Invalid branch data" });
    }
  });
  app2.put("/api/branches/:id", requireAdmin, async (req, res) => {
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
  app2.delete("/api/branches/:id", requireAdmin, async (req, res) => {
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
  app2.get("/api/users", requireAdmin, async (req, res) => {
    try {
      const users2 = await storage.getUsers();
      res.json(users2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.post("/api/users", requireAdmin, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });
  app2.put("/api/users/:id", requireAdmin, async (req, res) => {
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
  app2.delete("/api/users/:id", requireAdmin, async (req, res) => {
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/index.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT || 3e3;
app.use(express.json());
app.use(session({
  secret: "your-secret-key-here",
  // Change this to a secure random string
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1e3
    // 24 hours
  }
}));
var staticPath = path.join(__dirname, "../dist");
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
