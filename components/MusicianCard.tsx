import React from 'react';
import type { Musician } from '../types';
import MusicNoteIcon from './icons/MusicNoteIcon';
import LocationIcon from './icons/LocationIcon';
import HeartIcon from './icons/HeartIcon';

interface MusicianCardProps {
  musician: Musician;
  onSelect: (musician: Musician) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const MusicianCard: React.FC<MusicianCardProps> = ({ musician, onSelect, isFavorite, onToggleFavorite }) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o modal seja aberto ao clicar no coração
    onToggleFavorite(musician.id);
  };
  
  return (
    <div
      className="relative bg-white dark:bg-dark-card rounded-lg overflow-hidden shadow-lg hover:shadow-brand-primary/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col group"
      onClick={() => onSelect(musician)}
    >
      <button 
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 z-10 p-2 bg-black/30 rounded-full text-white hover:text-red-500 transition-colors duration-200"
        aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <HeartIcon filled={isFavorite} className={`w-5 h-5 ${isFavorite ? 'text-red-500' : ''}`} />
      </button>

      <img
        src={musician.image}
        alt={musician.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{musician.name}</h3>
        <div className="flex items-center space-x-2 text-gray-500 dark:text-dark-text-secondary text-sm mb-2">
          <LocationIcon className="w-4 h-4 text-brand-secondary" />
          <span>{musician.location}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500 dark:text-dark-text-secondary text-sm">
          <MusicNoteIcon className="w-4 h-4 text-brand-primary" />
          <span>{musician.instruments.join(', ')}</span>
        </div>
        <div className="mt-auto pt-4">
            <div className="flex flex-wrap gap-2">
            {musician.genres.slice(0, 3).map((genre) => (
                <span key={genre} className="bg-gray-100 dark:bg-dark-border text-xs font-medium px-2.5 py-1 rounded-full text-gray-600 dark:text-dark-text-secondary">
                {genre}
                </span>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MusicianCard;