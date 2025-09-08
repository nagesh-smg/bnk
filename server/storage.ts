import { type User, type InsertUser, type Scheme, type InsertScheme, type News, type InsertNews, type Document, type InsertDocument, type Setting, type InsertSetting, type Branch, type InsertBranch } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

export interface IStorage {
  // User methods
  getUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  // Scheme methods
  getSchemes(): Promise<Scheme[]>;
  getScheme(id: string): Promise<Scheme | undefined>;
  createScheme(scheme: InsertScheme): Promise<Scheme>;
  updateScheme(id: string, scheme: Partial<InsertScheme>): Promise<Scheme | undefined>;
  deleteScheme(id: string): Promise<boolean>;

  // News methods
  getNews(): Promise<News[]>;
  getNewsItem(id: string): Promise<News | undefined>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: string, news: Partial<InsertNews>): Promise<News | undefined>;
  deleteNews(id: string): Promise<boolean>;

  // Document methods
  getDocuments(): Promise<Document[]>;
  getDocument(id: string): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: string, document: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: string): Promise<boolean>;

  // Settings methods
  getSettings(): Promise<Setting[]>;
  getSetting(key: string): Promise<Setting | undefined>;
  setSetting(setting: InsertSetting): Promise<Setting>;
  updateSetting(id: string, setting: Partial<InsertSetting>): Promise<Setting | undefined>;

  // Branch methods
  getBranches(): Promise<Branch[]>;
  getBranch(id: string): Promise<Branch | undefined>;
  createBranch(branch: InsertBranch): Promise<Branch>;
  updateBranch(id: string, branch: Partial<InsertBranch>): Promise<Branch | undefined>;
  deleteBranch(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private schemes: Map<string, Scheme>;
  private news: Map<string, News>;
  private documents: Map<string, Document>;
  private settings: Map<string, Setting>;
  private branches: Map<string, Branch>;

  constructor() {
    this.users = new Map();
    this.schemes = new Map();
    this.news = new Map();
    this.documents = new Map();
    this.settings = new Map();
    this.branches = new Map();

    // Initialize with admin user and sample data
    this.initializeData();
  }

  private initializeData() {
    // Create admin user with hashed password
    const adminUser: User = {
      id: "admin-1",
      username: "admin",
      password: bcrypt.hashSync("admin123", 10) // hashed admin password
    };
    this.users.set(adminUser.id, adminUser);

    console.log(this.users)

    // Initialize default schemes
    const defaultSchemes: Scheme[] = [
      {
        id: "scheme-1",
        name: "Fixed Deposit Plus",
        type: "deposit",
        description: "Secure your future with guaranteed returns on your investment.",
        interestRate: "7.25",
        minAmount: "₹10,000",
        maxAmount: "₹50,00,000",
        tenure: "1-5 years",
        status: "active",
        createdAt: new Date()
      },
      {
        id: "scheme-2",
        name: "Recurring Deposit",
        type: "deposit", 
        description: "Build wealth systematically with monthly deposits and compound interest.",
        interestRate: "6.75",
        minAmount: "₹500/month",
        maxAmount: "₹1,00,000/month",
        tenure: "1-10 years",
        status: "active",
        createdAt: new Date()
      },
      {
        id: "scheme-3",
        name: "Home Loan",
        type: "loan",
        description: "Make your dream home a reality with our competitive home loan rates.",
        interestRate: "8.50",
        minAmount: "₹1,00,000",
        maxAmount: "₹2 Crore",
        tenure: "Up to 30 years",
        status: "active",
        createdAt: new Date()
      },
      {
        id: "scheme-4",
        name: "Personal Loan",
        type: "loan",
        description: "Quick approval personal loans for all your immediate financial needs.",
        interestRate: "12.00",
        minAmount: "₹25,000",
        maxAmount: "₹25 Lakh",
        tenure: "1-7 years",
        status: "active",
        createdAt: new Date()
      }
    ];

    defaultSchemes.forEach(scheme => this.schemes.set(scheme.id, scheme));

    // Initialize default news
    const defaultNews: News[] = [
      {
        id: "news-1",
        title: "New Digital Banking Features Launched",
        content: "Experience enhanced online banking with our latest digital features including instant transfers and mobile check deposits.",
        excerpt: "Experience enhanced online banking with our latest digital features including instant transfers and mobile check deposits.",
        publishDate: new Date("2023-12-15"),
        status: "published"
      },
      {
        id: "news-2", 
        title: "Interest Rates Updated",
        content: "We've revised our deposit and loan interest rates to offer you better returns and competitive borrowing costs.",
        excerpt: "We've revised our deposit and loan interest rates to offer you better returns and competitive borrowing costs.",
        publishDate: new Date("2023-12-12"),
        status: "published"
      },
      {
        id: "news-3",
        title: "Award for Best Customer Service",
        content: "Unity Banking receives recognition for outstanding customer service and innovative banking solutions.",
        excerpt: "Unity Banking receives recognition for outstanding customer service and innovative banking solutions.",
        publishDate: new Date("2023-12-10"),
        status: "published"
      }
    ];

    defaultNews.forEach(news => this.news.set(news.id, news));

    // Initialize default dashboard settings
    const defaultSettings: Setting[] = [
      {
        id: "setting-1",
        key: "total_deposits",
        value: "₹12.5 Cr",
        category: "dashboard",
        displayName: "Total Deposits"
      },
      {
        id: "setting-2", 
        key: "active_loans",
        value: "₹8.2 Cr",
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

    defaultSettings.forEach(setting => this.settings.set(setting.id, setting));

    // Initialize default branches
    const defaultBranches: Branch[] = [
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
        createdAt: new Date()
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
        createdAt: new Date()
      }
    ];

    defaultBranches.forEach(branch => this.branches.set(branch.id, branch));
  }

  // Helper for hashing password
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  // User methods
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = await this.hashPassword(insertUser.password);
    const user: User = { ...insertUser, id, password: hashedPassword };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedData = { ...updateData };
    if (updateData.password) {
      updatedData.password = await this.hashPassword(updateData.password);
    }

    const updatedUser = { ...user, ...updatedData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Scheme methods
  async getSchemes(): Promise<Scheme[]> {
    return Array.from(this.schemes.values());
  }

  async getScheme(id: string): Promise<Scheme | undefined> {
    return this.schemes.get(id);
  }

  async createScheme(insertScheme: InsertScheme): Promise<Scheme> {
    const id = randomUUID();
    const scheme: Scheme = { 
      ...insertScheme, 
      id, 
      createdAt: new Date(),
      status: insertScheme.status || "active",
      minAmount: insertScheme.minAmount || null,
      maxAmount: insertScheme.maxAmount || null
    };
    this.schemes.set(id, scheme);
    return scheme;
  }

  async updateScheme(id: string, updateData: Partial<InsertScheme>): Promise<Scheme | undefined> {
    const scheme = this.schemes.get(id);
    if (!scheme) return undefined;
    
    const updatedScheme = { ...scheme, ...updateData };
    this.schemes.set(id, updatedScheme);
    return updatedScheme;
  }

  async deleteScheme(id: string): Promise<boolean> {
    return this.schemes.delete(id);
  }

  // News methods
  async getNews(): Promise<News[]> {
    return Array.from(this.news.values()).sort((a, b) => 
      new Date(b.publishDate!).getTime() - new Date(a.publishDate!).getTime()
    );
  }

  async getNewsItem(id: string): Promise<News | undefined> {
    return this.news.get(id);
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const id = randomUUID();
    const news: News = { 
      ...insertNews, 
      id, 
      publishDate: new Date(),
      status: insertNews.status || "published"
    };
    this.news.set(id, news);
    return news;
  }

  async updateNews(id: string, updateData: Partial<InsertNews>): Promise<News | undefined> {
    const news = this.news.get(id);
    if (!news) return undefined;
    
    const updatedNews = { ...news, ...updateData };
    this.news.set(id, updatedNews);
    return updatedNews;
  }

  async deleteNews(id: string): Promise<boolean> {
    return this.news.delete(id);
  }

  // Document methods
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = { ...insertDocument, id, uploadDate: new Date() };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: string, updateData: Partial<InsertDocument>): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;
    
    const updatedDocument = { ...document, ...updateData };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  async deleteDocument(id: string): Promise<boolean> {
    return this.documents.delete(id);
  }

  // Settings methods
  async getSettings(): Promise<Setting[]> {
    return Array.from(this.settings.values());
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    return Array.from(this.settings.values()).find(setting => setting.key === key);
  }

  async setSetting(insertSetting: InsertSetting): Promise<Setting> {
    const existing = await this.getSetting(insertSetting.key);
    if (existing) {
      const updated = { ...existing, value: insertSetting.value };
      this.settings.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const setting: Setting = { 
        ...insertSetting, 
        id,
        category: insertSetting.category || "general",
        displayName: insertSetting.displayName || insertSetting.key
      };
      this.settings.set(id, setting);
      return setting;
    }
  }

  async updateSetting(id: string, updateData: Partial<InsertSetting>): Promise<Setting | undefined> {
    const setting = this.settings.get(id);
    if (!setting) return undefined;
    
    const updatedSetting = { ...setting, ...updateData };
    this.settings.set(id, updatedSetting);
    return updatedSetting;
  }

  // Branch methods implementation
  async getBranches(): Promise<Branch[]> {
    return Array.from(this.branches.values());
  }

  async getBranch(id: string): Promise<Branch | undefined> {
    return this.branches.get(id);
  }

  async createBranch(insertBranch: InsertBranch): Promise<Branch> {
    const id = randomUUID();
    const branch: Branch = { 
      ...insertBranch, 
      id,
      createdAt: new Date()
    };
    this.branches.set(id, branch);
    return branch;
  }

  async updateBranch(id: string, updateData: Partial<InsertBranch>): Promise<Branch | undefined> {
    const branch = this.branches.get(id);
    if (!branch) return undefined;
    
    const updatedBranch = { ...branch, ...updateData };
    this.branches.set(id, updatedBranch);
    return updatedBranch;
  }

  async deleteBranch(id: string): Promise<boolean> {
    return this.branches.delete(id);
  }


  // Changes
  async fetchAdminUserByUserName(name: string) {

    console.log(this.users)

    const users = Array.from(this.users.values()).find(user => user.username === name)

    console.log(users)

    return users
  }
}

export const storage = new MemStorage();
