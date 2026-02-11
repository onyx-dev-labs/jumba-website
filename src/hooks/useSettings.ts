"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { SiteSettings } from '@/lib/types';

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('site_settings').select('*').single();
      if (data) setSettings(data);
      setLoading(false);
    }
    fetch();
  }, []);

  return { settings, loading };
}