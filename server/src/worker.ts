import { app } from "./app.js";

// Cloudflare Workers fetch handler
export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    // If request is for static assets handled by Cloudflare Workers Assets binding
    const url = new URL(request.url);

    // Pass through non-API requests to static asset binding if available
    if (!url.pathname.startsWith("/api") && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    try {
      const seModule: any = await import("@codegenie/serverless-express");
      const serverlessExpress = seModule.default?.default || seModule.default || seModule;
      const handler = serverlessExpress({ app });
      return await handler(request as any, ctx);
    } catch (err: any) {
      console.error("Worker error handling request:", err);
      return new Response(
        JSON.stringify({ error: "Internal Server Error in Worker", message: err?.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
};
