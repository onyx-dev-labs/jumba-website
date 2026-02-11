"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const trackVisit = async () => {
      // Simple fingerprinting (not robust, but sufficient for basic stats)
      let visitorId = localStorage.getItem('visitor_id');
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem('visitor_id', visitorId);
      }

      const { error } = await supabase.from('visitor_analytics').insert({
        page_path: pathname,
        visitor_id: visitorId,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
      });

      if (error) {
        console.error('Analytics error:', error);
      }
    };

    trackVisit();
  }, [pathname, searchParams]);

  return null;
}
