import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { trackEventSchema, adminLoginSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/track", async (req, res) => {
    try {
      const parsed = trackEventSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid event type" });
      }
      
      await storage.trackEvent(parsed.data);
      return res.json({ success: true });
    } catch (error) {
      console.error("Track event error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    try {
      const parsed = adminLoginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid credentials format" });
      }
      
      const { username, password } = parsed.data;
      const isValid = await storage.validateAdmin(username, password);
      
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      return res.json({ success: true, message: "Login successful" });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      return res.json(analytics);
    } catch (error) {
      console.error("Analytics error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}
