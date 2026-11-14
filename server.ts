import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

interface FrameCheckCacheEntry {
  frameAllowed: boolean;
  finalUrl: string;
  reason?: string;
  checkedAt: number;
}

const frameCheckCache = new Map<string, FrameCheckCacheEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000;

function isSafeExternalUrl(rawUrl: string): URL | null {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      host === '0.0.0.0' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host.startsWith('169.254.') ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function checkIframeHeaders(headers: Headers): { allowed: boolean; reason?: string } {
  const xfo = (headers.get('x-frame-options') || '').toLowerCase().trim();
  if (xfo.includes('deny') || xfo.includes('sameorigin')) {
    return { allowed: false, reason: `x-frame-options: ${xfo}` };
  }
  const csp = (headers.get('content-security-policy') || '').toLowerCase();
  const faMatch = csp.match(/frame-ancestors\s+([^;]+)/);
  if (faMatch) {
    const directives = faMatch[1].trim();
    if (
      directives === "'none'" ||
      directives === "'self'" ||
      (!directives.includes('*') && !directives.includes('https:'))
    ) {
      return { allowed: false, reason: `csp frame-ancestors: ${directives}` };
    }
  }
  return { allowed: true };
}

async function startServer() {
  const app = express();

  app.get('/api/frame-check', async (req, res) => {
    const rawUrl = typeof req.query.url === 'string' ? req.query.url : '';
    const parsed = isSafeExternalUrl(rawUrl);
    if (!parsed) {
      res.status(400).json({ frameAllowed: false, finalUrl: rawUrl, reason: 'invalid_url' });
      return;
    }

    const cached = frameCheckCache.get(parsed.toString());
    if (cached && Date.now() - cached.checkedAt < CACHE_TTL_MS) {
      res.json({
        frameAllowed: cached.frameAllowed,
        finalUrl: cached.finalUrl,
        reason: cached.reason,
      });
      return;
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(parsed.toString(), {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; IndexiaPortal/1.0; +https://indexia.local)',
          Accept: 'text/html,application/xhtml+xml',
        },
      });
      clearTimeout(timer);

      const headerCheck = checkIframeHeaders(response.headers);
      const entry: FrameCheckCacheEntry = {
        frameAllowed: headerCheck.allowed,
        finalUrl: response.url || parsed.toString(),
        reason: headerCheck.reason,
        checkedAt: Date.now(),
      };
      frameCheckCache.set(parsed.toString(), entry);

      res.json({
        frameAllowed: entry.frameAllowed,
        finalUrl: entry.finalUrl,
        reason: entry.reason,
      });
    } catch {
      res.json({
        frameAllowed: true,
        finalUrl: parsed.toString(),
        reason: 'check_timeout',
      });
    }
  });

  app.get('/api/proxy-snapshot', async (req, res) => {
    const rawUrl = typeof req.query.url === 'string' ? req.query.url : '';
    const parsed = isSafeExternalUrl(rawUrl);
    if (!parsed) {
      res.status(400).send('URL invalide.');
      return;
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 7000);
      const response = await fetch(parsed.toString(), {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml',
        },
      });
      clearTimeout(timer);

      const finalUrl = new URL(response.url || parsed.toString());
      let html = await response.text();

      // Strip scripts and frame-restricting meta tags for safe visual snapshot rendering
      html = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<meta[^>]+http-equiv=["']?(?:Content-Security-Policy|X-Frame-Options)["']?[^>]*>/gi, '');

      const baseTag = `<base href="${finalUrl.origin}/" target="_blank" />`;
      if (/<head[^>]*>/i.test(html)) {
        html = html.replace(/<head([^>]*)>/i, `<head$1>${baseTag}`);
      } else {
        html = `${baseTag}${html}`;
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=300');
      res.send(html);
    } catch {
      res
        .status(502)
        .send(
          '<!doctype html><html lang="fr"><body style="font-family:sans-serif;padding:2rem;background:#FBF9F5;color:#1C1917;">Aperçu serveur indisponible pour cette page.</body></html>'
        );
    }
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Indexia server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
