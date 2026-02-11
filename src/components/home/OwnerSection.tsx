"use client";

import Image from 'next/image';

interface OwnerProfile {
  name: string;
  bio: string;
  image_url: string;
}

export default function OwnerSection({ profile }: { profile: OwnerProfile | null }) {
  if (!profile) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Image */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-end">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-300">
              <Image 
                src={profile.image_url || '/images/placeholder-owner.jpg'} 
                alt={profile.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="w-full md:w-2/3 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Meet the Owner</h2>
            <h3 className="text-xl text-primary font-semibold mb-6">{profile.name}</h3>
            
            <div 
              className="prose prose-lg text-slate-600 max-w-none"
              dangerouslySetInnerHTML={{ __html: profile.bio }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
