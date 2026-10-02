import { Router, Response } from "express";
import { getDb, db } from "../db/index.js";
import { memories } from "../db/schema.js";
import { eq, asc } from "drizzle-orm";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";
import crypto from "node:crypto";

export const memoriesRouter = Router();

const inMemoryMemories: any[] = [];

// Get memories for wedding
memoriesRouter.get("/wedding/:weddingId", async (req: AuthenticatedRequest, res: Response) => {
  const weddingId = String(req.params.weddingId);

  if (!db) {
    return res.json(inMemoryMemories.filter((m) => m.weddingId === weddingId));
  }

  try {
    const list = await getDb()
      .select()
      .from(memories)
      .where(eq(memories.weddingId, weddingId))
      .orderBy(asc(memories.sortOrder));
    return res.json(list);
  } catch (err) {
    console.error("Error fetching memories:", err);
    return res.status(500).json({ error: "Failed to fetch memories" });
  }
});

// Create memory
memoriesRouter.post("/wedding/:weddingId", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const weddingId = String(req.params.weddingId);
  const { date, title, description, location, imageUrl, sortOrder } = req.body;

  if (!date || !title) {
    return res.status(400).json({ error: "Date and title are required" });
  }

  const newMemory = {
    id: crypto.randomUUID(),
    weddingId,
    date,
    title,
    description: description || "",
    location: location || "",
    imageUrl: imageUrl || "",
    sortOrder: sortOrder ?? 0,
    createdAt: new Date(),
  };

  if (!db) {
    inMemoryMemories.push(newMemory);
    return res.status(201).json(newMemory);
  }

  try {
    const [created] = await getDb().insert(memories).values(newMemory).returning();
    return res.status(201).json(created);
  } catch (err) {
    console.error("Error creating memory:", err);
    return res.status(500).json({ error: "Failed to create memory" });
  }
});

// Update memory
memoriesRouter.put("/:memoryId", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const memoryId = String(req.params.memoryId);
  const updates = req.body;

  if (!db) {
    const index = inMemoryMemories.findIndex((m) => m.id === memoryId);
    if (index === -1) return res.status(404).json({ error: "Memory not found" });
    inMemoryMemories[index] = { ...inMemoryMemories[index], ...updates };
    return res.json(inMemoryMemories[index]);
  }

  try {
    const [updated] = await getDb()
      .update(memories)
      .set(updates)
      .where(eq(memories.id, memoryId))
      .returning();
    if (!updated) return res.status(404).json({ error: "Memory not found" });
    return res.json(updated);
  } catch (err) {
    console.error("Error updating memory:", err);
    return res.status(500).json({ error: "Failed to update memory" });
  }
});

// Delete memory
memoriesRouter.delete("/:memoryId", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const memoryId = String(req.params.memoryId);

  if (!db) {
    const index = inMemoryMemories.findIndex((m) => m.id === memoryId);
    if (index === -1) return res.status(404).json({ error: "Memory not found" });
    inMemoryMemories.splice(index, 1);
    return res.json({ success: true, message: "Memory deleted" });
  }

  try {
    const result = await getDb().delete(memories).where(eq(memories.id, memoryId)).returning();
    if (result.length === 0) return res.status(404).json({ error: "Memory not found" });
    return res.json({ success: true, message: "Memory deleted successfully" });
  } catch (err) {
    console.error("Error deleting memory:", err);
    return res.status(500).json({ error: "Failed to delete memory" });
  }
});
