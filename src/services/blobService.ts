import { put, del } from '@vercel/blob';
import path from 'path';

export class BlobService {
  private readonly baseUrl = 'https://jqbxvdli3n8vlyvo.public.blob.vercel-storage.com';
  private readonly storeId = 'store_jqbxVDli3n8vLyVO';

  async uploadFile(
    file: Express.Multer.File,
    userId: string
  ): Promise<{ url: string; pathname: string }> {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomSuffix = Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      const filename = `logos/${userId}-${timestamp}-${randomSuffix}${extension}`;

      // Upload to Vercel Blob
      const blob = await put(filename, file.buffer, {
        access: 'public',
        contentType: file.mimetype,
      });

      return {
        url: blob.url,
        pathname: blob.pathname
      };
    } catch (error) {
      console.error('Error uploading file to Vercel Blob:', error);
      throw new Error('Failed to upload file');
    }
  }

  async deleteFile(url: string): Promise<void> {
    try {
      // Extract pathname from URL for deletion
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      
      await del(pathname);
      console.log('File deleted from Vercel Blob:', pathname);
    } catch (error) {
      console.error('Error deleting file from Vercel Blob:', error);
      // Don't throw error for deletion failures as it's not critical
    }
  }

  isValidImageType(mimetype: string): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp'
    ];
    return allowedTypes.includes(mimetype);
  }

  isValidFileSize(size: number): boolean {
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '2097152'); // 2MB
    return size <= maxSize;
  }
} 