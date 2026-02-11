"use client";
import { useState, useCallback, useRef } from 'react';
import { Upload, X, FileImage, CheckCircle, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';

interface UploadedFile {
  file: File;
  id: string;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  url?: string;
}

interface MultiImageUploaderProps {
  bucket: string;
  onUploadComplete: (files: { url: string; name: string; size: number; type: string }[]) => void;
  maxSizeMB?: number; // Default 10MB
  acceptedTypes?: string[];
  maxConcurrentUploads?: number;
}

export default function MultiImageUploader({ 
  bucket, 
  onUploadComplete, 
  maxSizeMB = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxConcurrentUploads = 5
}: MultiImageUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Handle File Selection
  const handleFiles = (newFiles: FileList | File[]) => {
    const validFiles: UploadedFile[] = [];
    
    Array.from(newFiles).forEach(file => {
      // Validate Type
      if (!acceptedTypes.includes(file.type)) {
        console.warn(`Skipped ${file.name}: Invalid type`);
        return;
      }
      
      // Validate Size
      if (file.size > maxSizeMB * 1024 * 1024) {
        console.warn(`Skipped ${file.name}: File too large`);
        return;
      }

      // Check Duplicates in current queue
      if (files.some(f => f.file.name === file.name && f.file.size === file.size)) {
        return;
      }

      validFiles.push({
        file,
        id: Math.random().toString(36).substring(7),
        preview: URL.createObjectURL(file),
        progress: 0,
        status: 'pending'
      });
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter(f => f.id !== id);
    });
  };

  // Upload Logic
  const uploadFiles = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    // Process in chunks (concurrency)
    const queue = [...pendingFiles];
    const activeUploads = new Set<Promise<void>>();
    const results: { url: string; name: string; size: number; type: string }[] = [];

    const processFile = async (fileObj: UploadedFile) => {
      // Update status to uploading
      setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'uploading' } : f));

      try {
        // Compress Image
        const options = {
          maxSizeMB: 1, // Target 1MB
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: fileObj.file.type
        };
        
        let fileToUpload = fileObj.file;
        try {
          fileToUpload = await imageCompression(fileObj.file, options);
        } catch (e) {
          console.warn('Compression failed, using original file', e);
        }

        const fileExt = fileToUpload.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, progress: 30 } : f));

        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, fileToUpload, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;
        
        setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, progress: 80 } : f));

        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        // Success
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'completed', progress: 100, url: publicUrlData.publicUrl } : f
        ));
        
        results.push({
          url: publicUrlData.publicUrl,
          name: fileObj.file.name,
          size: fileToUpload.size,
          type: fileToUpload.type
        });

      } catch (err: any) {
        console.error(err);
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'error', error: err.message, progress: 0 } : f
        ));
      }
    };

    // Execution Loop
    while (queue.length > 0 || activeUploads.size > 0) {
      while (queue.length > 0 && activeUploads.size < maxConcurrentUploads) {
        const file = queue.shift()!;
        const promise = processFile(file).then(() => {
          activeUploads.delete(promise);
        });
        activeUploads.add(promise);
      }
      
      if (activeUploads.size > 0) {
        await Promise.race(activeUploads);
      }
    }

    // Call completion handler with successfully uploaded files
    if (results.length > 0) {
      onUploadComplete(results);
    }
  };

  const clearCompleted = () => {
    setFiles(prev => prev.filter(f => f.status !== 'completed'));
  };

  const cancelAll = () => {
    // Only remove pending. Uploading ones are hard to cancel without abort controller map
    setFiles(prev => prev.filter(f => f.status === 'uploading' || f.status === 'completed' || f.status === 'error')); 
    // Actually user probably wants to clear everything
    if (confirm("Clear all files? This won't delete already uploaded files from server.")) {
       setFiles([]);
    }
  };

  const pendingCount = files.filter(f => f.status === 'pending').length;
  const uploadingCount = files.filter(f => f.status === 'uploading').length;
  const completedCount = files.filter(f => f.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div 
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-slate-400'}
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-slate-100 rounded-full">
            <Upload className="text-slate-500" size={32} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-700">Drag & Drop photos here</h3>
            <p className="text-slate-500 mt-1">or click to browse files</p>
          </div>
          <p className="text-xs text-slate-400">
            Supports JPG, PNG, WebP, GIF up to {maxSizeMB}MB
          </p>
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition"
          >
            Select Files
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => e.target.files && handleFiles(e.target.files)} 
            className="hidden" 
            multiple 
            accept={acceptedTypes.join(',')}
          />
        </div>
      </div>

      {/* Stats & Actions */}
      {files.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="text-sm font-medium text-slate-700">
            {files.length} files selected 
            {pendingCount > 0 && <span className="text-orange-600 ml-2">({pendingCount} pending)</span>}
            {uploadingCount > 0 && <span className="text-blue-600 ml-2">({uploadingCount} uploading...)</span>}
            {completedCount > 0 && <span className="text-green-600 ml-2">({completedCount} done)</span>}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={cancelAll}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition"
            >
              Clear All
            </button>
            {pendingCount > 0 && (
              <button 
                onClick={uploadFiles}
                disabled={uploadingCount > 0}
                className="px-4 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition disabled:opacity-50 flex items-center gap-2"
              >
                {uploadingCount > 0 ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                {uploadingCount > 0 ? 'Uploading...' : 'Start Upload'}
              </button>
            )}
            {completedCount > 0 && pendingCount === 0 && uploadingCount === 0 && (
              <button 
                onClick={clearCompleted}
                className="px-4 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Clear Completed
              </button>
            )}
          </div>
        </div>
      )}

      {/* File List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto pr-2">
        {files.map((file) => (
          <div key={file.id} className="relative group bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
            {/* Preview */}
            <div className="relative h-32 bg-slate-100">
              <Image 
                src={file.preview} 
                alt={file.file.name} 
                fill 
                className={`object-cover ${file.status === 'error' ? 'opacity-50' : ''}`} 
              />
              
              {/* Overlay Actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                <button 
                  onClick={() => removeFile(file.id)}
                  className="p-1 bg-white/90 text-red-500 rounded-full hover:bg-red-50"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Status Overlay */}
              {file.status === 'uploading' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="text-white animate-spin" size={24} />
                </div>
              )}
              {file.status === 'completed' && (
                <div className="absolute top-2 left-2 p-1 bg-green-500 text-white rounded-full">
                  <CheckCircle size={14} />
                </div>
              )}
              {file.status === 'error' && (
                <div className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full">
                  <AlertCircle size={14} />
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="p-3">
              <p className="text-xs font-medium text-slate-700 truncate" title={file.file.name}>
                {file.file.name}
              </p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-[10px] text-slate-500">
                  {(file.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className={`text-[10px] font-medium ${
                  file.status === 'completed' ? 'text-green-600' :
                  file.status === 'error' ? 'text-red-600' :
                  file.status === 'uploading' ? 'text-blue-600' :
                  'text-slate-400'
                }`}>
                  {file.status === 'completed' ? 'Done' :
                   file.status === 'error' ? 'Failed' :
                   file.status === 'uploading' ? `${file.progress}%` :
                   'Pending'}
                </p>
              </div>
              
              {/* Progress Bar */}
              {file.status !== 'completed' && file.status !== 'error' && (
                <div className="w-full bg-slate-100 h-1 mt-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              )}
              
              {/* Error Message */}
              {file.error && (
                <p className="text-[10px] text-red-500 mt-1 truncate" title={file.error}>
                  {file.error}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
