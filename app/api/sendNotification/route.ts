import { NextResponse } from "next/server"
import webpush from "web-push"
import { getSubscription } from "../subscribe/route"

webpush.setVapidDetails(
  "mailto:aftabalikhan900@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST(req: Request) {
  const sub = getSubscription()
  if (!sub) {
    return NextResponse.json({ error: "No subscription found" }, { status: 400 })
  }

  try {
    const data = await req.json()
    const payload = JSON.stringify({
      title: data.title || "Notification",
      body: data.body || "Hello from your app!",
      icon: data.icon || "/icon-192x192.png",
      url: data.url || "/",
    })

    await webpush.sendNotification(sub, payload)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("❌ Push error:", err)
    return NextResponse.json({ error: "Failed to send" }, { status: 500 })
  }
}
