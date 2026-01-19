import { Router } from 'express';
import multer from 'multer';
import * as fileController from '../controllers/fileController';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB 제한
  },
});

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/', fileController.getAllFiles);
router.get('/:id', fileController.getFileById);
router.delete('/:id', fileController.deleteFile);

export default router;
