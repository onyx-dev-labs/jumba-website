import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // In a real app, you would use Resend, SendGrid, or Nodemailer here.
  // For now, we simulate a successful response.
  
  const body = await request.json();
  
  console.log("New Contact Form Submission:", body);

  return NextResponse.json({ success: true, message: "Email sent successfully" });
}