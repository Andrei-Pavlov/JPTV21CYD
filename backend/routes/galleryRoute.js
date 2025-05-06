import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Загрузка фото (только для админа, добавьте свою проверку авторизации!)
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Файл не загружен' });
  res.json({ filename: req.file.filename, url: `/uploads/${req.file.filename}` });
});

// Получить список всех фото
router.get('/list', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ message: 'Ошибка чтения папки' });
    const images = files.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f)).map(filename => ({
      filename,
      url: `/uploads/${filename}`
    }));
    res.json(images);
  });
});

// Удалить фото по имени файла
router.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDir, filename);

  // Проверяем, существует ли файл
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Файл не найден' });
  }

  // Удаляем файл
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при удалении файла' });
    }
    res.json({ message: 'Файл успешно удалён' });
  });
});

export default router; 