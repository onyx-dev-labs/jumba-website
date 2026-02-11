import { createClient } from '@/lib/supabase-server';
import OwnerProfileForm from '@/components/admin/OwnerProfileForm';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data } = await supabase.from('owner_profile').select('*').single();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Owner Profile</h1>
      <p className="text-slate-600 mb-8">
        Update the owner information displayed on the homepage. Changes are logged.
      </p>
      <OwnerProfileForm initialData={data} />
    </div>
  );
}
