import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const router = Router();

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: JPEG, PNG, WebP, GIF, SVG`));
  },
});

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const replitDomains = process.env["REPLIT_DOMAINS"];
  let baseUrl = "";

  if (replitDomains) {
    const primaryDomain = replitDomains.split(",")[0]?.trim();
    if (primaryDomain) baseUrl = `https://${primaryDomain}`;
  }

  if (!baseUrl) {
    const proto = (req.headers["x-forwarded-proto"] as string) ?? req.protocol;
    const host = (req.headers["x-forwarded-host"] as string) ?? (req.headers.host as string) ?? "localhost";
    if (host !== "localhost" && !host.startsWith("172.") && !host.startsWith("127.")) {
      baseUrl = `${proto}://${host}`;
    }
  }

  const url = baseUrl
    ? `${baseUrl}/api/uploads/${req.file.filename}`
    : `/api/uploads/${req.file.filename}`;

  res.json({ url, filename: req.file.filename, size: req.file.size });
});

router.delete("/upload/:filename", (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(UPLOADS_DIR, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ ok: true });
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

export default router;
