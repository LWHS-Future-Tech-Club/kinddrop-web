import { Heart, MessageCircle, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type View = 'dashboard' | 'moderation' | 'users';

interface DashboardProps {
  onViewChange: (view: View) => void;
}

export function Dashboard({ onViewChange }: DashboardProps) {
  const stats = [
    {
      title: 'Total Messages',
      value: '12,543',
      icon: MessageCircle,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Users',
      value: '3,291',
      icon: Users,
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Messages Today',
      value: '847',
      icon: Heart,
      change: '+23%',
      changeType: 'positive' as const,
    },
  ];

  const weeklyData = [
    { day: 'Mon', messages: 420, users: 145 },
    { day: 'Tue', messages: 580, users: 178 },
    { day: 'Wed', messages: 690, users: 201 },
    { day: 'Thu', messages: 520, users: 167 },
    { day: 'Fri', messages: 780, users: 224 },
    { day: 'Sat', messages: 650, users: 189 },
    { day: 'Sun', messages: 470, users: 156 },
  ];

  const recentActivity = [
    { user: 'Sarah Johnson', action: 'sent a kindness message', time: '5 min ago', type: 'message' },
    { user: 'Michael Chen', action: 'joined the platform', time: '12 min ago', type: 'user' },
    { user: 'Emma Wilson', action: 'sent a kindness message', time: '18 min ago', type: 'message' },
    { user: 'David Brown', action: 'received 10 messages', time: '25 min ago', type: 'achievement' },
    { user: 'Lisa Anderson', action: 'sent a kindness message', time: '32 min ago', type: 'message' },
  ];

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Weekly Activity Chart */}
        <div className="bg-purple-900/50 backdrop-blur-sm rounded-lg shadow-sm border border-purple-800 p-4 md:p-6">
          <h3 className="text-white mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#6b21a8" />
              <XAxis dataKey="day" stroke="#d8b4fe" />
              <YAxis stroke="#d8b4fe" />
              <Tooltip contentStyle={{ backgroundColor: '#581c87', border: '1px solid #6b21a8' }} />
              <Area type="monotone" dataKey="messages" stroke="#9333ea" fillOpacity={1} fill="url(#colorMessages)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performers */}
        <div className="bg-purple-900/50 backdrop-blur-sm rounded-lg shadow-sm border border-purple-800 p-4 md:p-6">
          <h3 className="text-white mb-4">Top Contributors This Week</h3>
          <div className="space-y-4">
            {[
              { name: 'Sarah Johnson', messages: 47, avatar: 'SJ', rank: 1 },
              { name: 'Michael Chen', messages: 42, avatar: 'MC', rank: 2 },
              { name: 'Emma Wilson', messages: 38, avatar: 'EW', rank: 3 },
              { name: 'Lisa Anderson', messages: 35, avatar: 'LA', rank: 4 },
              { name: 'David Brown', messages: 31, avatar: 'DB', rank: 5 },
            ].map((user) => (
              <div key={user.name} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                  user.rank === 1 ? 'bg-yellow-500' : 
                  user.rank === 2 ? 'bg-gray-400' : 
                  user.rank === 3 ? 'bg-amber-600' : 
                  'bg-purple-400'
                }`}>
                  {user.rank}
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-white">{user.name}</p>
                  <p className="text-purple-300">{user.messages} messages sent</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-purple-900/50 backdrop-blur-sm rounded-lg shadow-sm border border-purple-800 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white">Recent Activity</h3>
          <button className="text-purple-300 hover:text-purple-200">View All</button>
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center gap-3 pb-4 border-b border-purple-800 last:border-0 last:pb-0">
              <div className="w-8 h-8 rounded-full bg-purple-800 flex items-center justify-center text-purple-200">
                {activity.user.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white truncate">{activity.user}</p>
                <p className="text-purple-300 truncate">{activity.action}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-purple-400 text-sm hidden sm:inline">{activity.time}</span>
                {activity.type === 'message' && <MessageCircle className="w-4 h-4 text-purple-400" />}
                {activity.type === 'user' && <Users className="w-4 h-4 text-blue-400" />}
                {activity.type === 'achievement' && <Heart className="w-4 h-4 text-pink-400" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}