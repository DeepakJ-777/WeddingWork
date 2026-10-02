import { Router, Response } from "express";
import { getDb, db } from "../db/index.js";
import { gallery } from "../db/schema.js";
import { eq, asc } from "drizzle-orm";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";
import crypto from "node:crypto";

export const galleryRouter = Router();

const inMemoryGallery: any[] = [];

// Get gallery images for wedding
galleryRouter.get("/wedding/:weddingId", async (req: AuthenticatedRequest, res: Response) => {
  const weddingId = String(req.params.weddingId);

  if (!db) {
    return res.json(inMemoryGallery.filter((g) => g.weddingId === weddingId));
  }

  try {
    const list = await getDb()
      .select()
      .from(gallery)
      .where(eq(gallery.weddingId, weddingId))
      .orderBy(asc(gallery.sortOrder));
    return res.json(list);
  } catch (err) {
    console.error("Error fetching gallery:", err);
    return res.status(500).json({ error: "Failed to fetch gallery items" });
  }
});

// Add image to gallery
galleryRouter.post("/wedding/:weddingId", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const weddingId = String(req.params.weddingId);
  const { imageUrl, caption, sortOrder } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: "imageUrl is required" });
  }

  const newImage = {
    id: crypto.randomUUID(),
    weddingId,
    imageUrl,
    caption: caption || "",
    sortOrder: sortOrder ?? 0,
    createdAt: new Date(),
  };

  if (!db) {
    inMemoryGallery.push(newImage);
    return res.status(201).json(newImage);
  }

  try {
    const [created] = await getDb().insert(gallery).values(newImage).returning();
    return res.status(201).json(created);
  } catch (err) {
    console.error("Error adding gallery image:", err);
    return res.status(500).json({ error: "Failed to add image" });
  }
});

// Delete image from gallery
galleryRouter.delete("/:imageId", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const imageId = String(req.params.imageId);

  if (!db) {
    const index = inMemoryGallery.findIndex((g) => g.id === imageId);
    if (index === -1) return res.status(404).json({ error: "Image not found" });
    inMemoryGallery.splice(index, 1);
    return res.json({ success: true, message: "Image removed" });
  }

  try {
    const result = await getDb().delete(gallery).where(eq(gallery.id, imageId)).returning();
    if (result.length === 0) return res.status(404).json({ error: "Image not found" });
    return res.json({ success: true, message: "Image removed from gallery" });
  } catch (err) {
    console.error("Error removing gallery item:", err);
    return res.status(500).json({ error: "Failed to delete image" });
  }
});
