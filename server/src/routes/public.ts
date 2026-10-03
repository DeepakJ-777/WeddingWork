import { Router, Request, Response } from "express";
import { getDb, db } from "../db/index.js";
import { weddings, events, memories, gallery } from "../db/schema.js";
import { eq, asc } from "drizzle-orm";

export const publicRouter = Router();

// Demo wedding data used when testing or before database is seeded
const DEMO_WEDDING = {
  wedding: {
    id: "demo-wedding-1",
    slug: "rahul-ananya",
    brideName: "Ananya",
    groomName: "Rahul",
    weddingDate: "2026-12-23",
    weddingTime: "10:30 AM",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
    description: "Together with their families, Rahul and Ananya invite you to join them in celebrating their wedding day.",
    status: "published",
  },
  events: [
    {
      id: "event-1",
      weddingId: "demo-wedding-1",
      name: "Engagement Ceremony",
      description: "An intimate gathering of family and close friends to exchange rings and celebrate the union.",
      date: "2026-12-18",
      startTime: "12:15 PM",
      endTime: "09:00 PM",
      venue: "St. Mary's Hall",
      address: "Changanassery, Kerala, India",
      mapsUrl: "https://maps.google.com/?q=St+Marys+Hall+Changanassery",
      sortOrder: 1,
    },
    {
      id: "event-2",
      weddingId: "demo-wedding-1",
      name: "Wedding Holy Matrimony",
      description: "Join us as we take our vows and begin our journey of a lifetime together.",
      date: "2026-12-23",
      startTime: "10:30 AM",
      endTime: "01:00 PM",
      venue: "St. Mary's Forane Church",
      address: "Changanassery, Kerala, India",
      mapsUrl: "https://maps.google.com/?q=St+Marys+Forane+Church+Changanassery",
      sortOrder: 2,
    },
    {
      id: "event-3",
      weddingId: "demo-wedding-1",
      name: "Grand Reception",
      description: "An evening of dinner, music, and joyful celebrations with our loved ones.",
      date: "2026-12-23",
      startTime: "06:30 PM",
      endTime: "10:30 PM",
      venue: "Grand Convention Centre",
      address: "Kottayam, Kerala, India",
      mapsUrl: "https://maps.google.com/?q=Grand+Convention+Centre+Kottayam",
      sortOrder: 3,
    },
  ],
  memories: [
    {
      id: "mem-1",
      weddingId: "demo-wedding-1",
      date: "2019",
      title: "The Beginning",
      description: "Our paths crossed for the first time by the Marine Drive sunset. A chance conversation turned into coffee, and neither of us wanted the evening to end.",
      location: "Kochi, Kerala",
      imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
      sortOrder: 1,
    },
    {
      id: "mem-2",
      weddingId: "demo-wedding-1",
      date: "2021",
      title: "A New Chapter",
      description: "Moving cities, chasing shared dreams, late-night cooking experiments, and adopting our little kitten Milo.",
      location: "Bangalore, Karnataka",
      imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
      sortOrder: 2,
    },
    {
      id: "mem-3",
      weddingId: "demo-wedding-1",
      date: "2025",
      title: "The Proposal",
      description: "Surrounded by misty tea hills and the sunrise, Rahul got down on one knee. With happy tears and shaking hands, the easiest 'YES' was said.",
      location: "Munnar, Kerala",
      imageUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
      sortOrder: 3,
    },
    {
      id: "mem-4",
      weddingId: "demo-wedding-1",
      date: "2026",
      title: "Forever Begins",
      description: "Stepping hand-in-hand into the grandest chapter of our lives, with all our favorite people by our side.",
      location: "Changanassery, Kerala",
      imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      sortOrder: 4,
    },
  ],
  gallery: [
    {
      id: "gal-1",
      weddingId: "demo-wedding-1",
      imageUrl: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80",
      caption: "Golden hour in Munnar",
      sortOrder: 1,
    },
    {
      id: "gal-2",
      weddingId: "demo-wedding-1",
      imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
      caption: "Traditional engagement moments",
      sortOrder: 2,
    },
    {
      id: "gal-3",
      weddingId: "demo-wedding-1",
      imageUrl: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80",
      caption: "Laughter and chai dates",
      sortOrder: 3,
    },
    {
      id: "gal-4",
      weddingId: "demo-wedding-1",
      imageUrl: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=800&q=80",
      caption: "A walk through the tea gardens",
      sortOrder: 4,
    },
  ],
};

publicRouter.get("/weddings/:slug", async (req: Request, res: Response) => {
  const slug = String(req.params.slug);

  // If no DB configured or slug is rahul-ananya, fallback cleanly to demo if not found in db
  if (!db) {
    if (slug === "rahul-ananya" || slug === "demo") {
      return res.json(DEMO_WEDDING);
    }
    return res.status(404).json({ error: "Wedding invitation not found" });
  }

  try {
    const database = getDb();
    const [foundWedding] = await database
      .select()
      .from(weddings)
      .where(eq(weddings.slug, slug))
      .limit(1);

    if (!foundWedding) {
      if (slug === "rahul-ananya" || slug === "demo") {
        return res.json(DEMO_WEDDING);
      }
      return res.status(404).json({ error: "Wedding invitation not found" });
    }

    const weddingEvents = await database
      .select()
      .from(events)
      .where(eq(events.weddingId, foundWedding.id))
      .orderBy(asc(events.sortOrder));

    const weddingMemories = await database
      .select()
      .from(memories)
      .where(eq(memories.weddingId, foundWedding.id))
      .orderBy(asc(memories.sortOrder));

    const weddingGallery = await database
      .select()
      .from(gallery)
      .where(eq(gallery.weddingId, foundWedding.id))
      .orderBy(asc(gallery.sortOrder));

    return res.json({
      wedding: foundWedding,
      events: weddingEvents,
      memories: weddingMemories,
      gallery: weddingGallery,
    });
  } catch (error) {
    console.error("Public wedding fetch error:", error);
    if (slug === "rahul-ananya" || slug === "demo") {
      return res.json(DEMO_WEDDING);
    }
    return res.status(500).json({ error: "Internal server error fetching wedding" });
  }
});
