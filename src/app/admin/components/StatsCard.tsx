import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
  changeType: 'positive' | 'negative';
}

export function StatsCard({ title, value, icon: Icon, change, changeType }: StatsCardProps) {
  return (
    <div className="bg-purple-900/50 backdrop-blur-sm rounded-lg shadow-sm border border-purple-800 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-800 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-purple-300" />
        </div>
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            changeType === 'positive'
              ? 'bg-green-900/50 text-green-300'
              : 'bg-red-900/50 text-red-300'
          }`}
        >
          {change}
        </span>
      </div>
      <h3 className="text-purple-300 mb-1">{title}</h3>
      <p className="text-white">{value}</p>
    </div>
  );
}