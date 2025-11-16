import React from 'react';
import type { Musician } from '../types';
import CloseIcon from './icons/CloseIcon';
import LocationIcon from './icons/LocationIcon';
import MusicNoteIcon from './icons/MusicNoteIcon';
import EditIcon from './icons/EditIcon';

interface MusicianProfileModalProps {
  musician: Musician | null;
  onClose: () => void;
  onEdit: (musician: Musician) => void;
}

const MusicianProfileModal: React.FC<MusicianProfileModalProps> = ({ musician, onClose, onEdit }) => {
  if (!musician) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white dark:bg-dark-card rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 dark:text-dark-text-secondary hover:text-gray-800 dark:hover:text-white transition-colors z-10">
          <CloseIcon className="w-6 h-6" />
        </button>
        <div className="p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
            <img src={musician.image} alt={musician.name} className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-dark-border mx-auto sm:mx-0"/>
            <div className="text-center sm:text-left flex-grow">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{musician.name}</h2>
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-500 dark:text-dark-text-secondary mt-1">
                <LocationIcon className="w-5 h-5 text-brand-secondary" />
                <span>{musician.location}</span>
              </div>
            </div>
            <button 
              onClick={() => onEdit(musician)}
              className="mt-4 sm:mt-0 bg-gray-100 dark:bg-dark-border/50 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-dark-border transition-colors flex items-center justify-center space-x-2"
              aria-label="Editar Perfil"
            >
              <EditIcon className="w-4 h-4" />
              <span>Editar</span>
            </button>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-brand-primary mb-2 border-b border-gray-200 dark:border-dark-border pb-2">Sobre</h3>
              <p className="text-gray-600 dark:text-dark-text-secondary leading-relaxed">{musician.bio}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-brand-primary mb-2 border-b border-gray-200 dark:border-dark-border pb-2">Detalhes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-dark-text-secondary">
                <div className="flex items-start space-x-3">
                  <MusicNoteIcon className="w-5 h-5 mt-1 text-brand-primary flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-800 dark:text-dark-text">Instrumentos:</span>
                    <p>{musician.instruments.join(', ')}</p>
                  </div>
                </div>
                 <div>
                    <span className="font-semibold text-gray-800 dark:text-dark-text">Gêneros:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {musician.genres.map((genre) => (
                            <span key={genre} className="bg-gray-100 dark:bg-dark-border text-xs font-medium px-2.5 py-1 rounded-full text-gray-600 dark:text-dark-text-secondary">
                            {genre}
                            </span>
                        ))}
                    </div>
                </div>
              </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-brand-primary mb-2 border-b border-gray-200 dark:border-dark-border pb-2">Contato e Portfólio</h3>
                <div className="space-y-2 text-gray-600 dark:text-dark-text-secondary">
                    <p><span className="font-semibold text-gray-800 dark:text-dark-text">E-mail:</span> <a href={`mailto:${musician.email}`} className="text-brand-secondary hover:underline">{musician.email}</a></p>
                    <p><span className="font-semibold text-gray-800 dark:text-dark-text">Portfólio:</span> <a href={musician.portfolio} target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline">{musician.portfolio}</a></p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicianProfileModal;