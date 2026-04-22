import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isPDF = file.originalname.toLowerCase().endsWith('.pdf') || file.mimetype === 'application/pdf';
    const baseName = file.originalname.substring(0, file.originalname.lastIndexOf('.')) || file.originalname;
    
    if (isPDF) {
      return {
        folder: 'gigfactory_uploads',
        resource_type: 'raw', // Use raw to avoid Cloudinary Security 401 error
        public_id: baseName + '_' + Date.now() + '.pdf', // Must explicitly add .pdf so browser knows it's a PDF
      };
    } else {
      return {
        folder: 'gigfactory_uploads',
        resource_type: 'auto',
        public_id: baseName + '_' + Date.now(),
      };
    }
  },
});



const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit to match Cloudinary free tier
});

router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Cloudinary returns the secure_url in the path or secure_url property
    res.status(200).json({ url: req.file.path });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

export default router;
