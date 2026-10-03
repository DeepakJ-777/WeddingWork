import { Router, Response } from "express";
import { getDb, db } from "../db/index.js";
import { events, rsvps } from "../db/schema.js";
import { eq, asc, desc } from "drizzle-orm";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";
import crypto from "node:crypto";

export const eventsRouter = Router();

const inMemoryEvents: any[] = [];

// Get events for wedding
eventsRouter.get("/wedding/:weddingId", async (req: AuthenticatedRequest, res: Response) => {
  const weddingId = String(req.params.weddingId);

  if (!db) {
    return res.json(inMemoryEvents.filter((e) => e.weddingId === weddingId));
  }

  try {
    const list = await getDb()
      .select()
      .from(events)
      .where(eq(events.weddingId, weddingId))
      .orderBy(asc(events.sortOrder));
    return res.json(list);
  } catch (err) {
    console.error("Error fetching events:", err);
    return res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Create event
eventsRouter.post("/wedding/:weddingId", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const weddingId = String(req.params.weddingId);
  const { name, description, date, startTime, endTime, venue, address, mapsUrl, sortOrder } = req.body;

  if (!name || !date) {
    return res.status(400).json({ error: "Event name and date are required" });
  }

  const newEvent = {
    id: crypto.randomUUID(),
    weddingId,
    name,
    description: description || "",
    date,
    startTime: startTime || "",
    endTime: endTime || "",
    venue: venue || "",
    address: address || "",
    mapsUrl: mapsUrl || "",
    sortOrder: sortOrder ?? 0,
    createdAt: new Date(),
  };

  if (!db) {
    inMemoryEvents.push(newEvent);
    return res.status(201).json(newEvent);
  }

  try {
    const [created] = await getDb().insert(events).values(newEvent).returning();
    return res.status(201).json(created);
  } catch (err) {
    console.error("Error creating event:", err);
    return res.status(500).json({ error: "Failed to create event" });
  }
});

// Update event
eventsRouter.put("/:eventId", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const eventId = String(req.params.eventId);
  const updates = req.body;

  if (!db) {
    const index = inMemoryEvents.findIndex((e) => e.id === eventId);
    if (index === -1) return res.status(404).json({ error: "Event not found" });
    inMemoryEvents[index] = { ...inMemoryEvents[index], ...updates };
    return res.json(inMemoryEvents[index]);
  }

  try {
    const [updated] = await getDb()
      .update(events)
      .set(updates)
      .where(eq(events.id, eventId))
      .returning();
    if (!updated) return res.status(404).json({ error: "Event not found" });
    return res.json(updated);
  } catch (err) {
    console.error("Error updating event:", err);
    return res.status(500).json({ error: "Failed to update event" });
  }
});

// Delete event
eventsRouter.delete("/:eventId", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const eventId = String(req.params.eventId);

  if (!db) {
    const index = inMemoryEvents.findIndex((e) => e.id === eventId);
    if (index === -1) return res.status(404).json({ error: "Event not found" });
    inMemoryEvents.splice(index, 1);
    return res.json({ success: true, message: "Event deleted" });
  }

  try {
    const result = await getDb().delete(events).where(eq(events.id, eventId)).returning();
    if (result.length === 0) return res.status(404).json({ error: "Event not found" });
    return res.json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    return res.status(500).json({ error: "Failed to delete event" });
  }
});

// ── RSVP ENDPOINTS ────────────────────────────────────────────
const inMemoryRsvps: any[] = [];

// Submit RSVP (Public guest endpoint)
eventsRouter.post("/rsvp", async (req, res: Response) => {
  const { name, attendance, add_guest, addGuests, notes } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Guest name is required" });
  }

  const attendanceStatus = attendance === "no" ? "no" : "yes";
  const guestCount = attendanceStatus === "yes" ? Number(addGuests ?? add_guest ?? 0) : 0;

  const newRsvp = {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    attendance: attendanceStatus,
    addGuests: isNaN(guestCount) || guestCount < 0 ? 0 : guestCount,
    notes: notes ? String(notes).trim() : null,
    createdAt: new Date(),
  };

  if (!db) {
    inMemoryRsvps.unshift(newRsvp);
    return res.status(201).json({ success: true, rsvp: newRsvp });
  }

  try {
    const [created] = await getDb().insert(rsvps).values(newRsvp).returning();
    return res.status(201).json({ success: true, rsvp: created });
  } catch (err) {
    console.error("Database insert error for RSVP, falling back to memory:", err);
    inMemoryRsvps.unshift(newRsvp);
    return res.status(201).json({ success: true, rsvp: newRsvp });
  }
});

// Get all RSVPs and summary stats (Admin view)
eventsRouter.get("/rsvps", async (_req, res: Response) => {
  try {
    let list: any[] = [];

    if (!db) {
      list = [...inMemoryRsvps];
    } else {
      try {
        list = await getDb().select().from(rsvps).orderBy(desc(rsvps.createdAt));
      } catch (dbErr) {
        console.warn("DB query for RSVPs failed, returning memory list:", dbErr);
        list = [...inMemoryRsvps];
      }
    }

    const attendingList = list.filter((r) => r.attendance === "yes");
    const declinedList = list.filter((r) => r.attendance === "no");

    const attendingCount = attendingList.length;
    const additionalGuestsCount = attendingList.reduce((acc, curr) => acc + (Number(curr.addGuests) || 0), 0);
    const totalHeadcount = attendingCount + additionalGuestsCount;
    const declinedCount = declinedList.length;
    const totalResponses = list.length;

    return res.json({
      summary: {
        totalResponses,
        attendingCount,
        additionalGuestsCount,
        totalHeadcount,
        declinedCount,
      },
      rsvps: list,
    });
  } catch (err: any) {
    console.error("Error fetching RSVPs:", err);
    return res.status(500).json({ error: "Failed to fetch RSVPs" });
  }
});

// Delete an RSVP entry (Admin management)
eventsRouter.delete("/rsvps/:id", async (req, res: Response) => {
  const id = String(req.params.id);

  const memIdx = inMemoryRsvps.findIndex((r) => r.id === id);
  if (memIdx !== -1) {
    inMemoryRsvps.splice(memIdx, 1);
  }

  if (db) {
    try {
      await getDb().delete(rsvps).where(eq(rsvps.id, id));
    } catch (err) {
      console.error("Error deleting RSVP from DB:", err);
    }
  }

  return res.json({ success: true, message: "RSVP removed" });
});

