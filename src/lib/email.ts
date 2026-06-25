import { Resend } from "resend";

type BookingEmailPayload = {
  bookingId: string;
  toolName: string;
  pocName: string;
  pocEmail: string;
  requesterName: string;
  requesterEmail: string;
  preferredDate: string;
  preferredTime: string;
  durationMinutes: number;
  subject: string;
  message?: string;
};

export async function sendBookingEmail(payload: BookingEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL ?? "AI Hub Tool Guide <onboarding@resend.dev>";

  const body = `
Training session request — ${payload.toolName}

Booking reference: ${payload.bookingId}

Requester: ${payload.requesterName} <${payload.requesterEmail}>
Tool: ${payload.toolName}
Date: ${payload.preferredDate}
Time: ${payload.preferredTime}
Duration: ${payload.durationMinutes} minutes
Subject: ${payload.subject}

Message:
${payload.message || "(none)"}

---
Please follow up via Outlook to confirm the session.
`.trim();

  if (!apiKey) {
    console.info("[booking email — RESEND_API_KEY not set]\n", body);
    return { ok: true as const, mode: "logged" as const };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: payload.pocEmail,
    replyTo: payload.requesterEmail,
    subject: `[AI Hub Training] ${payload.subject}`,
    text: body,
  });

  if (error) {
    console.error("Resend error:", error);
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const, mode: "sent" as const };
}
