import Link from 'next/link';
import { LayoutDashboard, Images, Settings, LogOut, User } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminSidebar() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
    { icon: User, label: 'Owner Profile', href: '/admin/profile' },
    { icon: Images, label: 'Gallery', href: '/admin/gallery' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 flex flex-col">
      <div className="text-2xl font-bold mb-10 text-primary">Admin Panel</div>
      <nav className="flex-1 space-y-4">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition">
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-red-400 hover:text-red-300">
        <LogOut size={20} /> Logout
      </button>
    </aside>
  );
}