import multer from 'multer';
import { File } from '../models/file.model.js';
import { ApiError } from '../utils/ApiError.js';
import cloudinary from '../utils/cloudinary.js';


const storage = multer.memoryStorage(); 
const upload = multer({ storage }).single('file');  

// Middleware to handle file upload to Cloudinary
export const uploadFileToCloudinary = (req, res, next) => {
  upload(req, res, (err) => { 
    if (err) {
      throw new ApiError(400, 'Error uploading file', err);
    }

    if (!req.file) {
      throw new ApiError(400, 'No file uploaded');
    }

    // Cloudinary upload using the file buffer
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' }, 
      async (error, result) => {
        if (error) {
          throw new ApiError(400, 'Error uploading file to Cloudinary', error);
        }

        // Save file metadata to MongoDB
        const fileMetadata = new File({
          name: req.file.originalname,
          path: result.secure_url, 
          type: req.file.mimetype, 
          size: req.file.size,     
        });

        await fileMetadata.save();  

        // Attach the metadata to the request object for further use
        req.fileMetadata = fileMetadata;

        next();  
      }
    );

    // Pipe the file buffer to Cloudinary's upload stream
    stream.end(req.file.buffer);
  });
};


