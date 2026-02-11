import { cn } from '@/lib/utils';

export default function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white p-6 rounded-xl shadow-sm border border-slate-100', className)}>
      {children}
    </div>
  );
}