import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { MessageCustomization } from '@/app/dashboard/Dashboard';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageComposerProps {
  onSend: (text: string) => void;
  currentCustomization: MessageCustomization;
  unlockedItems: string[];
  onCustomizationChange: (customization: Partial<MessageCustomization>) => void;
  disabled?: boolean;
  username?: string;
}

export function MessageComposer({ 
  onSend,
  disabled = false,
  username = 'Friend'
}: MessageComposerProps) {
  const [message, setMessage] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="min-h-[700px] flex items-center justify-center relative overflow-hidden rounded-2xl p-8">
      {/* Main Content */}
  <div className="max-w-4xl w-full space-y-8 text-center relative z-10">
        {/* Main Message */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl text-glow"
        >
          Welcome back, {username}!
        </motion.h1>

        {/* Quote */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {disabled ? 'You have already sent a message today. Come back tomorrow!' : "There's a message waiting for you! Send a message to view it."}
        </motion.p>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-6 mt-12"
        >
          {/* Text Input */}
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Make them feel loved..."
            className="min-h-[300px] md:min-h-[360px] resize-none input-glass rounded-3xl text-center p-8 text-lg md:text-xl"
            disabled={disabled}
          />

          {/* Send Button */}
          <div className="relative inline-block mt-10">
            <motion.button
              type="submit"
              disabled={!message.trim() || disabled}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="send-button-custom"
              whileHover={message.trim() && !disabled ? { scale: 1.02 } : {}}
              whileTap={message.trim() && !disabled ? { scale: 0.98 } : {}}
              transition={{ duration: 0.2 }}
            >
              send
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
