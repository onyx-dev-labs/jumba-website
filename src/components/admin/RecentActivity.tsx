"use client";

import { FileText, Palette, Settings, User } from 'lucide-react';

interface ActivityLog {
  id: string;
  action_type: string;
  description: string;
  created_at: string;
  user_email?: string;
}

interface ActivityProps {
  logs: ActivityLog[];
}

export default function RecentActivity({ logs }: ActivityProps) {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'content': return <FileText size={16} />;
      case 'design': return <Palette size={16} />;
      case 'system': return <Settings size={16} />;
      default: return <User size={16} />;
    }
  };

  const getColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'content': return 'text-blue-600 bg-blue-100';
      case 'design': return 'text-purple-600 bg-purple-100';
      case 'system': return 'text-orange-600 bg-orange-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
      <div className="space-y-6">
        {logs.length === 0 ? (
          <p className="text-slate-500 text-sm">No recent activity found.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-4">
              <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getColor(log.action_type)}`}>
                {getIcon(log.action_type)}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{log.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500">
                    {new Date(log.created_at).toLocaleDateString()} at {new Date(log.created_at).toLocaleTimeString()}
                  </span>
                  {log.user_email && (
                    <>
                      <span className="text-xs text-slate-300">•</span>
                      <span className="text-xs text-slate-500">by {log.user_email}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
