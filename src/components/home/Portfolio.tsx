"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Project } from '@/lib/types';
import SectionHeader from '../ui/SectionHeader';
import Image from 'next/image';

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase.from('portfolio').select('*').limit(6).then(({ data }) => {
      if (data) setProjects(data);
    });
  }, []);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader title="Recent Projects" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.id} className="relative aspect-square group overflow-hidden rounded-xl bg-slate-200">
              <Image src={p.image_url} alt={p.title} fill className="object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <div className="text-white">
                  <h3 className="font-bold text-lg">{p.title}</h3>
                  <p className="text-sm text-slate-300">{p.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}