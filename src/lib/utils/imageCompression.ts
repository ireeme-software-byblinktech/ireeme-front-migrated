/**
 * Compress and resize an image file to base64
 * @param file - The image file to compress
 * @param maxWidth - Maximum width (default: 400px)
 * @param maxHeight - Maximum height (default: 600px)
 * @param quality - JPEG quality 0-1 (default: 0.7)
 * @returns Promise<string> - Base64 encoded image
 */
export async function compressImage(
  file: File,
  maxWidth: number = 400,
  maxHeight: number = 600,
  quality: number = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with compression
        const base64String = canvas.toDataURL('image/jpeg', quality);
        resolve(base64String);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

