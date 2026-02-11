import Button from '../ui/Button';
import Link from 'next/link';
import { SiteSettings } from '@/lib/types';

export default function Hero({ settings }: { settings?: SiteSettings | null }) {
  const bgType = settings?.hero_bg_type || 'image';
  const bgValue = settings?.hero_bg_value || '/images/hero-bg.svg';
  const blur = settings?.hero_blur || 0;

  return (
    <section className="relative h-screen flex items-center justify-center text-center text-white"
      style={{
        backgroundColor: bgType === 'color' ? bgValue : undefined
      }}
    >
      <div className="absolute inset-0 bg-slate-900/60 z-10" />
      
      {bgType === 'image' && (
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ 
            backgroundImage: `url('${bgValue}')`,
            filter: `blur(${blur}px)`
          }} 
        />
      )}
      
      {bgType === 'color' && (
         <div 
          className="absolute inset-0 z-0" 
          style={{ 
            backgroundColor: bgValue,
            filter: `blur(${blur}px)`
          }} 
        />
      )}
      
      <div className="relative z-20 max-w-4xl px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">Precision Glass & Aluminium</h1>
        <p className="text-xl md:text-2xl text-slate-200 mb-10">Transforming spaces with modern structural glazing and premium finishes.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/contact"><Button>Get Free Quote</Button></Link>
          <Link href="/gallery"><Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">View Work</Button></Link>
        </div>
      </div>
    </section>
  );
}