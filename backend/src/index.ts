import "dotenv/config";
import { buildApp } from "./app.js";
import { config } from "./config.js";

const app = await buildApp();

const closeSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
for (const signal of closeSignals) {
  process.on(signal, async () => {
    app.log.info(`Received ${signal}, shutting down.`);
    await app.close();
    process.exit(0);
  });
}

try {
  await app.listen({ port: config.PORT, host: "0.0.0.0" });
  app.log.info(`API running on port ${config.PORT}`);
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
