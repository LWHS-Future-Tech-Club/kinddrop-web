"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Send, Sparkles, Inbox, ShoppingBag, Sun, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

import { MessageComposer } from '../components/MessageComposer';
import { MessageFeed } from '../components/MessageFeed';
import { ShopSection } from '../components/ShopSection';
import ThankYouPopup from '../components/ThankYouPopup';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

// Shared types used by child components
export interface MessageCustomization {
  fontFamily: string;
  color: string;
  backgroundColor: string;
  fontSize: string;
}

export interface Message {
  id: string;
  text: string;
  type: 'sent' | 'received';
  timestamp: Date;
  customization: MessageCustomization;
}

export interface ShopItem {
  id: string;
  name: string;
  type: 'font' | 'color' | 'background' | 'size';
  value: string;
  cost: number;
  unlocked: boolean;
}

export function Dashboard() {
  const router = useRouter();
  const [points, setPoints] = useState<number>(50);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unlockedItems, setUnlockedItems] = useState<string[]>(['font-sans', 'color-black', 'bg-white', 'size-medium']);
  const [currentCustomization, setCurrentCustomization] = useState<MessageCustomization>({
    fontFamily: 'sans-serif',
    color: '#000000',
    backgroundColor: '#FFFFFF',
    fontSize: 'medium',
  });
  const [showThanks, setShowThanks] = useState(false);
  const [lastPointsAdded, setLastPointsAdded] = useState<number>(10);

  // Try to read a stored user for display (not required to view dashboard)
  const [userEmail, setUserEmail] = useState<string | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('kinddrop_user');
      if (raw) {
        const u = JSON.parse(raw);
        setUserEmail(u?.email ?? null);
      }
    } catch (err) {
      setUserEmail(null);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {}
    try {
      localStorage.removeItem('kinddrop_user');
    } catch (storageErr) {}
    router.push('/login');
  };

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
      customization: { ...currentCustomization },
      type: 'sent',
    };

    setMessages((prev) => [newMessage, ...prev]);
    const added = 10;
    setPoints((p) => p + added);
    setLastPointsAdded(added);
    // show popup briefly
    setShowThanks(true);
    window.setTimeout(() => setShowThanks(false), 1800);
  };

  const handleUnlockItem = (item: ShopItem) => {
    if (points >= item.cost && !unlockedItems.includes(item.id)) {
      setPoints((p) => p - item.cost);
      setUnlockedItems((u) => [...u, item.id]);
    }
  };

  const handleCustomizationChange = (customization: Partial<MessageCustomization>) => {
    setCurrentCustomization((c) => ({ ...c, ...customization }));
  };

  return (
    <div className="min-h-screen">
      <ThankYouPopup show={showThanks} pointsAdded={lastPointsAdded} onClose={() => setShowThanks(false)} />
      {/* Header */}
      <header className="glass-header mx-6 my-6 px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#8000FF'}}>
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-glow">KindDrop</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--primary)]" />
              <span className="font-bold">{points}</span>
              <span className="text-sm">points</span>
            </div>

            <div className="flex items-center gap-4">
              {/* {userEmail ? (
                <div className="text-sm text-[var(--text-muted)]">Signed in as <span className="font-medium text-white">{userEmail}</span></div>
              ) : (
                <div className="text-sm text-[var(--text-muted)]">Guest</div>
              )} */}

              <Link href="/settings">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Sun className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>

              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-0 py-0">
        <Tabs defaultValue="send" className="space-y-0">
          <TabsList className="w-full max-w-3xl mx-auto h-8">
            <TabsTrigger value="send" className="py-0">Send</TabsTrigger>
            <TabsTrigger value="messages" className="py-0">Messages</TabsTrigger>
            <TabsTrigger value="shop" className="py-0">Shop</TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="pt-0">
            <div className="max-w-3xl mx-auto">
              <MessageComposer
                onSend={handleSendMessage}
                currentCustomization={currentCustomization}
                unlockedItems={unlockedItems}
                onCustomizationChange={handleCustomizationChange}
              />
            </div>
          </TabsContent>

          <TabsContent value="messages" className="pt-0">
            <div className="max-w-3xl mx-auto">
              <MessageFeed messages={messages} />
            </div>
          </TabsContent>

          <TabsContent value="shop" className="pt-0">
            <div className="max-w-5xl mx-auto">
              <ShopSection points={points} unlockedItems={unlockedItems} onUnlock={handleUnlockItem} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default Dashboard;
