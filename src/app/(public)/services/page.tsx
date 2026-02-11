import SectionHeader from '@/components/ui/SectionHeader';
import Card from '@/components/ui/Card';
import { CheckCircle } from 'lucide-react';

const detailedServices = [
  {
    title: "Aluminium Sliding Doors/Windows",
    description: "Custom-made aluminium windows and doors designed for modern aesthetics, security, and durability.",
    features: ["Sliding Mechanisms", "Casement Windows", "Heavy Duty Profiles"]
  },
  {
    title: "Wall Curtaining System",
    description: "Advanced structural glazing and curtain wall systems for commercial building facades.",
    features: ["Structural Glazing", "Spider Fittings", "Weatherproofing"]
  },
  {
    title: "Office Partitions",
    description: "Professional workspace division using glass and aluminium for privacy and light flow.",
    features: ["Frameless Glass", "Aluminium Framed", "Frosted/Sandblasted"]
  },
  {
    title: "Koller Doors",
    description: "High-quality Koller doors suitable for both residential and commercial interiors.",
    features: ["Modern Designs", "Various Finishes", "Durable Hardware"]
  },
  {
    title: "Cabinets",
    description: "Custom cabinetry solutions for kitchens, offices, and storage requirements.",
    features: ["Kitchen Cabinets", "Wardrobes", "Office Storage"]
  },
  {
    title: "Counters",
    description: "Bespoke counters for reception areas, kitchens, and retail display spaces.",
    features: ["Granite/Wood Tops", "Reception Desks", "Retail Displays"]
  },
  {
    title: "Wood Works",
    description: "General carpentry and joinery services for custom furniture and fittings.",
    features: ["Custom Furniture", "Doors & Frames", "Interior Trim"]
  },
  {
    title: "Plumbing",
    description: "Complete plumbing installations and repairs for residential and commercial projects.",
    features: ["Pipe Fitting", "Sanitary Ware", "Maintenance"]
  },
  {
    title: "Tiles Fitting",
    description: "Precision floor and wall tiling services using ceramic, porcelain, or stone tiles.",
    features: ["Floor Tiling", "Wall Cladding", "Bathroom/Kitchen"]
  }
];

export default function ServicesPage() {
  return (
    <main>
      <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="Our Specializations" subtitle="Comprehensive fabrication and construction solutions." />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {detailedServices.map((service, idx) => (
              <Card key={idx} className="hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-bold mb-4 text-slate-800">{service.title}</h3>
                <p className="text-slate-600 mb-6 text-sm">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-slate-700 text-sm">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}