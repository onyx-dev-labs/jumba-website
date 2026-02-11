"use client";
import { useState, useRef } from 'react';
import { Project } from '@/lib/types';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import { Edit2, Check, X, Trash2, GripVertical } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface GalleryGroupedViewProps {
  projects: Project[];
  categories: Category[];
  onUpdate: () => void;
}

export default function GalleryGroupedView({ projects, categories, onUpdate }: GalleryGroupedViewProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [targetCategory, setTargetCategory] = useState<string | null>(null);
  const supabase = createClient();

  // Categorize projects
  // We handle both projects with category string matching category name
  // and projects with arbitrary category strings (which go to "Uncategorized" or their own group if we want)
  // For this view, let's group by the defined categories, and put others in "Other"
  
  const categoryNames = categories.map(c => c.name);
  const groupedProjects: Record<string, Project[]> = {};
  
  categories.forEach(cat => {
    groupedProjects[cat.name] = [];
  });
  groupedProjects['Other'] = [];

  projects.forEach(p => {
    if (categoryNames.includes(p.category)) {
      groupedProjects[p.category].push(p);
    } else {
      groupedProjects['Other'].push(p);
    }
  });

  // Rename Logic
  const startEditing = (p: Project) => {
    setEditingId(p.id);
    setEditTitle(p.title);
  };

  const saveTitle = async (id: number) => {
    if (!editTitle.trim()) return;
    
    // Check for duplicates in the same category? Or globally?
    // Let's just update
    const { error } = await supabase.from('portfolio').update({ title: editTitle.trim() }).eq('id', id);
    
    if (!error) {
      setEditingId(null);
      onUpdate();
      // Audit
      await supabase.from('audit_logs').insert({
        action_type: 'content',
        description: `Renamed project ID ${id} to "${editTitle.trim()}"`,
        entity_type: 'portfolio',
        entity_id: id.toString()
      });
    } else {
      alert('Error updating title');
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm('Delete this image?')) return;
    
    const { error } = await supabase.from('portfolio').delete().eq('id', id);
    if (!error) {
      onUpdate();
      // Audit
      await supabase.from('audit_logs').insert({
        action_type: 'content',
        description: `Deleted project ID ${id}`,
        entity_type: 'portfolio',
        entity_id: id.toString()
      });
    }
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData('text/plain', id.toString());
    setDraggingId(id);
  };

  const handleDragOver = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    setTargetCategory(category);
  };

  const handleDrop = async (e: React.DragEvent, category: string) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('text/plain'));
    setDraggingId(null);
    setTargetCategory(null);
    
    if (!id) return;
    
    // Find project
    const project = projects.find(p => p.id === id);
    if (project && project.category !== category) {
       // Update category
       const { error } = await supabase.from('portfolio').update({ category }).eq('id', id);
       
       if (!error) {
         onUpdate();
         // Audit
         await supabase.from('audit_logs').insert({
            action_type: 'content',
            description: `Moved "${project.title}" to ${category}`,
            entity_type: 'portfolio',
            entity_id: id.toString()
         });
       } else {
         alert('Failed to move project');
       }
    }
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedProjects).map(([category, items]) => {
        // Hide empty 'Other' category if irrelevant
        if (category === 'Other' && items.length === 0) return null;

        return (
          <div 
            key={category}
            className={`
              bg-white rounded-xl border transition-colors
              ${targetCategory === category ? 'border-primary ring-2 ring-primary/20 bg-blue-50' : 'border-slate-200'}
            `}
            onDragOver={(e) => handleDragOver(e, category)}
            onDrop={(e) => handleDrop(e, category)}
            onDragLeave={() => setTargetCategory(null)}
          >
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
              <h3 className="font-bold text-slate-800">{category}</h3>
              <span className="text-sm text-slate-500 bg-white px-2 py-1 rounded border">
                {items.length} items
              </span>
            </div>
            
            <div className="p-4">
              {items.length === 0 ? (
                <div className="text-center py-8 text-slate-400 border-2 border-dashed rounded-lg">
                  Drag items here to assign to {category}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {items.map((project) => (
                    <div 
                      key={project.id} 
                      className={`
                        relative group border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition
                        ${draggingId === project.id ? 'opacity-50' : ''}
                      `}
                      draggable
                      onDragStart={(e) => handleDragStart(e, project.id)}
                    >
                      {/* Image */}
                      <div className="relative h-32 w-full bg-slate-100">
                         <Image src={project.image_url} alt={project.title} fill className="object-cover" />
                         <div className="absolute top-2 left-2 p-1 bg-white/80 rounded cursor-grab active:cursor-grabbing text-slate-600">
                           <GripVertical size={14} />
                         </div>
                      </div>

                      {/* Content */}
                      <div className="p-2">
                        {editingId === project.id ? (
                          <div className="flex flex-col gap-2">
                            <input 
                              type="text" 
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="text-xs border rounded p-1 w-full"
                              autoFocus
                            />
                            <div className="flex gap-1 justify-end">
                              <button onClick={() => saveTitle(project.id)} className="bg-green-100 text-green-700 p-1 rounded hover:bg-green-200"><Check size={12} /></button>
                              <button onClick={() => setEditingId(null)} className="bg-red-100 text-red-700 p-1 rounded hover:bg-red-200"><X size={12} /></button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs font-medium text-slate-700 truncate" title={project.title}>
                              {project.title}
                            </p>
                            <div className="flex justify-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => startEditing(project)} className="text-blue-600 hover:bg-blue-50 p-1 rounded">
                                <Edit2 size={12} />
                              </button>
                              <button onClick={() => deleteProject(project.id)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
