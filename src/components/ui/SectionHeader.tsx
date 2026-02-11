export default function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{title}</h2>
      {subtitle && <p className="text-slate-600 max-w-2xl mx-auto">{subtitle}</p>}
      <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full" />
    </div>
  );
}