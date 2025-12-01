import type { Analytics, TrackEvent } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAnalytics(): Promise<Analytics>;
  trackEvent(event: TrackEvent): Promise<void>;
  validateAdmin(username: string, password: string): Promise<boolean>;
}

function generateHistoricalData(): Record<string, number> {
  const data: Record<string, number> = {};
  const today = new Date();
  
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const baseVisitors = Math.floor(Math.random() * 50) + 20;
    const variation = Math.floor(Math.random() * 30) - 15;
    data[dateStr] = Math.max(5, baseVisitors + variation);
  }
  
  return data;
}

function calculateTotalFromHistory(dailyVisitors: Record<string, number>): number {
  return Object.values(dailyVisitors).reduce((sum, count) => sum + count, 0);
}

export class MemStorage implements IStorage {
  private analytics: Analytics;
  private adminUsername: string;
  private adminPassword: string;

  constructor() {
    const dailyVisitors = generateHistoricalData();
    const totalVisitors = calculateTotalFromHistory(dailyVisitors);
    
    this.analytics = {
      id: randomUUID(),
      totalVisitors,
      dailyVisitors,
      adClicks: Math.floor(Math.random() * 20) + 5,
      lastUpdated: new Date().toISOString(),
    };

    this.adminUsername = process.env.ADMIN_USERNAME || "admin";
    this.adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  }

  async getAnalytics(): Promise<Analytics> {
    return { ...this.analytics, dailyVisitors: { ...this.analytics.dailyVisitors } };
  }

  async trackEvent(event: TrackEvent): Promise<void> {
    const today = new Date().toISOString().split("T")[0];
    
    if (event.eventType === "page_view") {
      this.analytics.totalVisitors += 1;
      this.analytics.dailyVisitors[today] = 
        (this.analytics.dailyVisitors[today] || 0) + 1;
    } else if (event.eventType === "ad_click") {
      this.analytics.adClicks += 1;
    }
    
    this.analytics.lastUpdated = new Date().toISOString();
  }

  async validateAdmin(username: string, password: string): Promise<boolean> {
    return username === this.adminUsername && password === this.adminPassword;
  }
}

export const storage = new MemStorage();
