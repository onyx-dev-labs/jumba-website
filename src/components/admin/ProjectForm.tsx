"use client";
import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ImageUploader from './ImageUploader';

interface ProjectFormProps {
  onSuccess: () => void;
}

export default function ProjectForm({ onSuccess }: ProjectFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Commercial');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return alert('Please upload an image first');
    
    setLoading(true);
    const { error } = await supabase.from('portfolio').insert({
      title,
      category,
      image_url: imageUrl
    });
    
    setLoading(false);
    if (!error) {
      // Audit Log
      await supabase.from('audit_logs').insert({
        action_type: 'content',
        description: `Added new gallery project: ${title}`,
        entity_type: 'portfolio',
      });

      setTitle('');
      setImageUrl('');
      onSuccess();
    } else {
      alert('Error saving project');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
      <h3 className="font-bold text-lg mb-4">Add New Project</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <label className="block text-sm font-medium mb-2">Project Image</label>
           <ImageUploader bucket="jumba-assets" onUpload={setImageUrl} currentImage={imageUrl} />
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Project Title</label>
            <Input 
              placeholder="e.g., Equity Bank HQ Partitions" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select 
              className="w-full px-4 py-2 border border-slate-300 rounded-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Commercial">Commercial</option>
              <option value="Residential">Residential</option>
              <option value="Windows">Windows & Doors</option>
              <option value="Partitioning">Office Partitioning</option>
              <option value="Shower">Shower Cubicles</option>
            </select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Add to Portfolio'}
          </Button>
        </div>
      </div>
    </form>
  );
}