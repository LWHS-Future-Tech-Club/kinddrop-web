"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Inbox } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface InboxMessage {
  id: string;
  text: string;
  senderEmail?: string | null;
  recipientEmail?: string | null;
  timestampMs: number;
  type: 'sent' | 'received';
}

export function MessageInbox() {
  const [sentMessages, setSentMessages] = useState<InboxMessage[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await fetch('/api/get-user-messages', {
          method: 'GET',
          credentials: 'include'
        });

        if (res.ok) {
          const data = await res.json();
          setSentMessages((data.sentMessages || []) as InboxMessage[]);
          setReceivedMessages((data.receivedMessages || []) as InboxMessage[]);
        }
      } catch (err) {
        console.error('Error loading messages:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-purple-400 mb-2">Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[500px] p-6">
      <Tabs defaultValue="received" valuesOrder={["received", "sent"]} className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="received" className="flex-1">
            <Inbox className="w-4 h-4 mr-2" />
            Received ({receivedMessages.length})
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex-1">
            <Send className="w-4 h-4 mr-2" />
            Sent ({sentMessages.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {receivedMessages.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 mx-auto mb-4 text-purple-400/50" />
              <p className="text-lg text-white/60">No messages received yet</p>
              <p className="text-sm text-white/40 mt-2">Send a message to receive one!</p>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {receivedMessages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-6 rounded-2xl"
                >
                  <p className="text-lg text-white mb-3">"{msg.text}"</p>
                  <div className="flex items-center justify-between text-sm text-white/60">
                    <span>From: {msg.senderEmail}</span>
                    <span>{new Date(msg.timestampMs).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {sentMessages.length === 0 ? (
            <div className="text-center py-12">
              <Send className="w-16 h-16 mx-auto mb-4 text-purple-400/50" />
              <p className="text-lg text-white/60">No messages sent yet</p>
              <p className="text-sm text-white/40 mt-2">Spread kindness by sending your first message!</p>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {sentMessages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-6 rounded-2xl"
                >
                  <p className="text-lg text-white mb-3">"{msg.text}"</p>
                  <div className="flex items-center justify-between text-sm text-white/60">
                    <span>To: {msg.recipientEmail || 'Waiting for recipient...'}</span>
                    <span>{new Date(msg.timestampMs).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
