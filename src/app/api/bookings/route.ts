import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendBookingEmail } from "@/lib/email";
import { bookingSchema } from "@/lib/validations/booking";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bookingSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const tool = await db.tool.findUnique({
      where: { id: data.toolId },
      include: { category: true },
    });

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    const preferredDate = new Date(`${data.preferredDate}T12:00:00`);

    const booking = await db.booking.create({
      data: {
        toolId: tool.id,
        requesterName: data.requesterName,
        requesterEmail: data.requesterEmail,
        preferredDate,
        preferredTime: data.preferredTime,
        durationMinutes: data.durationMinutes,
        subject: data.subject,
        message: data.message,
      },
    });

    const dateLabel = preferredDate.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    await sendBookingEmail({
      bookingId: booking.id,
      toolName: tool.name,
      pocName: tool.pocName,
      pocEmail: tool.pocEmail,
      requesterName: data.requesterName,
      requesterEmail: data.requesterEmail,
      preferredDate: dateLabel,
      preferredTime: data.preferredTime,
      durationMinutes: data.durationMinutes,
      subject: data.subject,
      message: data.message,
    });

    return NextResponse.json({
      id: booking.id,
      message: "Training request sent to POC",
    });
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
