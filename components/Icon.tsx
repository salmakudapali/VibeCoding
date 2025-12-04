import React from 'react';
import { 
  Apple, Fish, Star, Cookie, Rocket, HelpCircle, 
  Cat, Dog, Bird, Cloud, Sun, Leaf, Atom, Book, Pencil, Type
} from 'lucide-react';

interface IconProps {
  type: string;
  className?: string;
  style?: React.CSSProperties;
}

export const GameIcon: React.FC<IconProps> = ({ type, className, style }) => {
  const props = { className: className || "w-8 h-8", style };
  const lowerType = type?.toLowerCase() || '';

  // Match keyword to Icon
  if (lowerType.includes('apple')) return <Apple {...props} className={`${props.className} text-red-500 fill-red-200`} />;
  if (lowerType.includes('fish')) return <Fish {...props} className={`${props.className} text-blue-500 fill-blue-200`} />;
  if (lowerType.includes('star')) return <Star {...props} className={`${props.className} text-yellow-500 fill-yellow-200`} />;
  if (lowerType.includes('cookie')) return <Cookie {...props} className={`${props.className} text-amber-700 fill-amber-300`} />;
  if (lowerType.includes('rocket')) return <Rocket {...props} className={`${props.className} text-purple-600 fill-purple-200`} />;
  
  // English
  if (lowerType.includes('cat')) return <Cat {...props} className={`${props.className} text-orange-400 fill-orange-100`} />;
  if (lowerType.includes('dog')) return <Dog {...props} className={`${props.className} text-amber-800 fill-amber-200`} />;
  if (lowerType.includes('book')) return <Book {...props} className={`${props.className} text-blue-600 fill-blue-100`} />;
  if (lowerType.includes('pencil')) return <Pencil {...props} className={`${props.className} text-yellow-600 fill-yellow-100`} />;
  if (lowerType.includes('alphabet') || lowerType.includes('letter')) return <Type {...props} className={`${props.className} text-brand-pink`} />;

  // Science
  if (lowerType.includes('bird')) return <Bird {...props} className={`${props.className} text-sky-400 fill-sky-100`} />;
  if (lowerType.includes('cloud') || lowerType.includes('rain')) return <Cloud {...props} className={`${props.className} text-gray-400 fill-gray-100`} />;
  if (lowerType.includes('sun')) return <Sun {...props} className={`${props.className} text-yellow-500 fill-yellow-100`} />;
  if (lowerType.includes('leaf') || lowerType.includes('plant')) return <Leaf {...props} className={`${props.className} text-green-500 fill-green-100`} />;
  if (lowerType.includes('atom') || lowerType.includes('science')) return <Atom {...props} className={`${props.className} text-brand-teal spin-slow`} />;
  if (lowerType.includes('cow')) return <div className={`text-4xl ${props.className}`} style={style}>🐮</div>; // Fallback to emoji for complex animals if icon missing

  // Default
  return <HelpCircle {...props} className={`${props.className} text-gray-400`} />;
};