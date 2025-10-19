"use client";
import { useEffect } from "react";

export type ClassData = {
  subject: string;
  teacher: string;
  room: string;
  from_to: string; // e.g., "9:00 AM to 10:30 AM"
  time?: string;
};

type ClassNotificationSchedulerProps = {
  classes: ClassData[];
  enabled?: boolean;
};

// Parse time string like "9:00 AM" to Date object for today
function parseTimeToDate(timeStr: string): Date | null {
  const match = timeStr.match(/(\d+):(\d+)\s(AM|PM)/);
  if (!match) return null;
  
  const [, hours, minutes, period] = match;
  const date = new Date();
  let hour = parseInt(hours);
  
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  
  date.setHours(hour, parseInt(minutes), 0, 0);
  return date;
}

// Extract start and end times from "from_to" string
function parseFromTo(from_to: string): { start: Date; end: Date } | null {
  const [startStr, endStr] = from_to.split(" to ");
  if (!startStr || !endStr) return null;
  
  const start = parseTimeToDate(startStr.trim());
  const end = parseTimeToDate(endStr.trim());
  
  if (!start || !end) return null;
  return { start, end };
}

// Send push notification via API
async function sendNotification(title: string, body: string, url?: string) {
  try {
    await fetch("/api/sendNotification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, url: url || "/today-classes" }),
    });
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
}

export default function ClassNotificationScheduler({ 
  classes, 
  enabled = true 
}: ClassNotificationSchedulerProps) {
  useEffect(() => {
    if (!enabled || classes.length === 0) return;

    const timers: NodeJS.Timeout[] = [];
    const now = Date.now();

    classes.forEach((cls) => {
      const times = parseFromTo(cls.from_to);
      if (!times) return;

      const { start, end } = times;
      const msToStart = start.getTime() - now;
      const msToEnd = end.getTime() - now;

      // Schedule notification for class start (only if in the future)
      if (msToStart > 0) {
        const timer = setTimeout(() => {
          sendNotification(
            `📚 Class Starting Now!`,
            `${cls.subject} with ${cls.teacher} in ${cls.room}`,
            "/today-classes"
          );
          console.log(`🔔 Sent start notification for ${cls.subject}`);
        }, msToStart);
        
        timers.push(timer);
        console.log(`⏰ Scheduled start notification for ${cls.subject} in ${Math.round(msToStart / 1000)}s`);
      }

      // Schedule notification for class end (only if in the future)
      if (msToEnd > 0) {
        const timer = setTimeout(() => {
          sendNotification(
            `✅ Class Ended`,
            `${cls.subject} has finished. Take a break!`,
            "/today-classes"
          );
          console.log(`🔔 Sent end notification for ${cls.subject}`);
        }, msToEnd);
        
        timers.push(timer);
        console.log(`⏰ Scheduled end notification for ${cls.subject} in ${Math.round(msToEnd / 1000)}s`);
      }
    });

    // Cleanup timers on unmount
    return () => {
      timers.forEach(timer => clearTimeout(timer));
      console.log(`🧹 Cleaned up ${timers.length} notification timers`);
    };
  }, [classes, enabled]);

  return null; // This component doesn't render anything
}
