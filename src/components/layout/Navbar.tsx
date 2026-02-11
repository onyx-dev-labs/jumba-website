"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import Button from '../ui/Button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSettings();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2">
            {settings?.logo_url && (
              <div className="relative h-[50px] w-auto shrink-0">
                <Image 
                  src={settings.logo_url} 
                  alt="Logo" 
                  width={150} 
                  height={50} 
                  className="h-full w-auto object-contain" 
                />
              </div>
            )}
            <div className="flex flex-col justify-center">
               <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 leading-none">
                Jumba Glass & <span className="text-primary">Aluminium Fabricators</span>
               </h1>
               <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                 Building trust through transparency
               </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {['Home', 'Services', 'Gallery', 'Contact'].map((item) => (
              <Link key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-slate-700 hover:text-primary font-medium">
                {item}
              </Link>
            ))}
            <a href={`tel:${settings?.phone_primary}`}>
              <Button className="flex items-center gap-2 py-2">
                <Phone size={18} /> Get Quote
              </Button>
            </a>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-700">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4">
          {['Home', 'Services', 'Gallery', 'Contact'].map((item) => (
            <Link key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="block text-slate-700 font-medium" onClick={() => setIsOpen(false)}>
              {item}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}