import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import { Layers, Maximize, Grid, Droplets } from 'lucide-react';

const services = [
  { icon: Maximize, title: 'Aluminium Systems', desc: 'Sliding doors, windows, and structural wall curtaining.' },
  { icon: Grid, title: 'Office Solutions', desc: 'Acoustic partitions and premium Koller doors.' },
  { icon: Layers, title: 'Interior Fittings', desc: 'Custom cabinets, counters, and wood works.' },
  { icon: Droplets, title: 'Plumbing & Tiling', desc: 'Professional plumbing and precision tile fitting.' },
];

export default function Services() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader title="Our Specializations" subtitle="High quality fabrication using the best materials available in Kenya." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <Card key={i} className="text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <s.icon size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-slate-600">{s.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}