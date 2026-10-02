import { Router, Response } from "express";
import { getDb, db } from "../db/index.js";
import { weddings } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";
import crypto from "node:crypto";

export const weddingsRouter = Router();

// In-memory store fallback for initial prototyping without active database connection
const inMemoryWeddings: any[] = [];

// List user's weddings
weddingsRouter.get("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || "demo-user";

  if (!db) {
    return res.json(inMemoryWeddings.filter((w) => w.userId === userId));
  }

  try {
    const userWeddings = await getDb()
      .select()
      .from(weddings)
      .where(eq(weddings.userId, userId));
    return res.json(userWeddings);
  } catch (err) {
    console.error("Error fetching weddings:", err);
    return res.status(500).json({ error: "Failed to fetch weddings" });
  }
});

// Create wedding
weddingsRouter.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || "demo-user";
  const {
    slug,
    brideName,
    groomName,
    weddingDate,
    weddingTime,
    coverImage,
    description,
  } = req.body;

  if (!slug || !brideName || !groomName || !weddingDate) {
    return res.status(400).json({
      error: "Missing required fields: slug, brideName, groomName, weddingDate",
    });
  }

  const newWedding = {
    id: crypto.randomUUID(),
    userId,
    slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    brideName,
    groomName,
    weddingDate,
    weddingTime: weddingTime || "",
    coverImage: coverImage || "",
    description: description || "",
    status: "draft",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (!db) {
    inMemoryWeddings.push(newWedding);
    return res.status(201).json(newWedding);
  }

  try {
    const [created] = await getDb().insert(weddings).values(newWedding).returning();
    return res.status(201).json(created);
  } catch (err: any) {
    console.error("Error creating wedding:", err);
    if (err.code === "23505") {
      return res.status(409).json({ error: "Slug already exists. Please pick a unique slug." });
    }
    return res.status(500).json({ error: "Failed to create wedding" });
  }
});

// Get single wedding
weddingsRouter.get("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || "demo-user";
  const id = String(req.params.id);

  if (!db) {
    const found = inMemoryWeddings.find((w) => w.id === id && w.userId === userId);
    if (!found) return res.status(404).json({ error: "Wedding not found" });
    return res.json(found);
  }

  try {
    const [found] = await getDb()
      .select()
      .from(weddings)
      .where(and(eq(weddings.id, id), eq(weddings.userId, userId)))
      .limit(1);

    if (!found) {
      return res.status(404).json({ error: "Wedding not found or access denied" });
    }
    return res.json(found);
  } catch (err) {
    console.error("Error fetching wedding:", err);
    return res.status(500).json({ error: "Failed to retrieve wedding" });
  }
});

// Update wedding
weddingsRouter.put("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || "demo-user";
  const id = String(req.params.id);
  const updates = req.body;

  if (!db) {
    const index = inMemoryWeddings.findIndex((w) => w.id === id && w.userId === userId);
    if (index === -1) return res.status(404).json({ error: "Wedding not found" });
    inMemoryWeddings[index] = { ...inMemoryWeddings[index], ...updates, updatedAt: new Date() };
    return res.json(inMemoryWeddings[index]);
  }

  try {
    const [updated] = await getDb()
      .update(weddings)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(weddings.id, id), eq(weddings.userId, userId)))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Wedding not found or access denied" });
    }
    return res.json(updated);
  } catch (err) {
    console.error("Error updating wedding:", err);
    return res.status(500).json({ error: "Failed to update wedding" });
  }
});

// Delete wedding
weddingsRouter.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || "demo-user";
  const id = String(req.params.id);

  if (!db) {
    const index = inMemoryWeddings.findIndex((w) => w.id === id && w.userId === userId);
    if (index === -1) return res.status(404).json({ error: "Wedding not found" });
    inMemoryWeddings.splice(index, 1);
    return res.json({ success: true, message: "Wedding deleted" });
  }

  try {
    const result = await getDb()
      .delete(weddings)
      .where(and(eq(weddings.id, id), eq(weddings.userId, userId)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: "Wedding not found or access denied" });
    }
    return res.json({ success: true, message: "Wedding deleted successfully" });
  } catch (err) {
    console.error("Error deleting wedding:", err);
    return res.status(500).json({ error: "Failed to delete wedding" });
  }
});
