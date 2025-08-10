'use client';

import { useState, useEffect } from 'react';
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
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={getTranslation('searchPlaceholder', currentLanguage)}
        className="input rounded-full"
        disabled={isLoading}
      />
      <button type="submit" className="button rounded-1xl" disabled={isLoading}>
        {isLoading ? (
          <div className="spinner"></div>
        ) : (
          getTranslation('searchButton', currentLanguage)
        )}
      </button>
    </form>
  );
}