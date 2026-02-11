"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Project } from '@/lib/types';
import ProjectForm from '@/components/admin/ProjectForm';
import BatchUploadForm from '@/components/admin/BatchUploadForm';
import ProjectTable from '@/components/admin/ProjectTable';
import CategoryManager from '@/components/admin/CategoryManager';
import GalleryGroupedView from '@/components/admin/GalleryGroupedView';
import { Plus, Layers, Grid, List, Settings } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

export default function GalleryAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'grid' | 'single' | 'batch' | 'categories'>('grid');
  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    // Fetch projects
    const { data: projData } = await supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Fetch categories
    const { data: catData } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (projData) setProjects(projData);
    if (catData) setCategories(catData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) return;
    
    // 1. Delete from DB
    const { error } = await supabase.from('portfolio').delete().eq('id', id);
    
    if (!error) {
      // 2. Audit Log
      await supabase.from('audit_logs').insert({
        action_type: 'content',
        description: `Deleted gallery project ID: ${id}`,
        entity_type: 'portfolio',
        entity_id: id.toString()
      });

      // 3. Refresh List
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gallery Manager</h1>
          <p className="text-slate-500">Manage your portfolio images and categories</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
           {/* View Toggles */}
           {(view === 'list' || view === 'grid') && (
             <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 mr-2">
               <button 
                 onClick={() => setView('grid')}
                 className={`p-2 rounded-md transition ${view === 'grid' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                 title="Grid View (Grouped)"
               >
                 <Grid size={18} />
               </button>
               <button 
                 onClick={() => setView('list')}
                 className={`p-2 rounded-md transition ${view === 'list' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                 title="List View"
               >
                 <List size={18} />
               </button>
             </div>
           )}

           {(view === 'list' || view === 'grid') && (
             <>
              <button 
                onClick={() => setView('single')}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition font-medium text-sm"
              >
                <Plus size={16} /> Add Single
              </button>
              <button 
                onClick={() => setView('batch')}
                className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition font-medium text-sm"
              >
                <Layers size={16} /> Batch Upload
              </button>
              <button 
                onClick={() => setView('categories')}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition font-medium text-sm"
              >
                <Settings size={16} /> Categories
              </button>
             </>
           )}
           
           {/* Back Button for Sub-views */}
           {(view !== 'list' && view !== 'grid') && (
             <button 
               onClick={() => setView('grid')}
               className="text-slate-500 hover:text-slate-900 font-medium px-4"
             >
               Back to Gallery
             </button>
           )}
        </div>
      </div>
      
      {/* Content Area */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading gallery data...</div>
        ) : (
          <>
            {view === 'single' && (
              <ProjectForm onSuccess={() => { fetchData(); setView('grid'); }} />
            )}

            {view === 'batch' && (
              <BatchUploadForm onSuccess={() => { fetchData(); setView('grid'); }} onCancel={() => setView('grid')} />
            )}

            {view === 'categories' && (
              <CategoryManager onBack={() => { fetchData(); setView('grid'); }} />
            )}

            {view === 'list' && (
              <ProjectTable projects={projects} onDelete={handleDelete} />
            )}

            {view === 'grid' && (
              <GalleryGroupedView 
                projects={projects} 
                categories={categories}
                onUpdate={fetchData} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}