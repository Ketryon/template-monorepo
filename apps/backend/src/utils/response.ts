import { Response } from "express";

export function sendSuccess<T>(res: Response, data: T, status = 200): void {
  res.status(status).json(data);
}

export function sendError(res: Response, message: string, status = 500): void {
  res.status(status).json({ message });
}

export function asyncHandler<T>(
  fn: (req: T, res: Response) => Promise<void>
): (req: T, res: Response) => void {
  return (req: T, res: Response) => {
    Promise.resolve(fn(req, res)).catch((err) => {
      console.error("Route error:", err);
      sendError(
        res,
        err instanceof Error ? err.message : "Internal server error",
        500
      );
    });
  };
}
