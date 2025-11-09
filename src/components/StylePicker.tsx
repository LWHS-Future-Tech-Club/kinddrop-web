import { MessageCustomization } from '../pages/Dashboard';
import { Check } from 'lucide-react';

interface StylePickerProps {
  currentCustomization: MessageCustomization;
  unlockedItems: string[];
  onCustomizationChange: (customization: Partial<MessageCustomization>) => void;
}

const fontOptions = [
  { id: 'font-sans', value: 'sans-serif', label: 'Sans', sample: 'Aa' },
  { id: 'font-serif', value: 'serif', label: 'Serif', sample: 'Aa' },
  { id: 'font-mono', value: 'monospace', label: 'Mono', sample: 'Aa' },
  { id: 'font-cursive', value: 'cursive', label: 'Cursive', sample: 'Aa' }
];

const colorOptions = [
  { id: 'color-black', value: '#000000', label: 'Black' },
  { id: 'color-purple', value: '#8B5CF6', label: 'Purple' },
  { id: 'color-pink', value: '#EC4899', label: 'Pink' },
  { id: 'color-blue', value: '#3B82F6', label: 'Blue' },
  { id: 'color-green', value: '#10B981', label: 'Green' }
];

const bgOptions = [
  { id: 'bg-white', value: '#FFFFFF', label: 'White' },
  { id: 'bg-purple', value: '#F3E8FF', label: 'Purple' },
  { id: 'bg-pink', value: '#FCE7F3', label: 'Pink' },
  { id: 'bg-blue', value: '#DBEAFE', label: 'Blue' },
  { id: 'bg-yellow', value: '#FEF3C7', label: 'Yellow' }
];

const sizeOptions = [
  { id: 'size-small', value: 'small', label: 'S' },
  { id: 'size-medium', value: 'medium', label: 'M' },
  { id: 'size-large', value: 'large', label: 'L' }
];

export function StylePicker({
  currentCustomization,
  unlockedItems,
  onCustomizationChange
}: StylePickerProps) {
  return (
    <div className="p-6 bg-gray-50 rounded-xl space-y-6 border border-gray-200">
      {/* Fonts */}
      <div className="space-y-3">
        <div className="text-gray-500">Font</div>
        <div className="grid grid-cols-4 gap-2">
          {fontOptions.map((option) => {
            const isUnlocked = unlockedItems.includes(option.id);
            const isSelected = currentCustomization.fontFamily === option.value;
            return (
              <button
                key={option.id}
                disabled={!isUnlocked}
                onClick={() => onCustomizationChange({ fontFamily: option.value })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-black bg-white'
                    : 'border-gray-200 bg-white hover:border-gray-400'
                } ${!isUnlocked && 'opacity-40 cursor-not-allowed'}`}
              >
                <div
                  className="text-center"
                  style={{ fontFamily: option.value }}
                >
                  {option.sample}
                </div>
                <div className="text-gray-500 mt-1">{option.label}</div>
                {!isUnlocked && <div className="text-xs text-gray-400 mt-1">🔒</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Text Colors */}
      <div className="space-y-3">
        <div className="text-gray-500">Text Color</div>
        <div className="flex gap-2">
          {colorOptions.map((option) => {
            const isUnlocked = unlockedItems.includes(option.id);
            const isSelected = currentCustomization.color === option.value;
            return (
              <button
                key={option.id}
                disabled={!isUnlocked}
                onClick={() => onCustomizationChange({ color: option.value })}
                className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                  isSelected ? 'border-black scale-110' : 'border-gray-200'
                } ${!isUnlocked && 'opacity-40 cursor-not-allowed'}`}
                style={{ backgroundColor: option.value }}
              >
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white drop-shadow-lg" />
                  </div>
                )}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs">
                    🔒
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Backgrounds */}
      <div className="space-y-3">
        <div className="text-gray-500">Background</div>
        <div className="flex gap-2">
          {bgOptions.map((option) => {
            const isUnlocked = unlockedItems.includes(option.id);
            const isSelected = currentCustomization.backgroundColor === option.value;
            return (
              <button
                key={option.id}
                disabled={!isUnlocked}
                onClick={() => onCustomizationChange({ backgroundColor: option.value })}
                className={`relative w-12 h-12 rounded-lg border-2 transition-all ${
                  isSelected ? 'border-black scale-110' : 'border-gray-200'
                } ${!isUnlocked && 'opacity-40 cursor-not-allowed'}`}
                style={{ backgroundColor: option.value }}
              >
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-5 h-5 text-black drop-shadow-sm" />
                  </div>
                )}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs">
                    🔒
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-3">
        <div className="text-gray-500">Size</div>
        <div className="flex gap-2">
          {sizeOptions.map((option) => {
            const isUnlocked = unlockedItems.includes(option.id);
            const isSelected = currentCustomization.fontSize === option.value;
            return (
              <button
                key={option.id}
                disabled={!isUnlocked}
                onClick={() => onCustomizationChange({ fontSize: option.value })}
                className={`px-6 py-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-black bg-white'
                    : 'border-gray-200 bg-white hover:border-gray-400'
                } ${!isUnlocked && 'opacity-40 cursor-not-allowed'}`}
              >
                {option.label}
                {!isUnlocked && <span className="ml-2 text-xs">🔒</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
