"use client";
import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';

export default function ImageUploader({ bucket, onUpload, currentImage }: { bucket: string, onUpload: (url: string) => void, currentImage?: string | null }) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Validation
    if (file.size > 10 * 1024 * 1024) { // 10MB limit before compression
      alert('File size too large. Maximum 10MB allowed.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Invalid file type. Please upload an image.');
      return;
    }

    setUploading(true);
    
    try {
        // Compress
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: file.type
        };
        
        let fileToUpload = file;
        try {
            fileToUpload = await imageCompression(file, options);
        } catch (err) {
            console.warn('Compression failed', err);
        }

        const fileName = `${Date.now()}-${file.name}`;
        
        const { error } = await supabase.storage.from(bucket).upload(fileName, fileToUpload);
        if (!error) {
            const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
            onUpload(data.publicUrl);
        } else {
            alert('Upload failed: ' + error.message);
        }
    } catch (error: any) {
        alert('Error: ' + error.message);
    }
    setUploading(false);
  };


  return (
    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center">
      {currentImage && (
        <div className="relative w-32 h-32 mx-auto mb-4">
          <Image src={currentImage} alt="Preview" fill className="object-cover rounded-lg" />
        </div>
      )}
      <label className="cursor-pointer block">
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <Upload size={24} />
          <span>{uploading ? 'Uploading...' : 'Click to Upload Image'}</span>
        </div>
        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
      </label>
    </div>
  );
}