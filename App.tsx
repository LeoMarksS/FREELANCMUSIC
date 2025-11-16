import React, { useState, useMemo, useEffect } from 'react';
import type { Musician } from './types';
import Header from './components/Header';
import MusicianCard from './components/MusicianCard';
import MusicianProfileModal from './components/MusicianProfileModal';
import RegistrationForm from './components/RegistrationForm';

const MOCK_MUSICIANS: Musician[] = [
  {
    id: '1',
    name: 'Eleanor Vance',
    location: 'New York, NY',
    instruments: ['Violin', 'Piano'],
    genres: ['Classical', 'Orchestral', 'Cinematic'],
    bio: 'A passionate classical violinist with over 15 years of experience performing with renowned orchestras. My music aims to evoke deep emotion and tell a story without words.',
    email: 'eleanor.v@example.com',
    portfolio: 'https://example.com/eleanorvance',
    image: 'https://picsum.photos/seed/EleanorVance/400/300',
  },
  {
    id: '2',
    name: 'Marcus Holloway',
    location: 'Chicago, IL',
    instruments: ['Saxophone', 'Clarinet'],
    genres: ['Jazz', 'Blues', 'Soul'],
    bio: 'Saxophonist bringing the smooth, soulful sounds of Chicago jazz to life. Perfect for intimate venues, weddings, and corporate events looking for a touch of class and improvisation.',
    email: 'marcus.h@example.com',
    portfolio: 'https://example.com/marcusholloway',
    image: 'https://picsum.photos/seed/MarcusHolloway/400/300',
  },
  {
    id: '3',
    name: 'Chloe Kim',
    location: 'Los Angeles, CA',
    instruments: ['Acoustic Guitar', 'Vocals'],
    genres: ['Indie', 'Folk', 'Singer-Songwriter'],
    bio: 'I write and perform heartfelt songs about life, love, and the world around us. My acoustic sets create a warm, engaging atmosphere for coffee shops, small gatherings, and house concerts.',
    email: 'chloe.k@example.com',
    portfolio: 'https://example.com/chloekim',
    image: 'https://picsum.photos/seed/ChloeKim/400/300',
  },
  {
    id: '4',
    name: 'Leo Chen',
    location: 'Austin, TX',
    instruments: ['Electric Guitar'],
    genres: ['Rock', 'Blues Rock', 'Psychedelic'],
    bio: 'Lead guitarist with a flair for electrifying solos and groovy rhythms. My style is heavily influenced by classic rock legends, and I bring high energy to every performance.',
    email: 'leo.c@example.com',
    portfolio: 'https://example.com/leochen',
    image: 'https://picsum.photos/seed/LeoChen/400/300',
  },
  {
    id: '5',
    name: 'Jasmine Rodriguez',
    location: 'Miami, FL',
    instruments: ['DJ Controller', 'Synthesizer'],
    genres: ['Electronic', 'House', 'Techno'],
    bio: 'DJ and producer creating infectious dance beats. I specialize in reading the crowd and building a set that keeps the energy high and the dance floor packed all night long.',
    email: 'jasmine.r@example.com',
    portfolio: 'https://example.com/jasminerodriguez',
    image: 'https://picsum.photos/seed/JasmineR/400/300',
  },
  {
    id: '6',
    name: 'Samuel Jones',
    location: 'New Orleans, LA',
    instruments: ['Trumpet', 'Trombone'],
    genres: ['Brass Band', 'Funk', 'Jazz'],
    bio: 'Bringing the vibrant sounds of New Orleans brass to any event. My band and I deliver an authentic, high-energy performance that is guaranteed to get people moving and smiling.',
    email: 'samuel.j@example.com',
    portfolio: 'https://example.com/samueljones',
    image: 'https://picsum.photos/seed/SamuelJones/400/300',
  }
];

const FAVORITES_KEY = 'freelancmusic_favorites';

export default function App() {
  const [musicians, setMusicians] = useState<Musician[]>(MOCK_MUSICIANS);
  const [selectedMusician, setSelectedMusician] = useState<Musician | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [musicianToEdit, setMusicianToEdit] = useState<Musician | null>(null);
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse favorites from localStorage", error);
      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [instrumentFilter, setInstrumentFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const allInstruments = useMemo(() => {
    const instruments = new Set(musicians.flatMap(m => m.instruments));
    return Array.from(instruments).sort();
  }, [musicians]);

  const allGenres = useMemo(() => {
    const genres = new Set(musicians.flatMap(m => m.genres));
    return Array.from(genres).sort();
  }, [musicians]);
  
  const filteredMusicians = useMemo(() => {
    return musicians.filter(musician => {
      const nameMatch = musician.name.toLowerCase().includes(searchTerm.toLowerCase());
      const instrumentMatch = instrumentFilter ? musician.instruments.includes(instrumentFilter) : true;
      const genreMatch = genreFilter ? musician.genres.includes(genreFilter) : true;
      return nameMatch && instrumentMatch && genreMatch;
    });
  }, [musicians, searchTerm, instrumentFilter, genreFilter]);

  const favoritedMusicians = useMemo(() => {
    return musicians.filter(musician => favorites.includes(musician.id));
  }, [musicians, favorites]);

  const handleRegister = (newMusician: Musician) => {
    setMusicians(prev => [newMusician, ...prev]);
  };
  
  const handleUpdate = (updatedMusician: Musician) => {
    setMusicians(prev => prev.map(m => m.id === updatedMusician.id ? updatedMusician : m));
  };
  
  const handleOpenEditForm = (musician: Musician) => {
    setSelectedMusician(null);
    setMusicianToEdit(musician);
  };
  
  const handleCloseForm = () => {
    setIsRegistering(false);
    setMusicianToEdit(null);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg font-sans text-gray-900 dark:text-dark-text transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="container mx-auto p-4 md:p-8">
        {/* Filters and Actions */}
        <div className="bg-white dark:bg-dark-card p-4 rounded-lg mb-8 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <input
                    type="text"
                    placeholder="Pesquisar por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md px-3 py-2 text-gray-900 dark:text-dark-text focus:ring-brand-primary focus:border-brand-primary"
                />
                <select value={instrumentFilter} onChange={e => setInstrumentFilter(e.target.value)} className="w-full bg-gray-100 dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md px-3 py-2 text-gray-900 dark:text-dark-text focus:ring-brand-primary focus:border-brand-primary">
                    <option value="">Todos os Instrumentos</option>
                    {allInstruments.map(inst => <option key={inst} value={inst}>{inst}</option>)}
                </select>
                <select value={genreFilter} onChange={e => setGenreFilter(e.target.value)} className="w-full bg-gray-100 dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md px-3 py-2 text-gray-900 dark:text-dark-text focus:ring-brand-primary focus:border-brand-primary">
                    <option value="">Todos os Gêneros</option>
                    {allGenres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
                </select>
                <button 
                  onClick={() => setIsRegistering(true)}
                  className="bg-brand-primary w-full text-white font-semibold py-2 px-6 rounded-md hover:bg-teal-600 transition-colors"
                >
                  Cadastrar
                </button>
            </div>
        </div>

        {/* Favorites Section */}
        {favoritedMusicians.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b-2 border-brand-primary pb-2">Meus Favoritos ❤️</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoritedMusicians.map((musician) => (
                <MusicianCard 
                  key={musician.id} 
                  musician={musician} 
                  onSelect={setSelectedMusician}
                  isFavorite={favorites.includes(musician.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Musicians Grid */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{favoritedMusicians.length > 0 ? 'Todos os Músicos' : ''}</h2>
        {filteredMusicians.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMusicians.map((musician) => (
              <MusicianCard 
                key={musician.id} 
                musician={musician} 
                onSelect={setSelectedMusician}
                isFavorite={favorites.includes(musician.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Nenhum Músico Encontrado</h2>
            <p className="text-gray-500 dark:text-dark-text-secondary mt-2">Tente ajustar seus filtros ou termos de pesquisa.</p>
          </div>
        )}
      </main>

      <MusicianProfileModal 
        musician={selectedMusician} 
        onClose={() => setSelectedMusician(null)} 
        onEdit={handleOpenEditForm}
      />
      
      {(isRegistering || musicianToEdit) && (
        <RegistrationForm 
            onClose={handleCloseForm} 
            onSubmit={musicianToEdit ? handleUpdate : handleRegister}
            musicianToEdit={musicianToEdit}
        />
      )}
    </div>
  );
}