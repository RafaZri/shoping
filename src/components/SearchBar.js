'use client';

import { useState } from 'react';
import './SearchBar.css'; 
import { useSearch } from '../contexts/SearchContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

export default function SearchBar({isHomePage}) {
  const { handleSearch, isLoading } = useSearch();
  const { currentLanguage } = useLanguage();
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
    }
  };

  return (
    <form className={`searchBar ${isLoading ? 'loading' : ''} ${isHomePage ? 'homePageVariant' : ''}`} onSubmit={handleSubmit}>
      <div className="input-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={getTranslation('searchPlaceholder', currentLanguage)}
          className="input rounded-full"
          disabled={isLoading}
        />
        <button type="submit" className="search-icon-button" disabled={isLoading}>
          {isLoading ? (
            <div className="spinner"></div>
          ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="#10b981" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          )}
        </button>
      </div>
    </form>
  );
}
