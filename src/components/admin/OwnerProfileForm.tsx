"use client";

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import { Upload, Save, Loader2, Bold, Italic } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import Button from '../ui/Button';

export default function OwnerProfileForm({ initialData }: { initialData?: any }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initialData?.name || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.image_url || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const supabase = createClient();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      CharacterCount.configure({
        limit: 500,
      }),
    ],
    content: initialData?.bio || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose focus:outline-none min-h-[150px] p-4 border rounded-md',
      },
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (file.size > 2 * 1024 * 1024) { // 2MB
      setError('Image size must be less than 2MB');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Only JPG, PNG, and WebP formats are allowed');
      return;
    }

    setError(null);
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let imageUrl = initialData?.image_url;

      // Upload Image if changed
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('owner-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('owner-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrlData.publicUrl;
      }

      // Save Profile
      const bio = editor?.getHTML();
      const { error: dbError } = await supabase
        .from('owner_profile')
        .upsert({ 
          id: initialData?.id, // If updating existing
          name, 
          bio, 
          image_url: imageUrl,
          updated_at: new Date().toISOString()
        });

      if (dbError) throw dbError;

      // Audit Log
      await supabase.from('audit_logs').insert({
        action_type: 'content',
        description: 'Updated owner profile information',
        entity_type: 'owner_profile',
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!editor) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 max-w-2xl">
      <h2 className="text-xl font-bold mb-6">Edit Owner Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Profile Image</label>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100 border">
              {previewUrl ? (
                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Upload size={24} />
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profile-upload"
              />
              <label
                htmlFor="profile-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Change Photo
              </label>
              <p className="text-xs text-slate-500 mt-1">Max 2MB. JPG, PNG, WebP.</p>
            </div>
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. John Doe"
          />
        </div>

        {/* Bio Editor */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Biography 
            <span className="text-xs font-normal text-slate-500 ml-2">
              ({editor.storage.characterCount.characters()}/500 characters)
            </span>
          </label>
          
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 border-b border-gray-300 flex gap-2">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
              >
                <Bold size={18} />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
              >
                <Italic size={18} />
              </button>
            </div>
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
            Profile updated successfully!
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save Changes
        </Button>
      </form>
    </div>
  );
}
