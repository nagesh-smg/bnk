import type { Express, RequestHandler } from "express";

// Simple local authentication bypass
export const isAuthenticated: RequestHandler = (req: any, res, next) => {
  // Mock user for local development
  req.user = { 
    claims: { 
      sub: "local-admin-123",
      email: "admin@localhost" 
    } 
  };
  next();
};

export async function setupAuth(app: Express) {
  // Simple session middleware for local development
  app.use((req: any, res, next) => {
    req.isAuthenticated = () => true;
    next();
  });

  // Mock login route
  app.get("/api/login", (req, res) => {
    res.redirect("/");
  });

  // Mock logout route  
  app.get("/api/logout", (req, res) => {
    res.redirect("/");
  });
}