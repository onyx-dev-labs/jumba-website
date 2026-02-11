"use client";

import { Users, Eye, MousePointerClick, Activity } from 'lucide-react';

interface StatsProps {
  stats: {
    totalVisits: number;
    uniqueVisitors: number;
    pageViews: number;
    bounceRate: string;
  };
}

export default function DashboardStats({ stats }: StatsProps) {
  const items = [
    {
      label: 'Total Visits',
      value: stats.totalVisits.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: 'Unique Visitors',
      value: stats.uniqueVisitors.toLocaleString(),
      icon: UserCheck, // Will define or import below
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      label: 'Page Views',
      value: stats.pageViews.toLocaleString(),
      icon: Eye,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      label: 'Bounce Rate',
      value: stats.bounceRate,
      icon: Activity,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {items.map((item, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">{item.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{item.value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${item.bg}`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function UserCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}
