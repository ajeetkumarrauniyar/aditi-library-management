import bcrypt from "bcryptjs";
import { prisma } from "@/lib/database";
import { signJWT } from "@/lib/auth/jwt";
import {
  badRequestError,
  conflictError,
  notFoundError,
  unauthorizedError,
  successResponse,
} from "@/lib/http/apiResponse";
import {
  generateVerificationCode,
  generateVerificationCodeExpiry,
  sendUserRegistrationEmail,
  sendTenantRegistrationEmail,
} from "@/helpers";
import {
  UserRegistrationInput,
  userRegistrationSchema,
  TenantRegistrationInput,
  tenantRegistrationSchema,
  LoginInput,
  loginSchema,
} from "@/schema";

/**
 * Registers a new user for a given tenant (organization).
 * @param body - The registration input data.
 * @returns A success response with user and tenant IDs.
 */
export const registerUser = async (body: UserRegistrationInput) => {
  // Validate input using Zod schema
  const validation = userRegistrationSchema.safeParse(body);
  if (!validation.success) {
    throw new badRequestError(validation.error.errors[0].message);
  }

  const { email, password, firstName, lastName, tenantSlug, phone } = validation.data;

  // Find tenant by slug
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });

  if (!tenant) {
    throw new notFoundError("Organization not found");
  }

  // Check if user already exists by email
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new conflictError("User with this email already exists");
  }

  // Hash password securely
  const hashedPassword = await bcrypt.hash(password, 12);

  // Generate verification code and expiry (15 minutes)
  const verificationCode = generateVerificationCode();
  const verificationExpiry = generateVerificationCodeExpiry(15);

  // Create user in the database
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      phone,
      role: "USER",
      tenantId: tenant.id,
      verifyCode: verificationCode,
      verifyCodeExpiresAt: verificationExpiry,
      permissions: ["READ"],
    },
  });

  // Send verification email to the user
  try {
    await sendUserRegistrationEmail({
      email,
      firstName,
      verificationCode,
      tenantName: tenant.name,
      tenantLogo: tenant.logo || undefined,
    });
  } catch (emailError) {
    // eslint-disable-next-line no-console
    console.error("Failed to send verification email:", emailError);
    // Don't fail the registration if email fails
  }

  // Return success response with user and tenant IDs
  return successResponse({
    message: "Registration successful! Please check your email for verification code.",
    data: {
      userId: user.id,
      tenantId: tenant.id,
    },
  });
};

/**
 * Registers a new tenant (organization) with an admin user.
 * @param body - The tenant registration input data.
 * @returns A success response with tenant and user IDs.
 */
export const registerTenant = async (body: TenantRegistrationInput) => {
  // Validate input using Zod schema
  const validation = tenantRegistrationSchema.safeParse(body);
  if (!validation.success) {
    throw new badRequestError(validation.error.errors[0].message);
  }

  const { name, email, password, firstName, lastName } = validation.data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new conflictError("User with this email already exists");
  }

  // Generate tenant slug from organization name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");

  // Check if tenant slug already exists
  const existingTenant = await prisma.tenant.findUnique({
    where: { slug },
  });

  if (existingTenant) {
    throw new conflictError("Organization with this name already exists");
  }

  // Hash password securely
  const hashedPassword = await bcrypt.hash(password, 12);

  // Generate verification code and expiry (15 minutes)
  const verificationCode = generateVerificationCode();
  const verificationExpiry = generateVerificationCodeExpiry(15);

  // Create tenant and admin user in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create tenant
    const tenant = await tx.tenant.create({
      data: {
        name,
        slug,
        email,
      },
    });

    // Create admin user
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        role: "TENANT_ADMIN",
        isTenantAdmin: true,
        tenantId: tenant.id,
        verifyCode: verificationCode,
        verifyCodeExpiresAt: verificationExpiry,
        permissions: ["READ", "WRITE", "DELETE", "MANAGE_USERS", "MANAGE_SETTINGS"],
      },
    });

    return { tenant, user };
  });

  // Send verification email to the admin user
  try {
    await sendTenantRegistrationEmail({
      email,
      firstName,
      verificationCode,
    });
  } catch (emailError) {
    // eslint-disable-next-line no-console
    console.error("Failed to send verification email:", emailError);
  }

  // Return success response with tenant and user IDs
  return successResponse({
    message: "Organization registered successfully! Please check your email for verification code.",
    data: {
      tenantId: result.tenant.id,
      userId: result.user.id,
      slug: result.tenant.slug,
      email: email,
    },
  });
};

/**
 * Authenticates a user and returns a JWT token.
 * @param body - The login input data.
 * @returns A success response with user data and JWT token.
 */

//TODO: Update this function to login tenant and user
export const loginTenantAndUser = async (body: LoginInput) => {
  // Validate input using Zod schema
  const validation = loginSchema.safeParse(body);
  if (!validation.success) {
    throw new badRequestError(validation.error.errors[0].message);
  }

  const { email, password } = validation.data;

  // Find user by email with tenant information
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  // Check if user exists
  if (!user) {
    throw new unauthorizedError("Invalid email or password");
  }

  // Check if tenant exists
  if (!user.tenant) {
    throw new unauthorizedError("Invalid email or password");
  }

  // Verify password
  if (!user.password) {
    throw new unauthorizedError("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new unauthorizedError("Invalid email or password");
  }

  // Check if user's email is verified
  if (!user.isEmailVerified) {
    throw new unauthorizedError("Please verify your email address before logging in");
  }

  // Check if user account is active
  if (!user.isVerified) {
    throw new unauthorizedError("Your account is not active. Please contact support");
  }

  // Ensure required fields are present for JWT
  if (!user.email || !user.tenantId) {
    throw new unauthorizedError("User data is incomplete. Please contact support");
  }

  // Generate JWT token
  const token = await signJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
    permissions: user.permissions,
    isEmailVerified: user.isEmailVerified,
    isTenantAdmin: user.isTenantAdmin || false,
  });

  // Update last login timestamp
  // await prisma.user.update({
  //   where: { id: user.id },
  //   data: { lastLoginAt: new Date() },
  // });

  // Return success response with user data and token
  return successResponse(
    {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        role: user.role,
        permissions: user.permissions,
        isEmailVerified: user.isEmailVerified,
        isTenantAdmin: user.isTenantAdmin,
        tenant: user.tenant,
      },
      token,
      redirectInfo: {
        role: user.role,
        tenantSlug: user.tenant?.slug,
        shouldRedirect: true,
      },
    },
    "Login successful",
  );
};
