import { Router } from 'express';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';

const router = Router();

// مجلدات
const uploadDir = path.join(process.cwd(), 'uploads'); // يطابق ServeStaticModule
const dataDir = path.join(process.cwd(), 'data');
const dbFile = path.join(dataDir, 'featured.json');
fs.mkdirSync(uploadDir, { recursive: true });
fs.mkdirSync(dataDir, { recursive: true });

// Multer — 2MB
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_, file, cb) =>
    file.mimetype.startsWith('image/')
      ? cb(null, true)
      : cb(new Error('Only images allowed')),
});

// DB helpers
type Item = {
  id: string;
  imageUrl: string;
  order: number;
  active: boolean;
  productId?: string;
};
function readDB(): Item[] {
  if (!fs.existsSync(dbFile)) return [];
  try {
    return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
  } catch {
    return [];
  }
}
function writeDB(items: Item[]) {
  fs.writeFileSync(dbFile, JSON.stringify(items, null, 2));
}
const publicUrl = (filename: string) => `/uploads/${filename}`;

// Routes
router.get('/', (_req, res) => res.json(readDB()));

router.get('/:id', (req, res) => {
  const items = readDB();
  const item = items.find((x) => x.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

// ✅ طلب واحد لعدّة صور بالمفتاح images
router.post('/', upload.array('images', 10), (req, res) => {
  const files = (req.files as Express.Multer.File[]) || [];
  if (!files.length)
    return res.status(400).json({ message: 'No images uploaded' });

  const { order = '0', active = 'true', productId = null } = req.body;
  const items = readDB();

  const created = files.map((f, idx) => {
    const item: Item = {
      id: crypto.randomUUID(),
      imageUrl: publicUrl(f.filename),
      order: (Number(order) || 0) + idx,
      active: String(active) === 'true',
      productId: productId || undefined,
    };
    items.push(item);
    return item;
  });

  writeDB(items);
  res.status(201).json(created);
});

router.put('/:id', upload.single('image'), (req, res) => {
  const items = readDB();
  const i = items.findIndex((x) => x.id === req.params.id);
  if (i === -1) return res.status(404).json({ message: 'Not found' });

  const body = req.body || {};
  items[i].order = body.order != null ? Number(body.order) : items[i].order;
  items[i].active =
    body.active != null ? String(body.active) === 'true' : items[i].active;
  if (body.productId !== undefined)
    items[i].productId = body.productId || undefined;
  if ((req as any).file)
    items[i].imageUrl = publicUrl((req as any).file.filename);

  writeDB(items);
  res.json(items[i]);
});

router.delete('/:id', (req, res) => {
  const items = readDB();
  const i = items.findIndex((x) => x.id === req.params.id);
  if (i === -1) return res.status(404).json({ message: 'Not found' });

  const [removed] = items.splice(i, 1);
  writeDB(items);

  // حذف الملف الفعلي من uploads
  if (removed?.imageUrl) {
    const localPath = path.join(uploadDir, path.basename(removed.imageUrl));
    if (fs.existsSync(localPath)) fs.unlink(localPath, () => {});
  }
  res.status(204).end();
});

export default router;
