"use client";
import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { SiteSettings } from '@/lib/types';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ImageUploader from './ImageUploader';

import ColorPicker from './ColorPicker';

export default function SettingsForm({ initialData }: { initialData: SiteSettings }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from('site_settings').update(data).eq('id', data.id);
    
    if (!error) {
      await supabase.from('audit_logs').insert({
        action_type: 'system',
        description: 'Updated site settings and configuration',
        entity_type: 'site_settings',
        entity_id: data.id
      });
      alert('Saved!');
    } else {
      alert('Error saving settings');
    }
    
    setSaving(false);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-bold">Logo</label>
          <ImageUploader bucket="jumba-assets" currentImage={data.logo_url} onUpload={(url) => setData({ ...data, logo_url: url })} />
        </div>
        <div>
          <label className="block mb-2 font-bold">Owner Photo</label>
          <ImageUploader bucket="jumba-assets" currentImage={data.owner_image_url} onUpload={(url) => setData({ ...data, owner_image_url: url })} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input placeholder="Company Name" value={data.company_name} onChange={(e) => setData({ ...data, company_name: e.target.value })} />
        <Input placeholder="Owner Name" value={data.owner_name} onChange={(e) => setData({ ...data, owner_name: e.target.value })} />
        <Input placeholder="Owner Role" value={data.owner_role} onChange={(e) => setData({ ...data, owner_role: e.target.value })} />
        <Input placeholder="Phone" value={data.phone_primary} onChange={(e) => setData({ ...data, phone_primary: e.target.value })} />
        <Input placeholder="Email" value={data.email_primary} onChange={(e) => setData({ ...data, email_primary: e.target.value })} />
        <Input placeholder="Address" value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ColorPicker 
          label="Primary Color" 
          value={data.primary_color || '#0f172a'} 
          onChange={(color) => setData({ ...data, primary_color: color })} 
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-bold mb-4 text-slate-900">Hero Background Customization</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">Background Type</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setData({ ...data, hero_bg_type: 'image' })}
                  className={`px-4 py-2 rounded-md border ${data.hero_bg_type === 'image' || !data.hero_bg_type ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'}`}
                >
                  Image
                </button>
                <button
                  type="button"
                  onClick={() => setData({ ...data, hero_bg_type: 'color' })}
                  className={`px-4 py-2 rounded-md border ${data.hero_bg_type === 'color' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'}`}
                >
                  Solid Color
                </button>
              </div>
            </div>

            {data.hero_bg_type === 'color' ? (
              <ColorPicker 
                label="Background Color" 
                value={data.hero_bg_value || '#0f172a'} 
                onChange={(color) => setData({ ...data, hero_bg_value: color })} 
              />
            ) : (
              <div>
                <label className="block mb-2 font-bold">Background Image</label>
                <ImageUploader 
                  bucket="jumba-assets" 
                  currentImage={data.hero_bg_value} 
                  onUpload={(url) => setData({ ...data, hero_bg_value: url })} 
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">
                Blur Intensity ({data.hero_blur || 0}px)
              </label>
              <input 
                type="range" 
                min="0" 
                max="20" 
                value={data.hero_blur || 0} 
                onChange={(e) => setData({ ...data, hero_blur: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">Preview</label>
            <div 
              className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg flex items-center justify-center text-white border border-slate-200"
              style={{
                backgroundColor: data.hero_bg_type === 'color' ? (data.hero_bg_value || '#0f172a') : 'transparent',
                backgroundImage: data.hero_bg_type === 'image' && data.hero_bg_value ? `url(${data.hero_bg_value})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {(data.hero_bg_type === 'image' || !data.hero_bg_type) && (
                <div 
                  className="absolute inset-0 bg-slate-900/60" 
                  style={{ backdropFilter: `blur(${data.hero_blur || 0}px)` }}
                />
              )}
              {data.hero_bg_type === 'color' && (
                 <div 
                  className="absolute inset-0" 
                  style={{ backdropFilter: `blur(${data.hero_blur || 0}px)` }}
                />
              )}
              
              <div className="relative z-10 text-center p-4">
                <h4 className="text-2xl font-bold mb-2">Jumba Glass</h4>
                <p className="text-sm opacity-90">Transforming spaces with modern structural glazing.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <textarea 
        className="w-full border p-2 rounded-md" 
        rows={4} 
        placeholder="Owner Bio" 
        value={data.owner_bio || ''} 
        onChange={(e) => setData({ ...data, owner_bio: e.target.value })} 
      />
      <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
    </div>
  );
}