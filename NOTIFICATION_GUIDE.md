# 🔔 Notification System Guide

## Overview

This app has a complete push notification system that can send notifications for class start/end times, or any custom notification from anywhere in your app.

## Components

### 1. `ClassNotificationScheduler`

A reusable component that automatically schedules notifications for class start and end times.

**Usage:**

```tsx
import ClassNotificationScheduler from "@/components/ClassNotificationScheduler";

// In your component
<ClassNotificationScheduler 
  classes={[
    {
      subject: "Mathematics",
      teacher: "Dr. Smith",
      room: "Room 101",
      from_to: "9:00 AM to 10:30 AM"
    },
    {
      subject: "Physics",
      teacher: "Dr. Jones",
      room: "Lab 203",
      from_to: "11:00 AM to 12:30 PM"
    }
  ]}
  enabled={true}
/>
```

**Props:**
- `classes`: Array of class objects with `subject`, `teacher`, `room`, and `from_to` fields
- `enabled`: Boolean to enable/disable notifications (default: `true`)

**Features:**
- Automatically schedules 2 notifications per class (start and end)
- Only schedules future notifications (skips past times)
- Cleans up timers when component unmounts
- Logs scheduled notifications to console

---

### 2. Utility Functions

Located in `utils/notificationHelpers.ts`

#### `sendPushNotification(title, body, url?)`

Send an instant notification from anywhere.

```tsx
import { sendPushNotification } from "@/utils/notificationHelpers";

// Example: Send custom notification
await sendPushNotification(
  "Break Time!",
  "15 minute break before next class",
  "/today-classes"
);
```

#### `sendInstantClassNotification(subject, teacher, room, type)`

Send a pre-formatted class notification.

```tsx
import { sendInstantClassNotification } from "@/utils/notificationHelpers";

// Notify about class starting
await sendInstantClassNotification(
  "Data Structures",
  "Prof. Wilson",
  "CS-204",
  "starting"
);

// Notify about class ending
await sendInstantClassNotification(
  "Data Structures",
  "Prof. Wilson",
  "CS-204",
  "ending"
);
```

---

## Example Use Cases

### Example 1: Schedule all today's classes

```tsx
"use client";
import { timetable } from "@/data/timetabledata";
import ClassNotificationScheduler from "@/components/ClassNotificationScheduler";

export default function MyPage() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayClasses = timetable[today]?.filter(cls => cls !== null) || [];

  return (
    <div>
      <ClassNotificationScheduler classes={todayClasses} />
      {/* Your page content */}
    </div>
  );
}
```

### Example 2: Manual notification on button click

```tsx
"use client";
import { sendPushNotification } from "@/utils/notificationHelpers";

export default function NotifyButton() {
  const handleNotify = async () => {
    await sendPushNotification(
      "Custom Alert",
      "You clicked the button!",
      "/time-table"
    );
  };

  return (
    <button onClick={handleNotify}>
      Send Test Notification
    </button>
  );
}
```

### Example 3: Conditional notifications

```tsx
"use client";
import ClassNotificationScheduler from "@/components/ClassNotificationScheduler";
import { useState } from "react";

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const myClasses = [...]; // your class data

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={notificationsEnabled}
          onChange={(e) => setNotificationsEnabled(e.target.checked)}
        />
        Enable Class Notifications
      </label>

      <ClassNotificationScheduler 
        classes={myClasses}
        enabled={notificationsEnabled}
      />
    </div>
  );
}
```

### Example 4: Schedule for specific day

```tsx
"use client";
import ClassNotificationScheduler from "@/components/ClassNotificationScheduler";
import { timetable } from "@/data/timetabledata";

export default function MondaySchedule() {
  const mondayClasses = timetable.Monday?.filter(cls => cls !== null) || [];

  return (
    <div>
      <h1>Monday Schedule</h1>
      <ClassNotificationScheduler classes={mondayClasses} />
      {/* Display schedule */}
    </div>
  );
}
```

---

## How It Works

1. **User subscribes** when they first visit the app (via `PushSubscriber` in layout)
2. **Subscription is stored** on the server (currently in-memory)
3. **Component schedules** notifications using `setTimeout` for upcoming classes
4. **API sends push** to the service worker when time arrives
5. **Service worker shows** the notification (even if app is closed)
6. **User clicks notification** and is redirected to the specified URL

---

## Testing

### Quick Test (from browser console):

```javascript
// Test sending a notification
fetch('/api/sendNotification', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Test Notification',
    body: 'This is a test!',
    url: '/time-table'
  })
})
```

### Test with upcoming class:

Edit `data/timetabledata.tsx` and set a class time to 2 minutes from now to see the notification trigger.

---

## Important Notes

- ✅ Notifications work even when app tab is closed (as long as browser is running)
- ✅ Uses Web Push API with VAPID keys (configured in `.env.local`)
- ⚠️ Subscriptions are stored in memory - restart server and users need to re-subscribe
- ⚠️ For production, store subscriptions in a database
- ⚠️ Scheduled notifications only work while the page is open (use Web Push for background scheduling)

---

## Troubleshooting

**No notifications appearing?**
1. Check browser console for errors
2. Ensure notification permission is granted (check browser settings)
3. Verify VAPID keys are set in `.env.local`
4. Check that service worker registered successfully (console should show ✅)
5. Ensure at least one user is subscribed (check `/api/subscribe` logs)

**Notifications not working when app is closed?**
- This is expected for `setTimeout`-based scheduling
- Use the `/api/sendNotification` endpoint from a cron job or external service for true background notifications
