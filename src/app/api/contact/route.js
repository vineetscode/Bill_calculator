import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, and message are all required." },
        { status: 400 }
      );
    }

    // Obscure target email address securely on the server side
    const recipientEmail = process.env.CONTACT_EMAIL || "vineetsinghjzr28@gmail.com";

    const response = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: `New Message from Flowtix Bubble: ${name}`,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success || data.success === "true") {
        return NextResponse.json({ success: true }, { status: 200 });
      }
    }

    return NextResponse.json(
      { error: "Failed to forward contact message via mail service." },
      { status: 502 }
    );
  } catch (error) {
    console.error("[Flowtix Contact API] Server Error:", error.message);
    return NextResponse.json(
      { error: "An internal server error occurred while processing your message." },
      { status: 500 }
    );
  }
}
