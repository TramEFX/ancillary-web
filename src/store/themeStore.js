import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Theme definitions
export const themes = {
  dark: {
    name: 'Dark',
    colors: {
      // Backgrounds
      bg: {
        primary: 'bg-gray-950',
        secondary: 'bg-gray-900',
        tertiary: 'bg-gray-800',
        hover: 'hover:bg-gray-800',
        active: 'bg-gray-800',
      },
      // Text
      text: {
        primary: 'text-white',
        secondary: 'text-gray-300',
        tertiary: 'text-gray-400',
        muted: 'text-gray-500',
      },
      // Borders
      border: {
        primary: 'border-gray-800',
        secondary: 'border-gray-700',
      },
      // Accents
      accent: {
        primary: 'bg-blue-600 hover:bg-blue-700',
        secondary: 'bg-purple-600 hover:bg-purple-700',
        text: 'text-blue-400',
      },
      // Messages
      message: {
        user: 'bg-blue-600',
        assistant: 'bg-gray-800 border border-gray-700',
      },
    },
  },
  
  light: {
    name: 'Light',
    colors: {
      bg: {
        primary: 'bg-gray-50',
        secondary: 'bg-white',
        tertiary: 'bg-gray-100',
        hover: 'hover:bg-gray-100',
        active: 'bg-gray-100',
      },
      text: {
        primary: 'text-gray-900',
        secondary: 'text-gray-700',
        tertiary: 'text-gray-600',
        muted: 'text-gray-500',
      },
      border: {
        primary: 'border-gray-200',
        secondary: 'border-gray-300',
      },
      accent: {
        primary: 'bg-blue-600 hover:bg-blue-700',
        secondary: 'bg-purple-600 hover:bg-purple-700',
        text: 'text-blue-600',
      },
      message: {
        user: 'bg-blue-600',
        assistant: 'bg-gray-100 border border-gray-200',
      },
    },
  },
  
  cyberpunk: {
    name: 'Cyberpunk',
    colors: {
      bg: {
        primary: 'bg-black',
        secondary: 'bg-gray-950',
        tertiary: 'bg-gray-900',
        hover: 'hover:bg-cyan-950/30',
        active: 'bg-cyan-950/50',
      },
      text: {
        primary: 'text-cyan-400',
        secondary: 'text-cyan-300',
        tertiary: 'text-cyan-500',
        muted: 'text-cyan-600',
      },
      border: {
        primary: 'border-cyan-900',
        secondary: 'border-cyan-800',
      },
      accent: {
        primary: 'bg-cyan-600 hover:bg-cyan-500',
        secondary: 'bg-pink-600 hover:bg-pink-500',
        text: 'text-pink-400',
      },
      message: {
        user: 'bg-gradient-to-r from-cyan-600 to-blue-600',
        assistant: 'bg-gray-950 border border-cyan-900',
      },
    },
  },
  
  clinical: {
    name: 'Clinical',
    colors: {
      bg: {
        primary: 'bg-slate-50',
        secondary: 'bg-white',
        tertiary: 'bg-slate-100',
        hover: 'hover:bg-slate-100',
        active: 'bg-slate-200',
      },
      text: {
        primary: 'text-slate-900',
        secondary: 'text-slate-700',
        tertiary: 'text-slate-600',
        muted: 'text-slate-400',
      },
      border: {
        primary: 'border-slate-200',
        secondary: 'border-slate-300',
      },
      accent: {
        primary: 'bg-slate-700 hover:bg-slate-800',
        secondary: 'bg-slate-600 hover:bg-slate-700',
        text: 'text-slate-700',
      },
      message: {
        user: 'bg-slate-700',
        assistant: 'bg-white border border-slate-200',
      },
    },
  },
};

const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ancillary-theme',
    }
  )
);

export default useThemeStore;
