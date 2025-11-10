import { Message } from '../pages/Dashboard';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Heart, Send, Inbox } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageFeedProps {
  messages: Message[];
}

export function MessageFeed({ messages }: MessageFeedProps) {
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getFontSize = (size: string) => {
    switch (size) {
      case 'small': return '14px';
      case 'large': return '20px';
      default: return '16px';
    }
  };

  if (messages.length === 0) {
    return (
      <Card className="glass-card border-dashed border-purple-500/30">
        <CardContent className="py-16 text-center">
          <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">No messages yet</h3>
          <p className="text-white/70">
            Your sent and received messages will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-semibold">Your Messages</h2>
          <p className="text-white/70">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="glass-card border-purple-500/30">
              <CardContent className="p-6 space-y-4">
                {/* Message */}
                <div
                  className="p-5 rounded-lg border border-purple-500/30 bg-white/5"
                  style={{
                    fontFamily: message.customization.fontFamily,
                    color: message.customization.color,
                    backgroundColor: message.customization.backgroundColor,
                    fontSize: getFontSize(message.customization.fontSize)
                  }}
                >
                  {message.text}
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-purple-500/50 text-purple-300 bg-purple-500/10">
                    {message.type === 'sent' ? (
                      <>
                        <Send className="w-3 h-3 mr-1" />
                        Sent
                      </>
                    ) : (
                      <>
                        <Heart className="w-3 h-3 mr-1" />
                        Received
                      </>
                    )}
                  </Badge>
                  <span className="text-white/70">{formatTimestamp(message.timestamp)}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
