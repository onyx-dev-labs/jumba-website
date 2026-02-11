"use client";
import ContactMap from '@/components/home/ContactMap';
import SectionHeader from '@/components/ui/SectionHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert("Message sent! We will contact you shortly.");
    setLoading(false);
  };

  return (
    <main>
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
        <SectionHeader title="Contact Us" subtitle="Get a free quote or consultation today." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold">Get In Touch</h3>
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-primary"><MapPin /></div>
              <div>
                <h4 className="font-bold">Visit Us</h4>
                <p className="text-slate-600">P.O. Box 14309-20100, Nakuru</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-primary"><Phone /></div>
              <div>
                <h4 className="font-bold">Call Us</h4>
                <p className="text-slate-600">0721 471 764 / 0777 471 764</p>
                <p className="text-slate-600">0731 517 136</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-primary"><Mail /></div>
              <div>
                <h4 className="font-bold">Email Us</h4>
                <p className="text-slate-600">bmlugogo21@gmail.com</p>
              </div>
            </div>
            
            <div className="mt-8">
               <ContactMap />
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 h-fit">
            <h3 className="text-xl font-bold mb-6">Send a Message</h3>
            <div className="space-y-4">
              <Input placeholder="Your Name" required />
              <Input placeholder="Phone Number" required />
              <Input type="email" placeholder="Email Address" />
              <select className="w-full px-4 py-2 border border-slate-300 rounded-md">
                <option>Service Interested In...</option>
                <option>Structural Glazing</option>
                <option>Windows & Doors</option>
                <option>Partitioning</option>
                <option>Other</option>
              </select>
              <textarea 
                className="w-full px-4 py-2 border border-slate-300 rounded-md h-32" 
                placeholder="Project Details..." 
                required
              ></textarea>
              <Button className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}