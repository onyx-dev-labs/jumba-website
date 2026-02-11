"use client";
import SectionHeader from '@/components/ui/SectionHeader';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Project } from '@/lib/types';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  id: string;
  name: string;
}

export default function GalleryPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [currentCategoryImages, setCurrentCategoryImages] = useState<Project[]>([]);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Categories
      const { data: catData } = await supabase.from('categories').select('*').order('name');
      // Fetch Projects
      const { data: projData } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false });

      if (catData) setCategories(catData);
      if (projData) setProjects(projData);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Group Projects
  const groupedProjects: Record<string, Project[]> = {};
  
  // Initialize groups from categories
  categories.forEach(cat => {
    groupedProjects[cat.name] = [];
  });
  // Fallback for uncategorized or deleted categories
  groupedProjects['Other'] = [];

  projects.forEach(p => {
    if (groupedProjects[p.category]) {
      groupedProjects[p.category].push(p);
    } else {
      // If category exists in project but not in categories table, add it dynamically or put in Other
      // Let's add it dynamically to be safe
      if (!groupedProjects[p.category]) groupedProjects[p.category] = [];
      groupedProjects[p.category].push(p);
    }
  });

  // Remove empty groups
  const activeGroups = Object.entries(groupedProjects).filter(([_, items]) => items.length > 0);

  // Lightbox Handlers
  const openLightbox = (project: Project, categoryProjects: Project[]) => {
    const index = categoryProjects.findIndex(p => p.id === project.id);
    setCurrentCategoryImages(categoryProjects);
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null && lightboxIndex < currentCategoryImages.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    } else if (lightboxIndex !== null) {
      setLightboxIndex(0); // Loop
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    } else if (lightboxIndex !== null) {
      setLightboxIndex(currentCategoryImages.length - 1); // Loop
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  return (
    <main>
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 min-h-screen">
        <SectionHeader title="Project Portfolio" subtitle="A showcase of our finest work across Kenya." />
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-16">
            {activeGroups.map(([category, items]) => (
              <section key={category} className="scroll-mt-24">
                <div className="flex items-center gap-4 mb-6">
                   <h2 className="text-2xl font-bold text-slate-800">{category}</h2>
                   <div className="h-px bg-slate-200 flex-grow"></div>
                   <span className="text-sm text-slate-500 font-medium">{items.length} Projects</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((project) => (
                    <motion.div 
                      key={project.id}
                      layoutId={`project-${project.id}`}
                      className="group relative h-64 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all"
                      onClick={() => openLightbox(project, items)}
                    >
                      <Image 
                        src={project.image_url} 
                        alt={project.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white font-medium truncate">{project.title}</p>
                        <div className="flex items-center gap-2 text-white/80 text-xs mt-1">
                          <ZoomIn size={14} />
                          <span>Click to expand</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}

            {activeGroups.length === 0 && (
              <div className="text-center py-20 text-slate-500">
                No projects found. Check back soon!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button 
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition z-50"
            >
              <X size={32} />
            </button>

            {/* Navigation Buttons */}
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition z-50 hidden md:block"
            >
              <ChevronLeft size={40} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition z-50 hidden md:block"
            >
              <ChevronRight size={40} />
            </button>

            {/* Main Image */}
            <div 
              className="relative w-full max-w-6xl h-[80vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} 
            >
              <motion.div
                key={currentCategoryImages[lightboxIndex].id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-full h-full"
              >
                 <Image 
                   src={currentCategoryImages[lightboxIndex].image_url} 
                   alt={currentCategoryImages[lightboxIndex].title}
                   fill
                   className="object-contain"
                   quality={90}
                   priority
                 />
              </motion.div>
              
              {/* Caption */}
              <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                 <h3 className="text-white text-xl font-medium drop-shadow-md">
                   {currentCategoryImages[lightboxIndex].title}
                 </h3>
                 <p className="text-white/60 text-sm mt-1">
                   {lightboxIndex + 1} of {currentCategoryImages.length}
                 </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
