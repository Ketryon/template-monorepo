import { NextFunction, Request, Response } from "express";
import { checkRateLimit, getRateLimitInfo } from "../services/redis";

interface RateLimitOptions {
  limit: number;
  windowSeconds: number;
  keyGenerator?: (req: Request) => string;
  message?: string;
}

export function rateLimit(options: RateLimitOptions) {
  const {
    limit,
    windowSeconds,
    keyGenerator = (req) => getClientIp(req),
    message = "Too many requests, please try again later",
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    const identifier = keyGenerator(req);

    const isAllowed = await checkRateLimit(identifier, limit, windowSeconds);
    const info = await getRateLimitInfo(identifier, limit, windowSeconds);

    res.setHeader("X-RateLimit-Limit", limit.toString());
    res.setHeader("X-RateLimit-Remaining", info.remaining.toString());
    res.setHeader("X-RateLimit-Reset", info.resetIn.toString());
    res.setHeader("X-RateLimit-Window", windowSeconds.toString());

    if (!isAllowed) {
      res.status(429).json({ message, retryAfter: info.resetIn });
      return;
    }

    next();
  };
}

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0];
  return req.ip || req.socket.remoteAddress || "unknown";
}

// Pre-configured limiters
export const standardLimiter = rateLimit({
  limit: 500,
  windowSeconds: 60,
  message: "Too many requests. Please try again in a minute.",
});

export const uploadLimiter = rateLimit({
  limit: 50,
  windowSeconds: 15 * 60,
  message: "Upload limit reached. Please try again later.",
});

export const strictLimiter = rateLimit({
  limit: 30,
  windowSeconds: 60,
  message: "Rate limit exceeded. Please slow down.",
});
