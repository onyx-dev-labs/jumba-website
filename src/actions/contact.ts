"use server";

import { z } from "zod";
import nodemailer from "nodemailer";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    message?: string[];
  };
};

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    message: formData.get("message") as string,
  };

  // Validate data
  const validatedFields = contactSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, message } = validatedFields.data;

  try {
    // Configure Transporter
    // In production, use environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // Your email
        pass: process.env.SMTP_PASS, // App password
      },
    });

    // If no credentials, log for dev
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("---------------------------------------------------");
      console.log("⚠️ SMTP Credentials missing. Simulating email send.");
      console.log(`To: bmlugogo21@gmail.com`);
      console.log(`From: ${email} (${name})`);
      console.log(`Subject: New Contact Form Submission from ${name}`);
      console.log(`Message: ${message}`);
      console.log("---------------------------------------------------");
      
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: "Message sent successfully! (Simulation)",
      };
    }

    // Send Email
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`, // Sender address (must be authenticated user usually)
      replyTo: email,
      to: "bmlugogo21@gmail.com",
      subject: `New Contact Form Submission: ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        
        Message:
        ${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return {
      success: true,
      message: "Message sent successfully!",
    };
  } catch (error) {
    console.error("Email send error:", error);
    return {
      success: false,
      message: "Failed to send message. Please try again later.",
    };
  }
}
