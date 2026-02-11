"use client";
import { useSettings } from '@/hooks/useSettings';
import SettingsForm from '@/components/admin/SettingsForm';

export default function SettingsPage() {
  const { settings, loading } = useSettings();

  if (loading || !settings) return <div>Loading settings...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Website Settings</h1>
      <SettingsForm initialData={settings} />
    </div>
  );
}