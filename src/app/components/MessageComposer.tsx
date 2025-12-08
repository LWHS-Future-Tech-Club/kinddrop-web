import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { MessageCustomization } from '@/app/dashboard/Dashboard';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageComposerProps {
  onSend: (text: string, customization: MessageCustomization) => void;
  currentCustomization: MessageCustomization;
  unlockedItems: string[];
  onCustomizationChange: (customization: Partial<MessageCustomization>) => void;
  disabled?: boolean;
  username?: string;
}

const shopItems = [
  { id: 'font-sans', type: 'font', value: "'Poppins', sans-serif", name: 'Poppins' },
  { id: 'font-serif', type: 'font', value: 'serif', name: 'Serif' },
  { id: 'font-mono', type: 'font', value: 'monospace', name: 'Monospace' },
  { id: 'font-cursive', type: 'font', value: 'cursive', name: 'Cursive' },
  { id: 'color-black', type: 'color', value: '#000000', name: 'Black' },
  { id: 'color-white', type: 'color', value: '#FFFFFF', name: 'White' },
  { id: 'color-purple', type: 'color', value: '#8B5CF6', name: 'Purple' },
  { id: 'color-pink', type: 'color', value: '#EC4899', name: 'Pink' },
  { id: 'color-blue', type: 'color', value: '#3B82F6', name: 'Blue' },
  { id: 'color-green', type: 'color', value: '#10B981', name: 'Green' },
  { id: 'bg-white', type: 'background', value: '#FFFFFF', name: 'White' },
  { id: 'bg-purple', type: 'background', value: '#F3E8FF', name: 'Light Purple' },
  { id: 'bg-pink', type: 'background', value: '#FCE7F3', name: 'Light Pink' },
  { id: 'bg-blue', type: 'background', value: '#DBEAFE', name: 'Light Blue' },
  { id: 'bg-yellow', type: 'background', value: '#FEF3C7', name: 'Light Yellow' },
  { id: 'size-small', type: 'size', value: 'small', name: 'Small' },
  { id: 'size-medium', type: 'size', value: 'medium', name: 'Medium' },
  { id: 'size-large', type: 'size', value: 'large', name: 'Large' },
];

export function MessageComposer({ 
  onSend,
  currentCustomization,
  unlockedItems,
  onCustomizationChange,
  disabled = false,
  username = 'Friend'
}: MessageComposerProps) {
  const [message, setMessage] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message, currentCustomization);
      setMessage('');
    }
  };

  const unlockedFonts = shopItems.filter(i => i.type === 'font' && unlockedItems.includes(i.id));
  const unlockedColors = shopItems.filter(i => i.type === 'color' && unlockedItems.includes(i.id));
  const unlockedBgs = shopItems.filter(i => i.type === 'background' && unlockedItems.includes(i.id));
  const unlockedSizes = shopItems.filter(i => i.type === 'size' && unlockedItems.includes(i.id));

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
          {/* Customization Controls */}
          {!disabled && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <select 
                className="input-glass px-3 py-2 rounded-lg text-sm"
                value={shopItems.find(i => i.value === currentCustomization.fontFamily)?.id || 'font-sans'}
                onChange={(e) => {
                  const item = shopItems.find(i => i.id === e.target.value);
                  if (item) onCustomizationChange({ fontFamily: item.value });
                }}
              >
                {unlockedFonts.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
              <select 
                className="input-glass px-3 py-2 rounded-lg text-sm"
                value={shopItems.find(i => i.value === currentCustomization.color)?.id || 'color-black'}
                onChange={(e) => {
                  const item = shopItems.find(i => i.id === e.target.value);
                  if (item) onCustomizationChange({ color: item.value });
                }}
              >
                {unlockedColors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
              <select 
                className="input-glass px-3 py-2 rounded-lg text-sm"
                value={shopItems.find(i => i.value === currentCustomization.backgroundColor)?.id || 'bg-white'}
                onChange={(e) => {
                  const item = shopItems.find(i => i.id === e.target.value);
                  if (item) onCustomizationChange({ backgroundColor: item.value });
                }}
              >
                {unlockedBgs.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
              <select 
                className="input-glass px-3 py-2 rounded-lg text-sm"
                value={shopItems.find(i => i.value === currentCustomization.fontSize)?.id || 'size-medium'}
                onChange={(e) => {
                  const item = shopItems.find(i => i.id === e.target.value);
                  if (item) onCustomizationChange({ fontSize: item.value });
                }}
              >
                {unlockedSizes.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>
          )}

          {/* Text Input */}
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Make them feel loved..."
            className="min-h-[300px] md:min-h-[360px] resize-none input-glass rounded-3xl text-center p-8 text-lg md:text-xl"
            style={{
              fontFamily: currentCustomization.fontFamily,
              color: currentCustomization.color,
              backgroundColor: currentCustomization.backgroundColor === '#FFFFFF' ? 'rgba(255,255,255,0.03)' : currentCustomization.backgroundColor,
              fontSize: currentCustomization.fontSize === 'small' ? '16px' : currentCustomization.fontSize === 'large' ? '24px' : '20px'
            }}
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
