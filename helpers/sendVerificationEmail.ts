import { resend } from "@/lib/services";
import { shouldLogOTPToConsole } from "@/lib/core/utils";

export type VerificationType = "tenant_registration" | "user_registration";

interface SendVerificationEmailParams {
  email: string;
  firstName: string;
  verificationCode: string;
  verificationType: VerificationType;
  tenantName?: string;
  tenantLogo?: string;
  expirationTime?: number; // in minutes
  platformName?: string; // For tenant registration
}

// Simple HTML email template function
function createEmailTemplate({
  firstName,
  verificationCode,
  verificationType,
  tenantName = "Aditi Library",
  tenantLogo,
  expirationTime = 15,
  platformName = "ITMS Library Platform",
}: {
  firstName: string;
  verificationCode: string;
  verificationType: VerificationType;
  tenantName?: string;
  tenantLogo?: string;
  expirationTime?: number;
  platformName?: string;
}) {
  const isTenantRegistration = verificationType === "tenant_registration";
  const brandName = isTenantRegistration ? platformName : tenantName;

  const welcomeMessage = isTenantRegistration
    ? `Welcome to <strong>${platformName}</strong>! Thank you for choosing our platform to create your library management system. To complete your organization registration and start building your library community, please verify your email address using the verification code below.`
    : `Thank you for joining <strong>${tenantName}</strong>! To complete your registration and secure your account, please verify your email address using the verification code below.`;

  const instructions = isTenantRegistration
    ? `<li>Copy the verification code above</li>
       <li>Return to the organization setup page</li>
       <li>Paste the code in the verification field</li>
       <li>Click "Verify Email" to complete your organization setup</li>`
    : `<li>Copy the verification code above</li>
       <li>Return to the verification page</li>
       <li>Paste the code in the verification field</li>
       <li>Click "Verify Email" to complete the process</li>`;

  const footerMessage = isTenantRegistration
    ? `If you didn't sign up to create a library organization on ${platformName}, please ignore this email. This verification code will expire automatically.`
    : `If you didn't create an account with ${tenantName}, please ignore this email. This verification code will expire automatically.`;

  const nextSteps = isTenantRegistration
    ? `
    <div style="background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
      <h3 style="font-size: 16px; font-weight: 600; color: #047857; margin-bottom: 8px;">
        🚀 What happens after verification:
      </h3>
      <ul style="font-size: 14px; color: #047857; margin-left: 20px; line-height: 1.5;">
        <li>Complete your organization profile setup</li>
        <li>Customize your library's branding and settings</li>
        <li>Create your first admin account</li>
        <li>Start managing your library operations</li>
      </ul>
    </div>
  `
    : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification - ${brandName}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        
        <!-- Header -->
        <div style="background-color: ${isTenantRegistration ? "#7c3aed" : "#1e40af"}; padding: 30px 40px; text-align: center; border-radius: 8px 8px 0 0;">
          ${tenantLogo ? `<img src="${tenantLogo}" alt="${brandName} Logo" style="height: 50px; margin-bottom: 20px; display: block; margin: 0 auto 20px auto;">` : ""}
          <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">
            ${brandName}
          </h1>
          <p style="color: ${isTenantRegistration ? "#ddd6fe" : "#bfdbfe"}; font-size: 16px; margin: 8px 0 0 0;">
            ${isTenantRegistration ? "Organization Registration Verification" : "Email Verification Required"}
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 40px; background-color: #ffffff;">
          <h2 style="font-size: 24px; font-weight: 600; color: #1f2937; margin-bottom: 20px; line-height: 1.3;">
            Hello ${firstName}! 👋
          </h2>

          <p style="font-size: 16px; color: #4b5563; margin-bottom: 24px; line-height: 1.6;">
            ${welcomeMessage}
          </p>

          <!-- Verification Code Box -->
          <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 32px; text-align: center; margin-bottom: 32px;">
            <p style="font-size: 14px; color: #64748b; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
              Your Verification Code
            </p>
            <div style="font-size: 36px; font-weight: 700; color: ${isTenantRegistration ? "#7c3aed" : "#1e40af"}; letter-spacing: 8px; font-family: Monaco, Consolas, 'Courier New', monospace; margin-bottom: 12px;">
              ${verificationCode}
            </div>
            <p style="font-size: 13px; color: #9ca3af; margin: 0;">
              This code will expire in ${expirationTime} minutes
            </p>
          </div>

          <!-- Next Steps (for tenant registration only) -->
          ${nextSteps}

          <!-- Instructions -->
          <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
            <h3 style="font-size: 16px; font-weight: 600; color: #92400e; margin-bottom: 8px;">
              🔐 How to verify your email:
            </h3>
            <ol style="font-size: 14px; color: #92400e; margin-left: 20px; line-height: 1.5;">
              ${instructions}
            </ol>
          </div>

          <p style="font-size: 14px; color: #6b7280; margin-bottom: 24px; line-height: 1.6;">
            ${footerMessage}
          </p>

          <!-- Security Notice -->
          <div style="background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 16px; margin-bottom: 32px;">
            <p style="font-size: 13px; color: #991b1b; margin: 0; line-height: 1.5;">
              <strong>Security Notice:</strong> Never share this verification code with anyone. 
              ${brandName} will never ask for your verification code via phone, email, or any other method.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
          <p style="font-size: 14px; color: #64748b; margin-bottom: 16px;">
            Need help? Contact our support team
          </p>
          <div style="margin-bottom: 24px;">
            <a href="mailto:support@${brandName.toLowerCase().replace(/\s+/g, "-")}.com" style="color: ${isTenantRegistration ? "#7c3aed" : "#1e40af"}; text-decoration: none; font-size: 14px; font-weight: 500; margin-right: 24px;">
              📧 Email Support
            </a>
            <a href="#" style="color: ${isTenantRegistration ? "#7c3aed" : "#1e40af"}; text-decoration: none; font-size: 14px; font-weight: 500;">
              📚 Help Center
            </a>
          </div>
          <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              © 2024 ${brandName}. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </body>
    </html>
  `;
}

export async function sendVerificationEmail({
  email,
  firstName,
  verificationCode,
  verificationType,
  tenantName = "Aditi Library",
  tenantLogo,
  expirationTime = 15,
  platformName = "ITMS Library Platform",
}: SendVerificationEmailParams) {
  try {
    const isTenantRegistration = verificationType === "tenant_registration";
    const subject = isTenantRegistration
      ? `Verify your email - Complete your ${platformName} tenant setup`
      : `Verify your email - ${tenantName}`;

    // Check if we should log OTP to console instead of sending email
    const shouldLogOTP = shouldLogOTPToConsole();

    if (shouldLogOTP) {
      // Log OTP to console in development mode
      // eslint-disable-next-line no-console
      console.log("\n" + "=".repeat(60));
      // eslint-disable-next-line no-console
      console.log("🔐 DEVELOPMENT MODE - OTP VERIFICATION CODE");
      // eslint-disable-next-line no-console
      console.log("=".repeat(60));
      // eslint-disable-next-line no-console
      console.log(`📧 Email: ${email}`);
      // eslint-disable-next-line no-console
      console.log(`👤 Name: ${firstName}`);
      // eslint-disable-next-line no-console
      console.log(`🏢 Type: ${verificationType}`);
      // eslint-disable-next-line no-console
      console.log(`🔑 OTP CODE: ${verificationCode}`);
      // eslint-disable-next-line no-console
      console.log(`⏰ Expires in: ${expirationTime} minutes`);
      // eslint-disable-next-line no-console
      console.log("=".repeat(60) + "\n");

      return { success: true, data: { message: "OTP logged to console" } };
    }

    // Use Resend's default sender for development/testing
    const senderEmail =
      process.env.RESEND_FROM_EMAIL || "ITMS Library Management <onboarding@resend.dev>";

    // For development, use test email. In production, use the actual user email
    const isDevelopment = process.env.NODE_ENV !== "production";
    const recipientEmail = isDevelopment ? "rauniyarajeet5487@gmail.com" : email;

    // Generate HTML email template
    const htmlContent = createEmailTemplate({
      firstName,
      verificationCode,
      verificationType,
      tenantName,
      tenantLogo,
      expirationTime,
      platformName,
    });

    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(`📧 Sending email to: ${recipientEmail} (DEV MODE)`);
    }

    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: [recipientEmail],
      subject,
      html: htmlContent,
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error sending verification email:", error);
      // Handle case where error.message might be undefined
      const errorMessage = error.message || JSON.stringify(error) || "Unknown error";
      throw new Error(`Failed to send verification email: ${errorMessage}`);
    }

    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.log("Verification email sent successfully:", data);
    }
    return { success: true, data };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in sendVerificationEmail:", error);
    throw error;
  }
}

// Convenience functions for specific use cases
export async function sendTenantRegistrationEmail({
  email,
  firstName,
  verificationCode,
  expirationTime = 15,
  platformName = "ITMS Library Platform",
}: {
  email: string;
  firstName: string;
  verificationCode: string;
  expirationTime?: number;
  platformName?: string;
}) {
  return sendVerificationEmail({
    email,
    firstName,
    verificationCode,
    verificationType: "tenant_registration",
    expirationTime,
    platformName,
  });
}

export async function sendUserRegistrationEmail({
  email,
  firstName,
  verificationCode,
  tenantName,
  tenantLogo,
  expirationTime = 15,
}: {
  email: string;
  firstName: string;
  verificationCode: string;
  tenantName: string;
  tenantLogo?: string;
  expirationTime?: number;
}) {
  return sendVerificationEmail({
    email,
    firstName,
    verificationCode,
    verificationType: "user_registration",
    tenantName,
    tenantLogo,
    expirationTime,
  });
}
