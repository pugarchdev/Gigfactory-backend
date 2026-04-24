import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // 1. Get the base name without the extension
    const baseName =
      file.originalname.substring(0, file.originalname.lastIndexOf('.')) ||
      file.originalname;

    // 2. Check if it is a PDF
    const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');

    return {
      folder: 'gigfactory_uploads',
      resource_type: isPdf ? 'raw' : 'auto',

      // 3. ✅ FIX: If it's a PDF, add '.pdf' to the public_id. Otherwise, leave it normal.
      public_id: isPdf
        ? `${baseName}_${Date.now()}.pdf`
        : `${baseName}_${Date.now()}`,
    };
  },
});



const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // Increased to 100MB limit to support larger videos
});

router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Add this to see exactly what Cloudinary returns in your terminal
    console.log("Cloudinary uploaded file data:", req.file);

    // ✅ FIX: Use req.file.path instead of secure_url
    res.status(200).json({ url: req.file.path });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

export default router;
