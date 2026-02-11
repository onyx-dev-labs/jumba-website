import SectionHeader from '@/components/ui/SectionHeader';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main>
      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <SectionHeader title="About Jumba Glass" subtitle="Building trust through transparency since 2015." />
        
        <div className="prose prose-lg mx-auto text-slate-600">
          <p>
            Jumba Glass & Aluminium Fabricators is a premier construction partner in Kenya, specializing in high-end glass installations and aluminium joinery. 
            We started as a small workshop in Nakuru and have grown into a fully-fledged fabrication hub serving clients across East Africa.
          </p>
          
          <div className="my-10 relative h-64 w-full rounded-xl overflow-hidden">
             {/* Replace with a real workshop image if available */}
             <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400">
                Workshop Image Placeholder
             </div>
          </div>

          <h3>Our Mission</h3>
          <p>
            To provide durable, aesthetic, and precision-engineered glass solutions that elevate the architectural beauty of Kenyan homes and commercial spaces.
          </p>

          <h3>Why Choose Us?</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Precision:</strong> We use laser-guided cutting tools for perfect fits.</li>
            <li><strong>Materials:</strong> We source only high-grade aluminium (powder coated) and tempered safety glass.</li>
            <li><strong>Timeliness:</strong> We respect project timelines and deliver on schedule.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}