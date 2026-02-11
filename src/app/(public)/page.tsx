
import Hero from '@/components/home/Hero';
import Services from '@/components/home/Services';
import Portfolio from '@/components/home/Portfolio';
import ContactMap from '@/components/home/ContactMap';
import OwnerSection from '@/components/home/OwnerSection';
import CTASection from '@/components/home/CTASection';
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createClient();
  const [{ data: ownerProfile }, { data: settings }] = await Promise.all([
    supabase.from('owner_profile').select('*').single(),
    supabase.from('site_settings').select('*').single()
  ]);

  return (
    <main>
      <Hero settings={settings} />
      <OwnerSection profile={ownerProfile} />
      <Services />
      <Portfolio />
      <CTASection />
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Visit Our Workshop</h2>
          <ContactMap />
        </div>
      </section>
    </main>
  );
}
