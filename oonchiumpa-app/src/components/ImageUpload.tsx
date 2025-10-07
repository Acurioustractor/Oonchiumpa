import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { Loading } from './Loading';
import { Card } from './Card';

interface UploadedImage {
  id: string;
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
}

interface ImageUploadProps {
  onImagesUploaded: (images: UploadedImage[]) => void;
  maxImages?: number;
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesUploaded,
  maxImages = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize = 5
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} not supported`;
    }
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size exceeds ${maxFileSize}MB limit`;
    }
    return null;
  };

  const uploadFile = async (file: File): Promise<UploadedImage> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('context', 'blog-post');
    
    const fileId = Math.random().toString(36).substr(2, 9);
    setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
    
    try {
      // Real API call to backend
      const response = await fetch('http://localhost:3001/api/upload/image', {
        method: 'POST',
        body: formData,
        // Add auth headers if available
        headers: {
          // 'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Uncomment when auth is implemented
        }
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });

      return {
        id: data.image.id,
        url: data.image.url,
        filename: data.image.filename,
        size: data.image.size,
        uploadedAt: data.image.uploadedAt
      };
    } catch (error) {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
      throw error;
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const newErrors: string[] = [];

    // Validate files
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        newErrors.push(`${file.name}: ${error}`);
      }
    }

    if (uploadedImages.length + fileArray.length > maxImages) {
      newErrors.push(`Maximum ${maxImages} images allowed`);
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);
    setIsUploading(true);

    try {
      const uploadPromises = fileArray.map(file => uploadFile(file));
      const results = await Promise.all(uploadPromises);
      
      const newImages = [...uploadedImages, ...results];
      setUploadedImages(newImages);
      onImagesUploaded(newImages);
    } catch (error) {
      console.error('Upload error:', error);
      setErrors(['Upload failed. Please try again.']);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeImage = (imageId: string) => {
    const newImages = uploadedImages.filter(img => img.id !== imageId);
    setUploadedImages(newImages);
    onImagesUploaded(newImages);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className={`border-2 border-dashed transition-all duration-300 ${
        dragActive 
          ? 'border-ochre-500 bg-ochre-50' 
          : 'border-earth-300 hover:border-ochre-400'
      }`}>
        <div
          className="p-8 text-center cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          
          <div className="space-y-4">
            <div className="text-6xl">📸</div>
            <div>
              <h3 className="text-lg font-semibold text-earth-800 mb-2">
                Upload Images for Blog Post
              </h3>
              <p className="text-earth-600 mb-4">
                Drag and drop images here, or click to select files
              </p>
              <div className="text-sm text-earth-500">
                <p>Supported formats: JPEG, PNG, WebP</p>
                <p>Maximum file size: {maxFileSize}MB</p>
                <p>Maximum images: {maxImages}</p>
              </div>
            </div>
            
            <Button variant="secondary" disabled={isUploading}>
              {isUploading ? <Loading /> : '📁'} Choose Files
            </Button>
          </div>
        </div>
      </Card>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold text-earth-800 mb-3">Uploading Images...</h4>
          <div className="space-y-2">
            {Object.entries(uploadProgress).map(([fileId, progress]) => (
              <div key={fileId} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-earth-600">Uploading...</span>
                  <span className="text-earth-500">{progress}%</span>
                </div>
                <div className="w-full bg-earth-200 rounded-full h-2">
                  <div 
                    className="bg-ochre-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <h4 className="font-semibold text-red-800 mb-2">Upload Errors</h4>
          <ul className="text-sm text-red-600 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* Uploaded Images Gallery */}
      {uploadedImages.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-earth-800">
              Uploaded Images ({uploadedImages.length}/{maxImages})
            </h4>
            <span className="text-sm text-earth-500">
              Total size: {formatFileSize(uploadedImages.reduce((sum, img) => sum + img.size, 0))}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedImages.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-video bg-earth-100 rounded-lg overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.filename}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => removeImage(image.id)}
                    className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-200"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Image Info */}
                <div className="mt-2 text-xs text-earth-600">
                  <p className="font-medium truncate">{image.filename}</p>
                  <p>{formatFileSize(image.size)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Cultural Protocol Notice */}
      <Card className="p-4 bg-ochre-50 border-ochre-200">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">🛡️</div>
          <div>
            <h4 className="font-semibold text-ochre-800 mb-1">Cultural Protocols</h4>
            <p className="text-ochre-700 text-sm">
              Please ensure all uploaded images respect cultural protocols and have appropriate permissions for use. 
              Images depicting sacred sites, cultural practices, or community members should have proper consent.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ImageUpload;