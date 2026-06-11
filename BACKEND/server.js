import { connectDB, disconnectDB } from "./src/config/db";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const port = process.env.PORT;

const app = express();

connectDB();

const server = app.listen(port || 5001, "0.0.0.0", () => {
  logger.info(`Server running on PORT ${port}`);
});

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  logger.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
