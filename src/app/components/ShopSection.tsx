import { ShopItem } from '@/app/dashboard/Dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Sparkles, Check, Lock, ShoppingBag, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from './ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface ShopSectionProps {
  points: number;
  unlockedItems: string[];
  onUnlock: (item: ShopItem) => void;
}

const shopItems: ShopItem[] = [
  // Fonts
  { id: 'font-sans', name: 'Sans Serif', type: 'font', value: 'sans-serif', cost: 0, unlocked: true },
  { id: 'font-serif', name: 'Serif Font', type: 'font', value: 'serif', cost: 20, unlocked: false },
  { id: 'font-mono', name: 'Monospace', type: 'font', value: 'monospace', cost: 30, unlocked: false },
  { id: 'font-cursive', name: 'Cursive Font', type: 'font', value: 'cursive', cost: 50, unlocked: false },
  
  // Colors
  { id: 'color-black', name: 'Black', type: 'color', value: '#000000', cost: 0, unlocked: true },
  { id: 'color-white', name: 'White', type: 'color', value: '#FFFFFF', cost: 0, unlocked: true },
  { id: 'color-purple', name: 'Purple', type: 'color', value: '#8B5CF6', cost: 15, unlocked: false },
  { id: 'color-deep-purple', name: 'Deep Purple', type: 'color', value: '#6D28D9', cost: 15, unlocked: false },
  { id: 'color-blue', name: 'Blue', type: 'color', value: '#3B82F6', cost: 15, unlocked: false },
  { id: 'color-green', name: 'Green', type: 'color', value: '#10B981', cost: 15, unlocked: false },
  
  // Backgrounds
  { id: 'bg-white', name: 'White', type: 'background', value: '#FFFFFF', cost: 0, unlocked: true },
  { id: 'bg-purple', name: 'Light Purple', type: 'background', value: '#F3E8FF', cost: 25, unlocked: false },
  { id: 'bg-deep-purple', name: 'Lavender', type: 'background', value: '#EDE9FE', cost: 25, unlocked: false },
  { id: 'bg-blue', name: 'Light Blue', type: 'background', value: '#DBEAFE', cost: 25, unlocked: false },
  { id: 'bg-yellow', name: 'Light Yellow', type: 'background', value: '#FEF3C7', cost: 25, unlocked: false },
  
  // Sizes
  { id: 'size-medium', name: 'Medium', type: 'size', value: 'medium', cost: 0, unlocked: true },
  { id: 'size-small', name: 'Small', type: 'size', value: 'small', cost: 10, unlocked: false },
  { id: 'size-large', name: 'Large', type: 'size', value: 'large', cost: 40, unlocked: false },
];

const categories = [
  { type: 'font', title: 'Font Styles', icon: '✍️', description: 'Choose different typography styles' },
  { type: 'color', title: 'Text Colors', icon: '🎨', description: 'Colorful text for your messages' },
  { type: 'background', title: 'Backgrounds', icon: '🎭', description: 'Beautiful background colors' },
  { type: 'size', title: 'Font Sizes', icon: '📏', description: 'Adjust text size' }
];

export function ShopSection({ points, unlockedItems, onUnlock }: ShopSectionProps) {
  return (
    <div className="space-y-6 mt-6">

      {/* Shop Categories */}
      <Accordion type="multiple" className="space-y-4">
        {categories.map((category, categoryIndex) => {
          const items = shopItems.filter((item) => item.type === category.type);

          return (
            <AccordionItem key={category.type} value={category.type} className="glass-card border-purple-500/30 rounded-2xl px-6">
              <AccordionTrigger className="text-xl hover:no-underline py-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{category.icon}</span>
                  <div className="text-left">
                    <div className="text-white text-2xl font-semibold" style={{ fontFamily: "'Instrument Serif', serif" }}>{category.title}</div>
                    <div className="text-white/70 text-base font-normal" style={{ fontFamily: "'Poppins', sans-serif" }}>{category.description}</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  {items.map((item) => {
                    const isUnlocked = unlockedItems.includes(item.id);
                    const canAfford = points >= item.cost;

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isUnlocked
                            ? 'border-green-400/50 bg-green-900/20'
                            : 'border-purple-500/30 bg-white/5 hover:border-purple-500/50 hover:bg-white/10'
                        }`}
                      >
                        {/* Preview */}
                        <div className="mb-3">
                          {item.type === 'color' || item.type === 'background' ? (
                            <div
                              className="w-full h-16 rounded-md border-2 border-purple-500/30"
                              style={{ backgroundColor: item.value }}
                            />
                          ) : item.type === 'font' ? (
                            <div
                              className="text-center py-3 bg-white/10 rounded-md border border-purple-500/30 text-white"
                              style={{ fontFamily: item.value }}
                            >
                              Aa Bb Cc
                            </div>
                          ) : (
                            <div
                              className="text-center py-3 bg-white/10 rounded-md border border-purple-500/30 text-white"
                              style={{
                                fontSize:
                                  item.value === 'small' ? '12px' : item.value === 'large' ? '20px' : '16px'
                              }}
                            >
                              Sample Text
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-white font-medium">{item.name}</span>
                            {isUnlocked && (
                              <Badge variant="outline" className="bg-green-500/20 border-green-400/50 text-green-300 shrink-0">
                                <Check className="w-3 h-3" />
                              </Badge>
                            )}
                          </div>

                          {!isUnlocked && (
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-1 text-white/70">
                                <Sparkles className="w-4 h-4 text-purple-400" />
                                <span>{item.cost} K</span>
                              </div>
                              <button
                                onClick={() => onUnlock(item)}
                                disabled={!canAfford || item.cost === 0}
                                className={`h-8 rounded-md gap-1.5 px-3 text-sm font-medium transition-all inline-flex items-center justify-center disabled:pointer-events-none disabled:opacity-50 bg-white/5 ${
                                  canAfford && item.cost > 0 
                                    ? 'hover:bg-gradient-to-r hover:from-purple-600 hover:to-violet-600 text-white shadow-sm hover:shadow-md' 
                                    : 'text-white/50 cursor-not-allowed'
                                }`}
                              >
                                {!canAfford ? (
                                  <>
                                    <Lock className="w-3 h-3 mr-1" />
                                    Locked
                                  </>
                                ) : (
                                  'Unlock'
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
