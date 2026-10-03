import { app } from "./app.js";

// Cloudflare Workers fetch handler
export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // 1. Forward all API endpoints to Express app
    if (url.pathname.startsWith("/api")) {
      try {
        const seModule: any = await import("@codegenie/serverless-express");
        const serverlessExpress = seModule.default?.default || seModule.default || seModule;
        const handler = serverlessExpress({ app, eventSourceName: "AWS_LAMBDA_V2" });

        // Translate Fetch API Request to AWS Gateway V2 event format
        const bodyText =
          request.method !== "GET" && request.method !== "HEAD"
            ? await request.text()
            : undefined;

        const event = {
          version: "2.0",
          routeKey: "$default",
          rawPath: url.pathname,
          rawQueryString: url.search ? url.search.slice(1) : "",
          headers: Object.fromEntries(request.headers.entries()),
          requestContext: {
            http: {
              method: request.method,
              path: url.pathname,
              protocol: "HTTP/1.1",
              sourceIp: request.headers.get("cf-connecting-ip") || "127.0.0.1",
              userAgent: request.headers.get("user-agent") || "",
            },
          },
          body: bodyText,
          isBase64Encoded: false,
        };

        const result: any = await handler(event, ctx);

        const responseHeaders = new Headers();
        if (result.headers) {
          for (const [key, val] of Object.entries(result.headers)) {
            if (val !== undefined && val !== null) {
              responseHeaders.set(key, String(val));
            }
          }
        }

        return new Response(result.body, {
          status: result.statusCode || 200,
          headers: responseHeaders,
        });
      } catch (err: any) {
        console.error("Worker error handling API request:", err);
        return new Response(
          JSON.stringify({ error: "Internal Server Error in Worker", message: err?.message }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // 2. Static Assets & SPA routing fallback for Vue frontend
    if (env.ASSETS) {
      const response = await env.ASSETS.fetch(request);
      if (response.status === 404) {
        // Fallback to index.html for Vue client-side routes (/w/:slug, /dashboard, etc.)
        const indexRequest = new Request(new URL("/", request.url), request);
        return env.ASSETS.fetch(indexRequest);
      }
      return response;
    }

    return new Response("Not Found", { status: 404 });
  },
};
