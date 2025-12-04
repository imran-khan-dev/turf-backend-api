import { prisma } from "./db";
/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";
import { envVars } from "./app/config/env";

import { seedAdmin } from "./app/utils/seedAdmin";

let server: Server;

async function connectDB() {
  try {
    await prisma.$connect();
    console.log("DB connect successfully!");
  } catch (error) {
    console.log("DB connection fail!");
    console.log(error);
    process.exit(1);
  }
}

const startServer = async () => {
  try {
    connectDB();
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening to port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
  await seedAdmin();
})();

// Server error handling
process.on("SIGTERM", () => {
  console.log("SIGTERM Signal Detected! Server Shutting Down...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection Detected! Server Shutting Down...", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("Unhandled Exception Detected! Server Shutting Down...", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
export { prisma };
