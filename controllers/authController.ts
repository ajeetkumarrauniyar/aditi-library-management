import bcrypt from "bcryptjs";
import { prisma } from "@/lib";
import { BadRequestError, ConflictError, NotFoundError, successResponse } from "@/lib/apiResponse";
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
    throw new BadRequestError(validation.error.errors[0].message);
  }

  const { email, password, firstName, lastName, tenantSlug, phone } = validation.data;

  // Find tenant by slug
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });

  if (!tenant) {
    throw new NotFoundError("Organization not found");
  }

  // Check if user already exists by email
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictError("User with this email already exists");
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
    throw new BadRequestError(validation.error.errors[0].message);
  }

  const { name, email, password, firstName, lastName } = validation.data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictError("User with this email already exists");
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
    throw new ConflictError("Organization with this name already exists");
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
    console.error("Failed to send verification email:", emailError);
    // Don't fail the registration if email fails
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
