import { successResponse } from "@/lib/http/apiResponse";
import { prisma } from "@/lib/database";

interface HealthStatus {
  status: "healthy" | "unhealthy";
  timestamp: string;
  uptime: number;
  database: {
    status: "connected" | "disconnected";
    responseTime?: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  environment: string;
  version: string;
}

export async function healthCheck() {
  // Check database connection
  let dbStatus: "connected" | "disconnected" = "disconnected";
  let dbResponseTime: number | undefined;

  try {
    const dbStartTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbResponseTime = Date.now() - dbStartTime;
    dbStatus = "connected";
  } catch (error) {
    console.error("Database health check failed:", error);
  }

  // Get memory usage
  const memUsage = process.memoryUsage();
  const memoryInfo = {
    used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
    total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
    percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
  };

  // Determine overall status
  const overallStatus: "healthy" | "unhealthy" = dbStatus === "connected" ? "healthy" : "unhealthy";

  const healthData: HealthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStatus,
      responseTime: dbResponseTime,
    },
    memory: memoryInfo,
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
  };

  const statusCode = overallStatus === "healthy" ? 200 : 503;

  return successResponse(
    healthData,
    overallStatus === "healthy" ? "Service is healthy" : "Service is unhealthy",
    statusCode,
  );
}
