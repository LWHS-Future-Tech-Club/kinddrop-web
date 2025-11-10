import { ShopItem } from '../pages/Dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Sparkles, Check, Lock, ShoppingBag, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from './ui/alert';

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
  { id: 'color-purple', name: 'Purple', type: 'color', value: '#8B5CF6', cost: 15, unlocked: false },
  { id: 'color-pink', name: 'Pink', type: 'color', value: '#EC4899', cost: 15, unlocked: false },
  { id: 'color-blue', name: 'Blue', type: 'color', value: '#3B82F6', cost: 15, unlocked: false },
  { id: 'color-green', name: 'Green', type: 'color', value: '#10B981', cost: 15, unlocked: false },
  
  // Backgrounds
  { id: 'bg-white', name: 'White', type: 'background', value: '#FFFFFF', cost: 0, unlocked: true },
  { id: 'bg-purple', name: 'Light Purple', type: 'background', value: '#F3E8FF', cost: 25, unlocked: false },
  { id: 'bg-pink', name: 'Light Pink', type: 'background', value: '#FCE7F3', cost: 25, unlocked: false },
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
    <div className="space-y-8">
      {/* Points Card */}
      <Card className="glass-card bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-white/70 mb-1">Your Balance</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-white text-2xl font-bold">{points}</span>
                  <span className="text-white/70">points</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/70">Send messages</div>
              <div className="text-white/70">to earn more</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert className="glass-card border-purple-500/30 bg-purple-900/20">
        <Info className="h-4 w-4 text-purple-400" />
        <AlertDescription className="text-white/80">
          Unlock customizations to personalize your kindness messages. Each item can be used when composing messages.
        </AlertDescription>
      </Alert>

      {/* Shop Categories */}
      {categories.map((category, categoryIndex) => {
        const items = shopItems.filter((item) => item.type === category.type);

        return (
          <motion.div
            key={category.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
          >
            <Card className="glass-card border-purple-500/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <CardTitle className="text-white">{category.title}</CardTitle>
                    <CardDescription className="text-white/70">{category.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                <span>{item.cost} pts</span>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => onUnlock(item)}
                                disabled={!canAfford || item.cost === 0}
                                variant={canAfford && item.cost > 0 ? 'default' : 'secondary'}
                                className={canAfford && item.cost > 0 ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' : 'bg-white/10 text-white/50'}
                              >
                                {!canAfford ? (
                                  <>
                                    <Lock className="w-3 h-3 mr-1" />
                                    Locked
                                  </>
                                ) : (
                                  'Unlock'
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
