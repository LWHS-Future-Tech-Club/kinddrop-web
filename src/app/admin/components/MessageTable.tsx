"use client";

import { useState } from 'react';
import { Eye, Search, ArrowUpDown, AlertTriangle, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Message {
  id: string;
  sender: string;
  recipient: string;
  message: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  flagged?: boolean;
}


export function MessageTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Sarah Johnson',
      recipient: 'Michael Chen',
      message: 'You are doing an amazing job! Keep up the great work!',
      category: 'Encouragement',
      status: 'approved',
      date: '2025-12-01',
      flagged: false,
    },
    {
      id: '2',
      sender: 'Emma Wilson',
      recipient: 'David Brown',
      message: 'Thank you for being such a supportive friend. I appreciate you!',
      category: 'Gratitude',
      status: 'approved',
      date: '2025-12-01',
      flagged: false,
    },
    {
      id: '3',
      sender: 'Lisa Anderson',
      recipient: 'John Smith',
      message: 'Your kindness brightens my day every time we talk.',
      category: 'Support',
      status: 'approved',
      date: '2025-12-01',
      flagged: false,
    },
    {
      id: '4',
      sender: 'James Miller',
      recipient: 'Emily Davis',
      message: 'Congratulations on your achievement! You earned it!',
      category: 'Celebration',
      status: 'approved',
      date: '2025-11-30',
      flagged: true,
    },
    {
      id: '5',
      sender: 'Sophia Martinez',
      recipient: 'Oliver Taylor',
      message: 'Believe in yourself. You have what it takes to succeed!',
      category: 'Inspiration',
      status: 'approved',
      date: '2025-11-30',
      flagged: false,
    },
    {
      id: '6',
      sender: 'Tom Wilson',
      recipient: 'Jane Doe',
      message: 'This message contains inappropriate content that was flagged.',
      category: 'Support',
      status: 'approved',
      date: '2025-12-02',
      flagged: true,
    },
  ]);

  type SortField = 'sender' | 'recipient' | 'message' | 'category' | 'status' | 'date';

  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedMessages = [...messages].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const filteredMessages = sortedMessages.filter(msg =>
    msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const flaggedCount = messages.filter(msg => msg.flagged).length;
  const pendingCount = 5;

  const flaggedDistribution = [
    { name: 'Profanity', value: 8, color: '#dc2626' },
    { name: 'Spam', value: 5, color: '#ea580c' },
    { name: 'Harassment', value: 3, color: '#d97706' },
    { name: 'Other', value: 2, color: '#ca8a04' },
  ];

  return (
    <>
      {/* Moderation Container */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-white mb-4">Moderation Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Flagged Message Distribution */}
          <div className="bg-purple-900/50 backdrop-blur-sm rounded-lg shadow-sm border border-purple-800 p-4 md:p-6">
            <h3 className="text-white mb-4">Flagged Message Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={flaggedDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {flaggedDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#581c87', border: '1px solid #6b21a8' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
              {flaggedDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-purple-200 text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Pending */}
          <div className="bg-purple-900/50 backdrop-blur-sm rounded-lg shadow-sm border border-purple-800 p-4 md:p-6">
            <h3 className="text-white mb-4">Review Pending</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-800/50 rounded-lg border border-purple-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-900/50 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white">Pending Messages</p>
                    <p className="text-purple-300">{pendingCount} messages awaiting review</p>
                  </div>
                </div>
                <div className="text-2xl text-white">{pendingCount}</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-800/50 rounded-lg border border-purple-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-900/50 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white">Flagged Content</p>
                    <p className="text-purple-300">{flaggedCount} messages flagged</p>
                  </div>
                </div>
                <div className="text-2xl text-white">{flaggedCount}</div>
              </div>

              <div className="p-4 bg-purple-800/50 rounded-lg border border-purple-700">
                <h4 className="text-white mb-2">Quick Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Today's Flags</span>
                    <span className="text-white">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Avg Response Time</span>
                    <span className="text-white">12 min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Resolved Today</span>
                    <span className="text-white">15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-purple-900/50 backdrop-blur-sm rounded-lg shadow-sm border border-purple-800">
        <div className="p-4 md:p-6 border-b border-purple-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
            <h2 className="text-white">All Messages</h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="px-4 py-2 border border-purple-700 bg-purple-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="date">Sort by: Date</option>
                <option value="sender">Sort by: Sender</option>
                <option value="recipient">Sort by: Recipient</option>
                <option value="category">Sort by: Category</option>
                <option value="status">Sort by: Status</option>
              </select>
              <button
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2 border border-purple-700 bg-purple-800 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowUpDown className="w-4 h-4" />
                {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Export Data
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-purple-700 bg-purple-800 text-white placeholder-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-800/50 border-b border-purple-700">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-purple-200 cursor-pointer whitespace-nowrap" onClick={() => handleSort('sender')}>Sender</th>
                <th className="px-4 md:px-6 py-3 text-left text-purple-200 cursor-pointer whitespace-nowrap" onClick={() => handleSort('recipient')}>Recipient</th>
                <th className="px-4 md:px-6 py-3 text-left text-purple-200 cursor-pointer whitespace-nowrap hidden md:table-cell" onClick={() => handleSort('message')}>Message</th>
                <th className="px-4 md:px-6 py-3 text-left text-purple-200 cursor-pointer whitespace-nowrap" onClick={() => handleSort('category')}>Category</th>
                <th className="px-4 md:px-6 py-3 text-left text-purple-200 cursor-pointer whitespace-nowrap hidden sm:table-cell" onClick={() => handleSort('status')}>Status</th>
                <th className="px-4 md:px-6 py-3 text-left text-purple-200 cursor-pointer whitespace-nowrap hidden lg:table-cell" onClick={() => handleSort('date')}>Date</th>
                <th className="px-4 md:px-6 py-3 text-left text-purple-200 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-800">
              {filteredMessages.map((message) => (
                <tr key={message.id} className={`hover:bg-purple-800/30 ${message.flagged ? 'bg-red-900/20' : ''}`}>
                  <td className="px-4 md:px-6 py-4 text-white">{message.sender}</td>
                  <td className="px-4 md:px-6 py-4 text-white">{message.recipient}</td>
                  <td className="px-4 md:px-6 py-4 text-purple-200 max-w-md truncate hidden md:table-cell">
                    {message.message}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className="px-2 py-1 bg-purple-700 text-purple-200 rounded-full text-sm whitespace-nowrap">
                      {message.category}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 hidden sm:table-cell">
                    <span
                      className={`px-2 py-1 rounded-full text-sm whitespace-nowrap ${
                        message.status === 'approved'
                          ? 'bg-green-900/50 text-green-300'
                          : message.status === 'rejected'
                          ? 'bg-red-900/50 text-red-300'
                          : 'bg-yellow-900/50 text-yellow-300'
                      }`}
                    >
                      {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-purple-200 hidden lg:table-cell">{message.date}</td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-2">
                      {message.flagged && (
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      )}
                      <button className="p-1 text-purple-400 hover:bg-purple-800 rounded transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 md:p-6 border-t border-purple-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-purple-200">
            Showing {filteredMessages.length} of {messages.length} messages
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-purple-700 bg-purple-800 rounded-lg text-white hover:bg-purple-700 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 border border-purple-700 bg-purple-800 rounded-lg text-white hover:bg-purple-700 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}