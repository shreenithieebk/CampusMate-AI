import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Local dev middleware so `/api/chat` and `/api/reschedule` work during `npm run dev`
 * without exposing server-side environment variables to the browser bundle.
 */
function localVercelApiPlugin() {
  return {
    name: 'local-vercel-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        // Load non-VITE env vars strictly on the Node.js server side
        const env = loadEnv(server.config.mode, process.cwd(), '');
        if (env.GEMINI_API_KEY) {
          process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
        }

        const route = req.url.split('?')[0];
        let modulePath = null;
        if (route === '/api/chat') modulePath = '/api/chat.js';
        if (route === '/api/reschedule') modulePath = '/api/reschedule.js';

        if (!modulePath) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'API route not found' }));
          return;
        }

        try {
          if (req.method === 'POST') {
            const chunks = [];
            for await (const chunk of req) {
              chunks.push(chunk);
            }
            const raw = Buffer.concat(chunks).toString('utf8');
            req.body = raw ? JSON.parse(raw) : {};
          }

          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (payload) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(payload));
          };

          const mod = await server.ssrLoadModule(modulePath);
          await mod.default(req, res);
        } catch (error) {
          console.error('[local-vercel-api] Error:', error);
          if (!res.writableEnded) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                error: error?.message || 'Internal server error',
              })
            );
          }
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localVercelApiPlugin()],
  resolve: {
    preserveSymlinks: true,
  },
});
