// Utility function to send push notifications from anywhere in your app

export async function sendPushNotification(
  title: string,
  body: string,
  url?: string
): Promise<boolean> {
  try {
    const response = await fetch("/api/sendNotification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        body,
        url: url || "/today-classes",
      }),
    });

    if (!response.ok) {
      console.error("Failed to send notification:", await response.text());
      return false;
    }

    console.log("✅ Notification sent successfully");
    return true;
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    return false;
  }
}

// Helper to send instant notification (not scheduled)
export async function sendInstantClassNotification(
  subject: string,
  teacher: string,
  room: string,
  type: "starting" | "ending"
) {
  const title = type === "starting" ? "📚 Class Starting Now!" : "✅ Class Ended";
  const body =
    type === "starting"
      ? `${subject} with ${teacher} in ${room}`
      : `${subject} has finished. Take a break!`;

  return sendPushNotification(title, body, "/today-classes");
}
