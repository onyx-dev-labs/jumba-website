"use client";
import { useSettings } from '@/hooks/useSettings';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-secondary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {settings?.owner_bio && (
          <div className="bg-slate-800 p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8 mb-12">
            {settings.owner_image_url && (
              <div className="relative w-32 h-32 flex-shrink-0">
                <Image src={settings.owner_image_url} alt="Owner" fill className="rounded-full object-cover border-4 border-primary" />
              </div>
            )}
            <div className="text-center md:text-left">
              <h4 className="text-xl font-bold mb-1">{settings.owner_name}</h4>
              <p className="text-primary text-sm uppercase font-bold tracking-wider mb-3">{settings.owner_role}</p>
              <p className="text-slate-300 italic">"{settings.owner_bio}"</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-slate-700 pb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{settings?.company_name || 'Jumba Glass'}</h3>
            <p className="text-slate-400">Premium glass fabrication solutions tailored for Kenyan homes and businesses.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="text-slate-400 space-y-2">
              <li>{settings?.address}</li>
              <li>{settings?.phone_primary}</li>
              <li>{settings?.email_primary}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Links</h4>
            <ul className="text-slate-400 space-y-2">
              <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors">Portfolio</Link></li>
              <li><Link href="/admin/login" className="hover:text-primary transition-colors">Admin Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} {settings?.company_name}. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span>Built by</span>
            <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-primary font-bold">NYXUS DEV LABS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
