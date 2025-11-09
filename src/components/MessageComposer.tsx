import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { MessageCustomization } from '../pages/Dashboard';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageComposerProps {
  onSend: (text: string) => void;
  currentCustomization: MessageCustomization;
  unlockedItems: string[];
  onCustomizationChange: (customization: Partial<MessageCustomization>) => void;
}

export function MessageComposer({ 
  onSend
}: MessageComposerProps) {
  const [message, setMessage] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="min-h-[700px] flex items-center justify-center relative overflow-hidden rounded-2xl bg-gradient-to-b from-purple-900 via-purple-800 to-purple-700 p-8">
      {/* Sparkle decorations */}
      <motion.div
        className="absolute top-20 left-20 text-purple-300"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sparkles className="w-6 h-6" />
      </motion.div>
      
      <motion.div
        className="absolute top-40 right-32 text-purple-300"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <Sparkles className="w-4 h-4" />
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-40 text-purple-300"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <Sparkles className="w-5 h-5" />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-20 text-purple-300"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      >
        <Sparkles className="w-4 h-4" />
      </motion.div>

      {/* Main Content */}
  <div className="max-w-4xl w-full space-y-8 text-center relative z-10">
        {/* Main Message */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white text-4xl md:text-5xl"
          style={{ fontFamily: 'serif' }}
        >
          Be the reason someone smiles today.
        </motion.h1>

        {/* Quote */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-purple-200 italic"
          style={{ fontFamily: 'serif' }}
        >
          "Be kind, for everyone you meet is fighting a hard battle." – Plato
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
            className="min-h-[300px] md:min-h-[360px] resize-none bg-white/10 border-2 border-purple-400/30 text-white placeholder:text-purple-300/60 backdrop-blur-sm focus:border-purple-300 focus:bg-white/15 transition-all rounded-3xl text-center p-8 text-lg md:text-xl"
            style={{ fontFamily: 'serif' }}
          />

          {/* Send Button */}
          <div className="relative inline-block">
            <motion.div
              animate={isHovered ? {
                boxShadow: [
                  '0 0 20px rgba(216, 180, 254, 0.3)',
                  '0 0 40px rgba(216, 180, 254, 0.5)',
                  '0 0 20px rgba(216, 180, 254, 0.3)',
                ]
              } : {}}
              transition={{
                duration: 1.5,
                repeat: isHovered ? Infinity : 0,
                ease: "easeInOut"
              }}
              className="rounded-full"
            >
              <Button
                type="submit"
                size="lg"
                disabled={!message.trim()}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-2 border-white/30 px-20 py-6 md:px-28 md:py-8 rounded-full relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg md:text-xl"
                style={{ fontFamily: 'serif' }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Send
                  <Sparkles className="w-5 h-5" />
                </span>
                
                {/* Glow effect on hover */}
                {isHovered && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </Button>
            </motion.div>

            {/* Floating sparkles around button */}
            {isHovered && (
              <>
                <motion.div
                  className="absolute -top-2 -left-2 text-purple-200"
                  animate={{
                    y: [-5, -10, -5],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>

                <motion.div
                  className="absolute -top-2 -right-2 text-purple-200"
                  animate={{
                    y: [-5, -10, -5],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-2 left-1/4 text-purple-200"
                  animate={{
                    y: [5, 10, 5],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6
                  }}
                >
                  <Sparkles className="w-3 h-3" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-2 right-1/4 text-purple-200"
                  animate={{
                    y: [5, 10, 5],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.9
                  }}
                >
                  <Sparkles className="w-3 h-3" />
                </motion.div>
              </>
            )}
          </div>
        </motion.form>
      </div>
    </div>
  );
}
