import { NextRequest } from "next/server";
import { verifyJWT, CustomJWTPayload } from "./jwt";
import { unauthorizedError } from "../http/apiResponse";

export async function getAuthUser(request: NextRequest): Promise<CustomJWTPayload> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new unauthorizedError("Authorization token required");
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix

  try {
    const payload = await verifyJWT(token);
    return payload;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("JWT verification failed:", error);
    throw new unauthorizedError("Invalid or expired token");
  }
}

export function requireAuth(
  handler: (request: NextRequest, user: CustomJWTPayload) => Promise<Response>,
) {
  return async (request: NextRequest) => {
    const user = await getAuthUser(request);
    return handler(request, user);
  };
}

export function requirePermission(permission: string) {
  return (handler: (request: NextRequest, user: CustomJWTPayload) => Promise<Response>) => {
    return async (request: NextRequest) => {
      const user = await getAuthUser(request);

      if (!user.permissions || !user.permissions.includes(permission)) {
        throw new unauthorizedError(`Permission '${permission}' required`);
      }

      return handler(request, user);
    };
  };
}

export function requireRole(role: string) {
  return (handler: (request: NextRequest, user: CustomJWTPayload) => Promise<Response>) => {
    return async (request: NextRequest) => {
      const user = await getAuthUser(request);

      if (user.role !== role) {
        throw new unauthorizedError(`Role '${role}' required`);
      }

      return handler(request, user);
    };
  };
}
