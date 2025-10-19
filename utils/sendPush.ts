// utils/sendPush.ts
export async function sendPush(title: string, body: string, url?: string) {
  await fetch("/api/sendNotification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body, url }),
  })
}
