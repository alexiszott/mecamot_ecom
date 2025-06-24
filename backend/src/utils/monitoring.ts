import { log } from "./logger.js";

export const monitorPerformance = (req: any, res: any, next: any) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const duration = Number(process.hrtime.bigint() - start) / 1000000; // ms

    if (duration > 1000) {
      log.warn("Requête lente détectée", {
        method: req.method,
        path: req.path,
        duration: `${duration.toFixed(2)}ms`,
        userId: req.session?.userId,
      });
    }
  });

  next();
};
