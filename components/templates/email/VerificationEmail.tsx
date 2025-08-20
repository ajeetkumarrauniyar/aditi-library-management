import Image from "next/image";
import * as React from "react";

export type VerificationType = "tenant_registration" | "user_registration";

interface VerificationEmailProps {
  firstName: string;
  verificationCode: string;
  verificationType: VerificationType;
  tenantName?: string;
  tenantLogo?: string;
  expirationTime?: number; // in minutes
  platformName?: string; // For tenant registration, this would be "ITMS Library Platform"
}

export const VerificationEmail: React.FC<Readonly<VerificationEmailProps>> = ({
  firstName,
  verificationCode,
  verificationType,
  tenantName = "Aditi Library",
  tenantLogo,
  expirationTime = 15,
  platformName = "ITMS Library Platform",
}) => {
  // Dynamic content based on verification type
  const isTenantRegistration = verificationType === "tenant_registration";
  const brandName = isTenantRegistration ? platformName : tenantName;
  const logoSrc = isTenantRegistration ? "/logo.png" : tenantLogo; // Platform logo vs tenant logo

  const getWelcomeMessage = () => {
    if (isTenantRegistration) {
      return (
        <>
          Welcome to <strong>{platformName}</strong>! Thank you for choosing our platform to create
          your library management system. To complete your organization registration and start
          building your library community, please verify your email address using the verification
          code below.
        </>
      );
    }
    return (
      <>
        Thank you for joining <strong>{tenantName}</strong>! To complete your registration and
        secure your account, please verify your email address using the verification code below.
      </>
    );
  };

  const getInstructions = () => {
    if (isTenantRegistration) {
      return (
        <>
          <li>Copy the verification code above</li>
          <li>Return to the organization setup page</li>
          <li>Paste the code in the verification field</li>
          <li>Click &quot;Verify Email&quot; to complete your organization setup</li>
        </>
      );
    }
    return (
      <>
        <li>Copy the verification code above</li>
        <li>Return to the verification page</li>
        <li>Paste the code in the verification field</li>
        <li>Click &quot;Verify Email&quot; to complete the process</li>
      </>
    );
  };

  const getFooterMessage = () => {
    if (isTenantRegistration) {
      return `If you didn&apos;t sign up to create a library organization on ${platformName}, please ignore this email. This verification code will expire automatically.`;
    }
    return `If you didn&apos;t create an account with ${tenantName}, please ignore this email. This verification code will expire automatically.`;
  };

  const getNextSteps = () => {
    if (isTenantRegistration) {
      return (
        <div
          style={{
            backgroundColor: "#ecfdf5",
            border: "1px solid #10b981",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "32px",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#047857",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            🚀 What happens after verification:
          </h3>
          <ul
            style={{
              fontSize: "14px",
              color: "#047857",
              marginLeft: "20px",
              lineHeight: "1.5",
            }}
          >
            <li>Complete your organization profile setup</li>
            <li>Customize your library&apos;s branding and settings</li>
            <li>Create your first admin account</li>
            <li>Start managing your library operations</li>
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        lineHeight: "1.6",
        color: "#333333",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: isTenantRegistration ? "#7c3aed" : "#1e40af",
          padding: "30px 40px",
          textAlign: "center" as const,
          borderRadius: "8px 8px 0 0",
        }}
      >
        {logoSrc && (
          <Image
            src={logoSrc}
            alt={`${brandName} Logo`}
            style={{
              height: "50px",
              marginBottom: "20px",
            }}
          />
        )}
        <h1
          style={{
            color: "#ffffff",
            fontSize: "28px",
            fontWeight: "700",
            margin: "0",
            letterSpacing: "-0.5px",
          }}
        >
          {brandName}
        </h1>
        <p
          style={{
            color: isTenantRegistration ? "#ddd6fe" : "#bfdbfe",
            fontSize: "16px",
            margin: "8px 0 0 0",
          }}
        >
          {isTenantRegistration
            ? "Organization Registration Verification"
            : "Email Verification Required"}
        </p>
      </div>

      {/* Content */}
      <div
        style={{
          padding: "40px",
          backgroundColor: "#ffffff",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: "20px",
            lineHeight: "1.3",
          }}
        >
          Hello {firstName}! 👋
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: "#4b5563",
            marginBottom: "24px",
            lineHeight: "1.6",
          }}
        >
          {getWelcomeMessage()}
        </p>

        {/* Verification Code Box */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            border: "2px solid #e2e8f0",
            borderRadius: "12px",
            padding: "32px",
            textAlign: "center" as const,
            marginBottom: "32px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: "#64748b",
              marginBottom: "12px",
              textTransform: "uppercase" as const,
              letterSpacing: "0.5px",
              fontWeight: "600",
            }}
          >
            Your Verification Code
          </p>
          <div
            style={{
              fontSize: "36px",
              fontWeight: "700",
              color: isTenantRegistration ? "#7c3aed" : "#1e40af",
              letterSpacing: "8px",
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              marginBottom: "12px",
            }}
          >
            {verificationCode}
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "#9ca3af",
              margin: "0",
            }}
          >
            This code will expire in {expirationTime} minutes
          </p>
        </div>

        {/* Next Steps (for tenant registration only) */}
        {getNextSteps()}

        {/* Instructions */}
        <div
          style={{
            backgroundColor: "#fef3c7",
            border: "1px solid #fbbf24",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "32px",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#92400e",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            🔐 How to verify your email:
          </h3>
          <ol
            style={{
              fontSize: "14px",
              color: "#92400e",
              marginLeft: "20px",
              lineHeight: "1.5",
            }}
          >
            {getInstructions()}
          </ol>
        </div>

        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
            marginBottom: "24px",
            lineHeight: "1.6",
          }}
        >
          {getFooterMessage()}
        </p>

        {/* Security Notice */}
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "32px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "#991b1b",
              margin: "0",
              lineHeight: "1.5",
            }}
          >
            <strong>Security Notice:</strong> Never share this verification code with anyone.{" "}
            {brandName} will never ask for your verification code via phone, email, or any other
            method.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          padding: "32px 40px",
          textAlign: "center" as const,
          borderTop: "1px solid #e2e8f0",
          borderRadius: "0 0 8px 8px",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color: "#64748b",
            marginBottom: "16px",
          }}
        >
          Need help? Contact our support team
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            flexWrap: "wrap" as const,
          }}
        >
          <a
            href={`mailto:support@${brandName.toLowerCase().replace(/\s+/g, "-")}.com`}
            style={{
              color: isTenantRegistration ? "#7c3aed" : "#1e40af",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            📧 Email Support
          </a>
          <a
            href="#"
            style={{
              color: isTenantRegistration ? "#7c3aed" : "#1e40af",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            📚 Help Center
          </a>
        </div>
        <div
          style={{
            marginTop: "24px",
            paddingTop: "24px",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "#9ca3af",
              margin: "0",
            }}
          >
            © 2024 {brandName}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationEmail;
