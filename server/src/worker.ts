import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { rsvps } from "./db/schema.js";
import { desc, eq } from "drizzle-orm";

// Strip params unsupported by the neon HTTP driver (e.g. channel_binding)
function sanitizeDbUrl(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.delete("channel_binding");
    return u.toString();
  } catch {
    return url;
  }
}

// In-memory state cache for worker runtime
const inMemoryRsvps: any[] = [];

// Cloudflare Workers fetch handler
export default {
  async fetch(request: Request, env: any, _ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // ── 1. API ROUTES ──────────────────────────────────────────
    if (url.pathname.startsWith("/api/")) {
      const corsHeaders = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      };

      // Health Check
      if (url.pathname === "/api/health") {
        return new Response(
          JSON.stringify({
            status: "ok",
            service: "Wedding Invite API",
            timestamp: new Date().toISOString(),
          }),
          { headers: corsHeaders }
        );
      }

      // Submit RSVP (POST /api/guest/submit)
      if (url.pathname === "/api/guest/submit" && request.method === "POST") {
        try {
          const body: any = await request.json();
          const name = String(body.name || "").trim();

          if (!name) {
            return new Response(
              JSON.stringify({ error: "Guest name is required" }),
              { status: 400, headers: corsHeaders }
            );
          }

          const attendanceStatus = body.attendance === "no" ? "no" : "yes";
          const guestCount = attendanceStatus === "yes" ? Number(body.addGuests ?? body.add_guest ?? 0) : 0;

          const newRsvp = {
            id: crypto.randomUUID(),
            name,
            attendance: attendanceStatus,
            addGuests: isNaN(guestCount) || guestCount < 0 ? 0 : guestCount,
            notes: body.notes ? String(body.notes).trim() : null,
            createdAt: new Date().toISOString(),
          };

          // Try saving to Neon PostgreSQL if DATABASE_URL is configured
          const dbUrl = env?.DATABASE_URL || process.env.DATABASE_URL;
          if (dbUrl) {
            try {
              const sql = neon(sanitizeDbUrl(dbUrl));
              const db = drizzle(sql);
              await db.insert(rsvps).values({
                ...newRsvp,
                createdAt: new Date(),
              } as any);
              console.log("Neon DB insert success for:", newRsvp.name);
            } catch (dbErr: any) {
              console.error("Neon DB insert failed:", dbErr?.message || dbErr);
            }
          } else {
            console.warn("No DATABASE_URL configured, RSVP saved to memory only");
          }

          inMemoryRsvps.unshift(newRsvp);

          return new Response(
            JSON.stringify({ success: true, rsvp: newRsvp }),
            { status: 201, headers: corsHeaders }
          );
        } catch (err: any) {
          console.error("Error processing RSVP:", err);
          return new Response(
            JSON.stringify({ error: "Failed to process RSVP", message: err?.message }),
            { status: 500, headers: corsHeaders }
          );
        }
      }

      // Get All RSVPs & Summary Analytics (GET /api/guest/list)
      if (url.pathname === "/api/guest/list" && request.method === "GET") {
        try {
          let list: any[] = [...inMemoryRsvps];

          const dbUrl = env?.DATABASE_URL || process.env.DATABASE_URL;
          if (dbUrl) {
            try {
              const sql = neon(sanitizeDbUrl(dbUrl));
              const db = drizzle(sql);
              const dbList = await db.select().from(rsvps).orderBy(desc(rsvps.createdAt));
              list = dbList.map((item: any) => ({
                ...item,
                createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
              }));
              console.log("Neon DB query returned", list.length, "RSVPs");
            } catch (dbErr: any) {
              console.error("Neon DB query failed:", dbErr?.message || dbErr);
            }
          } else {
            console.warn("No DATABASE_URL, returning in-memory RSVPs:", list.length);
          }

          const attendingList = list.filter((r: any) => r.attendance === "yes");
          const declinedList = list.filter((r: any) => r.attendance === "no");

          const attendingCount = attendingList.length;
          const additionalGuestsCount = attendingList.reduce(
            (acc: number, curr: any) => acc + (Number(curr.addGuests) || 0),
            0
          );
          const totalHeadcount = attendingCount + additionalGuestsCount;
          const declinedCount = declinedList.length;
          const totalResponses = list.length;

          return new Response(
            JSON.stringify({
              summary: {
                totalResponses,
                attendingCount,
                additionalGuestsCount,
                totalHeadcount,
                declinedCount,
              },
              rsvps: list,
            }),
            { headers: corsHeaders }
          );
        } catch (err: any) {
          console.error("Error fetching RSVPs:", err);
          return new Response(
            JSON.stringify({ error: "Failed to fetch RSVPs", message: err?.message }),
            { status: 500, headers: corsHeaders }
          );
        }
      }

      // Delete RSVP (DELETE /api/guest/remove/:id)
      if (url.pathname.startsWith("/api/guest/remove/") && request.method === "DELETE") {
        const id = url.pathname.replace("/api/guest/remove/", "").trim();

        const memIdx = inMemoryRsvps.findIndex((r: any) => r.id === id);
        if (memIdx !== -1) {
          inMemoryRsvps.splice(memIdx, 1);
        }

        const dbUrl = env?.DATABASE_URL || process.env.DATABASE_URL;
        if (dbUrl) {
          try {
            const sql = neon(sanitizeDbUrl(dbUrl));
            const db = drizzle(sql);
            await db.delete(rsvps).where(eq(rsvps.id, id));
            console.log("Neon DB delete success for id:", id);
          } catch (dbErr: any) {
            console.error("Neon DB delete failed:", dbErr?.message || dbErr);
          }
        }

        return new Response(
          JSON.stringify({ success: true, message: "RSVP removed" }),
          { headers: corsHeaders }
        );
      }

      // Fallback for unhandled API routes
      return new Response(
        JSON.stringify({ error: "Not Found", path: url.pathname }),
        { status: 404, headers: corsHeaders }
      );
    }

    // ── 2. STATIC ASSETS & CLIENT SPA ROUTING ──────────────────
    if (env.ASSETS) {
      const response = await env.ASSETS.fetch(request);
      if (response.status === 404) {
        // Fallback to index.html for Vue client-side routes (/dashboard, /invite/:slug, etc.)
        const indexRequest = new Request(new URL("/", request.url), request);
        return env.ASSETS.fetch(indexRequest);
      }
      return response;
    }

    return new Response("Not Found", { status: 404 });
  },
};
