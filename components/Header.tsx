import React from 'react';
import MusicNoteIcon from './icons/MusicNoteIcon';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="py-6 bg-white/80 dark:bg-dark-card/50 backdrop-blur-sm border-b border-gray-200 dark:border-dark-border sticky top-0 z-20">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <MusicNoteIcon className="h-8 w-8 text-brand-primary"/>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              FreelancMusic
            </h1>
            <p className="text-gray-500 dark:text-dark-text-secondary mt-1">Conectando músicos e oportunidades</p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-600 dark:text-dark-text-secondary bg-gray-200/50 dark:bg-dark-bg/50 hover:bg-gray-200 dark:hover:bg-dark-bg transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <MoonIcon className="w-5 h-5" />
          ) : (
            <SunIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;