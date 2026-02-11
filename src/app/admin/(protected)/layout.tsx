"use client";
import AdminSidebar from '@/components/layout/AdminSidebar';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10">Loading Admin...</div>;
  if (!user) return null; // Redirect handled in hook

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-slate-100 min-h-screen">
        {children}
      </main>
    </div>
  );
}