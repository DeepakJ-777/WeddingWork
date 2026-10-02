import express from "express";
import cors from "cors";
import { auth } from "./auth.js";
import { toNodeHandler } from "better-auth/node";
import { publicRouter } from "./routes/public.js";
import { weddingsRouter } from "./routes/weddings.js";
import { eventsRouter } from "./routes/events.js";
import { memoriesRouter } from "./routes/memories.js";
import { galleryRouter } from "./routes/gallery.js";

export const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Better Auth API route handler
app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Wedding Invite API",
    timestamp: new Date().toISOString(),
  });
});

// Mount domain routes
app.use("/api/public", publicRouter);
app.use("/api/weddings", weddingsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/memories", memoriesRouter);
app.use("/api/gallery", galleryRouter);
