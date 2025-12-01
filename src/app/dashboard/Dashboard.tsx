"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Send, Sparkles, Inbox, ShoppingBag, Sun, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

import { MessageComposer } from '../components/MessageComposer';
import { MessageFeed } from '../components/MessageFeed';
import { MessageInbox } from '../components/MessageInbox';
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
  const [canSend, setCanSend] = useState<boolean>(true);
  const [canReceive, setCanReceive] = useState<boolean>(true);
  const [receivedMessage, setReceivedMessage] = useState<{text: string, senderEmail: string} | null>(null);

  // Try to read a stored user for display (not required to view dashboard)
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('Friend');
  useEffect(() => {
    try {
      const raw = localStorage.getItem('kinddrop_user');
      if (raw) {
        const u = JSON.parse(raw);
        setUserEmail(u?.email ?? null);
        setUsername(u?.username ?? 'Friend');
      }
    } catch (err) {
      setUserEmail(null);
      setUsername('Friend');
    }
  }, []);

  // Check if user can send message today on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch('/api/get-user', { method: 'GET', credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data?.user?.points !== undefined) {
            setPoints(data.user.points);
          }
          if (data?.user?.username) {
            setUsername(data.user.username);
          }
        }
      } catch (err) {
        // ignore
      }
    };

    const loadLatestReceived = async () => {
      try {
        const res = await fetch('/api/get-user-messages', {
          method: 'GET',
          credentials: 'include'
        });
        if (!res.ok) return;
        const data = await res.json();
        const received = Array.isArray(data.receivedMessages) ? data.receivedMessages : [];
        if (received.length > 0) {
          // Pick most recent by timestamp
          const sorted = received.slice().sort((a: any, b: any) => {
            const ta = a.timestamp?.seconds ? a.timestamp.seconds * 1000 : new Date(a.timestamp).getTime();
            const tb = b.timestamp?.seconds ? b.timestamp.seconds * 1000 : new Date(b.timestamp).getTime();
            return tb - ta;
          });
          const latest = sorted[0];
          setReceivedMessage({ text: latest.text, senderEmail: latest.senderEmail });
        }
      } catch (err) {
        // ignore
      }
    };

    const checkSendStatus = async () => {
      try {
        const res = await fetch('/api/check-send-status', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (res.ok) {
          const data = await res.json();
          setCanSend(data.canSend ?? true);
          setCanReceive(data.canReceive ?? true);
          // If user already received, load the latest received message to display inline
          if (!data.canSend && !data.canReceive) {
            loadLatestReceived();
          }
        }
      } catch (err) {
        console.error('Error checking send status:', err);
      }
    };
    
    checkSendStatus();
    loadUser();
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

  const handleSendMessage = async (text: string) => {
    try {
      // Call send-message API
      const sendRes = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text })
      });

      const sendData = await sendRes.json();
      
      if (!sendRes.ok || !sendData.success) {
        alert(sendData.error || 'Failed to send message');
        return;
      }

      // Update points from server response
      if (sendData.points) {
        setPoints(sendData.points);
        setLastPointsAdded(10);
      }

      // Disable send button (user has sent for today)
      setCanSend(false);

      // First, show "Message Sent" popup with +10 points
      setShowThanks(true);
      
      // After 2 seconds, hide thanks popup and start finding message
      setTimeout(async () => {
        setShowThanks(false);

        // Call get-message API to receive a message
        const getRes = await fetch('/api/get-message', {
          method: 'GET',
          credentials: 'include'
        });

        const getData = await getRes.json();

        if (getData.message) {
          // Message received! Show it in popup
          setCanReceive(false);
          setReceivedMessage({
            text: getData.message.text,
            senderEmail: getData.message.senderEmail
          });
          
          // Add to messages feed
          const newMessage: Message = {
            id: getData.message.id,
            text: getData.message.text,
            timestamp: new Date(getData.message.timestamp?.seconds * 1000 || Date.now()),
            customization: { ...currentCustomization },
            type: 'received',
          };
          setMessages((prev) => [newMessage, ...prev]);
        }
        // If getData.waiting is true, the UI will already show "check back later" 
        // because canSend=false and canReceive=true
      }, 2000);
    } catch (error: any) {
      console.error('Error sending message:', error);
      alert('Error: ' + error.message);
    }
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

      {/* Inline rendering handles received message; overlay removed */}

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
              <span className="text-sm">karma</span>
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
              {canSend ? (
                <MessageComposer
                  onSend={handleSendMessage}
                  currentCustomization={currentCustomization}
                  unlockedItems={unlockedItems}
                  onCustomizationChange={handleCustomizationChange}
                  disabled={false}
                  username={username}
                />
              ) : (
                <>
                  <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl text-glow text-center mt-6"
                  >
                    Welcome back, {username}!
                  </motion.h1>

                  <div className="min-h-[600px] flex items-start justify-center pt-16">
                    <div className="bg-white/10 backdrop-blur-md p-12 rounded-3xl text-center max-w-xl w-full mx-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        {canReceive ? 'We are finding a message for you...' : 'You received a message!'}
                      </h2>
                      {canReceive ? (
                        <p className="text-white/80 text-lg md:text-xl">Check back later for a message</p>
                      ) : receivedMessage ? (
                        <div>
                          <p className="text-white text-xl md:text-2xl mb-3">"{receivedMessage.text}"</p>
                          <p className="text-white/70 text-sm">From: {receivedMessage.senderEmail}</p>
                        </div>
                      ) : (
                        <p className="text-white/80 text-lg md:text-xl">Message received!</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="pt-0">
            <div className="max-w-3xl mx-auto">
              <MessageInbox />
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
