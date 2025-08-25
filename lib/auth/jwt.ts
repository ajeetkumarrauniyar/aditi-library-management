import { SignJWT, jwtVerify, JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

export interface CustomJWTPayload extends JWTPayload {
  userId: string;
  email: string;
  role: string;
  tenantId: string;
  permissions: string[];
  isEmailVerified: boolean;
  isTenantAdmin?: boolean;
}

export async function signJWT(payload: CustomJWTPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token expires in 7 days
    .sign(secret);
}

export async function verifyJWT(token: string): Promise<CustomJWTPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload as unknown as CustomJWTPayload;
}
