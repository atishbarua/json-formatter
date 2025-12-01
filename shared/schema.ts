import { z } from "zod";

export const analyticsSchema = z.object({
  id: z.string(),
  totalVisitors: z.number(),
  dailyVisitors: z.record(z.string(), z.number()),
  adClicks: z.number(),
  lastUpdated: z.string(),
});

export const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const trackEventSchema = z.object({
  eventType: z.enum(["page_view", "ad_click"]),
});

export type Analytics = z.infer<typeof analyticsSchema>;
export type AdminLogin = z.infer<typeof adminLoginSchema>;
export type TrackEvent = z.infer<typeof trackEventSchema>;

export interface DailyStats {
  date: string;
  visitors: number;
}
