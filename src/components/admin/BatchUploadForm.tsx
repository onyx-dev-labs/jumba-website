"use client";
import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import MultiImageUploader from './MultiImageUploader';
import { ArrowLeft } from 'lucide-react';

interface BatchUploadFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BatchUploadForm({ onSuccess, onCancel }: BatchUploadFormProps) {
  const [category, setCategory] = useState('Commercial');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const supabase = createClient();

  const handleUploadComplete = async (uploadedFiles: { url: string; name: string }[]) => {
    setIsProcessing(true);
    let successCount = 0;

    // Process DB Inserts
    // We can do this in parallel or batch
    const inserts = uploadedFiles.map(async (file) => {
      // Generate title from filename (remove extension and replace dashes/underscores)
      const title = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      
      const { error } = await supabase.from('portfolio').insert({
        title: title,
        category: category,
        image_url: file.url
      });

      if (!error) successCount++;
      return error;
    });

    await Promise.all(inserts);

    // Audit Log for Batch
    if (successCount > 0) {
      await supabase.from('audit_logs').insert({
        action_type: 'content',
        description: `Batch uploaded ${successCount} images to gallery (Category: ${category})`,
        entity_type: 'portfolio',
      });
    }

    setCompletedCount(successCount);
    setIsProcessing(false);
    
    // Slight delay before closing or just let user see "Done"
    // We'll call onSuccess which refreshes the list
    if (successCount === uploadedFiles.length) {
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-700">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Batch Upload Photos</h2>
          <p className="text-sm text-slate-500">Upload multiple images at once to the gallery.</p>
        </div>
      </div>

      <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <label className="block text-sm font-medium mb-2 text-slate-700">Default Category for this Batch</label>
        <select 
          className="w-full md:w-1/3 px-4 py-2 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-primary focus:border-transparent"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Commercial">Commercial</option>
          <option value="Residential">Residential</option>
          <option value="Windows">Windows & Doors</option>
          <option value="Partitioning">Office Partitioning</option>
          <option value="Shower">Shower Cubicles</option>
        </select>
        <p className="text-xs text-slate-500 mt-2">
          Projects will be created with filenames as titles. You can edit them later.
        </p>
      </div>

      <MultiImageUploader 
        bucket="jumba-assets" 
        onUploadComplete={handleUploadComplete}
        maxConcurrentUploads={5}
        maxSizeMB={10}
      />

      {isProcessing && (
        <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center">
          Saving to database...
        </div>
      )}
      
      {completedCount > 0 && !isProcessing && (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg text-center">
          Successfully added {completedCount} projects to the gallery! Redirecting...
        </div>
      )}
    </div>
  );
}
