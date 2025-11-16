import React, { useState } from 'react';
import type { Musician } from '../types';
import { generateBio } from '../services/geminiService';
import CloseIcon from './icons/CloseIcon';
import CameraIcon from './icons/CameraIcon';

interface RegistrationFormProps {
  onClose: () => void;
  onSubmit: (musician: Musician) => void;
  musicianToEdit?: Musician | null;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onClose, onSubmit, musicianToEdit }) => {
  const isEditing = !!musicianToEdit;

  const [formData, setFormData] = useState(() => {
    if (isEditing) {
      return {
        name: musicianToEdit.name,
        location: musicianToEdit.location,
        instruments: musicianToEdit.instruments.join(', '),
        genres: musicianToEdit.genres.join(', '),
        bio: musicianToEdit.bio,
        email: musicianToEdit.email,
        portfolio: musicianToEdit.portfolio,
      };
    }
    return {
      name: '',
      location: '',
      instruments: '',
      genres: '',
      bio: '',
      email: '',
      portfolio: '',
    };
  });
  const [imagePreview, setImagePreview] = useState<string | null>(musicianToEdit?.image || null);
  const [bioKeywords, setBioKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleGenerateBio = async () => {
    if (!bioKeywords) return;
    setIsGenerating(true);
    try {
      const generated = await generateBio(bioKeywords);
      setFormData(prev => ({ ...prev, bio: generated }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const musicianData: Musician = {
      id: isEditing ? musicianToEdit.id : new Date().toISOString(),
      ...formData,
      instruments: formData.instruments.split(',').map(s => s.trim()).filter(Boolean),
      genres: formData.genres.split(',').map(s => s.trim()).filter(Boolean),
      image: imagePreview || `https://i.pravatar.cc/400?u=${encodeURIComponent(formData.name)}`,
    };
    onSubmit(musicianData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white dark:bg-dark-card rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 dark:text-dark-text-secondary hover:text-gray-800 dark:hover:text-white transition-colors">
          <CloseIcon className="w-6 h-6" />
        </button>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">{isEditing ? 'Editar Perfil' : 'Cadastre-se como Músico'}</h2>
          
          <div className="flex flex-col items-center space-y-2">
             <label htmlFor="photo-upload" className="cursor-pointer">
                 {imagePreview ? (
                    <img src={imagePreview} alt="Pré-visualização do Perfil" className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 dark:border-dark-border hover:border-brand-primary transition-colors"/>
                 ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-dark-bg border-2 border-dashed border-gray-300 dark:border-dark-border flex flex-col items-center justify-center text-gray-500 dark:text-dark-text-secondary hover:border-brand-primary hover:text-brand-primary transition-colors">
                        <CameraIcon className="w-8 h-8" />
                        <span className="text-xs mt-1">Sua Foto</span>
                    </div>
                 )}
             </label>
             <input id="photo-upload" name="photo-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
             {!imagePreview && <p className="text-xs text-gray-500 dark:text-dark-text-secondary">Clique no ícone para carregar uma foto.</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Nome Completo" name="name" value={formData.name} onChange={handleChange} required />
            <InputField label="Localização (ex: cidade, estado)" name="location" value={formData.location} onChange={handleChange} required />
            <InputField label="Instrumentos (separados por vírgula)" name="instruments" value={formData.instruments} onChange={handleChange} required />
            <InputField label="Gêneros (separados por vírgula)" name="genres" value={formData.genres} onChange={handleChange} required />
            <InputField label="E-mail de Contato" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <InputField label="URL do Portfólio (ex: Soundcloud, YouTube)" name="portfolio" type="url" value={formData.portfolio} onChange={handleChange} required />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-500 dark:text-dark-text-secondary mb-2">Palavras-chave para a Bio</label>
             <div className="flex gap-2">
                <input
                    type="text"
                    value={bioKeywords}
                    onChange={(e) => setBioKeywords(e.target.value)}
                    placeholder="ex: apaixonado, pianista de jazz, 10 anos de experiência"
                    className="w-full bg-gray-100 dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md px-3 py-2 text-gray-900 dark:text-dark-text focus:ring-brand-primary focus:border-brand-primary"
                />
                <button
                    type="button"
                    onClick={handleGenerateBio}
                    disabled={isGenerating || !bioKeywords}
                    className="flex-shrink-0 bg-brand-secondary text-white font-semibold py-2 px-4 rounded-md hover:bg-violet-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {isGenerating ? 'Gerando...' : '✨ Gerar Bio com IA'}
                </button>
             </div>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-500 dark:text-dark-text-secondary mb-2">Sua Bio</label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md px-3 py-2 text-gray-900 dark:text-dark-text focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-brand-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-teal-600 transition-colors"
            >
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Perfil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface InputFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type = 'text', required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-500 dark:text-dark-text-secondary mb-2">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full bg-gray-100 dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md px-3 py-2 text-gray-900 dark:text-dark-text focus:ring-brand-primary focus:border-brand-primary"
        />
    </div>
);


export default RegistrationForm;