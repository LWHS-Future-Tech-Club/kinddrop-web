"use client";

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MessageTable } from './components/MessageTable';
import { UserTable } from './components/UserTable';

type View = 'dashboard' | 'moderation' | 'users';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-purple-950">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 lg:ml-64">
        <header className="bg-purple-900/50 backdrop-blur-sm border-b border-purple-800 px-4 md:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-white p-2 hover:bg-purple-800 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-white">
                  {currentView === 'dashboard' && 'Dashboard'}
                  {currentView === 'moderation' && 'Message Moderation'}
                  {currentView === 'users' && 'User Management'}
                </h1>
                <p className="text-purple-300 mt-1 text-sm md:text-base">
                  {currentView === 'dashboard' && 'Welcome back! Here\'s your overview.'}
                  {currentView === 'moderation' && 'Manage and moderate kindness messages'}
                  {currentView === 'users' && 'View and manage platform users'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="text-right hidden md:block">
                <p className="text-white">Admin User</p>
                <p className="text-purple-300">admin@kindness.app</p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white">
                AU
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">
          {currentView === 'dashboard' && <Dashboard onViewChange={setCurrentView} />}
          {currentView === 'moderation' && <MessageTable />}
          {currentView === 'users' && <UserTable />}
        </main>
      </div>
    </div>
  );
}