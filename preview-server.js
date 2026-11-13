const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");

const root = __dirname;
const port = Number(process.env.PORT || 8765);
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".gif", "image/gif"],
]);

async function findPhotos(directory = "photos") {
  const entries = await fs.readdir(path.join(root, directory), {
    withFileTypes: true,
  });
  const photos = [];

  for (const entry of entries) {
    const relativePath = path.posix.join(directory, entry.name);
    if (entry.isDirectory()) {
      photos.push(...(await findPhotos(relativePath)));
      continue;
    }

    if (!imageExtensions.has(path.extname(entry.name).toLowerCase())) {
      continue;
    }

    const parts = relativePath.split("/");
    if (parts.length === 4) {
      photos.push({
        path: relativePath,
        set: parts[1],
        description: parts[2],
      });
    }
  }

  return photos;
}

const server = http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url, "http://localhost");
    if (requestUrl.pathname === "/photo-index.json") {
      const photos = await findPhotos();
      photos.sort((first, second) => first.path.localeCompare(second.path));
      response.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": contentTypes.get(".json"),
      });
      response.end(JSON.stringify(photos));
      return;
    }

    const decodedPath = decodeURIComponent(requestUrl.pathname);
    const relativePath = decodedPath === "/" ? "index.html" : decodedPath.slice(1);
    const filePath = path.resolve(root, relativePath);
    const pathFromRoot = path.relative(root, filePath);
    if (pathFromRoot.startsWith("..") || path.isAbsolute(pathFromRoot)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    const contents = await fs.readFile(filePath);
    response.writeHead(200, {
      "Content-Type":
        contentTypes.get(path.extname(filePath).toLowerCase()) ||
        "application/octet-stream",
    });
    response.end(contents);
  } catch (error) {
    const status = error.code === "ENOENT" ? 404 : 500;
    if (status === 500) {
      console.error(error);
    }
    response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(status === 404 ? "Not found" : "Photo preview failed.");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Photo preview available at http://127.0.0.1:${port}`);
});
