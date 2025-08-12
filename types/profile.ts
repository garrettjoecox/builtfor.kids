export interface Profile {
  id: string;
  name: string;
  icon: string;
  color: string;
  apps: App[];
}

export interface App {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
}

export const profiles: Profile[] = [
  {
    id: 'toddler',
    name: 'Toddler (2-4 years)',
    icon: '🧸',
    color: 'bg-pink-500',
    apps: [
      { id: 'shapes', name: 'Shapes', icon: '🔴', color: 'bg-red-500' },
      { id: 'colors', name: 'Colors', icon: '🌈', color: 'bg-blue-500' },
      { id: 'animals', name: 'Animals', icon: '🐶', color: 'bg-green-500' },
      { id: 'music', name: 'Music', icon: '🎵', color: 'bg-purple-500' },
    ],
  },
  {
    id: 'preschool',
    name: 'Preschool (4-6 years)',
    icon: '🎒',
    color: 'bg-blue-500',
    apps: [
      { id: 'abc', name: 'ABC', icon: '🔤', color: 'bg-yellow-500' },
      { id: 'numbers', name: 'Numbers', icon: '🔢', color: 'bg-orange-500' },
      { id: 'puzzles', name: 'Puzzles', icon: '🧩', color: 'bg-indigo-500' },
      { id: 'drawing', name: 'Drawing', icon: '🎨', color: 'bg-pink-500' },
    ],
  },
  {
    id: 'elementary',
    name: 'Elementary (6-10 years)',
    icon: '📚',
    color: 'bg-green-500',
    apps: [
      { id: 'math', name: 'Math', icon: '➕', color: 'bg-teal-500' },
      { id: 'reading', name: 'Reading', icon: '📖', color: 'bg-brown-500' },
      { id: 'science', name: 'Science', icon: '🔬', color: 'bg-cyan-500' },
      { id: 'geography', name: 'Geography', icon: '🌍', color: 'bg-emerald-500' },
    ],
  },
];
