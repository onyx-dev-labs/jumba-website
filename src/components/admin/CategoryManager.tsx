"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface CategoryManagerProps {
  onBack: () => void;
}

export default function CategoryManager({ onBack }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setError(null);

    const { error } = await supabase.from('categories').insert({ name: newCategory.trim() });
    
    if (error) {
      if (error.code === '23505') setError('Category already exists');
      else setError('Error adding category');
    } else {
      setNewCategory('');
      fetchCategories();
      // Log
      await supabase.from('audit_logs').insert({
        action_type: 'system',
        description: `Created category: ${newCategory.trim()}`,
        entity_type: 'categories'
      });
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    
    const { error } = await supabase.from('categories').update({ name: editName.trim() }).eq('id', id);
    
    if (error) {
       setError('Error updating category');
    } else {
      setEditingId(null);
      fetchCategories();
      // Log
      await supabase.from('audit_logs').insert({
        action_type: 'system',
        description: `Updated category ID ${id} to ${editName.trim()}`,
        entity_type: 'categories',
        entity_id: id
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? Projects using this category will remain but might need recategorization.`)) return;

    const { error } = await supabase.from('categories').delete().eq('id', id);
    
    if (error) {
      setError('Error deleting category');
    } else {
      fetchCategories();
      // Log
      await supabase.from('audit_logs').insert({
        action_type: 'system',
        description: `Deleted category: ${name}`,
        entity_type: 'categories',
        entity_id: id
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-700">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-900">Manage Categories</h2>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New Category Name"
          className="flex-1 px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <button 
          type="submit"
          disabled={!newCategory.trim()}
          className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:opacity-50"
        >
          <Plus size={20} />
        </button>
      </form>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group">
              {editingId === cat.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-2 py-1 border border-slate-300 rounded"
                    autoFocus
                  />
                  <button onClick={() => handleUpdate(cat.id)} className="text-green-600 p-1 hover:bg-green-50 rounded">
                    <Check size={18} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-red-600 p-1 hover:bg-red-50 rounded">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-medium text-slate-700">{cat.name}</span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                      className="text-slate-500 hover:text-blue-600 p-1"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="text-slate-500 hover:text-red-600 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-center text-slate-500 py-4">No categories found.</p>
          )}
        </div>
      )}
    </div>
  );
}
