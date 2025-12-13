import { LayoutDashboard, MessageSquare, Users, Heart, X, ArrowLeft } from 'lucide-react';

type View = 'dashboard' | 'moderation' | 'users';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ currentView, onViewChange, sidebarOpen, setSidebarOpen }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'moderation' as View, label: 'Moderation', icon: MessageSquare },
    { id: 'users' as View, label: 'Users', icon: Users },
  ];

  const handleViewChange = (view: View) => {
    onViewChange(view);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white p-6 z-50 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-600" fill="currentColor" />
            </div>
            <div>
              <h2 className="text-white">Kindness</h2>
              <p className="text-purple-200">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-purple-700 p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-purple-900'
                    : 'text-purple-100 hover:bg-purple-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button 
            onClick={() => {}}
            className="w-full flex items-center gap-2 px-4 py-3 text-purple-100 bg-purple-800 hover:bg-purple-700 rounded-lg transition-colors text-left"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Return to User View</span>
          </button>
        </div>
      </div>
    </>
  );
}