import { createClient } from '@/lib/supabase-server';
import DashboardStats from '@/components/admin/DashboardStats';
import AnalyticsChart from '@/components/admin/AnalyticsChart';
import RecentActivity from '@/components/admin/RecentActivity';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  const supabase = await createClient();
  
  // Parallel data fetching
  const [
    { count: totalVisits },
    { count: uniqueVisitors },
    { count: pageViews },
    { data: logs },
    { data: analyticsData }
  ] = await Promise.all([
    supabase.from('visitor_analytics').select('*', { count: 'exact', head: true }),
    supabase.from('visitor_analytics').select('visitor_id', { count: 'exact', head: true }), // Approximation (distinct needs raw sql or different query)
    supabase.from('visitor_analytics').select('*', { count: 'exact', head: true }), // Assuming pageViews = totalVisits for now
    supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('visitor_analytics').select('created_at').order('created_at', { ascending: true }) // For chart
  ]);

  // Process chart data (group by date)
  const chartMap = new Map();
  analyticsData?.forEach((entry: any) => {
    const date = new Date(entry.created_at).toLocaleDateString();
    chartMap.set(date, (chartMap.get(date) || 0) + 1);
  });

  const chartData = Array.from(chartMap.entries()).map(([date, visits]) => ({
    date,
    visits
  })).slice(-7); // Last 7 days

  return {
    stats: {
      totalVisits: totalVisits || 0,
      uniqueVisitors: uniqueVisitors || 0, // Note: This is just total rows count in this simple query. Distinct requires .rpc or raw query.
      pageViews: pageViews || 0,
      bounceRate: '0%', // Placeholder, requires session tracking logic
    },
    logs: logs || [],
    chartData: chartData.length > 0 ? chartData : [{ date: new Date().toLocaleDateString(), visits: 0 }]
  };
}

export default async function AdminDashboard() {
  const { stats, logs, chartData } = await getDashboardData();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Dashboard Overview</h1>
      
      <DashboardStats stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnalyticsChart data={chartData} />
        </div>
        <div>
          <RecentActivity logs={logs} />
        </div>
      </div>
    </div>
  );
}
