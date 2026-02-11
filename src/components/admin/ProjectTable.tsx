"use client";
import Image from 'next/image';
import { Project } from '@/lib/types';
import { Trash2 } from 'lucide-react';

interface ProjectTableProps {
  projects: Project[];
  onDelete: (id: number) => void;
}

export default function ProjectTable({ projects, onDelete }: ProjectTableProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center p-10 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-500">
        No projects found. Add one above!
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 text-slate-600 font-semibold text-sm">
          <tr>
            <th className="p-4 border-b">Image</th>
            <th className="p-4 border-b">Title</th>
            <th className="p-4 border-b">Category</th>
            <th className="p-4 border-b text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-slate-50 transition-colors">
              <td className="p-4 w-24">
                <div className="relative w-16 h-12 rounded overflow-hidden bg-slate-200">
                  <Image 
                    src={project.image_url} 
                    alt={project.title} 
                    fill 
                    className="object-cover"
                  />
                </div>
              </td>
              <td className="p-4 font-medium text-slate-900">{project.title}</td>
              <td className="p-4">
                <span className="px-2 py-1 bg-blue-50 text-primary text-xs rounded-full font-medium border border-blue-100">
                  {project.category}
                </span>
              </td>
              <td className="p-4 text-right">
                <button 
                  onClick={() => onDelete(project.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete Project"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}