const fs = require("fs");
const http = require("http");
const path = require("path");
const { URL } = require("url");

const root = path.resolve(__dirname, "..", "frontend", "xc-ui-pc-static-portal");
const port = Number(process.env.PORT || 8602);
const host = process.env.HOST || "127.0.0.1";

const backends = [
  { prefix: "/api/content", target: "http://127.0.0.1:65040", strip: "/api" },
  { prefix: "/api/search", target: "http://127.0.0.1:65080", strip: "/api" },
  { prefix: "/api/media", target: "http://127.0.0.1:65050", strip: "/api" },
  { prefix: "/api/system", target: "http://127.0.0.1:63110", strip: "/api" },
  { prefix: "/api/auth", target: "http://127.0.0.1:65070", strip: "/api" },
  { prefix: "/api/checkcode", target: "http://127.0.0.1:65075", strip: "/api" },
  { prefix: "/api/learning", target: "http://127.0.0.1:65010", strip: "/api" },
  { prefix: "/api/orders", target: "http://127.0.0.1:65010", strip: "/api" },
  { prefix: "/open/content", target: "http://127.0.0.1:65040", strip: "/open" },
  { prefix: "/open/media", target: "http://127.0.0.1:65050", strip: "/open" },
  { prefix: "/open/search", target: "http://127.0.0.1:65080", strip: "/open" },
  { prefix: "/mediafiles", target: "http://127.0.0.1:9000", strip: "" },
];

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".mp4": "video/mp4",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function resolveStaticPath(requestPath) {
  let pathname = decodeURIComponent(requestPath);
  if (pathname === "/") pathname = "/index.html";
  if (pathname.startsWith("/static/")) pathname = pathname.slice("/static".length);
  const filePath = path.resolve(root, "." + pathname);
  if (!filePath.startsWith(root)) return null;
  return filePath;
}

function stripHtmlShell(html) {
  return html
    .replace(/^\uFEFF/, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<\/?html[^>]*>/gi, "")
    .replace(/<\/?head[^>]*>/gi, "")
    .replace(/<\/?body[^>]*>/gi, "");
}

function renderHtml(filePath, isInclude = false) {
  let html = fs.readFileSync(filePath, "utf8");
  html = html.replace(/<!--#include\s+virtual="([^"]+)"\s*-->/g, (_match, includePath) => {
    const resolvedInclude = resolveStaticPath(includePath);
    if (!resolvedInclude || !fs.existsSync(resolvedInclude)) return "";
    return renderHtml(resolvedInclude, true);
  });
  if (isInclude) {
    html = stripHtmlShell(html);
  }
  return html;
}

function proxyRequest(req, res, route) {
  const incoming = new URL(req.url, `http://${req.headers.host}`);
  const targetBase = new URL(route.target);
  const targetPath = incoming.pathname.slice(route.strip.length) + incoming.search;
  const options = {
    protocol: targetBase.protocol,
    hostname: targetBase.hostname,
    port: targetBase.port,
    method: req.method,
    path: targetPath,
    headers: { ...req.headers, host: targetBase.host },
  };

  const proxy = http.request(options, (proxyRes) => {
    const headers = { ...proxyRes.headers };
    delete headers["transfer-encoding"];
    res.writeHead(proxyRes.statusCode || 502, headers);
    proxyRes.pipe(res);
  });

  proxy.on("error", (error) => {
    send(
      res,
      502,
      JSON.stringify({ errMessage: `local proxy failed: ${error.message}` }),
      { "content-type": "application/json; charset=utf-8" }
    );
  });

  req.pipe(proxy);
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const route = backends.find((item) => requestUrl.pathname.startsWith(item.prefix));
  if (route) {
    proxyRequest(req, res, route);
    return;
  }

  const filePath = resolveStaticPath(requestUrl.pathname);
  if (!filePath) {
    send(res, 403, "Forbidden", { "content-type": "text/plain; charset=utf-8" });
    return;
  }

  fs.stat(filePath, (statError, stat) => {
    if (statError || !stat.isFile()) {
      send(res, 404, "Not Found", { "content-type": "text/plain; charset=utf-8" });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = mimeTypes[ext] || "application/octet-stream";
    if (ext === ".html") {
      send(res, 200, renderHtml(filePath), { "content-type": type });
      return;
    }
    res.writeHead(200, { "content-type": type });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(port, host, () => {
  console.log(`static portal running at http://${host}:${port}/`);
});
