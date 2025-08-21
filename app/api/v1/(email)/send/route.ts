import { resend } from "@/lib/server";
import { createElement } from "react";
import VerificationEmail from "@/components/templates/email/VerificationEmail";

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: "ITMS Library <noreply@itms-library.com>",
      to: ["delivered@resend.dev"],
      subject: "Test Verification Email",
      react: createElement(VerificationEmail, {
        firstName: "John",
        verificationCode: "123456",
        verificationType: "user_registration",
        tenantName: "Aditi Library",
        tenantLogo: "https://aditi.com/logo.png",
        platformName: "ITMS Library Platform",
        expirationTime: 15,
      }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
