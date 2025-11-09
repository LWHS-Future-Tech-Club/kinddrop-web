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
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-gray-600 mb-1">Your Balance</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-900">{points}</span>
                  <span className="text-gray-600">points</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-600">Send messages</div>
              <div className="text-gray-600">to earn more</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
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
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
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
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        {/* Preview */}
                        <div className="mb-3">
                          {item.type === 'color' || item.type === 'background' ? (
                            <div
                              className="w-full h-16 rounded-md border-2 border-gray-200"
                              style={{ backgroundColor: item.value }}
                            />
                          ) : item.type === 'font' ? (
                            <div
                              className="text-center py-3 bg-gray-50 rounded-md border border-gray-200"
                              style={{ fontFamily: item.value }}
                            >
                              Aa Bb Cc
                            </div>
                          ) : (
                            <div
                              className="text-center py-3 bg-gray-50 rounded-md border border-gray-200"
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
                            <span className="text-gray-900">{item.name}</span>
                            {isUnlocked && (
                              <Badge variant="outline" className="bg-green-100 border-green-300 text-green-700 shrink-0">
                                <Check className="w-3 h-3" />
                              </Badge>
                            )}
                          </div>

                          {!isUnlocked && (
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-1 text-gray-600">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                <span>{item.cost} pts</span>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => onUnlock(item)}
                                disabled={!canAfford || item.cost === 0}
                                variant={canAfford && item.cost > 0 ? 'default' : 'secondary'}
                                className={canAfford && item.cost > 0 ? 'bg-gray-900 hover:bg-gray-800' : ''}
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
