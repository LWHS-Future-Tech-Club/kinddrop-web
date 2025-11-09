"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
      <header className="glass-card mx-6 my-6 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
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
              {userEmail ? (
                <div className="text-sm text-[var(--text-muted)]">Signed in as <span className="font-medium text-white">{userEmail}</span></div>
              ) : (
                <div className="text-sm text-[var(--text-muted)]">Guest</div>
              )}

              <Link href="/">
                <Button variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold mb-2 text-glow">Your Daily Dose of Brightness</h1>
          <p className="text-[var(--text-muted)] max-w-2xl">Send messages of encouragement and positivity. Brighten someone's day and earn points to unlock customizations.</p>
        </motion.div>
      </div>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="send" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-white/5 border border-[var(--border)]">
            <TabsTrigger value="send">Send</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="shop">Shop</TabsTrigger>
          </TabsList>

          <TabsContent value="send">
            <div className="max-w-3xl mx-auto">
              <MessageComposer
                onSend={handleSendMessage}
                currentCustomization={currentCustomization}
                unlockedItems={unlockedItems}
                onCustomizationChange={handleCustomizationChange}
              />
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <div className="max-w-3xl mx-auto">
              <MessageFeed messages={messages} />
            </div>
          </TabsContent>

          <TabsContent value="shop">
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
